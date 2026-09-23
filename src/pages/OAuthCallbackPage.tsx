import styled from "styled-components";
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveAuthTokens } from "../utils/authStorage";
import { postOAuthExchange } from "../api/auth";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showAlert } = useFeedbackModal();
  const hasExchangedCode = useRef(false);

  const code = searchParams.get("code");

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (hasExchangedCode.current) {
        return;
      }

      hasExchangedCode.current = true;

      if (!code) {
        await showAlert("로그인 인증 코드가 올바르지 않습니다.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const res = await postOAuthExchange(code);

        if (res.isSuccess) {
          saveAuthTokens(res.result);

          navigate("/main-home", { replace: true });
        } else {
          await showAlert(`로그인 실패: ${res.message}`);
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("OAuth 토큰 교환 중 서버 오류:", err);
        await showAlert("로그인 처리 중 서버 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    exchangeCodeForToken();
  }, [code, navigate, showAlert]);

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
  height: 100dvh;
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
