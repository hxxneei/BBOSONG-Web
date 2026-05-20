import styled from "styled-components";
import { useState } from "react";
import Title from "../components/FabricScanner/Title";
import PreviewImage from "../components/FabricScanner/PreviewImage";
import ImageDescription from "../components/FabricScanner/ImageDescription";
import Actions from "../components/FabricScanner/Actions";
import CameraPreview from "../common/CameraPreview";

import { postClothesAnalysis } from "../api/clothes";

import type { ApiResponse } from "../types/auth";
import type { ClothesAnalysisResult } from "../types/clothes";

import { useNavigate } from "react-router-dom";
// 경로도 나중에 @ 수정

export default function FabricScanner() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 분석 중 로딩 상태

  const navigate = useNavigate();

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // 갤러리 or 사진찍기 선택 시, 실행 로직
  const handleCapture = async (imageFile: File) => {
    // 권한 처리 추가
    setIsCameraActive(false);
    setIsLoading(true);
    try {
      const res: ApiResponse<ClothesAnalysisResult> =
        await postClothesAnalysis(imageFile);
      if (res.isSuccess) {
        const imageUrl = URL.createObjectURL(imageFile);
        // 결과 페이지 이동
        navigate("/result", { state: { serverData: res.result, imageUrl } });
      }
    } catch (error) {
      alert("분석 실패");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePickGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCapture(file);
    }
  };

  return (
    <Page>
      {isLoading ? (
        <LoadingView>
          <p>옷 분석 중</p>
        </LoadingView>
      ) : isCameraActive ? (
        <CameraOnlyWrap>
          <CameraPreview
            onCapture={(base64Image: string) => {
              const file = dataURLtoFile(base64Image, "captured_cloth.png");
              handleCapture(file);
            }}
            onClose={() => setIsCameraActive(false)}
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
          {/* hidden input */}
          <input
            type="file"
            id="gallery-input"
            hidden
            accept="image/*"
            onChange={handlePickGallery}
          />
          <Actions
            onStartCamera={() => setIsCameraActive(true)}
            onPickGallery={() =>
              document.getElementById("gallery-input")?.click()
            }
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

const LoadingView = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;
