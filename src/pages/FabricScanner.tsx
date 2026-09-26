import styled from "styled-components";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { optimizeImageFile } from "../utils/imageOptimizer";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

type FabricScannerProps = {
  onCameraActiveChange?: (active: boolean) => void;
};

const POLLING_INTERVAL_MS = 2500;
const MAX_POLLING_COUNT = 60;

const createAbortError = () =>
  new DOMException("분석 작업이 취소되었습니다.", "AbortError");

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, ms);

    const handleAbort = () => {
      window.clearTimeout(timer);
      reject(createAbortError());
    };

    signal.addEventListener("abort", handleAbort, { once: true });
  });

export default function FabricScanner({
  onCameraActiveChange,
}: FabricScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const analysisControllerRef = useRef<AbortController | null>(null);
  const onCameraActiveChangeRef = useRef(onCameraActiveChange);

  const navigate = useNavigate();
  const { showAlert } = useFeedbackModal();

  useEffect(() => {
    onCameraActiveChangeRef.current = onCameraActiveChange;
  }, [onCameraActiveChange]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      analysisControllerRef.current?.abort();
      analysisControllerRef.current = null;
      onCameraActiveChangeRef.current?.(false);
    };
  }, []);

  const closeCamera = useCallback(() => {
    setIsCameraActive(false);
    onCameraActiveChangeRef.current?.(false);
  }, []);

  const openCamera = useCallback(() => {
    setIsCameraActive(true);
    onCameraActiveChangeRef.current?.(true);
  }, []);

  const handleCapture = async (
    imageFile: File,
    imageAlreadyOptimized = false,
  ) => {
    analysisControllerRef.current?.abort();

    const controller = new AbortController();
    const { signal } = controller;
    analysisControllerRef.current = controller;

    closeCamera();
    setIsLoading(true);

    try {
      const optimizedImageFile = imageAlreadyOptimized
        ? imageFile
        : await optimizeImageFile(imageFile, {
            fileName: "cloth_analysis.jpg",
          });

      if (signal.aborted) return;

      const analysisJob = await postClothesAnalysis(optimizedImageFile, signal);

      if (!analysisJob.isSuccess) {
        if (!signal.aborted) {
          void showAlert("분석 요청에 실패했습니다.");
        }
        return;
      }

      const { jobId } = analysisJob.result;

      for (let count = 0; count < MAX_POLLING_COUNT; count += 1) {
        await wait(POLLING_INTERVAL_MS, signal);

        const analysisResult = await getClothesAnalysisResult(jobId, signal);
        const { status, result, errorMessage } = analysisResult.result;

        if (status === "SUCCESS" && result) {
          if (signal.aborted || !isMountedRef.current) return;

          const imageUrl = URL.createObjectURL(optimizedImageFile);
          analysisControllerRef.current = null;

          navigate("/result", {
            state: {
              serverData: result,
              imageUrl,
              imageFile: optimizedImageFile,
            },
          });
          return;
        }

        if (status === "FAILED") {
          if (!signal.aborted) {
            void showAlert(errorMessage || "분석에 실패했습니다.");
          }
          return;
        }
      }

      if (!signal.aborted) {
        void showAlert(
          "분석 시간이 길어지고 있습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    } catch (error: unknown) {
      if (signal.aborted || axios.isCancel(error)) return;

      if (axios.isAxiosError(error) && error.response?.status === 429) {
        void showAlert("요청이 많습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      void showAlert("분석에 실패했습니다.");
    } finally {
      if (analysisControllerRef.current === controller) {
        analysisControllerRef.current = null;

        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }
  };

  const handlePickGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      void handleCapture(file);
    }
  };

  return (
    <Page $reserveBottomNav={!isCameraActive}>
      {isLoading ? (
        <LoadingView>
          <Loading />
        </LoadingView>
      ) : isCameraActive ? (
        <CameraOnlyWrap>
          <CameraPreview
            onCapture={(file, isOptimized) =>
              void handleCapture(file, isOptimized)
            }
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
            onChange={(event) => {
              handlePickGallery(event);
              event.target.value = "";
            }}
          />
          <Actions
            onStartCamera={openCamera}
            onPickGallery={() =>
              document.getElementById("gallery-input")?.click()
            }
          />
        </>
      )}
    </Page>
  );
}

const Page = styled.main<{ $reserveBottomNav: boolean }>`
  min-height: 100%;
  padding: 8px 24px
    ${({ $reserveBottomNav }) =>
      $reserveBottomNav
        ? "calc(var(--bottom-nav-height) + 24px + env(safe-area-inset-bottom, 0px))"
        : "24px"};
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
