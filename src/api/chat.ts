import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/auth";

export interface ChatMessage {
  chatMessageId: number;
  senderType: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface ChatSendResult {
  conversationId: string;
  assistantMessage: ChatMessage;
}

// 채팅 메시지 전송 API 함수
export const sendChatMessage = async (content: string, image?: File) => {
  const formData = new FormData();
  formData.append("content", content); // 텍스트 추가

  if (image) {
    formData.append("image", image); // 이미지 있으면 추가
  }

  const response = await axiosInstance.post<ApiResponse<ChatSendResult>>(
    "/chat/messages",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    },
  );
  return response.data;
};
