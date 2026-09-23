import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { ReissueResult } from "../types/auth";
import type { ApiResponse } from "../types/api";
import {
  getAccessToken,
  getAccessTokenExpiresAt,
  getRefreshToken,
  getRefreshTokenExpiresAt,
  resetSession,
  saveAuthTokens,
} from "../utils/authStorage";
import { notifyAuthExpired } from "../utils/authEvents";
import { COMMON_AXIOS_CONFIG } from "./apiConfig";
import publicAxios from "./publicAxios";

const TOKEN_REFRESH_BUFFER_MS = 60 * 1000;

let refreshRequest: Promise<string | null> | null = null;

const axiosInstance = axios.create(COMMON_AXIOS_CONFIG);

const expireSession = () => {
  resetSession();
  notifyAuthExpired();
};

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
    expireSession();
    return null;
  }

  if (!refreshRequest) {
    refreshRequest = publicAxios
      .post<ApiResponse<ReissueResult>>("/auth/reissue", { refreshToken })
      .then((response) => {
        if (!response.data.isSuccess) {
          expireSession();
          return null;
        }

        saveAuthTokens(response.data.result);
        return response.data.result.accessToken;
      })
      .catch((error) => {
        console.error("토큰 재발급 실패:", error);
        expireSession();
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
    expireSession();
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

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      expireSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const token = await requestTokenReissue();

    if (token) {
      setAuthorizationHeader(originalRequest, token);
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
