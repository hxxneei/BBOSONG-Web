import { useRef, useEffect } from "react";
import styled from "styled-components";
import cameraBtn from "../assets/cameraBtn.svg";
import closeBtn from "../assets/closeBtn.svg";

type Props = {
  onCapture: (imageFile: File) => void;
  onClose?: () => void;
};

const CameraPreview = ({ onCapture, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    let localStream: MediaStream | null = null;

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

        localStream = stream;
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
          alert("카메라를 사용할 수 없습니다. 권한을 허용했는지 확인해주세요.");
          onClose?.();
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [onClose]);

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
        <CloseButton onClick={onClose}>
          <img src={closeBtn} alt="닫기" />
        </CloseButton>
      )}

      <CaptureButton onClick={handleCapture}>
        <img src={cameraBtn} alt="촬영" />
      </CaptureButton>
    </Wrap>
  );
};

export default CameraPreview;

/* ------------------- 스타일 컴포넌트 (기존 유지) ------------------- */
const Wrap = styled.div`
  position: relative;
  width: 100vw;
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
