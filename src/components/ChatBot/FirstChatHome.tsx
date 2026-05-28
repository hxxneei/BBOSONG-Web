import React from "react";
import styled from "styled-components";
import BSlogo from "../../assets/ChatPage/BSlogo.webp";

interface FirstChatHomeProps {
  onStart: () => void;
}

const FirstChatHome: React.FC<FirstChatHomeProps> = ({ onStart }) => {
  return (
    <Container>
      <Title>
        <span className="blue">스마트 챗봇 </span>뽀송이
      </Title>

      <Image src={BSlogo} alt="뽀송이" />

      <Desc>
        옷을 카메라에 비추어 실시간으로
        <br />
        <span className="blue">옷/세탁 정보</span>를 확인해보세요!
      </Desc>

      <StartBtn onClick={onStart}>뽀송이 챗봇 시작하기</StartBtn>
    </Container>
  );
};

export default FirstChatHome;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;

  transform: translateY(-42px);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 40px;
  text-align: center;
  .blue {
    color: #4b80fc;
  }
`;

const Image = styled.img`
  width: 280px;
  margin-bottom: 12px;
  transform: scaleX(-1);
`;

const Desc = styled.p`
  color: #000000;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.4;
  margin-bottom: 20px;
  .blue {
    color: #4b80fc;
  }
`;

const StartBtn = styled.button`
  width: 80%;
  padding: 18px 0;
  background: #4b80fc;
  border: none;
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(75, 128, 252, 0.2);

  margin-bottom: 60px;
  margin-top: 20px;

  &:active {
    transform: scale(0.98);
  }
`;
