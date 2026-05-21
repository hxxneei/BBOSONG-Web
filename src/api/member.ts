import axiosInstance from "./axiosInstance";

export interface MemberMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string | null; // 설정 안 됐을 때 null 감안
    birth: string | null; // 설정 안 됐을 때 null 감안
  };
}

// 1. 내 정보 조회 API
export const getMemberMe = async () => {
  const response = await axiosInstance.get<MemberMeResponse>("/members/me");
  return response.data;
};

// 2. 로그아웃 API
export const postLogout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
