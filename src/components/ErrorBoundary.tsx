import { Component, type ErrorInfo, type ReactNode } from "react";
import styled from "styled-components";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("렌더링 중 오류가 발생했습니다.", error, errorInfo);
  }

  private handleRetry = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.assign("/main-home");
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Fallback role="alert">
        <ErrorCard>
          <Title>화면을 불러오지 못했어요</Title>
          <Description>
            일시적인 오류가 발생했습니다. 다시 시도하거나 메인 화면으로
            이동해 주세요.
          </Description>
          <ButtonGroup>
            <PrimaryButton type="button" onClick={this.handleRetry}>
              다시 시도
            </PrimaryButton>
            <SecondaryButton type="button" onClick={this.handleGoHome}>
              메인으로 이동
            </SecondaryButton>
          </ButtonGroup>
        </ErrorCard>
      </Fallback>
    );
  }
}

const Fallback = styled.main`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: 24px;
  background: #f8fafc;
  color: #111827;
  font-family:
    "Noto Sans KR",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;

const ErrorCard = styled.div`
  width: 100%;
  max-width: 342px;
  padding: 32px 24px 24px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 21px;
  line-height: 1.4;
`;

const Description = styled.p`
  margin: 0 0 24px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  word-break: keep-all;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BaseButton = styled.button`
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
`;

const PrimaryButton = styled(BaseButton)`
  background: #4b80fc;
  color: #ffffff;
`;

const SecondaryButton = styled(BaseButton)`
  background: #ebf0f7;
  color: #64748b;
`;
