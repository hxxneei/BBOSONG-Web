import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "../assets/DeleteIcon.png";

type DeleteModalProps = {
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
};

export default function DeleteModal({ onClose, onConfirm }: DeleteModalProps) {
  const [step, setStep] = useState<"confirm" | "done">("confirm");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmClick = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const isSuccess = await onConfirm();
      if (isSuccess) {
        setStep("done");
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
              <PrimaryBtn onClick={handleConfirmClick} disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "확인"}
              </PrimaryBtn>
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
              <PrimaryBtn onClick={onClose}>확인</PrimaryBtn>
            </BtnCol>
          </>
        )}
      </Card>
    </Layer>
  );
}

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
