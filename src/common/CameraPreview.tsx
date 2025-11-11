import { useRef, useEffect } from "react";
import styled from "styled-components";
import cameraBtn from "../assets/cameraBtn.svg";
import closeBtn from "../assets/closeBtn.svg";

type Props = {
  onCapture: (image: string) => void; // 촬영된 이미지 전달
  onClose?: () => void; // 닫기 버튼 클릭 시 실행
};

const CameraPreview = ({ onCapture, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // 가능하면 후면 카메라
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("getUserMedia 에러:", err);
        alert("카메라를 사용할 수 없습니다. 권한을 허용했는지 확인해주세요.");
        onClose?.();
      }
    };

    startCamera();

    // 언마운트 시 카메라 끄기
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9); // Base64 이미지
    onCapture(dataUrl);
  };

  return (
    <Wrap>
      {/* 실제 카메라 프리뷰 */}
      <Video ref={videoRef} playsInline muted />

      {/* 닫기 버튼 */}
      {onClose && (
        <CloseButton onClick={onClose}>
          <img src={closeBtn} alt="닫기" />
        </CloseButton>
      )}

      {/* 캡처 버튼 */}
      <CaptureButton onClick={handleCapture}>
        <img src={cameraBtn} alt="촬영" />
      </CaptureButton>
    </Wrap>
  );
};

export default CameraPreview;

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
  transform: scaleX(-1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  padding: 0;
  z-index: 2;

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

  img {
    width: 84px;
    height: 84px;
  }

  &:active {
    opacity: 0.8;
  }
`;
