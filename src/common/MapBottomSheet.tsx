import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import LaundryDummy from "../assets/LaundryDummy.svg";

import { Icon } from "@iconify/react";

export type KakaoPlace = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  place_url: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  place: KakaoPlace | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

const LaundryBottomSheet = ({
  isOpen,
  onClose,
  place,
  isFavorite,
  onToggleFavorite,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen && place) {
      setIsVisible(true);
      setTranslateY(0);
      setDragStartY(null);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen, place]);

  if (!isVisible || !place) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return;
    const diff = e.touches[0].clientY - dragStartY;
    if (diff > 0) {
      if (e.cancelable) {
        e.preventDefault();
      }
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    const THRESHOLD = 100;
    if (translateY > THRESHOLD) {
      setTranslateY(0);
      onClose();
    } else {
      setTranslateY(0);
    }
    setDragStartY(null);
  };

  const displayAddress = place.road_address_name || place.address_name;

  return (
    <>
      <Dimmed onClick={onClose} />
      <SheetWrapper $translateY={translateY}>
        <Sheet>
          <DragZone
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <GrayBar />

          <HeaderImage>
            <img src={LaundryDummy} alt="세탁소 이미지" />
          </HeaderImage>
          <TitleRow>
            <Title>{place.place_name}</Title>

            <BookmarkBtn $active={isFavorite} onClick={onToggleFavorite}>
              <Icon
                icon={isFavorite ? "mdi:bookmark" : "mdi:bookmark-outline"}
                width="30"
              />
            </BookmarkBtn>
          </TitleRow>
          <Address>{displayAddress}</Address>

          <RatingRow>
            <Stars>★★★★★ 4.1</Stars>
            <RatingRight>
              <RatingText>
                사용자 리뷰 <span className="highlight">47개</span> 더보기
              </RatingText>
              <Icon icon="mingcute:right-line" width={14} height={14} />
            </RatingRight>
          </RatingRow>

          <SectionTitle>운영 시간 및 가격</SectionTitle>
          <InfoText style={{ marginBottom: "30px" }}>
            매일 09:00 ~ 20:00
            <br />
            셔츠 및 스웨터류 18,000원 ~
            <br />
            코트 및 점퍼튜 50,000원 ~
          </InfoText>
          <SectionTitle>가게 정보</SectionTitle>
          <InfoText>
            세제/유연제 자동 무료 투입되며 약 60분 세탁 + 건조 완료
            <br />
            3만원 이상 무료 수거 배달 가능
            <br />
            매주 수요일 7% 드라이크리닝 할인
          </InfoText>
        </Sheet>
      </SheetWrapper>
    </>
  );
};

export default LaundryBottomSheet;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const Dimmed = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const SheetWrapper = styled.div<{ $translateY: number }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transform: ${({ $translateY }) => `translateY(${$translateY}px)`};
  transition: transform 0.2s ease-out;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  padding: 8px 22px 20px;
  animation: ${slideUp} 0.25s ease-out forwards;
  position: relative;
  box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.3);

  min-height: 80vh;
  max-height: 90vh;
  overflow-y: auto;
`;

const DragZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  touch-action: none;
`;

const GrayBar = styled.div`
  width: 98px;
  height: 6px;
  background: #d9d9d9;
  border-radius: 6px;
  margin: 35px auto 12px;
`;

const HeaderImage = styled.div`
  width: 100%;
  height: 165px;
  border-radius: 18px;
  background: #e5e7eb;
  margin-bottom: 12px;
  overflow: hidden;

  margin-top: 35px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* SVG도 꽉 차게 */
    display: block;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0px;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 40px;
`;

const BookmarkBtn = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ $active }) => ($active ? "#4B80FC" : "#BFC5D2")};
`;

const Address = styled.p`
  font-size: 14px;
  color: #4b80fc;
  margin: 0 0 6px;
  font-weight: 600;
`;

// const Phone = styled.p`
//   font-size: 13px;
//   color: #374151;
//   margin: 0 0 10px;
// `;

const RatingRow = styled.div`
  display: flex;
  align-items: center;

  padding: 12px 0 12px;
  gap: 110px;

  margin-bottom: 30px;
  margin-top: 30px;

  border-top: 1px solid #c1c1c5;
  border-bottom: 1px solid #c1c1c5;
`;

const RatingRight = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Stars = styled.span`
  font-size: 18px;
  color: #4b80fc;
`;

const RatingText = styled.span`
  font-size: 12px;
  color: #939393;

  .highlight {
    color: #4b80fc;
    font-weight: 600;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 6px;
`;

const InfoText = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: #939393;
  margin: 0 0 12px;
  line-height: 1.4;
`;
