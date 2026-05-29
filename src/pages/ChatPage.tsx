import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FirstChatHome from "../components/ChatBot/FirstChatHome";
import ChatPrepare from "../components/ChatBot/ChatPrepare";
import ChatMain from "../components/ChatBot/ChatMain";
import { sendChatMessage, getChatMessages } from "../api/chat";

import ChatLoading from "../components/ChatBot/ChatLoading";

export interface MessageStructure {
  from: "user" | "bot";
  text: string;
  imageUrl?: string | null;
}

interface ChatPageProps {
  onStepChange?: (step: number) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onStepChange }) => {
  const [step, setStep] = useState<number>(() => {
    const savedStep = sessionStorage.getItem("bbosong_chat_step");
    return savedStep ? Number(savedStep) : 1;
  });

  const [input, setInput] = useState("");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("nickname") || "회원",
  );

  const [messages, setMessages] = useState<MessageStructure[]>(() => {
    const savedMessages = sessionStorage.getItem("bbosong_chat_messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return sessionStorage.getItem("bbosong_chat_isLoading") === "true";
  });

  useEffect(() => {
    sessionStorage.setItem("bbosong_chat_step", String(step));
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    sessionStorage.setItem("bbosong_chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem("bbosong_chat_isLoading", String(isLoading));
  }, [isLoading]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (messages.length > 0) return;

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

  const handleSendMessage = async (
    textToSend: string,
    imageFile: File | null = null,
  ) => {
    if (!textToSend.trim() && !imageFile) return;

    setInput("");

    const newNewMessages: MessageStructure[] = [];
    const previewImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    if (previewImageUrl) {
      newNewMessages.push({
        from: "user",
        text: "[이미지 첨부]",
        imageUrl: previewImageUrl,
      });
    }

    if (textToSend.trim()) {
      newNewMessages.push({
        from: "user",
        text: textToSend.trim(),
        imageUrl: null,
      });
    }

    setMessages((prev) => [...prev, ...newNewMessages]);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(textToSend.trim(), imageFile);

      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      if (res.isSuccess) {
        const responseMessages: MessageStructure[] = [];

        if (res.result.userMessage.imageUrl) {
          responseMessages.push({
            from: "user",
            text: "[이미지 첨부]",
            imageUrl: res.result.userMessage.imageUrl,
          });
        }
        if (res.result.userMessage.content) {
          responseMessages.push({
            from: "user",
            text: res.result.userMessage.content,
            imageUrl: null,
          });
        }

        responseMessages.push({
          from: "bot",
          text: res.result.assistantMessage.content || "",
          imageUrl: res.result.assistantMessage.imageUrl,
        });

        setMessages((prev) => [
          ...prev.slice(0, -newNewMessages.length),
          ...responseMessages,
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
    } finally {
      setIsLoading(false);
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
          onSendMessage={(text, file) => handleSendMessage(text, file)}
          onSendWithImage={(file) => handleSendMessage("", file)}
          onBack={() => setStep(1)}
          userName={userName}
          isLoading={isLoading}
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
