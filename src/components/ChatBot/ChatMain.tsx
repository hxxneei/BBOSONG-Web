import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import cameraBtn from "../../assets/ChatPage/cameraBtn.svg";
import micBtn from "../../assets/ChatPage/micBtn.svg";
import sendBtn from "../../assets/ChatPage/sendBtn.svg";
import BSProfile from "../../assets/ChatPage/BSProfile.svg";

interface Props {
  messages: { from: string; text: string }[]; // 기존 가짜 데이터 구조로 복구
  input: string;
  setInput: (val: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  userName?: string; // 이름 전달용은 유지
}

const ChatMain: React.FC<Props> = ({
  messages,
  input,
  setInput,
  onSendMessage,
  onBack,
  userName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container>
      <TopArea>
        <BackBtn onClick={onBack}></BackBtn>
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
          ───────── 뽀송이와 {userName || "홍길동"}님이 입장했어요 ─────────
        </EntryText>

        {/* 원래대로 msg.from과 msg.text 구조로 맵핑 */}
        {messages.map((msg, i) => (
          <Bubble key={i} $isUser={msg.from === "user"}>
            {msg.text}
          </Bubble>
        ))}
      </ChatBody>

      <InputSection>
        <InputBox>
          <button className="icon-btn">
            <img src={cameraBtn} alt="camera" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()} // 엔터키 전송
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
  padding: 40px 20px 20px 20px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 16px;
  top: 45px;
  img {
    width: 24px;
    opacity: 0.6;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 30px;
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

const Bubble = styled.div<{ $isUser: boolean }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background: ${(props) => (props.$isUser ? "#4B80FC" : "white")};
  color: ${(props) => (props.$isUser ? "white" : "#333")};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  ${(props) =>
    props.$isUser
      ? "border-bottom-right-radius: 2px;"
      : "border-bottom-left-radius: 2px;"}
`;

const InputSection = styled.div`
  padding: 15px;
  background: white;
  margin-bottom: 70px;
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 30px;

  input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 15px;
  }

  /* ⭕ 이제 카메라도, 마이크도, 전송 버튼도 이 스타일 하나로 전부 이쁘게 정렬됩니다! */
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; /* 여백 초기화 */

    img {
      width: 24px; /* 삼총사 크기 똑같이 24px로 통일 */
      height: 24px;
      opacity: 0.7;
    }

    /* 클릭할 때 살짝 눌리는 손맛 추가 */
    &:active {
      transform: scale(0.9);
    }
  }
`;

const SendBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4b80fc;
  border: none;
  cursor: pointer;
  background-image: url("/send-icon.png");
  background-size: 18px;
  background-position: center;
  background-repeat: no-repeat;
`;
