import { useRef, useEffect } from "react";
import styled from "styled-components";
import cameraBtn from "../assets/cameraBtn.svg";
import closeBtn from "../assets/closeBtn.svg";

type Props = {
  onCapture: (image: string) => void;
  onClose?: () => void;
};

const CameraPreview = ({ onCapture, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // 1. ★ 이 컴포넌트가 살아있는지 감시하는 내부 깃발(Flag) 선언
    let isMounted = true;
    let localStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        // 카메라 권한을 수락하는 사이에 컴포넌트가 닫혔다면 즉시 실행 중단 및 클린업
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStream = stream;
        streamRef.current = stream;

        // 2. ★ videoRef가 여전히 화면에 잘 존재하는지 한 번 더 확인!
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // play() 도중에 인터럽트(중단) 되어도 에러로 앱이 죽지 않게 catch 처리
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

    // 3. ★ 언마운트 시 즉시 깃발을 내리고 카메라를 확실하게 종료
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
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(dataUrl);
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
// import { useRef, useEffect } from "react";
// import styled from "styled-components";
// import cameraBtn from "../assets/cameraBtn.svg";
// import closeBtn from "../assets/closeBtn.svg";

// type Props = {
//   onCapture: (image: string) => void; // 촬영된 이미지 전달
//   onClose?: () => void; // 닫기 버튼 클릭 시 실행
// };

// const CameraPreview = ({ onCapture, onClose }: Props) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" }, // 가능하면 후면 카메라
//           audio: false,
//         });

//         streamRef.current = stream;

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (err) {
//         console.error("getUserMedia 에러:", err);
//         alert("카메라를 사용할 수 없습니다. 권한을 허용했는지 확인해주세요.");
//         onClose?.();
//       }
//     };

//     startCamera();

//     // 언마운트 시 카메라 끄기
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [onClose]);

//   const handleCapture = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth || 1080;
//     canvas.height = video.videoHeight || 1920;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/jpeg", 0.9); // Base64 이미지
//     onCapture(dataUrl);
//   };

//   return (
//     <Wrap>
//       {/* 실제 카메라 프리뷰 */}
//       <Video ref={videoRef} playsInline muted />

//       {/* 닫기 버튼 */}
//       {onClose && (
//         <CloseButton onClick={onClose}>
//           <img src={closeBtn} alt="닫기" />
//         </CloseButton>
//       )}

//       {/* 캡처 버튼 */}
//       <CaptureButton onClick={handleCapture}>
//         <img src={cameraBtn} alt="촬영" />
//       </CaptureButton>
//     </Wrap>
//   );
// };

// export default CameraPreview;

// const Wrap = styled.div`
//   position: relative;
//   width: 100vw;
//   height: 100dvh;
//   background: #000;
//   overflow: hidden;
// `;

// const Video = styled.video`
//   width: 100%;
//   height: 100%;
//   aspect-ratio: 9 / 16;
//   object-fit: cover;
//   transform: scaleX(-1);
// `;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 24px;
//   right: 24px;
//   background: none;
//   border: none;
//   padding: 0;
//   z-index: 2;

//   img {
//     width: 22px;
//     height: 22px;
//   }
// `;

// const CaptureButton = styled.button`
//   position: absolute;
//   bottom: calc(env(safe-area-inset-bottom) + 40px);
//   left: 50%;
//   transform: translateX(-50%);
//   background: transparent;
//   border: none;
//   padding: 0;
//   z-index: 2;

//   img {
//     width: 84px;
//     height: 84px;
//   }

//   &:active {
//     opacity: 0.8;
//   }
// `;
