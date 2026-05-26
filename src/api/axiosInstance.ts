import axios from "axios";
import { postReissue } from "./auth";

const axiosInstance = axios.create({
  baseURL: "https://api.bbosongi.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    accept: "*/*",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // 실패한 원래 요청 정보

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // 토큰 재발급
          const res = await postReissue(refreshToken);

          if (res.isSuccess) {
            // 새 토큰들 로컬 스토리지에 저장
            localStorage.setItem("accessToken", res.result.accessToken);
            localStorage.setItem("refreshToken", res.result.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${res.result.accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (reissueError) {
          console.error("토큰 재발급 실패:", reissueError);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
