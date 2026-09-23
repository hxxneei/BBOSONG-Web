import axiosInstance from "./axiosInstance";
import { registerSessionResetter } from "../utils/authStorage";
import type { ApiResponse } from "../types/api";

const STORE_CACHE_TTL_MS = 2 * 60 * 1000;

export interface FavoriteStoreRequest {
  kakaoPlaceId: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  placeUrl: string;
}

export interface FavoriteStoreResponse {
  storeId: number;
  kakaoPlaceId: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  placeUrl: string;
  createdAt: string;
}

let favoriteStoresCache:
  | {
      expiresAt: number;
      data: ApiResponse<FavoriteStoreResponse[]>;
    }
  | null = null;

export const invalidateStoresCache = () => {
  favoriteStoresCache = null;
};

registerSessionResetter(invalidateStoresCache);

// 즐겨찾기 매장 목록 조회
export const getFavoriteStores = async (): Promise<
  ApiResponse<FavoriteStoreResponse[]>
> => {
  if (favoriteStoresCache && favoriteStoresCache.expiresAt > Date.now()) {
    return favoriteStoresCache.data;
  }

  const response = await axiosInstance.get<
    ApiResponse<FavoriteStoreResponse[]>
  >("stores/favorites");
  if (response.data.isSuccess) {
    favoriteStoresCache = {
      data: response.data,
      expiresAt: Date.now() + STORE_CACHE_TTL_MS,
    };
  }
  return response.data;
};

//  즐겨찾기 매장 저장
export const addFavoriteStore = async (
  data: FavoriteStoreRequest,
): Promise<ApiResponse<FavoriteStoreResponse>> => {
  const response = await axiosInstance.post<
    ApiResponse<FavoriteStoreResponse>
  >("stores/favorites", data);
  if (response.data.isSuccess) {
    invalidateStoresCache();
  }
  return response.data;
};

// 즐겨찾기 매장 삭제
export const deleteFavoriteStore = async (
  storeId: number,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.delete<ApiResponse<string>>(
    `stores/favorites/${storeId}`,
  );
  if (response.data.isSuccess) {
    invalidateStoresCache();
  }
  return response.data;
};
