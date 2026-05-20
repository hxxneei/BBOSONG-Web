import { useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";

export default function HeartButton() {
  const [liked, setLiked] = useState(false);

  return (
    <Button
      onClick={() => setLiked(!liked)}
      aria-label={liked ? "찜 해제" : "찜하기"}
    >
      {liked ? (
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
    transform: scale(0.9);
  }
`;
