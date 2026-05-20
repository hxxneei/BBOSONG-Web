// import React, { useEffect, useRef } from "react";
// import styled from "styled-components";

// import type { ChatMessage } from "../api/chat";

// interface Props {
//   messages: { from: string; text: string }[];
//   input: string;
//   setInput: (val: string) => void;
//   onSendMessage: () => void;
//   onBack: () => void;
// }

// const ChatMain: React.FC<Props> = ({
//   messages,
//   input,
//   setInput,
//   onSendMessage,
//   onBack,
// }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <Container>
//       {" "}
//       <TopArea>
//         {" "}
//         <BackBtn onClick={onBack}>
//           <img src="/back-icon.png" alt="back" />{" "}
//         </BackBtn>{" "}
//         <Header>
//           <ProfileImg src="/bbosong5.png" alt="프로필" />{" "}
//           <NameArea>
//             <div className="name">뽀송이</div>{" "}
//             <div className="desc">스마트 챗봇</div>{" "}
//           </NameArea>{" "}
//         </Header>{" "}
//       </TopArea>{" "}
//       <ChatBody ref={scrollRef}>
//         {/* 여기에 서버 연결해서 username입력 */}{" "}
//         <EntryText>
//           ───────── 뽀송이와 "홍길동"님이 입장했어요 ─────────
//         </EntryText>
//         {messages.map((msg, i) => (
//           <Bubble key={i} $isUser={msg.from === "user"}>
//             {msg.text}
//           </Bubble>
//         ))}
//       </ChatBody>
//       <InputSection>
//         <InputBox>
//           <button className="icon-btn">
//             <img src="/camera-icon.png" alt="cam" />
//           </button>
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && onSendMessage()} // 엔터키 전송 추가
//             placeholder="뽀송이에게 무엇이든 물어보세요!"
//           />
//           <SendBtn onClick={onSendMessage} />
//         </InputBox>
//       </InputSection>
//     </Container>
//   );
// };

// export default ChatMain;
// ChatPage.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FirstChatHome from "../components/ChatBot/FirstChatHome";
import ChatPrepare from "../components/ChatBot/ChatPrepare";
import ChatMain from "../components/ChatBot/ChatMain";
import { sendChatMessage } from "../api/chat";

const ChatPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("홍길동");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ from: string; text: string }>
  >([{ from: "bot", text: "홍길동님 안녕하세요! 무엇을 도와드릴까요? 😊" }]);

  useEffect(() => {
    // 콘솔로 주입한 가짜 이름이 있으면 꺼내오기
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
      setMessages([
        {
          from: "bot",
          text: `${savedName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
        },
      ]);
    }
  }, []);

  const onSendMessage = async () => {
    if (!input.trim()) return;

    // 1. 내가 입력한 메시지를 화면에 먼저 띄우기 ({ from, text } 구조)
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");

    try {
      // 서버에 채팅 메시지 전송
      const res = await sendChatMessage(currentInput);

      if (res.isSuccess) {
        // 대화 유지 ID 저장
        setConversationId(res.result.conversationId);

        //  답변을 화면에 보여줌
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: res.result.assistantMessage.content, // 뽀송이 대답 매핑!
          },
        ]);
      }
    } catch (error) {
      console.error("채팅 전송 실패:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "서버와 연결이 불안정해요. 다시 시도해 주세요. 😥",
        },
      ]);
    }
  };
  return (
    <ChatWrapper>
      {step === 1 && <FirstChatHome onStart={() => setStep(2)} />}
      {step === 2 && <ChatPrepare onGoChat={() => setStep(3)} />}
      {step === 3 && (
        <ChatMain
          messages={messages} // 이제 확실하게 배열이 전달되므로 map 에러가 나지 않습니다!
          input={input}
          setInput={setInput}
          onSendMessage={onSendMessage}
          onBack={() => setStep(1)}
          userName={userName}
        />
      )}
    </ChatWrapper>
  );
};

export default ChatPage;

const ChatWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  height: 100vh;
  margin: 0 auto;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
`;
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
  width: 44px;
  height: 44px;
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
  flex: 1; /* ★ 남은 공간 전부 차지 */
  padding: 20px;
  background: linear-gradient(#bcdcff, #dff1ff);
  overflow-y: auto; /* ★ 여기서만 스크롤 발생! */
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* 스크롤바 숨기기 (깔끔함) */
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
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    img {
      width: 24px;
      opacity: 0.5;
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
