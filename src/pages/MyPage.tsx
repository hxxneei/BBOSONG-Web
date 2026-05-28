import { useViewportVH } from "../hooks/useViewportVH";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import styled from "styled-components";
import { Icon } from "@iconify/react";

import { Calendar, Mail, UserX } from "lucide-react";
import { HeaderWrapper } from "../components/mypage/HeaderWrapper";
import { SectionWrapper } from "../components/mypage/SectionWrapper";
import { InfoRow } from "../components/mypage/Row";
import { deleteMemberMe, getMemberMe, postLogout } from "../api/member";

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

  // 1. 페이지 접속 시 내 정보 불러오기
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const res = await getMemberMe();
        if (res.isSuccess) {
          setMemberInfo(res.result);
          // 실시간 화면 표시 및 다른 컴포넌트 동기화를 위해 로컬스토리지도 업데이트
          if (res.result.nickname) {
            localStorage.setItem("nickname", res.result.nickname);
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

  // 2. 로그아웃 처리
  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    try {
      await postLogout();
      // 성공 여부와 상관없이 프론트 토큰 및 유저 정보 청소
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("nickname");
      localStorage.removeItem("chat_history"); // 채팅 기록도 깔끔하게 비우기

      alert("로그아웃 되었습니다.");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  // 3. 회원 탈퇴 처리
  const handleWithdraw = async () => {
    if (isWithdrawing) return;

    const confirmed = window.confirm(
      "회원 탈퇴 시 계정, 채팅, 의류, 즐겨찾기 데이터가 모두 삭제됩니다.\n정말 탈퇴하시겠습니까?",
    );
    if (!confirmed) return;

    setIsWithdrawing(true);
    try {
      const res = await deleteMemberMe();
      if (res.isSuccess) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("nickname");
        localStorage.removeItem("chat_history");

        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/login", { replace: true });
      } else {
        alert(res.message || "회원 탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      console.error("회원 탈퇴 실패:", error);
      alert(
        error.response?.data?.message || "회원 탈퇴 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsWithdrawing(false);
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
          onClick={() => {
            // 별도의 닉네임 설정/수정 페이지나 모달로 이동
            // navigate("/mypage/edit-nickname");
          }}
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
              ? memberInfo.birth.replace(/-/g, ".") // 2026-05-21 -> 2026.05.21 변환
              : "등록된 생년월일이 없습니다"
          }
          hint={memberInfo?.birth ? "변경하기" : "등록하기"}
          onClick={() => {
            // 별도의 생년월일 설정/수정 페이지나 모달로 이동
            // navigate("/mypage/edit-birth");
          }}
        />
      </SectionWrapper>

      {/* 옷장 관리 */}
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
          onClick={handleLogout} // 로그아웃 함수 연결
        />
        <InfoRow
          icon={<UserX size={18} />}
          label={isWithdrawing ? "탈퇴 처리 중..." : "회원 탈퇴"}
          onClick={handleWithdraw}
        />
      </SectionWrapper>
    </Screen>
  );
};

export default MyPage;

const Screen = styled.main`
  min-height: 100dvh;
  color: #111827;
  padding-bottom: env(safe-area-inset-bottom);
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
