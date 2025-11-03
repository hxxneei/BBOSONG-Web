import styled from "styled-components";
import Title from "../components/FabricScanner/Title";
import PreviewImage from "../components/FabricScanner/PreviewImage";
import ImageDescription from "../components/FabricScanner/ImageDescription";
import Actions from "../components/FabricScanner/Actions";
// 경로도 나중에 @ 수정

export default function FabricScanner() {
  const handleStartCamera = () => {
    // 권한 처리 추가
  };
  const handlePickGallery = () => {};

  return (
    <Page>
      <Title titleLeft="스마트 AI" titleRight="분석 카메라" />
      <PreviewImage />
      <ImageDescription
        line1="옷을 카메라에 비추어 실시간으로"
        strong="옷/세탁 정보"
        line2="를 확인해보세요!"
      />
      <Actions
        onStartCamera={handleStartCamera}
        onPickGallery={handlePickGallery}
      />
    </Page>
  );
}
const Page = styled.main`
  min-height: 100%;
  padding: 8px 24px 24px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
`;
