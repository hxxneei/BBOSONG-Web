import styled from "styled-components";

import Camera from "../../assets/camera.png";
type Props = {
  aspectRatio?: number;
};

export default function CameraIllustration({ aspectRatio = 16 / 9 }: Props) {
  return (
    <Hero $ratio={aspectRatio}>
      <img src={Camera} alt="의류 촬영 안내" />
    </Hero>
  );
}

const Hero = styled.div<{ $ratio: number }>`
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  border-radius: 12px;
  overflow: hidden;

  margin-bottom: 34px;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;
