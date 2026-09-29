import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";

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
  const response =
    await axiosInstance.get<GetMessagesResponse>("/chat/messages");
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
  return response.data;
};
