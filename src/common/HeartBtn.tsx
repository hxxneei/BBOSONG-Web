import styled from "styled-components";
import { Icon } from "@iconify/react";

interface HeartButtonProps {
  active?: boolean;
  onClick?: () => void;
}

export default function HeartButton({
  active = false,
  onClick,
}: HeartButtonProps) {
  return (
    <Button onClick={onClick} aria-label={active ? "찜 해제" : "찜하기"}>
      {active ? (
        <Icon icon="mdi:heart" color="#4B80FC" width="22" height="22" />
      ) : (
        <Icon icon="mdi:heart-outline" color="#d1d5db" width="22" height="22" />
      )}
    </Button>
  );
}

const Button = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:active {
    transform: transform 0.15s ease;
    transform: scale(0.9);
  }
`;
