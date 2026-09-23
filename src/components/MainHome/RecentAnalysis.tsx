import React from "react";
import styled from "styled-components";
import type { ClothesListItem } from "../../api/clothes";
import {
  getClothesImageUrl,
  handleClothesImageError,
} from "../../utils/clothesImage";

type RecentAnalysisProps = {
  recentClothes: ClothesListItem[];
  isLoading: boolean;
};

const RecentAnalysis: React.FC<RecentAnalysisProps> = ({
  recentClothes,
  isLoading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 정보 없음";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <SectionContainer>
      <SectionTitle>
        <span className="highlight">최근 분석한 옷</span>이에요
      </SectionTitle>

      <ListContainer>
        {isLoading ? (
          <ItemName style={{ padding: "12px 16px" }}>
            옷장 데이터를 불러오는 중... 🧺
          </ItemName>
        ) : recentClothes.length === 0 ? (
          <ItemName style={{ padding: "12px 16px" }}>
            최근에 분석한 옷이 없어요! ✨
          </ItemName>
        ) : (
          recentClothes.slice(0, 5).map((item) => (
            <AnalysisItem key={item.clothesId}>
              <ImageWrapper>
                <ItemImg
                  src={getClothesImageUrl(item.imageUrl)}
                  alt={item.name}
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  onError={handleClothesImageError}
                />
              </ImageWrapper>
              <TextInfo>
                <ItemName>{item.name}</ItemName>
                <AnalysisDate>{formatDate(item.createdAt)}</AnalysisDate>
              </TextInfo>
            </AnalysisItem>
          ))
        )}
      </ListContainer>
    </SectionContainer>
  );
};

export default RecentAnalysis;

const SectionContainer = styled.div`
  margin: 0px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #000;

  .highlight {
    color: #4b80fc;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
`;

const AnalysisItem = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 12px 16px;
  flex-shrink: 0;
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;

  border-radius: 50%;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.09);

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-shrink: 0;

  border: 1px solid #f0f0f0;
`;

const ItemImg = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const TextInfo = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #808080;
`;

const AnalysisDate = styled.span`
  font-size: 10px;
  font-weight: 200;
  color: #c5c5c5;
`;
