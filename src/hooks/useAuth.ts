import { useState } from "react";
import { postSignupLocal } from "../api/auth";
import type { SignupRequest } from "../types/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (data: SignupRequest) => {
    setIsLoading(true);
    try {
      const response = await postSignupLocal(data);
      if (response.isSuccess) {
        alert("회원가입이 완료되었습니다!");
        return response.result;
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      alert("회원가입 중 오류가 발생했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
