import styled, { keyframes } from "styled-components";

export default function ChatLoading() {
  return (
    <LoadingContainer>
      <LoadingBubble>
        <Dot $delay="0s" />
        <Dot $delay="0.2s" />
        <Dot $delay="0.4s" />
      </LoadingBubble>
    </LoadingContainer>
  );
}

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 12px;
`;

const LoadingBubble = styled.div`
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 2px 16px 16px 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  max-width: 70%;
  box-shadow: 0px 4px 5px 0px #4b80fc4d;
`;

const Dot = styled.div<{ $delay: string }>`
  width: 5px;
  height: 5px;
  background-color: #4b80fc;
  border-radius: 50%;
  animation: ${bounce} 1s infinite ease-in-out;
  animation-delay: ${(props) => props.$delay};
`;
