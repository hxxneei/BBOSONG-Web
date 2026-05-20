import React from "react";
import styled from "styled-components";

interface FirstChatHomeProps {
  onStart: () => void;
}

const FirstChatHome: React.FC<FirstChatHomeProps> = ({ onStart }) => {
  return (
    <Container>
      {/* h2 대신 Title 사용 */}
      <Title>
        <span className="blue">스마트 챗봇 </span>뽀송이
      </Title>

      {/* img 대신 Image 사용 */}
      <Image src="/bbosong4.png" alt="뽀송이" />

      {/* p 대신 Desc 사용 */}
      <Desc>
        옷을 카메라에 비추어 실시간으로
        <br />
        <span className="blue">옷/세탁 정보</span>를 확인해보세요!
      </Desc>

      {/* button 대신 StartBtn 사용 */}
      <StartBtn onClick={onStart}>뽀송이 챗봇 시작하기</StartBtn>
    </Container>
  );
};

export default FirstChatHome;

/* --- 아래는 떡볶이님이 작성하신 스타일 컴포넌트 그대로 유지 --- */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  .blue {
    color: #4b80fc;
  }
`;

const Image = styled.img`
  width: 180px;
  margin-bottom: 16px;
`;

const Desc = styled.p`
  color: #555;
  text-align: center;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 20px;
  .blue {
    color: #4b80fc;
  }
`;

const StartBtn = styled.button`
  width: 80%;
  padding: 14px 0;
  background: #4b80fc;
  border: none;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(75, 128, 252, 0.2);

  /* 클릭했을 때 살짝 눌리는 효과 추가 (옵션) */
  &:active {
    transform: scale(0.98);
  }
`;
