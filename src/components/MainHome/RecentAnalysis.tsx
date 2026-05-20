import React from "react";
import styled from "styled-components";
import png1 from "../../assets/categorydummy/1.png";
import png2 from "../../assets/categorydummy/2.png";
import png3 from "../../assets/categorydummy/3.png";

const RecentAnalysis: React.FC = () => {
  const allData = [
    { id: 1, name: "폴로 코튼 케이블 니트", date: "2024.05.10", img: png1 },
    { id: 2, name: "아디다스 크롭 티셔츠", date: "2024.05.09", img: png2 },
    { id: 3, name: "나이키 스포츠 양말", date: "2024.05.08", img: png3 },
    { id: 4, name: "리바이스 501 데님", date: "2024.05.07", img: png1 },
    { id: 5, name: "자라 오버사이즈 셔츠", date: "2024.05.06", img: png2 },
    { id: 6, name: "안 보일 데이터", date: "2024.05.05", img: png3 },
  ];

  const displayData = allData.slice(0, 5);

  return (
    <SectionContainer>
      <SectionTitle>
        <span className="highlight">최근 분석한 옷</span>이에요
      </SectionTitle>{" "}
      <ListContainer>
        {displayData.map((item) => (
          <AnalysisItem key={item.id}>
            <ImageWrapper>
              <ItemImg src={item.img} alt={item.name} />
            </ImageWrapper>
            <TextInfo>
              <ItemName>{item.name}</ItemName>
              <AnalysisDate>{item.date} </AnalysisDate>
            </TextInfo>
          </AnalysisItem>
        ))}
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
  weight: 
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
