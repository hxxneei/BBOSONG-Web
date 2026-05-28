import styled from "styled-components";

type ConfirmModalProps = {
  open: boolean; // 외부에서 열고 닫기만 제어 (기능 X)
  title?: string; // 상단 문구
  confirmText?: string; // 확인 버튼 라벨
  cancelText?: string; // 취소 버튼 라벨
  className?: string;

  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  open,
  title = "정말 삭제 하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  className,

  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <Layer className={className}>
      <Dim onClick={onCancel} />
      <Card role="dialog" aria-modal="true">
        <Title>{title}</Title>

        <BtnCol>
          <PrimaryBtn type="button" onClick={onConfirm}>
            {confirmText}
          </PrimaryBtn>
          {cancelText && (
            <GhostBtn type="button" onClick={onCancel}>
              {cancelText}
            </GhostBtn>
          )}
        </BtnCol>
      </Card>
    </Layer>
  );
}
const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2999;
`;

const Dim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(1.5px);
`;

const Card = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(301px, calc(100% - 48px));
  background: #ffffff;
  border-radius: 15px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 16px;
  min-height: 120px;
  height: fit-content;
`;

const Title = styled.p`
  margin: 8px 0 20px;
  text-align: center;
  color: #111827;
  font-weight: 500;
  font-size: 15px;
  line-height: 1.4;
  letter-spacing: -0.2px;
  white-space: pre-line;
`;

const BtnCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BaseBtn = styled.button`
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

const PrimaryBtn = styled(BaseBtn)`
  background: #4b80fc;
  color: #fff;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.08);
`;

const GhostBtn = styled(BaseBtn)`
  background: #ebf0f7;
  color: #808080;
`;
