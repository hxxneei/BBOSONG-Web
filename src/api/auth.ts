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
export const postLoginLocal = async (data: LoginRequest) => {
  const response = await axiosInstance.post("/auth/login/local", data);
  return response.data;
};

export const postReissue = async (refreshToken: string) => {
  const response = await axios.post(
    "https://api.bbosongi.com/api/auth/reissue",
    {
      refreshToken,
    },
  );
  return response.data;
};
