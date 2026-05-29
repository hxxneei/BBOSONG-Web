import React, { useRef, useEffect } from "react";
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
  onSendMessage: () => void;
  onSendWithImage: (file: File) => void; // 이미지 파일 전송용 핸들러 추가
  onBack: () => void;
  userName?: string; // 이름 전달용은 유지
  isLoading: boolean;
}

const ChatMain: React.FC<Props> = ({
  messages,
  input,
  setInput,
  onSendMessage,
  onSendWithImage,
  onBack,
  userName,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      onSendWithImage(selectedFile);
    }
  };
  // useEffect(() => {
  //   if (messages.length > 0 && scrollRef.current) {
  //     const timer = setTimeout(() => {
  //       if (scrollRef.current) {
  //         scrollRef.current.scrollTo({
  //           top: scrollRef.current.scrollHeight,
  //           behavior: "smooth",
  //         });
  //       }
  //     }, 100);

  //     return () => clearTimeout(timer); // 메모리 누수 방지용 청소
  //   }
  // }, [messages]);
  useEffect(() => {
    if ((messages.length > 0 || isLoading) && scrollRef.current) {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
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
            key={i}
            $isUser={msg.from === "user"}
            $hasImage={Boolean(msg.imageUrl)}
          >
            {msg.imageUrl && (
              <MessageImage src={msg.imageUrl} alt="채팅 이미지" />
            )}
            {msg.text && msg.text !== "[이미지 첨부]" && (
              <MessageText>{msg.text}</MessageText>
            )}
          </Bubble>
        ))}
        {isLoading && <ChatLoading />}
      </ChatBody>

      <InputSection>
        <InputBox>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />

          <button className="icon-btn" onClick={handleCameraClick}>
            <img src={cameraBtn} alt="camera" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            placeholder="뽀송이에게 무엇이든 물어보세요!"
          />
          <button className="icon-btn">
            <img src={micBtn} alt="mic" />
          </button>
          <button className="icon-btn" onClick={onSendMessage}>
            <img src={sendBtn} alt="send" />
          </button>
        </InputBox>
      </InputSection>
    </Container>
  );
};

export default ChatMain;

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
  }
`;
