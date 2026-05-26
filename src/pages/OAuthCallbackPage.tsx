import styled from "styled-components";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      if (!code) {
        alert("로그인 인증 코드가 올바르지 않습니다. ");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "https://api.bbosongi.com/api/auth/oauth/exchange",
          {
            code: code,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const res = response.data;

        if (res.isSuccess) {
          const { accessToken, refreshToken } = res.result;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          alert("완료!");
          navigate("/main-home");
        } else {
          alert(`로그인 실패: ${res.message}`);
          navigate("/login");
        }
      } catch (err) {
        console.error("OAuth 토큰 교환 중 서버 오류:", err);
        alert("로그인 처리 중 서버 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    exchangeCodeForToken();
  }, [code, navigate]);

  return (
    <LoadingWrapper>
      <Spinner />
      <LoadingText>로그인 중입니다. 잠시만 기다려주세요... 🧺</LoadingText>
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
