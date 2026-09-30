import { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import FirstChatHome from "../components/ChatBot/FirstChatHome";
import ChatPrepare from "../components/ChatBot/ChatPrepare";
import ChatMain from "../components/ChatBot/ChatMain";
import { sendChatMessage, getChatMessages } from "../api/chat";
import type { ChatMessage } from "../api/chat";
import { optimizeImageFile } from "../utils/imageOptimizer";

export interface MessageStructure {
  from: "user" | "bot";
  text: string;
  imageUrl?: string | null;
  chatMessageId?: number;
  clientMessageId: string;
  messagePart: "image" | "text";
  isPending?: boolean;
}

interface ChatPageProps {
  onStepChange?: (step: number) => void;
}

const CHAT_MESSAGES_STORAGE_KEY = "bbosong_chat_messages";
const CHAT_STEP_STORAGE_KEY = "bbosong_chat_step";
const MAX_STORED_MESSAGES = 80;

let localMessageSequence = 0;

const isBlobImageUrl = (imageUrl: unknown): imageUrl is string =>
  typeof imageUrl === "string" && imageUrl.startsWith("blob:");

const isStorableMessage = (message: MessageStructure) =>
  !message.isPending && !isBlobImageUrl(message.imageUrl);

const settleFailedPendingMessages = (
  messages: MessageStructure[],
  pendingMessageIds: ReadonlySet<string>,
) =>
  messages.flatMap((message): MessageStructure[] => {
    if (!pendingMessageIds.has(message.clientMessageId)) {
      return [message];
    }

    if (isBlobImageUrl(message.imageUrl)) {
      return [];
    }

    return [{ ...message, isPending: false }];
  });

const createClientMessageId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `local-${Date.now()}-${localMessageSequence++}`;

const createGreetingMessage = (userName: string): MessageStructure => ({
  from: "bot",
  text: `${userName}님 안녕하세요! 무엇을 도와드릴까요? 😊`,
  clientMessageId: createClientMessageId(),
  messagePart: "text",
});

const mapServerMessage = (message: ChatMessage): MessageStructure[] => {
  const from = message.senderType === "USER" ? "user" : "bot";
  const mappedMessages: MessageStructure[] = [];

  if (message.imageUrl) {
    mappedMessages.push({
      from,
      text: "[이미지 첨부]",
      imageUrl: message.imageUrl,
      chatMessageId: message.chatMessageId,
      clientMessageId: `server-${message.chatMessageId}-image`,
      messagePart: "image",
    });
  }

  if (message.content && message.content !== "[이미지 첨부]") {
    mappedMessages.push({
      from,
      text: message.content,
      imageUrl: null,
      chatMessageId: message.chatMessageId,
      clientMessageId: `server-${message.chatMessageId}-text`,
      messagePart: "text",
    });
  }

  if (mappedMessages.length === 0) {
    mappedMessages.push({
      from,
      text: "",
      imageUrl: null,
      chatMessageId: message.chatMessageId,
      clientMessageId: `server-${message.chatMessageId}-text`,
      messagePart: "text",
    });
  }

  return mappedMessages;
};

const getMessageIdentity = (message: MessageStructure) =>
  message.chatMessageId !== undefined
    ? `server-${message.chatMessageId}-${message.messagePart}`
    : message.clientMessageId;

const mergeMessages = (
  primaryMessages: MessageStructure[],
  additionalMessages: MessageStructure[],
) => {
  const identities = new Set(primaryMessages.map(getMessageIdentity));
  const mergedMessages = [...primaryMessages];

  additionalMessages.forEach((message) => {
    const identity = getMessageIdentity(message);

    if (!identities.has(identity)) {
      identities.add(identity);
      mergedMessages.push(message);
    }
  });

  return mergedMessages;
};

const getStoredMessages = (): MessageStructure[] => {
  try {
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_STORAGE_KEY);
    if (!savedMessages) return [];

    const parsedMessages: unknown = JSON.parse(savedMessages);
    if (!Array.isArray(parsedMessages)) {
      throw new Error("Invalid cached chat messages");
    }

    return parsedMessages.flatMap((message): MessageStructure[] => {
      if (!message || typeof message !== "object") return [];

      const cachedMessage = message as Partial<MessageStructure>;
      if (
        (cachedMessage.from !== "user" && cachedMessage.from !== "bot") ||
        typeof cachedMessage.text !== "string" ||
        cachedMessage.isPending === true ||
        isBlobImageUrl(cachedMessage.imageUrl)
      ) {
        return [];
      }

      return [
        {
          from: cachedMessage.from,
          text: cachedMessage.text,
          imageUrl:
            typeof cachedMessage.imageUrl === "string" ||
            cachedMessage.imageUrl === null
              ? cachedMessage.imageUrl
              : undefined,
          chatMessageId:
            typeof cachedMessage.chatMessageId === "number"
              ? cachedMessage.chatMessageId
              : undefined,
          clientMessageId:
            typeof cachedMessage.clientMessageId === "string"
              ? cachedMessage.clientMessageId
              : createClientMessageId(),
          messagePart:
            cachedMessage.messagePart === "image" ||
            cachedMessage.messagePart === "text"
              ? cachedMessage.messagePart
              : cachedMessage.imageUrl
                ? "image"
                : "text",
          isPending: false,
        },
      ];
    });
  } catch {
    sessionStorage.removeItem(CHAT_MESSAGES_STORAGE_KEY);
    return [];
  }
};

