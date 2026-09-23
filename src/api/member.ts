import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";

export type MemberMeResponse = ApiResponse<{
    memberId: number;
    email: string;
    nickname: string | null;
    birth: string | null;
}>;

// 내 정보 조회
export const getMemberMe = async (): Promise<MemberMeResponse> => {
  const response = await axiosInstance.get<MemberMeResponse>("/members/me");
  return response.data;
};

// 로그아웃
export const postLogout = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post<ApiResponse<null>>("/auth/logout");
  return response.data;
};

// 회원 탈퇴
export const deleteMemberMe = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>("/members/me");
  return response.data;
};
