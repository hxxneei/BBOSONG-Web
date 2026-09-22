import axios from "axios";
import { useRef, useState } from "react";
import { postSignupLocal } from "../api/auth";
import type { SignupRequest } from "../types/auth";

type SignupOutcome =
  | { isSuccess: true }
  | { isSuccess: false; message: string };

const DEFAULT_SIGNUP_ERROR_MESSAGE = "회원가입 중 오류가 발생했어요.";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const signup = async (data: SignupRequest): Promise<SignupOutcome> => {
    if (isSubmittingRef.current) {
      return {
        isSuccess: false,
        message: "회원가입 요청을 처리하고 있어요.",
      };
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const response = await postSignupLocal(data);

      if (response.isSuccess) {
        return { isSuccess: true };
      }

      return {
        isSuccess: false,
        message: response.message || DEFAULT_SIGNUP_ERROR_MESSAGE,
      };
    } catch (error: unknown) {
      console.error("회원가입 에러:", error);

      const serverMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;

      return {
        isSuccess: false,
        message: serverMessage || DEFAULT_SIGNUP_ERROR_MESSAGE,
      };
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
