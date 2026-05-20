import React from "react";
import styled from "styled-components";
import TermsDetail from "../../assets/SignupPage/TermsDetail.svg";
import RequiredMark from "../../assets/SignupPage/RequiredMark.svg";

interface PolicySectionProps {
  isServiceAgreed: boolean;
  setIsServiceAgreed: (val: boolean) => void;
  isMarketingAgreed: boolean;
  setIsMarketingAgreed: (val: boolean) => void;
  onOpenService: () => void;
  onOpenMarketing: () => void;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  isServiceAgreed,
  setIsServiceAgreed,
  isMarketingAgreed,
  setIsMarketingAgreed,
  onOpenService,
  onOpenMarketing,
}) => {
  return (
    <SectionWrapper>
      <PolicyRow>
        {/* 체크 아이콘 클릭 시 상태 변경 */}
        <PolicyLabelGroup onClick={() => setIsServiceAgreed(!isServiceAgreed)}>
          <PolicyText>서비스 약관 동의</PolicyText>
          <RequiredDot src={RequiredMark} alt="필수" />
          <CheckIcon src={TermsDetail} $isAgreed={isServiceAgreed} />
        </PolicyLabelGroup>
        <ViewLink type="button" onClick={onOpenService}>
          약관 보기
        </ViewLink>
      </PolicyRow>

      <PolicyRow>
        <PolicyLabelGroup
          onClick={() => setIsMarketingAgreed(!isMarketingAgreed)}
        >
          <PolicyText>마케팅 수신 동의</PolicyText>
          <CheckIcon src={TermsDetail} $isAgreed={isMarketingAgreed} />
        </PolicyLabelGroup>
        <ViewLink type="button" onClick={onOpenMarketing}>
          약관 보기
        </ViewLink>
      </PolicyRow>
    </SectionWrapper>
  );
};

export default PolicySection;

const SectionWrapper = styled.div`
  width: 100%;
  max-width: 340px;
  margin-top: 30px;
`;

const PolicyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  & + & {
    margin-top: 6px;
    border-top: 1px solid #ddd;
  }
`;

const PolicyLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const PolicyText = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #000;
`;

const RequiredDot = styled.img`
  width: 6px;
  height: 6px;
  margin-left: -4px;
  position: relative;
  top: -3px;
  object-fit: contain;
`;

const ViewLink = styled.button`
  border: none;
  background: none;
  font-size: 11px;
  color: #777;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  padding: 0;
  line-height: 1.2;
`;

const CheckIcon = styled.img<{ $isAgreed: boolean }>`
  width: 16px;
  cursor: pointer;
  transition: filter 0.3s ease;

  filter: ${(props) =>
    props.$isAgreed
      ? "invert(42%) sepia(93%) saturate(1352%) hue-rotate(209deg) brightness(101%) contrast(107%)"
      : "none"};
`;
