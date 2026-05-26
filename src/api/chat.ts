import axiosInstance from "./axiosInstance";

export interface ChatMessage {
  chatMessageId: number;
  senderType: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface GetMessagesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ChatMessage[];
}

export interface SendMessageResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
  };
}

export const getChatMessages = async () => {
  const response =
    await axiosInstance.get<GetMessagesResponse>("/chat/messages");
  return response.data;
};

export const sendChatMessage = async (
  content: string,
  imageFile: File | null,
) => {
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
