import axiosInstance from "./axiosInstance";
import { registerSessionResetter } from "../utils/authStorage";
import type { ApiResponse } from "../types/api";

const CHAT_MESSAGES_CACHE_TTL_MS = 2 * 60 * 1000;

let chatMessagesCache:
  | {
      expiresAt: number;
      data: GetMessagesResponse;
    }
  | null = null;

export const clearChatMessagesCache = () => {
  chatMessagesCache = null;
};

registerSessionResetter(clearChatMessagesCache);

export interface ChatMessage {
  chatMessageId: number;
  senderType: "USER" | "ASSISTANT";
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

export type GetMessagesResponse = ApiResponse<ChatMessage[]>;

export type SendMessageResponse = ApiResponse<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
}>;

export const getChatMessages = async (): Promise<GetMessagesResponse> => {
  if (chatMessagesCache && chatMessagesCache.expiresAt > Date.now()) {
    return chatMessagesCache.data;
  }

  const response =
    await axiosInstance.get<GetMessagesResponse>("/chat/messages");
  if (response.data.isSuccess) {
    chatMessagesCache = {
      data: response.data,
      expiresAt: Date.now() + CHAT_MESSAGES_CACHE_TTL_MS,
    };
  }
  return response.data;
};

export const sendChatMessage = async (
  content: string,
  imageFile: File | null,
): Promise<SendMessageResponse> => {
  const formData = new FormData();

  if (content.trim()) {
    formData.append("content", content);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axiosInstance.post<SendMessageResponse>(
    "/chat/messages",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (response.data.isSuccess) {
    clearChatMessagesCache();
  }
  return response.data;
};
