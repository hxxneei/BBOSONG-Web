import styled from "styled-components";
import { useState } from "react";
import Title from "../components/FabricScanner/Title";
import PreviewImage from "../components/FabricScanner/PreviewImage";
import ImageDescription from "../components/FabricScanner/ImageDescription";
import Actions from "../components/FabricScanner/Actions";

import CameraPreview from "../common/CameraPreview";
// 경로도 나중에 @ 수정

export default function FabricScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleStartCamera = () => {
    // 권한 처리 추가
    setIsCameraActive(true);
    console.log("촬영 버튼 클릭");
  };
  const handlePickGallery = () => {
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    // setCapturedImage(image); // 사진 저장(서버 연동 시, 다시)
    setIsCameraActive(false); // 카메라 화면 닫기
    console.log("캡처 완");
  };

  return (
    <Page>
      {/* 카메라만 표시 */}
      {isCameraActive ? (
        <CameraOnlyWrap>
          <CameraPreview
            onCapture={handleCapture}
            onClose={() => setIsCameraActive(false)} // X 버튼 눌렀을 때
          />
        </CameraOnlyWrap>
      ) : (
        <>
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
        </>
      )}
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

const CameraOnlyWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
