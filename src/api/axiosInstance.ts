import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ReissueResponse } from "./auth";
import {
  clearAuthStorage,
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  getRefreshTokenExpiresAt,
  saveAuthTokens,
} from "../utils/authStorage";

const API_BASE_URL = "https://api.bbosongi.com/api";
const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;

let refreshRequest: Promise<string | null> | null = null;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    accept: "*/*",
  },
});

const isTokenExpiringSoon = (expiresAt: string | null) => {
  if (!expiresAt) {
    return true;
  }

  const expiresAtMs = new Date(expiresAt).getTime();

  if (Number.isNaN(expiresAtMs)) {
    return true;
  }

  return expiresAtMs - Date.now() <= TOKEN_REFRESH_BUFFER_MS;
};

const requestTokenReissue = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (!refreshRequest) {
    refreshRequest = axios
      .post<ReissueResponse>(
        `${API_BASE_URL}/auth/reissue`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        },
      )
      .then((response) => {
        if (!response.data.isSuccess) {
          return null;
        }

        saveAuthTokens(response.data.result);
        return response.data.result.accessToken;
      })
      .catch((error) => {
        console.error("토큰 재발급 실패:", error);
        clearAuthStorage();
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

const getValidAccessToken = async () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }

  if (!isTokenExpiringSoon(getAccessTokenExpiresAt())) {
    return accessToken;
  }

  if (isTokenExpiringSoon(getRefreshTokenExpiresAt())) {
    clearAuthStorage();
    return null;
  }

  return requestTokenReissue();
};

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  token: string,
) => {
  config.headers.Authorization = `Bearer ${token}`;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken();

    if (token) {
      setAuthorizationHeader(config, token);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const token = await requestTokenReissue();

      if (token) {
        setAuthorizationHeader(originalRequest, token);
        return axiosInstance(originalRequest);
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