const ChatPage = ({ onStepChange }: ChatPageProps) => {
  const messageMutationVersionRef = useRef(0);

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
        JSON.stringify(
          messages.filter(isStorableMessage).slice(-MAX_STORED_MESSAGES),
        ),
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (step !== 3) return;

    let isCancelled = false;
    const mutationVersionAtRequest = messageMutationVersionRef.current;

    const loadChatHistory = async () => {
      try {
        const res = await getChatMessages();
        if (isCancelled) return;

        if (!res.isSuccess) {
          throw new Error(res.message || "Failed to load chat history");
        }

        const serverMessages = res.result.flatMap(mapServerMessage);
        const nextMessages =
          serverMessages.length > 0
            ? serverMessages
            : [createGreetingMessage(userName)];

        setMessages((currentMessages) => {
          const hasMessagesCreatedDuringSync =
            mutationVersionAtRequest !== messageMutationVersionRef.current;
          const messagesToPreserve = currentMessages.filter(
            (message) =>
              message.isPending ||
              (hasMessagesCreatedDuringSync &&
                message.chatMessageId !== undefined),
          );

          return mergeMessages(nextMessages, messagesToPreserve);
        });
      } catch (error) {
        if (isCancelled) return;

        console.error("채팅 내역 조회 실패:", error);
        setMessages((currentMessages) =>
          currentMessages.length > 0
            ? currentMessages
            : [createGreetingMessage(userName)],
        );
      }
    };

    void loadChatHistory();

    return () => {
      isCancelled = true;
    };
  }, [step, userName]);

  const handleSendMessage = useCallback(async (
    textToSend: string,
    imageFile: File | null = null,
  ) => {
    if (isLoading) return;
    if (!textToSend.trim() && !imageFile) return;

    messageMutationVersionRef.current += 1;
    setInput("");

    const uploadImageFile = imageFile
      ? await optimizeImageFile(imageFile, {
          maxDimension: 1280,
          quality: 0.8,
          fileName: "chat_image.jpg",
        })
      : null;

    const previewImageUrl = uploadImageFile
      ? URL.createObjectURL(uploadImageFile)
      : null;
    const pendingMessages: MessageStructure[] = [];

    if (previewImageUrl) {
      pendingMessages.push({
        from: "user",
        text: "[이미지 첨부]",
        imageUrl: previewImageUrl,
        clientMessageId: createClientMessageId(),
        messagePart: "image",
        isPending: true,
      });
    }

    if (textToSend.trim()) {
      pendingMessages.push({
        from: "user",
        text: textToSend.trim(),
        imageUrl: null,
        clientMessageId: createClientMessageId(),
        messagePart: "text",
        isPending: true,
      });
    }

    const pendingMessageIds = new Set(
      pendingMessages.map((message) => message.clientMessageId),
    );

    setMessages((prev) => [...prev, ...pendingMessages]);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(textToSend.trim(), uploadImageFile);

      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }

      if (res.isSuccess) {
        messageMutationVersionRef.current += 1;
        const responseMessages = [
          ...mapServerMessage(res.result.userMessage),
          ...mapServerMessage(res.result.assistantMessage),
        ];

        setMessages((prev) =>
          mergeMessages(
            prev.filter(
              (message) => !pendingMessageIds.has(message.clientMessageId),
            ),
            responseMessages,
          ),
        );
      } else {
        messageMutationVersionRef.current += 1;
        setMessages((prev) =>
          settleFailedPendingMessages(prev, pendingMessageIds),
        );
      }
    } catch (error) {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
      console.error("채팅 전송 실패:", error);
      messageMutationVersionRef.current += 1;
      setMessages((prev) => [
        ...settleFailedPendingMessages(prev, pendingMessageIds),
        {
          from: "bot",
          text: "서버와 연결이 불안정해요. 다시 시도해 주세요. 😥",
          clientMessageId: createClientMessageId(),
          messagePart: "text",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleGoChat = useCallback(
    (initialMessage?: string) => {
      setStep(3);

      if (initialMessage) {
        void handleSendMessage(initialMessage);
      }
    },
    [handleSendMessage],
  );

  return (
    <ChatWrapper>
      {step === 1 && <FirstChatHome onStart={() => setStep(2)} />}
      {step === 2 && <ChatPrepare onGoChat={handleGoChat} />}
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
  height: 100dvh;
  margin: 0 auto;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
`;
