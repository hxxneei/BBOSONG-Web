import styled from "styled-components";
import PlusIcon from "../../assets/MainHome/PlusIcon.svg";
import HangerIcon from "../../assets/MainHome/HangerIcon.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { HomeClothingItem } from "../../api/clothes";
import {
  getClothesImageUrl,
  handleClothesImageError,
} from "../../utils/clothesImage";

type MyClosetCardProps = {
  favorites: HomeClothingItem[];
  isLoading: boolean;
};

const MyClosetCard: React.FC<MyClosetCardProps> = ({
  favorites,
  isLoading,
}) => {
  const navigate = useNavigate();
  const userNickname = localStorage.getItem("nickname") || "보송이";
  const visibleFavorites = favorites.slice(0, 5);
  const emptyCount = Math.max(0, 5 - visibleFavorites.length);

  return (
    <CardContainer>
      <Header>
        <TitleGroup>
          <UserName>{userNickname}</UserName>
          <TitleText>님 맞춤 옷장</TitleText>
          <HangerImg src={HangerIcon} alt="옷걸이" />
        </TitleGroup>
        <ShortcutBtn onClick={() => navigate("/closetpage")}>
          바로가기
          <ChevronRight size={14} color="#888888" />
        </ShortcutBtn>
      </Header>

      <ScrollWrapper>
        {visibleFavorites.map((item) => (
          <ClosetItem
            key={item.clothesId}
            onClick={() => navigate(`/my-closet/${item.clothesId}`)}
          >
            <ItemImg
              src={getClothesImageUrl(item.imageUrl)}
              alt={item.name}
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              onError={handleClothesImageError}
            />
            <ItemName>{item.name}</ItemName>
          </ClosetItem>
        ))}

        {!isLoading &&
          Array.from({ length: emptyCount }).map((_, index) => (
            <EmptyItem
              key={`empty-${index}`}
              onClick={() => navigate("/closetpage")}
            >
              <img src={PlusIcon} alt="추가하기" width={24} height={24} />
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

  width: calc(100% - 32px);
  max-width: 368px;
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

  height: 150px;

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
