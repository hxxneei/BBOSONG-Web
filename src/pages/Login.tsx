import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import KakaoLogin from "../assets/LoginPage/KakaoLogin.svg";
import GoogleLogin from "../assets/LoginPage/GoogleLogin.svg";
import BbosongLogo from "../assets/BbosongLogo.svg";
import { postLoginLocal } from "../api/auth";
import { saveAuthTokens, saveNickname } from "../utils/authStorage";
import { API_ORIGIN } from "../api/apiConfig";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useFeedbackModal();

  // 입력값 저장 상태 함수
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: "kakao" | "google") => {
    window.location.href = `${API_ORIGIN}/oauth2/authorization/${provider}`;
  };

  // Login 누르면 실행
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 새로고침 방지

    if (!loginId || !password) {
      void showAlert("아이디와 비밀번호를\n모두 입력해주세요!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await postLoginLocal({ loginId, password });

      if (res.isSuccess) {
        saveAuthTokens(res.result);

        const userNickname = res.result.nickname || "보송이회원";
        saveNickname(userNickname);

        navigate("/main-home", { replace: true });
        return;
      }

      void showAlert(res.message || "로그인 정보가 올바르지 않습니다.");
    } catch (error: unknown) {
      console.error("로그인 실패:", error);
      const errorMsg =
        axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;
      void showAlert(errorMsg || "로그인 정보가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Logo>
        <img src={BbosongLogo} />
      </Logo>

      <form onSubmit={handleLogin}>
        <InputGroup>
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)} // 입력할 때마다 상태 업데이트
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <Links>
          <button type="button" onClick={() => navigate("/signup")}>
            회원가입
          </button>
        </Links>

        <ButtonGroup>
          <LoginBtn type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </LoginBtn>
          <SocialImg
            src={KakaoLogin}
            alt="kakao"
            onClick={() => handleSocialLogin("kakao")}
            style={{ cursor: "pointer" }}
          />
          <SocialImg
            src={GoogleLogin}
            alt="google"
            onClick={() => handleSocialLogin("google")}
            style={{ cursor: "pointer" }}
          />
        </ButtonGroup>
      </form>
    </LoginContainer>
  );
};

export default Login;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: white;
  padding: 16px;

  form {
    width: 100%;
    max-width: 342px;
  }
`;

const SocialImg = styled.img`
  cursor: pointer;
  width: 100%;
  max-width: 342px;
`;

const Logo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  margin-bottom: 100px;

  width: 159px;
  height: 94px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const InputGroup = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: -10px;

  input {
    border: none;
    border-radius: 14px;
    background-color: #f3f3f3;
    padding: 16px;
    font-size: 16px;
    outline: none;
    transition: all 0.2s;

    &::placeholder {
      color: #b5b5b5;
    }
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;

  button {
    background: none;
    border: none;
    color: #767676;
    cursor: pointer;
    font-size: 9px;
    line-height: 0.8;
    margin-top: 24px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;
  margin-top: 120px;
`;

const LoginBtn = styled.button`
  width: 100%;
  max-width: 342px;
  height: 55px;
  background-color: #4b80fcc1;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  padding: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4b80fc;
  }

  &:active {
    transform: scale(0.98);
  }
`;
