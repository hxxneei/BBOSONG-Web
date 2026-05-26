import styled, { keyframes } from "styled-components";

const bubbleFadeUp = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  height: 100vh;
  background-color: white;
  padding: 32px 24px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: "Pretendard", sans-serif;
`;

export const PageWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  line-height: 1.45;
  margin-bottom: 0px;
  color: #222;
  .highlight {
    color: #4b80fc;
  }
`;

export const BubbleList = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Bubble = styled.div<{ $delay: number }>`
  background: #e8f0ff;
  color: #4b80fc;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  max-width: 80%;
  width: fit-content;
  position: relative;
  opacity: 0;
  animation: ${bubbleFadeUp} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  &:nth-child(odd) {
    align-self: flex-start;
    border-bottom-left-radius: 0;
    &::after {
      content: "";
      position: absolute;
      left: 16px;
      bottom: -6px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #e8f0ff;
    }
  }

  &:nth-child(even) {
    align-self: flex-end;
    border-bottom-right-radius: 0;
    &::after {
      content: "";
      position: absolute;
      right: 16px;
      bottom: -6px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #e8f0ff;
    }
  }
`;

export const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "22px" : "8px")};
  height: 8px;
  background-color: ${({ $active }) => ($active ? "#4b80fc" : "#d0d0d0")};
  border-radius: 999px;
  transition: all 0.3s ease;
  cursor: pointer;
`;

export const BottomBtnWrap = styled.div`
  width: 100%;
  max-width: 342px;
  margin-bottom: 12px;
`;

export const StyledButton = styled.button<{ $isStart?: boolean }>`
  width: 100%;
  padding: 16px;
  background-color: #4b80fc;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;

  &:active {
    background-color: #356be0;
  }
`;

export const ImageGrid = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;
