import styled from "styled-components";

type ConfirmModalProps = {
  open: boolean; // 외부에서 열고 닫기만 제어 (기능 X)
  title?: string; // 상단 문구
  confirmText?: string; // 확인 버튼 라벨
  cancelText?: string; // 취소 버튼 라벨
  className?: string;
};

export default function ConfirmModal({
  open,
  title = "정말 삭제 하시겠습니까?",
  confirmText = "확인",
  cancelText = "취소",
  className,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <Layer className={className}>
      <Dim />
      <Card role="dialog" aria-modal="true">
        <Title>{title}</Title>

        <BtnCol>
          <PrimaryBtn type="button">{confirmText}</PrimaryBtn>
          <GhostBtn type="button">{cancelText}</GhostBtn>
        </BtnCol>
      </Card>
    </Layer>
  );
}

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px 20px 16px;
  height: 188px;
`;

const Title = styled.p`
  margin: 8px 0 16px;
  text-align: center;
  color: #111827;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: -0.2px;
`;

const BtnCol = styled.div`
  display: grid;
  gap: 10px;
`;

const BaseBtn = styled.button`
  width: 253px;
  height: 40px;
  border: 0;
  border-radius: 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: default;
`;

const PrimaryBtn = styled(BaseBtn)`
  background: #4b80fc; /* 메인 파랑 */
  color: #fff;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.08);
`;

const GhostBtn = styled(BaseBtn)`
  background: #ebf0f7; /* 연한 회색/블루 톤 */
  color: #808080; /* 흐린 텍스트 느낌 */
`;
