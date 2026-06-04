import React from "react";
import styled from "styled-components";
import { ChevronLeft } from "lucide-react";
interface HeaderWrapperProp {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export const HeaderWrapper: React.FC<HeaderWrapperProp> = ({
  title,
  onBack,
  rightSlot,
}) => {
  return (
    <HeaderBar role="banner">
      <Left>
        <BackButton aria-label="뒤로가기" onClick={onBack}>
          <ChevronLeft size={32} />
        </BackButton>
      </Left>
      <Center aria-live="polite">{title}</Center>
      <Right>{rightSlot}</Right>
    </HeaderBar>
  );
};

const HeaderBar = styled.header`
  position: sticky;
  top: 0;

  z-index: 10;
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  height: 56px;
  padding: 0 8px;
  background: #fff;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  jusify-content: flex-start;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  jusify-content: flex-end;
`;
const Center = styled.div`
  margin: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;
const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #aeaeae;
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  border-radius: 10px;
  &:active {
    background: rgba(0, 0, 0, 0.04);
  }
`;
