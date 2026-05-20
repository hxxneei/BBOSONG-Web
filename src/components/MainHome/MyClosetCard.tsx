import React from "react";
import styled from "styled-components";
import LeftBackBtn from "../../assets/LeftBackBtn.svg";
import PlusIcon from "../../assets/MainHome/PlusIcon.svg";
import HangerIcon from "../../assets/MainHome/HangerIcon.svg";
import { useNavigate } from "react-router-dom";
import png1 from "../../assets/categorydummy/1.png";
import png2 from "../../assets/categorydummy/2.png";

const MyClosetCard: React.FC = () => {
  // 나중에 서버 데이터로 바뀔 더미 데이터
  const dummyItems = [
    { id: 1, name: "아디다스 크롭", img: png1 },
    { id: 2, name: "폴로 코튼 케이블 니트", img: png2 },
  ];
  const navigate = useNavigate();

  return (
    <CardContainer>
      <Header>
        <TitleGroup>
          <UserName>홍길동</UserName>
          <TitleText>님 맞춤 옷장</TitleText>
          <HangerImg src={HangerIcon} alt="옷걸이" />
        </TitleGroup>
        <ShortcutBtn onClick={() => navigate("/closetpage")}>
          바로가기
          <FlipIcon src={LeftBackBtn} alt="바로가기" />
        </ShortcutBtn>
      </Header>

      <ScrollWrapper>
        {/* 기존 아이템들 */}
        {dummyItems.map((item) => (
          <ClosetItem key={item.id}>
            <ItemImg src={item.img} alt={item.name} />
            <ItemName>{item.name}</ItemName>
          </ClosetItem>
        ))}

        {/* 비어있는 플러스 아이콘 2개 */}
        {[1, 2].map((i) => (
          <EmptyItem key={`empty-${i}`}>
            <img src={PlusIcon} alt="추가하기" style={{ width: "24px" }} />
          </EmptyItem>
        ))}
      </ScrollWrapper>
    </CardContainer>
  );
};

export default MyClosetCard;

const CardContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  margin: 0 auto;

  align-items: center;

  width: 368px;
  height: 224px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  color: #4a89ff;
  font-size: 15px;
  font-weight: 700;
`;

const TitleText = styled.span`
  font-size: 15px;
  font-weight: 700;
  margin-left: 4px;
`;

const ShortcutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #888;
  font-size: 13px;
  cursor: pointer;
`;

const FlipIcon = styled.img`
  width: 14px;
  transform: scaleX(-1);
`;

const ScrollWrapper = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ClosetItem = styled.div`
  /* 너비 고정: flex-grow(0), flex-shrink(0), width(110px) */
  flex: 0 0 110px;

  height: 110px;

  background: #fff;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
`;

const ItemImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const ItemName = styled.p`
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
  word-break: keep-all;
`;

const EmptyItem = styled.div`
  flex: 0 0 110px;

  height: 150px;

  border: 1.5px dashed #4a89ff;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8faff;
  box-sizing: border-box;
`;

const HangerImg = styled.img`
  width: 20px;
  height: auto;
  margin-left: 6px;
  object-fit: contain;
`;
