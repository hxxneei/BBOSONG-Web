import React, {
  memo,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";

import cameraBtn from "../../assets/ChatPage/cameraBtn.svg";
import micBtn from "../../assets/ChatPage/micBtn.svg";
import sendBtn from "../../assets/ChatPage/sendBtn.svg";
import BSProfile from "../../assets/ChatPage/BSProfile.webp";
import { Icon } from "@iconify/react";
import ChatLoading from "./ChatLoading";

interface Props {
  messages: { from: string; text: string; imageUrl?: string | null }[];
  input: string;
  setInput: (val: string) => void;
  onSendMessage: (text: string, file: File | null) => void;
  onBack: () => void;
  userName?: string; // 이름 전달용은 유지
  isLoading: boolean;
}

const ChatMain: React.FC<Props> = ({
  messages,
  input,
  setInput,
  onSendMessage,
  onBack,
  userName,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImageFile(file);
      setImagePreviewUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return URL.createObjectURL(file);
      });
      e.target.value = "";
    }
  }, []);

  const handleCancelImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreviewUrl]);

  const handleFinalSubmit = useCallback(() => {
    if (isLoading) return;
    if (!input.trim() && !selectedImageFile) return;

    // 🚀 부모인 ChatPage의 handleSendMessage로 텍스트와 파일 객체를 유실 없이 정상 배달!
    onSendMessage(input, selectedImageFile);

    // 전송 처리가 완전히 끝났으므로 내 임시 대기 장소 초기화
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [input, isLoading, onSendMessage, selectedImageFile]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if ((messages.length > 0 || isLoading) && scrollRef.current) {
      const animationFrame = window.requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "auto",
          });
        }
      });

      return () => window.cancelAnimationFrame(animationFrame);
    }
  }, [messages, isLoading]);
  return (
    <Container>
      <TopArea>
        <TopRow>
          <BackBtn onClick={onBack}>
            <Icon
              icon="mingcute:left-line"
              width={32}
              height={32}
              color="#767676"
            />
          </BackBtn>
        </TopRow>
        <Header>
          <ProfileImg src={BSProfile} alt="BSProfile" />
          <NameArea>
            <div className="name">뽀송이</div>
            <div className="desc">스마트 챗봇</div>
          </NameArea>
        </Header>
      </TopArea>

      <ChatBody ref={scrollRef}>
        <EntryText>
          ─────── &nbsp;&nbsp; 뽀송이와 {userName || "회원"}님이 입장했어요
          &nbsp;&nbsp; ───────
        </EntryText>

        {messages.map((msg, i) => (
          <Bubble
            key={`${msg.from}-${i}-${msg.text}`}
            $isUser={msg.from === "user"}
            $hasImage={Boolean(msg.imageUrl)}
          >
            {msg.imageUrl && (
              <MessageImage
                src={msg.imageUrl}
                alt="채팅 이미지"
                loading="lazy"
                decoding="async"
              />
            )}
            {msg.text && msg.text !== "[이미지 첨부]" && (
              <MessageText>{msg.text}</MessageText>
            )}
          </Bubble>
        ))}
        {isLoading && <ChatLoading />}
      </ChatBody>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      <InputSection>
        {imagePreviewUrl && (
          <ImagePreviewBar>
            <PreviewContainer>
              <img src={imagePreviewUrl} alt="업로드 대기 샘플" />
              <CancelImageBtn onClick={handleCancelImage}>
                <Icon
                  icon="ic:baseline-close"
                  width="16"
                  height="16"
                  color="white"
                />
              </CancelImageBtn>
            </PreviewContainer>
          </ImagePreviewBar>
        )}
        <InputBox>
          <button
            className="icon-btn"
            type="button"
            onClick={handleCameraClick}
            disabled={isLoading}
          >
            <img src={cameraBtn} alt="camera" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFinalSubmit()}
            disabled={isLoading}
            placeholder="뽀송이에게 무엇이든 물어보세요!"
          />
          <button className="icon-btn" type="button" disabled={isLoading}>
            <img src={micBtn} alt="mic" />
          </button>
          <button
            className="icon-btn"
            type="button"
            onClick={handleFinalSubmit}
            disabled={isLoading}
          >
            <img src={sendBtn} alt="send" />
          </button>
        </InputBox>
      </InputSection>
    </Container>
  );
};

export default memo(ChatMain);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const TopArea = styled.div`
  background: white;
  padding: 10px 20px 20px 20px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 12px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-right: 16px;

  img {
    width: 24px;
    opacity: 0.6;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 0px;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const NameArea = styled.div`
  .name {
    font-size: 17px;
    font-weight: 700;
  }
  .desc {
    font-size: 12px;
    color: #888;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 20px;
  padding-bottom: 80px;
  background: linear-gradient(#bcdcff, #dff1ff);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const EntryText = styled.div`
  text-align: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.2);
  margin: 10px 0;
`;

const Bubble = styled.div<{ $isUser: boolean; $hasImage?: boolean }>`
  max-width: 75%;
  padding: ${(props) => (props.$hasImage ? "0px" : "10px 18px")};
  border-radius: ${(props) => (props.$hasImage ? "18px" : "30px")};
  font-size: 13px;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.$hasImage ? "transparent" : props.$isUser ? "#4B80FC" : "white"};
  color: ${(props) => (props.$isUser ? "white" : "#333")};
  box-shadow: 0px 4px 5px 0px #4b80fc4d;
`;

const MessageImage = styled.img`
  display: block;
  width: 140px;
  height: 140px;
  border-radius: 14px;
  object-fit: contain;
  background: #fff;
`;

const MessageText = styled.span`
  display: block;
  white-space: pre-wrap;

  img + & {
    margin-top: 8px;
    padding: 0 8px 4px;
  }
`;

const InputSection = styled.div`
  position: absolute;
  bottom: 25px;
  left: 0;
  right: 0;

  padding: 0 20px;
  background: transparent;
  z-index: 5;
`;
const InputBox = styled.div`
  width: 95%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 10px 16px;
  border-radius: 30px;

  box-shadow: 0px 4px 10px rgba(75, 128, 252, 0.1);

  input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    color: #333333;

    &::placeholder {
      color: #b4b4b4;
    }
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    img {
      width: 24px;
      height: 24px;
      opacity: 0.7;
    }

    &:active {
      transform: scale(0.9);
    }

    &:disabled {
      cursor: default;
      opacity: 0.45;
    }
  }
`;

const ImagePreviewBar = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  padding-left: 12px;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(75, 128, 252, 0.2);
  overflow: visible; /* 엑스표 단추가 삐져나갈 수 있게 처리 */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const CancelImageBtn = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #374151; /* 챠콜 회색 원형 단추 */
  border: 1.5px solid white;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #1f2937;
  }
`;
