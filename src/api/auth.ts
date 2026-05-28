import axiosInstance from "./axiosInstance";
import axios from "axios";
import type {
  LoginRequest,
  SignupRequest,
  ApiResponse,
  SignupResult,
} from "../types/auth";

export const postSignupLocal = async (data: SignupRequest) => {
  const response = await axiosInstance.post<ApiResponse<SignupResult>>(
    "/auth/signup/local",
    data,
  );
  return response.data;
};

export const checkLoginId = async (loginId: string) => {
  const response = await axios.get<
    ApiResponse<{ loginId: string; available: boolean; duplicated: boolean }>
  >("https://api.bbosongi.com/api/auth/signup/local/check-login-id", {
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    params: {
      loginId,
    },
  });
  return response.data;
};

export const postLoginLocal = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/login/local", data);
  return response.data;
};

// 토큰 재발급

export interface ReissueResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    grantType: string;
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };
}

export const postReissue = async (refreshToken: string) => {
  const response = await axios.post<ReissueResponse>(
    "https://api.bbosongi.com/api/auth/reissue",
    {
      refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    },
  );

  return response.data;
};

// 닉네임 수정
export const updateNickname = async (nickname: string) => {
  const response = await axiosInstance.patch("/members/me/nickname", {
    nickname,
  });
  return response.data;
};

// 생년월일 수정
export const updateBirthDate = async (birthDate: string) => {
  const response = await axiosInstance.patch("/members/me/birth-date", {
    birthDate,
  });
  return response.data;
};
