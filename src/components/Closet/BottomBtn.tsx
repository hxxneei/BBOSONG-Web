import styled from "styled-components";
import { Icon } from "@iconify/react";

// 아이콘이 안뜸h

type Props = {
  onClick?: () => void;
  // 옵셔널 다 수정해야됨ㅠ
  size?: number;
  ariaLabel?: string;
};

const BottomBtn = ({
  onClick,

  size = 42,
  ariaLabel = "open bag",
}: Props) => {
  return (
    <Fab type="button" onClick={onClick} aria-label={ariaLabel}>
      <Icon icon="mdi:bag-outline" width={size} height={size} color="#4B80FC" />
    </Fab>
  );
};

export default BottomBtn;

const Fab = styled.button`
  position: fixed;
right: max(20px, calc((100vw - 420px) / 2 + 20px));
  bottom: 24px;

  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: #ffffff;

  display: grid;
  place-items: center;
  cursor: pointer;

  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);

    outline: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {

    box-shadow:
      0 0 0 3px rgba(75,128,252,.25),  /* 커스텀 포커스 링 */
      0 10px 20px rgba(0,0,0,.12);      /* 아래쪽 그림자 */

      
`;
