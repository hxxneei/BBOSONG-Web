import styled from "styled-components";
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAuthTokens } from "../utils/authStorage";

const OAUTH_EXCHANGE_URL = "https://api.bbosongi.com/api/auth/oauth/exchange";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasExchangedCode = useRef(false);

  const code = searchParams.get("code");

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (hasExchangedCode.current) {
        return;
      }

      if (!code) {
        alert("로그인 인증 코드가 올바르지 않습니다.");
        navigate("/login", { replace: true });
        return;
      }

      hasExchangedCode.current = true;

      try {
        const response = await axios.post(
          OAUTH_EXCHANGE_URL,
          { code },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const res = response.data;

        if (res.isSuccess) {
          saveAuthTokens(res.result);

          navigate("/main-home", { replace: true });
        } else {
          alert(`로그인 실패: ${res.message}`);
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("OAuth 토큰 교환 중 서버 오류:", err);
        alert("로그인 처리 중 서버 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    exchangeCodeForToken();
  }, [code, navigate]);

  return (
    <LoadingWrapper>
      <Spinner />
      <LoadingText>로그인 중입니다. 잠시만 기다려주세요...</LoadingText>
    </LoadingWrapper>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #4b80fc;
  font-weight: 500;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f4f6;
  border-top: 5px solid #4b80fc;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
