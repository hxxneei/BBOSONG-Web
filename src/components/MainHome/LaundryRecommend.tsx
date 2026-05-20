import React from "react";
import styled from "styled-components";

const LaundryRecommend: React.FC = () => {
  return (
    <SectionContainer>
      <SectionTitle>
        오늘의 <span className="highlight">추천 세탁</span>
      </SectionTitle>

      <RecommendCard>
        <WeatherEmoji role="img" aria-label="해">
          ☀️
        </WeatherEmoji>
        <TextGroup>
          <CardTitle>실외건조</CardTitle>
          <CardDesc>
            미세먼지가 적고 화창한 오늘
            <br />
            날씨에는 실외건조를 추천해요.
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
  width: 100%; /* 카드 하나니까 가득 차게 */
  max-width: 342px; /* 디자인 가이드에 맞춰 조절 가능 */
  height: 74px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
  margin: 0 auto; /* 중앙 정렬 */
`;

const WeatherEmoji = styled.div`
  font-size: 45px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; /* 찌그러짐 방지 */
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
`;
