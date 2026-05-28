import React, { useState } from "react";
import styled from "styled-components";
import IdField from "../components/Signup/IdField";
import PolicySection from "../components/Signup/PolicySection";
import BbosongLogoGaRo from "../assets/BbosongLogoGaRo.svg";
import PolicyModal from "../modal/PolicyModal";
import { useAuth } from "../hooks/useAuth";
import { checkLoginId } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  // 중복 확인
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 약관 모달
  const [isServiceAgreed, setIsServiceAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);

  const { signup, isLoading } = useAuth(); // 회원가입

  const handleCheckIdDuplication = async () => {
    if (!loginId.trim()) {
      alert("아이디를 입력해 주세요.");
      return;
    }
    try {
      const response = await checkLoginId(loginId);

      if (response.isSuccess) {
        const { available } = response.result;
        if (available) {
          alert("사용 가능한 아이디입니다. ");
          setIsIdChecked(true);
        } else {
          alert("이미 사용 중인 아이디입니다. ");
          setIsIdChecked(false);
        }
      }
    } catch (error: any) {
      console.error("중복 확인 에러:", error);
      if (error.response && error.response.status === 400) {
        alert("잘못된 요청입니다. 아이디 형식을 확인해 주세요.");
      } else if (error.response && error.response.status === 401) {
        alert(
          "아이디 중복 확인 API가 인증 필요 상태입니다. 서버 설정을 확인해 주세요.",
        );
      } else {
        alert("중복 확인 중 오류가 발생했습니다.");
      }
      setIsIdChecked(false);
    }
  };

  // 가입 버튼 실행 함수
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지

    if (!isIdChecked) {
      alert("아이디 중복 확인을 먼저 완료해 주세요!");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    // 서버로 데이터 전송 (스웨거의 loginId, password, email 형식)
    await signup({ loginId, password, email });
    navigate("/signup-complete");
  };

  return (
    <SignupContainer>
      <LogoWrapper>
        <LogoImg src={BbosongLogoGaRo} alt="BBO SONG Logo" />{" "}
      </LogoWrapper>

      <form
        onSubmit={handleSignup}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IdField
          label="아이디"
          placeholder="아이디를 입력해주세요"
          showCheckBtn
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value);
            setIsIdChecked(false);
          }}
          onCheck={handleCheckIdDuplication}
        />

        <IdField
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          subText="비밀번호는 8~20자의 영문 대소문자, 숫자, 특수문자를 조합하여 설정해주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <IdField
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <IdField
          label="이메일"
          placeholder="AAAAA@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PolicySection
          // 1. 체크 상태 데이터 전달
          isServiceAgreed={isServiceAgreed}
          setIsServiceAgreed={setIsServiceAgreed}
          isMarketingAgreed={isMarketingAgreed}
          setIsMarketingAgreed={setIsMarketingAgreed}
          // 2. 모달 여는 함수 전달
          onOpenService={() => setIsServiceModalOpen(true)}
          onOpenMarketing={() => setIsMarketingModalOpen(true)}
        />
        <PolicyModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          title="서비스 이용약관"
          content={
            <>
              <strong>1. 서비스 목적</strong>
              AI 챗봇 상담 및 사용자 의류 이미지 분석·저장 기능을 포함한 디지털
              옷장 서비스 제공.
              <strong>2. 이미지 데이터 활용</strong>
              사용자가 촬영하여 업로드한 의류 사진은 AI 모델의 분석 및 서비스 내
              저장 목적으로만 사용됩니다.
              <strong>3. 개인정보 수집 항목</strong>
              ID, 비밀번호, 이메일, 의류 이미지 데이터.
              <strong>4. 보유 및 이용 기간</strong>
              회원 탈퇴 시까지 (관계 법령에 따름).
              <br />
              <br />* AI 서비스 개선을 위해 학습 데이터로 사용될 수 있음을
              고지합니다.
            </>
          }
        />

        {/* 2. 마케팅 수신 동의 모달 */}
        <PolicyModal
          isOpen={isMarketingModalOpen}
          onClose={() => setIsMarketingModalOpen(false)}
          title="마케팅 정보 수신 동의"
          content={
            <>
              <strong>1. 수집 목적</strong>
              맞춤형 의류 관리 팁, 스타일링 제안, 신규 기능 업데이트 안내 및
              이벤트 정보 제공.
              <strong>2. 수집 항목</strong>
              이메일 주소.
              <strong>3. 수신 채널</strong>
              전자우편(E-mail).
              <strong>4. 보유 기간</strong>
              동의 철회 시 또는 회원 탈퇴 시까지.
            </>
          }
        />
        {/* 4. 버튼 활성화 및 제출 타입 설정 */}
        <SignupButton
          type="submit"
          // 필수 약관(isServiceAgreed) 동의까지 해야 버튼이 활성화되게 수정!
          disabled={
            isLoading ||
            !loginId ||
            !password ||
            !email ||
            !isServiceAgreed ||
            !isIdChecked
          }
        >
          {isLoading ? "가입 중..." : "회원가입"}
        </SignupButton>
      </form>
    </SignupContainer>
  );
};

export default SignupPage;

const SignupButton = styled.button`
  width: 100%;
  max-width: 340px;
  height: 52px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#4b80fc")};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  margin-top: 40px;
  cursor: pointer;
`;

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  min-height: 100vh;
  background-color: white;
`;

const LogoWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 30px;
  margin-top: 20px;
`;

const LogoImg = styled.img`
  width: 170px;
`;
