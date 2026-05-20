import styled, { keyframes } from "styled-components";

/* --- 애니메이션 --- */
const bubbleFadeUp = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  position: relative; /* 자식 absolute 배치의 기준점 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: white;
  padding: 32px 24px;
  box-sizing: border-box;
  overflow: hidden; /* ★중요: 화면 밖으로 나간 이미지를 자름 */
  font-family: "Pretendard", sans-serif;
`;

/* --- 중앙 페이지 영역 (기존 .page) --- */
export const PageWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Mockup 위치 보정 */
  position: relative;
  z-index: 10; /* 텍스트가 이미지 위에 오도록 */
`;

/* --- 텍스트 스타일 --- */
export const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 30px;
  color: #222;
  .highlight {
    color: #4b80fc;
  }
`;

/* --- 말풍선 섹션 --- */
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
  margin-bottom: 20px;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "22px" : "8px")};
  height: 8px;
  background-color: ${({ $active }) => ($active ? "#4b80fc" : "#d0d0d0")};
  border-radius: 999px;
  transition: all 0.3s ease;
  cursor: pointer;
`;

/* --- 버튼 영역 --- */
export const BottomBtnWrap = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: 30px;
`;

export const StyledButton = styled.button<{ $isStart?: boolean }>`
  width: 100%;
  padding: 14px;
  background-color: ${({ $isStart }) => ($isStart ? "#4b80fc" : "#4b80fc")};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
`;

export const ImageGrid = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 20px;
`;
