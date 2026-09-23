import axiosInstance from "./axiosInstance";
import publicAxios from "./publicAxios";
import type {
  LoginRequest,
  SignupRequest,
  LoginResult,
  ReissueResult,
  SignupResult,
} from "../types/auth";
import type { ApiResponse } from "../types/api";

export const postSignupLocal = async (
  data: SignupRequest,
): Promise<ApiResponse<SignupResult>> => {
  const response = await publicAxios.post<ApiResponse<SignupResult>>(
    "/auth/signup/local",
    data,
  );
  return response.data;
};

export const checkLoginId = async (
  loginId: string,
): Promise<
  ApiResponse<{ loginId: string; available: boolean; duplicated: boolean }>
> => {
  const response = await publicAxios.get<
    ApiResponse<{ loginId: string; available: boolean; duplicated: boolean }>
  >("/auth/signup/local/check-login-id", { params: { loginId } });
  return response.data;
};

export const postLoginLocal = async (
  data: LoginRequest,
): Promise<ApiResponse<LoginResult>> => {
  const response = await publicAxios.post<ApiResponse<LoginResult>>(
    "/auth/login/local",
    data,
  );
  return response.data;
};

// 토큰 재발급

export const postReissue = async (
  refreshToken: string,
): Promise<ApiResponse<ReissueResult>> => {
  const response = await publicAxios.post<ApiResponse<ReissueResult>>(
    "/auth/reissue",
    { refreshToken },
  );

  return response.data;
};

export const postOAuthExchange = async (
  code: string,
): Promise<ApiResponse<LoginResult>> => {
  const response = await publicAxios.post<ApiResponse<LoginResult>>(
    "/auth/oauth/exchange",
    { code },
  );
  return response.data;
};

// 닉네임 수정
export const updateNickname = async (
  nickname: string,
): Promise<ApiResponse<{ nickname: string }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ nickname: string }>>(
    "/members/me/nickname",
    {
    nickname,
    },
  );
  return response.data;
};

// 생년월일 수정
export const updateBirthDate = async (
  birthDate: string,
): Promise<ApiResponse<{ birth: string }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ birth: string }>>(
    "/members/me/birth-date",
    {
    birthDate,
    },
  );
  return response.data;
};
