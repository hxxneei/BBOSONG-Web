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
        return true;
      }
      return false;
    } catch (err) {
      console.error("회원가입 에러:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
