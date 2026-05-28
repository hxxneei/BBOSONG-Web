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

export interface EmptyApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

// 내 정보 조회
export const getMemberMe = async () => {
  const response = await axiosInstance.get<MemberMeResponse>("/members/me");
  return response.data;
};

// 로그아웃
export const postLogout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// 회원 탈퇴
export const deleteMemberMe = async () => {
  const response = await axiosInstance.delete<EmptyApiResponse>("/members/me");
  return response.data;
};
