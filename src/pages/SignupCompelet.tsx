import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BaseBtn } from "../common/BaseBtn";
import BbosongLogo from "../assets/BbosongLogo.svg";

const SignupComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LogoArea>
        <img src={BbosongLogo} alt="BBO SONG Logo" />
      </LogoArea>

      <SuccessMessage>회원 가입이 완료되었습니다!!</SuccessMessage>

      <ButtonGroup>
        <LoginBtn as="button" onClick={() => navigate("/login")}>
          로그인
        </LoginBtn>

        <HomeBtn as="button" onClick={() => navigate("/main-home")}>
          홈 화면으로
        </HomeBtn>
      </ButtonGroup>
    </Container>
  );
};

export default SignupComplete;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 24px;
  background-color: white;
`;

const LogoArea = styled.div`
  margin-bottom: 40px;
  img {
    width: 160px;
    height: auto;
  }
`;

const SuccessMessage = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 80px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  width: 100%;
  max-width: 342px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginBtn = styled(BaseBtn)`
  background-color: #4b80fc; // 메인 블루 컬러
  color: white;
  border: none;
  cursor: pointer;

  justify-content: center;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #3b6edb;
  }
`;

const HomeBtn = styled(BaseBtn)`
  background-color: white;
  color: #767676;
  border: 0.8px solid #d1d1d1;
  cursor: pointer;

  justify-content: center;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f9f9f9;
  }
`;
