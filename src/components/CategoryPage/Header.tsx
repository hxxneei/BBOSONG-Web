import styled from "styled-components";
import { Icon } from "@iconify/react";

type Props = {
  title: string;
  onBack?: () => void;
};

export default function ClosetHeader({ title, onBack }: Props) {
  return (
    <Header>
      <BackButton aria-label="뒤로가기" onClick={onBack}>
        <Icon
          icon="mingcute:left-line"
          width={32}
          height={32}
          color="#AEAEAE"
        />
      </BackButton>
      <Title>{title}</Title>
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  position: relative;
  background: #fff;
`;

const BackButton = styled.button`
  all: unset;
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;
