import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getWeatherLaundry } from "../../api/weather";

const emojiMap: Record<string, string> = {
  SUN: "☀️",
  RAIN: "🌧️",
  CLOUD: "☁️",
  SNOW: "❄️",
  WIND: "💨",
  DEFAULT: "🧺",
};

interface RecommendationData {
  title: string;
  description: string;
  iconType: string;
}

const LaundryRecommend: React.FC = () => {
  const [recommend, setRecommend] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await getWeatherLaundry(latitude, longitude);
            if (res.isSuccess && res.result.recommendations.length > 0) {
              setRecommend(res.result.recommendations[0]);
            }
          } catch (error) {
            console.error("날씨 세탁 추천 데이터 호출 실패:", error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("GPS 위치 권한 거부 또는 획득 실패:", error);
          fetchDefaultWeather();
        },
      );
    } else {
      fetchDefaultWeather();
    }
  }, []);

  const fetchDefaultWeather = async () => {
    try {
      const SEOUL_LAT = 37.5665;
      const SEOUL_LON = 126.978;
      const res = await getWeatherLaundry(SEOUL_LAT, SEOUL_LON);
      if (res.isSuccess && res.result.recommendations.length > 0) {
        setRecommend(res.result.recommendations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SectionContainer>
        <SectionTitle>
          오늘의 <span className="highlight">추천 세탁</span>
        </SectionTitle>
        <RecommendCard>
          <LoadingText>실시간 날씨 분석 중...</LoadingText>
        </RecommendCard>
      </SectionContainer>
    );
  }

  const displayTitle = recommend?.title || "실내 건조";
  const displayDesc =
    recommend?.description ||
    "날씨 정보를 불러올 수 없어\n기본 세탁 가이드를 추천해요.";
  const displayEmoji =
    emojiMap[recommend?.iconType || "DEFAULT"] || emojiMap["DEFAULT"];

  return (
    <SectionContainer>
      <SectionTitle>
        오늘의 <span className="highlight">추천 세탁</span>
      </SectionTitle>

      <RecommendCard>
        <WeatherEmoji role="img" aria-label={recommend?.iconType || "laundry"}>
          {displayEmoji}
        </WeatherEmoji>
        <TextGroup>
          <CardTitle>{displayTitle}</CardTitle>
          <CardDesc>
            {displayDesc.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index !== displayDesc.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </CardDesc>
        </TextGroup>
      </RecommendCard>
    </SectionContainer>
  );
};

export default LaundryRecommend;

const SectionContainer = styled.div`
  margin: 20px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  .highlight {
    color: #4a89ff;
  }
`;

const RecommendCard = styled.div`
  width: 100%;
  max-width: 342px;
  min-height: 74px;
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
`;

const WeatherEmoji = styled.div`
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

const CardDesc = styled.p`
  font-size: 10px;
  color: #888;
  line-height: 1.5;
  font-weight: 600;
  margin: 0;
  white-space: pre-line;
`;

const LoadingText = styled.span`
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
`;
