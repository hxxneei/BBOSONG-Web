import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

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
  const [isClosing, setIsClosing] = useState(false);

  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen && place) {
      setIsVisible(true);
      setIsClosing(false); // 열릴 때는 닫힘 상태 해제
      setTranslateY(0);
      setDragStartY(null);
      document.body.style.overflow = "hidden";
    } else if (!isOpen && isVisible) {
      // ⭕ [핵심 로직] 바로 없애지 말고, 닫히는 애니메이션을 먼저 실행합니다.
      setIsClosing(true);
      document.body.style.overflow = "visible";

      // 애니메이션 시간(0.2s)이 지난 후에 실제로 컴포넌트를 언마운트(삭제)합니다.
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, place, isVisible]);

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
      <Dimmed $isClosing={isClosing} onClick={onClose} />
      <SheetWrapper $translateY={translateY}>
        <Sheet $isClosing={isClosing}>
          <SheetContent>
            <DragZone
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
            <GrayBar />

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
            {place.phone && <Phone href={`tel:${place.phone}`}>{place.phone}</Phone>}

            <PlaceLink
              href={place.place_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오맵에서 자세히 보기
              <Icon icon="mingcute:right-line" width={18} height={18} />
            </PlaceLink>
          </SheetContent>
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

const slideDown = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const Dimmed = styled.div<{ $isClosing?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.2s
    ease-out forwards;
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

const Sheet = styled.div<{ $isClosing?: boolean }>`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  position: relative;
  box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.3);

  max-height: 90vh;
  overflow: hidden;

  animation: ${({ $isClosing }) =>
    $isClosing
      ? css`
          ${slideDown} 0.2s ease-in forwards
        `
      : css`
          ${slideUp} 0.25s ease-out forwards
        `};
`;

const SheetContent = styled.div`
  max-height: 90vh;
  padding: 8px 22px 32px;

  /* ⭕ 핵심 1: 모바일 터치 시 폰 앱처럼 관성 스크롤(샤라락) 적용 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* ⭕ 핵심 2: 스크롤 움직임을 더 부드럽게 만들어주는 스무스 효과 */
  scroll-behavior: smooth;
  scrollbar-gutter: stable;

  /* ⭕ 핵심 3: 기본 스크롤바의 딱딱함을 없애고 투명하고 얇게 다듬기 */
  &::-webkit-scrollbar {
    width: 5px; /* 스크롤바 폭을 슬림하게 */
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* 배경은 투명하게 */
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(147, 147, 147, 0.3); /* 은은한 회색 바 */
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(
      75,
      128,
      252,
      0.5
    ); /* 마우스 올리면 브랜드 포인트 컬러로 살짝 피드백 */
  }
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

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0px;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
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
  margin: 8px 0 6px;
  font-weight: 600;
`;

const Phone = styled.a`
  display: inline-block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 20px;
  text-decoration: none;
`;

const PlaceLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #4b80fc;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
`;
