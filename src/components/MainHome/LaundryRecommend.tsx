import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { getWeatherLaundry } from "../../api/weather";

const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;

const emojiMap: Record<string, string> = {
  SUN: "☀️",
  INDOOR: "🧺",
  DELAY: "⏳",
  DEHUMIDIFY: "💨",
  LAUNDRY: "🧺",
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

interface WeatherCache {
  expiresAt: number;
  recommendations: RecommendationData[];
}

let weatherCache: WeatherCache | null = null;
let weatherRequest: Promise<RecommendationData[]> | null = null;

const getCachedRecommendations = () => {
  if (!weatherCache || weatherCache.expiresAt <= Date.now()) {
    return null;
  }

  return weatherCache.recommendations;
};

const setWeatherCache = (recommendations: RecommendationData[]) => {
  weatherCache = {
    recommendations,
    expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
  };
};

const fetchWeatherRecommendations = async (
  latitude: number,
  longitude: number,
) => {
  const res = await getWeatherLaundry(latitude, longitude);

  if (res.isSuccess && res.result.recommendations.length > 0) {
    return res.result.recommendations;
  }

  return [];
};

const getWeatherRecommendations = async (
  latitude: number,
  longitude: number,
) => {
  const cachedRecommendations = getCachedRecommendations();

  if (cachedRecommendations) {
    return cachedRecommendations;
  }

  if (!weatherRequest) {
    weatherRequest = fetchWeatherRecommendations(latitude, longitude)
      .then((recommendations) => {
        if (recommendations.length > 0) {
          setWeatherCache(recommendations);
        }

        return recommendations;
      })
      .finally(() => {
        weatherRequest = null;
      });
  }

  return weatherRequest;
};

const fallbackRecommendations: RecommendationData[] = [
  {
    title: "실내건조 추천",
    description: "날씨 정보를 불러올 수 없어\n기본 세탁 가이드를 추천해요.",
    iconType: "DEFAULT",
  },
];

const LaundryRecommend = () => {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cachedRecommendations = getCachedRecommendations();

    if (cachedRecommendations) {
      setRecommendations(cachedRecommendations);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const updateRecommendations = async (
      latitude: number,
      longitude: number,
    ) => {
      try {
        const nextRecommendations = await getWeatherRecommendations(
          latitude,
          longitude,
        );

        if (isMounted) {
          setRecommendations(nextRecommendations);
        }
      } catch (error) {
        console.error("날씨 세탁 추천 데이터 호출 실패:", error);

        try {
          const defaultRecommendations = await getWeatherRecommendations(
            SEOUL_LAT,
            SEOUL_LON,
          );

          if (isMounted) {
            setRecommendations(defaultRecommendations);
          }
        } catch (defaultError) {
          console.error("기본 위치 날씨 데이터 호출 실패:", defaultError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateRecommendations(latitude, longitude);
        },
        (error) => {
          console.error("GPS 위치 권한 거부 또는 획득 실패:", error);
          updateRecommendations(SEOUL_LAT, SEOUL_LON);
        },
      );
    } else {
      updateRecommendations(SEOUL_LAT, SEOUL_LON);
    }

    return () => {
      isMounted = false;
    };
  }, []);

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

  const displayRecommendations =
    recommendations.length > 0 ? recommendations : fallbackRecommendations;

  return (
    <SectionContainer>
      <SectionTitle>
        오늘의 <span className="highlight">추천 세탁</span>
      </SectionTitle>

      <CardScroller>
        {displayRecommendations.map((recommend, cardIndex) => {
          const displayEmoji =
            emojiMap[recommend.iconType || "DEFAULT"] || emojiMap.DEFAULT;
          const descriptionLines = recommend.description.split("\n");

          return (
            <RecommendCard key={`${recommend.title}-${cardIndex}`}>
              <WeatherEmoji
                role="img"
                aria-label={recommend.iconType || "laundry"}
              >
                {displayEmoji}
              </WeatherEmoji>
              <TextGroup>
                <CardTitle>{recommend.title}</CardTitle>
                <CardDesc>
                  {descriptionLines.map((line, index) => (
                    <Fragment key={`${line}-${index}`}>
                      {line}
                      {index !== descriptionLines.length - 1 && <br />}
                    </Fragment>
                  ))}
                </CardDesc>
              </TextGroup>
            </RecommendCard>
          );
        })}
      </CardScroller>
    </SectionContainer>
  );
};

export default LaundryRecommend;

const SectionContainer = styled.div`
  margin: 2px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  .highlight {
    color: #4a89ff;
  }
`;

const CardScroller = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 20px 8px 0;
  margin-right: -20px;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RecommendCard = styled.div`
  width: 100%;
  max-width: 342px;
  flex: 0 0 min(342px, calc(100vw - 40px));
  min-height: 74px;
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
  margin: 0;
  scroll-snap-align: start;
`;

const WeatherEmoji = styled.div`
  width: 58px;
  height: 58px;
  font-size: 42px;
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
