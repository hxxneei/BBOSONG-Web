import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FirstChatHome from "../components/ChatBot/FirstChatHome";
import ChatPrepare from "../components/ChatBot/ChatPrepare";
import ChatMain from "../components/ChatBot/ChatMain";
import { sendChatMessage, getChatMessages } from "../api/chat";

export interface MessageStructure {
  from: "user" | "bot";
  text: string;
  imageUrl?: string | null;
}

interface ChatPageProps {
  onStepChange?: (step: number) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onStepChange }) => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("nickname") || "회원",
  );
  const [messages, setMessages] = useState<MessageStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const res = await getChatMessages();
        if (res.isSuccess && res.result.length > 0) {
          const history = res.result.map((msg) => ({
            from:
              msg.senderType === "USER" ? ("user" as const) : ("bot" as const),
            text: msg.content || "",
            imageUrl: msg.imageUrl,
          }));
          setMessages(history);
        } else {
          setMessages([
            {
              from: "bot",
              text: `${userName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
            },
          ]);
        }
      } catch (error) {
        console.error("채팅 내역 조회 실패:", error);
        setMessages([
          {
            from: "bot",
            text: `${userName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
          },
        ]);
      }
    };

    if (step === 3) {
      loadChatHistory();
    }
  }, [step, userName]);

  const handleSendMessage = async (imageFile: File | null = null) => {
    if (!input.trim() && !imageFile) return;

    const previewImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;
    const previewMessage: MessageStructure = {
      from: "user",
      text: input.trim(),
      imageUrl: previewImageUrl,
    };

    setMessages((prev) => [...prev, previewMessage]);

    const currentInput = input;
    setInput("");

    try {
      const res = await sendChatMessage(currentInput, imageFile);
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      if (res.isSuccess) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            from: "user",
            text: res.result.userMessage.content || "",
            imageUrl: res.result.userMessage.imageUrl,
          },
          {
            from: "bot",
            text: res.result.assistantMessage.content || "",
            imageUrl: res.result.assistantMessage.imageUrl,
          },
        ]);
      }
    } catch (error) {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
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
          messages={messages}
          input={input}
          setInput={setInput}
          onSendMessage={() => handleSendMessage(null)}
          onSendWithImage={(file) => handleSendMessage(file)}
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
