import styled from "styled-components";

type ImageDescriptionProps = {
  line1: string; // 옷을 카메라에 비추어 실시간으로
  strong: string; // 옷/세탁 정보
  line2: string; // 를 확인해보세요
};

export default function ImageDescription({
  line1,
  line2,
  strong,
}: ImageDescriptionProps) {
  return (
    <Wrap>
      <P>{line1}</P>
      <P>
        <Strong>{strong}</Strong>
        {line2}
      </P>
    </Wrap>
  );
}
const Wrap = styled.div`
  margin-bottom: 56px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const P = styled.p`
  margin: 4px 0;
  color: #111111;
  font-size: 18px;
  font-weight: 600;
  line-height: 14px;

  &:first-child {
    margin-top: 0;
  }
`;

const Strong = styled.strong`
  color: #4b80fc;
`;
