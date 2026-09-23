import { useEffect, useState } from "react";
import styled from "styled-components";
import MyClosetCard from "../components/MainHome/MyClosetCard";
import LaundryRecommend from "../components/MainHome/LaundryRecommend";
import RecentAnalysis from "../components/MainHome/RecentAnalysis";
import MainLogo from "../assets/BbosongLogoGaRo.svg";
import {
  getHomeSummary,
  type HomeSummaryResponse,
} from "../api/clothes";

export default function LoadingPage() {
  const [homeSummary, setHomeSummary] = useState<
    HomeSummaryResponse["result"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeSummary = async () => {
      try {
        const response = await getHomeSummary();
        if (isMounted && response.isSuccess) {
          setHomeSummary(response.result);
        }
      } catch (error) {
        console.error("홈 의류 요약을 불러오지 못했습니다.", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchHomeSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <HomeWrapper>
      <BlueBackground />

      <ContentContainer>
        <LogoWrapper>
          <LogoImg src={MainLogo} alt="BBOSONG" width={149} height={24} />
        </LogoWrapper>
        <MyClosetCard
          favorites={homeSummary?.favoriteClothes ?? []}
          isLoading={isLoading}
        />
        <LaundryRecommend />
        <RecentAnalysis
          recentClothes={homeSummary?.recentClothes ?? []}
          isLoading={isLoading}
        />
      </ContentContainer>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 20px 0;
  width: 100%;
`;

const LogoImg = styled.img`
  width: 149px;
  height: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
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
  padding: 10px 0
    calc(
      var(--bottom-nav-height) + 24px + env(safe-area-inset-bottom, 0px)
    );
`;
