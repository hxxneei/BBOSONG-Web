import styled from "styled-components";
import MyClosetCard from "../components/MainHome/MyClosetCard";
import LaundryRecommend from "../components/MainHome/LaundryRecommend";
import RecentAnalysis from "../components/MainHome/RecentAnalysis";
import MainLogo from "../assets/MainHome/MainLogo.png";

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
  padding: 10px 0 20px 0;
  width: 100%;
`;

const LogoImg = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;
`;

const BlueBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 270px;
  background-color: #4b80fc;
  z-index: 0;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`;
