import { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import FirstChatHome from "../components/ChatBot/FirstChatHome";
import ChatPrepare from "../components/ChatBot/ChatPrepare";
import ChatMain from "../components/ChatBot/ChatMain";
import { sendChatMessage, getChatMessages } from "../api/chat";
import { optimizeImageFile } from "../utils/imageOptimizer";

export interface MessageStructure {
  from: "user" | "bot";
  text: string;
  imageUrl?: string | null;
}

interface ChatPageProps {
  onStepChange?: (step: number) => void;
}

const CHAT_MESSAGES_STORAGE_KEY = "bbosong_chat_messages";
const CHAT_STEP_STORAGE_KEY = "bbosong_chat_step";
const CHAT_LOADING_STORAGE_KEY = "bbosong_chat_isLoading";
const MAX_STORED_MESSAGES = 80;

const getStoredMessages = () => {
  try {
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch {
    sessionStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
    return [];
  }
};

const ChatPage = ({ onStepChange }: ChatPageProps) => {
  const shouldRefreshHistoryRef = useRef(
    sessionStorage.getItem(CHAT_LOADING_STORAGE_KEY) === "true",
  );

  const [step, setStep] = useState<number>(() => {
    const savedStep = sessionStorage.getItem(CHAT_STEP_STORAGE_KEY);
    return savedStep ? Number(savedStep) : 1;
  });

  const [input, setInput] = useState("");
  const userName = localStorage.getItem("nickname") || "회원";

  const [messages, setMessages] = useState<MessageStructure[]>(getStoredMessages);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(CHAT_STEP_STORAGE_KEY, String(step));
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(
        CHAT_MESSAGES_STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    sessionStorage.setItem(CHAT_LOADING_STORAGE_KEY, String(isLoading));
  }, [isLoading]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (messages.length > 0 && !shouldRefreshHistoryRef.current) return;

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
          shouldRefreshHistoryRef.current = false;
        } else {
          setMessages([
            {
              from: "bot",
              text: `${userName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
            },
          ]);
          shouldRefreshHistoryRef.current = false;
        }
      } catch (error) {
        console.error("채팅 내역 조회 실패:", error);
        setMessages([
          {
            from: "bot",
            text: `${userName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
          },
        ]);
        shouldRefreshHistoryRef.current = false;
      }
    };

    if (step === 3) {
      loadChatHistory();
    }
  }, [messages.length, step, userName]);

  const handleSendMessage = useCallback(async (
    textToSend: string,
    imageFile: File | null = null,
  ) => {
    if (isLoading) return;
    if (!textToSend.trim() && !imageFile) return;

    setInput("");

    const uploadImageFile = imageFile
      ? await optimizeImageFile(imageFile, {
          maxDimension: 1280,
          quality: 0.8,
          fileName: "chat_image.jpg",
        })
      : null;

    const newNewMessages: MessageStructure[] = [];
    const previewImageUrl = uploadImageFile
      ? URL.createObjectURL(uploadImageFile)
      : null;

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
      const res = await sendChatMessage(textToSend.trim(), uploadImageFile);

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
  }, [isLoading]);

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
