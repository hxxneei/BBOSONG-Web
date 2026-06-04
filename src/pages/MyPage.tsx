import { useViewportVH } from "../hooks/useViewportVH";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";

import { Calendar, Mail, UserX } from "lucide-react";
import { HeaderWrapper } from "../components/mypage/HeaderWrapper";
import { SectionWrapper } from "../components/mypage/SectionWrapper";
import { InfoRow } from "../components/mypage/Row";
import { deleteMemberMe, getMemberMe, postLogout } from "../api/member";
import { updateNickname, updateBirthDate } from "../api/auth";
import ConfirmModal from "../components/Modal/ConfirmModal";
import { clearAuthStorage, saveNickname } from "../utils/authStorage";
import {
  clearMemberCache,
  getCachedMember,
  setCachedMember,
  updateCachedMember,
} from "../utils/memberCache";

interface MemberInfo {
  email: string;
  nickname: string | null;
  birth: string | null;
}

const MyPage: React.FC = () => {
  const handleBack = () => window.history.back();
  const navigate = useNavigate();
  useViewportVH();

  // 내 정보 상태 관리
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"nickname" | "birth">("nickname");
  const [editValue, setEditValue] = useState("");

  // 모달

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onClose?: () => void;
    cancelText?: string;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
    cancelText: "취소",
  });

  //내 정보 불러오기
  useEffect(() => {
    const cachedMember = getCachedMember();

    if (cachedMember) {
      setMemberInfo(cachedMember);
      setIsLoading(false);
      return;
    }

    const fetchMemberData = async () => {
      try {
        const res = await getMemberMe();
        if (res.isSuccess) {
          setMemberInfo(res.result);
          setCachedMember(res.result);
          if (res.result.nickname) {
            saveNickname(res.result.nickname);
          }
        }
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const closeConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, open: false }));
  };

  // 로그아웃
  const handleLogout = () => {
    setConfirmModalConfig({
      open: true,
      title: "로그아웃",
      message: "정말 로그아웃 하시겠습니까?",
      onConfirm: async () => {
        closeConfirmModal();
        try {
          await postLogout();
          clearAuthStorage();
          clearMemberCache();

          // 로그아웃 완료 커스텀 경고 팝업 가이드
          setConfirmModalConfig({
            open: true,
            title: "알림",
            message: "로그아웃 되었습니다.",
            onConfirm: () => {
              closeConfirmModal();
              navigate("/login");
            },
          });
        } catch (error) {
          console.error("로그아웃 실패:", error);
          setConfirmModalConfig({
            open: true,
            title: "오류",
            message: "로그아웃 처리 중 오류가 발생했습니다.",
            onConfirm: closeConfirmModal,
          });
        }
      },
      onClose: closeConfirmModal,
    });
  };

  // 회원 탈퇴 처리
  const handleWithdraw = () => {
    if (isWithdrawing) return;

    setConfirmModalConfig({
      open: true,
      title: "회원 탈퇴",
      message:
        "회원 탈퇴 시 계정, 채팅, 의류, 즐겨찾기 데이터가 모두 삭제됩니다.\n정말 탈퇴하시겠습니까?",
      onConfirm: async () => {
        closeConfirmModal();
        setIsWithdrawing(true);
        try {
          const res = await deleteMemberMe();
          if (res.isSuccess) {
            clearAuthStorage();
            clearMemberCache();

            setConfirmModalConfig({
              open: true,
              title: "탈퇴 완료",
              message: "회원 탈퇴가 완료되었습니다.",
              onConfirm: () => {
                closeConfirmModal();
                navigate("/login", { replace: true });
              },
            });
          } else {
            setConfirmModalConfig({
              open: true,
              title: "알림",
              message: res.message || "회원 탈퇴 처리 중 오류가 발생했습니다.",
              onConfirm: closeConfirmModal,
            });
          }
        } catch (error: unknown) {
          console.error("회원 탈퇴 실패:", error);
          const errorMessage = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined;
          setConfirmModalConfig({
            open: true,
            title: "탈퇴 실패",
            message:
              errorMessage || "회원 탈퇴 처리 중 오류가 발생했습니다.",
            onConfirm: closeConfirmModal,
          });
        } finally {
          setIsWithdrawing(false);
        }
      },
      onClose: closeConfirmModal,
    });
  };

  const handleOpenEditModal = (
    type: "nickname" | "birth",
    currentVal: string | null,
  ) => {
    setModalType(type);
    setEditValue(currentVal || "");
    setIsModalOpen(true);
  };

  const handleSaveInfo = async () => {
    if (!editValue.trim()) {
      setConfirmModalConfig({
        open: true,
        title: "경고",
        message: "값을 입력해 주세요.",
        onConfirm: closeConfirmModal,
      });
      return;
    }

    try {
      if (modalType === "nickname") {
        const res = await updateNickname(editValue);
        if (res.isSuccess) {
          setIsModalOpen(false);
          setConfirmModalConfig({
            open: true,
            title: "변경 성공",
            message: "닉네임이 변경되었습니다. ",
            cancelText: "",
            onConfirm: () => {
              closeConfirmModal();
              setMemberInfo((prev) =>
                prev ? { ...prev, nickname: res.result.nickname } : null,
              );
              updateCachedMember({ nickname: res.result.nickname });
              saveNickname(res.result.nickname);
            },
          });
        }
      } else {
        const res = await updateBirthDate(editValue);
        if (res.isSuccess) {
          setIsModalOpen(false);
          setConfirmModalConfig({
            open: true,
            title: "변경 성공",
            message: "생년월일이 변경되었습니다.",
            cancelText: "",
            onConfirm: () => {
              closeConfirmModal();
              setMemberInfo((prev) =>
                prev ? { ...prev, birth: res.result.birth } : null,
              );
              updateCachedMember({ birth: res.result.birth });
            },
          });
        }
      }
    } catch (error) {
      console.error("정보 수정 실패:", error);
      setConfirmModalConfig({
        open: true,
        title: "오류",
        message: "정보 수정 중 오류가 발생했습니다. 다시 시도해 주세요.",
        onConfirm: closeConfirmModal,
      });
    }
  };

  if (isLoading) {
    return (
      <Screen>
        <LoadingText>정보를 불러오는 중입니다...</LoadingText>
      </Screen>
    );
  }

  return (
    <Screen>
      <HeaderWrapper title="마이 페이지" onBack={handleBack} />

      {/* 내 정보 */}
      <SectionWrapper title="내 정보">
        <InfoRow
          icon={<Icon icon="bi:bar-chart" width="20" height="20" />}
          label="닉네임"
          value={
            memberInfo?.nickname ? (
              <Strong>{memberInfo.nickname}</Strong>
            ) : (
              <Placeholder>닉네임을 설정해주세요</Placeholder>
            )
          }
          hint={memberInfo?.nickname ? "변경하기" : "등록하기"}
          onClick={() =>
            handleOpenEditModal("nickname", memberInfo?.nickname || null)
          }
        />
        <InfoRow
          icon={<Mail size={18} />}
          label="이메일"
          value={memberInfo?.email || "이메일 정보 없음"}
        />
        <InfoRow
          icon={<Calendar size={18} />}
          label="생년월일"
          value={
            memberInfo?.birth
              ? memberInfo.birth.replace(/-/g, ".")
              : "등록된 생년월일이 없습니다"
          }
          hint={memberInfo?.birth ? "변경하기" : "등록하기"}
          onClick={() =>
            handleOpenEditModal("birth", memberInfo?.birth || null)
          }
        />
      </SectionWrapper>

      {/* 옷장 관리*/}
      <SectionWrapper title="옷장 관리">
        <InfoRow
          icon={<Icon icon="mdi:hanger" width="20" height="20" />}
          label="저장한 옷"
          hint="더보기"
          onClick={() => navigate("/my-closet")}
        />
      </SectionWrapper>

      {/* 내 세탁소 관리 */}
      <SectionWrapper title="내 세탁소 관리">
        <InfoRow
          icon={<Icon icon="mdi:washing-machine" width="22" height="20" />}
          label="즐겨찾는 매장"
          hint="더보기"
          onClick={() => navigate("/favorite-stores")}
        />
      </SectionWrapper>

      {/* 계정 관리 */}
      <SectionWrapper title="계정 관리">
        <InfoRow
          icon={<Icon icon="bi:chat-dots" width="20" height="20" />}
          label="로그아웃"
          onClick={handleLogout}
        />
        <InfoRow
          icon={<UserX size={18} />}
          label={isWithdrawing ? "탈퇴 처리 중..." : "회원 탈퇴"}
          onClick={handleWithdraw}
        />
      </SectionWrapper>

      {/* mypage 모달 창  */}
      {isModalOpen && (
        <ModalDimmed onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              {modalType === "nickname" ? "닉네임 변경" : "생년월일 변경"}
            </ModalTitle>

            <ModalInput
              type={modalType === "nickname" ? "text" : "date"}
              placeholder={
                modalType === "nickname"
                  ? "새로운 닉네임을 입력하세요"
                  : "YYYY-MM-DD"
              }
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              maxLength={modalType === "nickname" ? 40 : undefined}
            />

            <ModalButtonGroup>
              <CancelBtn onClick={() => setIsModalOpen(false)}>취소</CancelBtn>
              <SaveBtn onClick={handleSaveInfo}>저장</SaveBtn>
            </ModalButtonGroup>
          </ModalContent>
        </ModalDimmed>
      )}
      <ConfirmModal
        open={confirmModalConfig.open}
        title={confirmModalConfig.message}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={confirmModalConfig.onClose}
        cancelText={confirmModalConfig.cancelText}
      />
    </Screen>
  );
};

export default MyPage;

const Screen = styled.main`
  min-height: 100dvh;
  color: #111827;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: white;
`;

const Strong = styled.strong`
  font-weight: 600;
  color: #2563eb;
  font-size: 14px;
`;

const Placeholder = styled.span`
  color: #9ca3af;
  font-size: 13px;
`;

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #6b7280;
  font-size: 14px;
`;

const ModalDimmed = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  width: 90%;
  max-width: 320px;
  background: white;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 18px 0;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  margin-bottom: 22px;
  box-sizing: border-box;
  color: #000;
  background-color: #fff;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #2563eb;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const BaseModalBtn = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const CancelBtn = styled(BaseModalBtn)`
  background-color: #f3f4f6;
  color: #4b5563;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const SaveBtn = styled(BaseModalBtn)`
  background-color: #2563eb;
  color: white;
  &:hover {
    background-color: #1d4ed8;
  }
`;
