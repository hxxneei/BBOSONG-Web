// ⭕ 수정 및 업그레이드된 DeleteModal.tsx

import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "../assets/DeleteIcon.png";

// 💡 1. 부모(ClosetDetailPage)로부터 명령을 전달받을 리모컨 버튼 규격을 정의합니다.
type DeleteModalProps = {
  onClose: () => void; // 취소 버튼 누르면 모달을 닫는 함수
  onConfirm: () => Promise<boolean>; // 진짜 삭제 API를 호출하고 성공 여부(true/false)를 알려주는 함수
};

export default function DeleteModal({ onClose, onConfirm }: DeleteModalProps) {
  const [step, setStep] = useState<"confirm" | "done">("confirm");
  const [isDeleting, setIsDeleting] = useState(false); // 로딩 스피너/방어막 역할

  // 💡 2. '확인' 버튼을 눌렀을 때 백엔드 삭제를 진짜로 작동시킬 엔진 함수
  const handleConfirmClick = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      // 부모가 건네준 진짜 삭제 API 함수를 가동시킵니다!
      const isSuccess = await onConfirm();
      if (isSuccess) {
        setStep("done"); // 백엔드 삭제가 성공하면 완료 화면으로 전환!
      }
    } catch (err) {
      console.error("모달 내 삭제 에러:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layer>
      <Dim onClick={step === "confirm" ? onClose : undefined} />
      <Card>
        {step === "confirm" ? (
          <>
            <Text>정말 삭제 하시겠습니까?</Text>
            <BtnCol>
              {/* 💡 3. 확인 버튼을 누르면 handleConfirmClick 가동 */}
              <PrimaryBtn onClick={handleConfirmClick} disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "확인"}
              </PrimaryBtn>
              {/* 💡 4. 취소 버튼을 누르면 모달이 깨끗하게 닫힙니다 */}
              <GhostBtn onClick={onClose} disabled={isDeleting}>
                취소
              </GhostBtn>
            </BtnCol>
          </>
        ) : (
          <>
            <Emoji src={DeleteIcon} alt="완료" />
            <Text>삭제가 완료되었습니다.</Text>
            <BtnCol>
              {/* 💡 5. 삭제가 다 끝나고 확인을 누르면 부모가 알아서 페이지를 쫓아내도록 onClose 유도 */}
              <PrimaryBtn onClick={onClose}>확인</PrimaryBtn>
            </BtnCol>
          </>
        )}
      </Card>
    </Layer>
  );
}

// --- 🎨 하단 스타일드 컴포넌트 구역 (기존과 100% 동일하되 구조적 높이 자동 조절 적용) ---
const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: grid;
  place-items: center;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(1.5px);
`;

const Card = styled.div`
  position: relative;
  width: min(320px, calc(100% - 48px));
  min-height: 188px; /* height 고정 대신 min-height로 글자 짤림 방지 */
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 20px;
  text-align: center;
  z-index: 1;
  box-sizing: border-box;
`;

const Emoji = styled.img`
  display: block;
  margin: 0 auto 12px auto;
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const Text = styled.p`
  color: #111827;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  margin-top: 0;
`;

const BtnCol = styled.div`
  display: grid;
  gap: 10px;
`;

const BaseBtn = styled.button`
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 5px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryBtn = styled(BaseBtn)`
  background: #4b80fc;
  color: #fff;
  font-weight: 400;
`;

const GhostBtn = styled(BaseBtn)`
  background: #eef2ff;
  color: #9aa3b2;
`;
