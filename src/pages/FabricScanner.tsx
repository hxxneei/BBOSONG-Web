import styled from "styled-components";
import { useEffect, useState } from "react";
import Title from "../components/FabricScanner/Title";
import PreviewImage from "../components/FabricScanner/PreviewImage";
import ImageDescription from "../components/FabricScanner/ImageDescription";
import Actions from "../components/FabricScanner/Actions";
import CameraPreview from "../common/CameraPreview";
import Loading from "../pages/Loading";

import {
  getClothesAnalysisResult,
  postClothesAnalysis,
} from "../api/clothes";

import { useNavigate } from "react-router-dom";

type FabricScannerProps = {
  onCameraActiveChange?: (active: boolean) => void;
};

const POLLING_INTERVAL_MS = 2500;
const MAX_POLLING_COUNT = 60;

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export default function FabricScanner({
  onCameraActiveChange,
}: FabricScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => onCameraActiveChange?.(false);
  }, [onCameraActiveChange]);

  const closeCamera = () => {
    setIsCameraActive(false);
    onCameraActiveChange?.(false);
  };

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

  const handleCapture = async (imageFile: File) => {
    closeCamera();
    setIsLoading(true);

    try {
      const analysisJob = await postClothesAnalysis(imageFile);

      if (!analysisJob.isSuccess) {
        alert("분석 요청에 실패했습니다.");
        return;
      }

      const { jobId } = analysisJob.result;

      for (let count = 0; count < MAX_POLLING_COUNT; count += 1) {
        await wait(POLLING_INTERVAL_MS);

        const analysisResult = await getClothesAnalysisResult(jobId);
        const { status, result, errorMessage } = analysisResult.result;

        if (status === "SUCCESS" && result) {
          const imageUrl = URL.createObjectURL(imageFile);

          navigate("/result", {
            state: { serverData: result, imageUrl, imageFile },
          });
          return;
        }

        if (status === "FAILED") {
          alert(errorMessage || "분석에 실패했습니다.");
          return;
        }
      }

      alert("분석 시간이 길어지고 있습니다. 잠시 후 다시 시도해 주세요.");
    } catch (error: any) {
      if (error?.response?.status === 429) {
        alert("요청이 많습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

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
          <Loading />
        </LoadingView>
      ) : isCameraActive ? (
        <CameraOnlyWrap>
          <CameraPreview
            onCapture={(base64Image: string) => {
              const file = dataURLtoFile(base64Image, "captured_cloth.png");
              handleCapture(file);
            }}
            onClose={closeCamera}
          />
        </CameraOnlyWrap>
      ) : (
        <>
          <Title titleLeft="스마트 AI" titleRight="분석 카메라" />
          <PreviewImage />
          <ImageDescription
            line1="옷을 카메라에 비추면 실시간으로"
            strong="의류 정보"
            line2="를 확인해보세요!"
          />
          <input
            type="file"
            id="gallery-input"
            hidden
            accept="image/*"
            onChange={handlePickGallery}
          />
          <Actions
            onStartCamera={() => {
              setIsCameraActive(true);
              onCameraActiveChange?.(true);
            }}
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
