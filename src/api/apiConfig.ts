export const API_BASE_URL = "https://api.bbosongi.com/api";

export const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;

export const COMMON_AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    accept: "*/*",
  },
} as const;
