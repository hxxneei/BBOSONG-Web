import { useRef, useEffect } from "react";
import styled from "styled-components";
import cameraBtn from "../assets/cameraBtn.svg";
import closeBtn from "../assets/closeBtn.svg";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

type Props = {
  onCapture: (imageFile: File, isOptimized: boolean) => void;
  onClose?: () => void;
};

const CameraPreview = ({ onCapture, onClose }: Props) => {
  const { showAlert } = useFeedbackModal();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await videoRef.current.play().catch((playErr) => {
            console.warn("비디오 재생 인터럽트 예외 방어:", playErr);
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("getUserMedia 에러:", err);
          void showAlert(
            "카메라를 사용할 수 없습니다. 권한을 허용했는지 확인해주세요.",
          ).then(() => {
            if (isMounted) {
              onCloseRef.current?.();
            }
          });
        }
      }
    };

    void startCamera();

    return () => {
      isMounted = false;

      const stream = streamRef.current;
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [showAlert]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const sourceWidth = video.videoWidth || 1080;
    const sourceHeight = video.videoHeight || 1920;
    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));

    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        onCapture(
          new File([blob], "captured_cloth.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          }),
          true,
        );
      },
      "image/jpeg",
      0.82,
    );
  };

  return (
    <Wrap>
      <Video ref={videoRef} playsInline muted />

      {onClose && (
        <CloseButton type="button" aria-label="카메라 닫기" onClick={onClose}>
          <img src={closeBtn} alt="" aria-hidden="true" />
        </CloseButton>
      )}

      <CaptureButton type="button" aria-label="사진 촬영" onClick={handleCapture}>
        <img src={cameraBtn} alt="" aria-hidden="true" />
      </CaptureButton>
    </Wrap>
  );
};

export default CameraPreview;

const Wrap = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: #000;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  padding: 0;
  z-index: 2;
  cursor: pointer;

  img {
    width: 22px;
    height: 22px;
  }
`;

const CaptureButton = styled.button`
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom) + 40px);
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  padding: 0;
  z-index: 2;
  cursor: pointer;

  img {
    width: 84px;
    height: 84px;
  }

  &:active {
    opacity: 0.8;
  }
`;
