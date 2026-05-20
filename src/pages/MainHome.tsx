import styled from "styled-components";
import MyClosetCard from "../components/MainHome/MyClosetCard";
import LaundryRecommend from "../components/MainHome/LaundryRecommend";
import RecentAnalysis from "../components/MainHome/RecentAnalysis";
import MainLogo from "../assets/MainHome/MainLogo.svg";

export default function LoadingPage() {
  return (
    <HomeWrapper>
      <BlueBackground />

      <ContentContainer>
        <LogoWrapper>
          <LogoImg src={MainLogo} alt="BBOSONG LOGO" />
        </LogoWrapper>
        <MyClosetCard />
        <LaundryRecommend />
        <RecentAnalysis />
      </ContentContainer>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 20px 0; /* 로고 위아래 여백 */
  width: 100%;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;

  filter: brightness(0) invert(1);
`;

const BlueBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 320px;
  background-color: #4b80fc;
  z-index: 0;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 30px;
`;
