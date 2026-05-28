import styled from "styled-components";

type TitleHeaderProps = {
  titleLeft: string; // 스마트 AI
  titleRight: string; // 분석 카메라
};

export default function TitleHeader({
  titleLeft,
  titleRight,
}: TitleHeaderProps) {
  return (
    <Wrap>
      <Title>
        <Accent>{titleLeft} </Accent>
        <Primary>{titleRight} </Primary>
      </Title>
    </Wrap>
  );
}
const Wrap = styled.div`
  margin-bottom: 32px;
  margin-top: 42px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
`;

const Primary = styled.span`
  color: #000000;
`;

const Accent = styled.span`
  color: #4b80fc;
`;
