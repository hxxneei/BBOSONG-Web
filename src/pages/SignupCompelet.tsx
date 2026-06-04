import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BbosongLogo from "../assets/BbosongLogo.svg";

const SignupComplete = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LogoArea>
        <img src={BbosongLogo} alt="BBO SONG Logo" />
      </LogoArea>

      <SuccessMessage>회원가입이 완료되었습니다</SuccessMessage>

      <ButtonGroup>
        <LoginBtn type="button" onClick={() => navigate("/login")}>
          로그인
        </LoginBtn>
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
  min-height: 100vh;
  min-height: 100svh;
  padding: 0 24px;
  background-color: white;
  box-sizing: border-box;
`;

const LogoArea = styled.div`
  margin-bottom: 40px;

  img {
    width: 160px;
    height: auto;
    display: block;
  }
`;

const SuccessMessage = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin: 0 0 80px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  width: 100%;
  max-width: 342px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginBtn = styled.button`
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border: none;
  border-radius: 15px;
  background-color: #4b80fc;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  touch-action: manipulation;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: #3b6edb;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(75, 128, 252, 0.28);
    outline-offset: 3px;
  }
`;
