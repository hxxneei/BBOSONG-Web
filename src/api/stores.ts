import axiosInstance from "./axiosInstance";

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

interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

let favoriteStoresCache:
  | {
      expiresAt: number;
      data: BaseResponse<FavoriteStoreResponse[]>;
    }
  | null = null;

export const invalidateStoresCache = () => {
  favoriteStoresCache = null;
};

// 즐겨찾기 매장 목록 조회
export const getFavoriteStores = async (): Promise<
  BaseResponse<FavoriteStoreResponse[]>
> => {
  if (favoriteStoresCache && favoriteStoresCache.expiresAt > Date.now()) {
    return favoriteStoresCache.data;
  }

  const response = await axiosInstance.get("stores/favorites"); // 중복 api 제거 규칙 반영!
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
): Promise<BaseResponse<FavoriteStoreResponse>> => {
  const response = await axiosInstance.post("stores/favorites", data);
  if (response.data.isSuccess) {
    invalidateStoresCache();
  }
  return response.data;
};

// 즐겨찾기 매장 삭제
export const deleteFavoriteStore = async (
  storeId: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosInstance.delete(`stores/favorites/${storeId}`);
  if (response.data.isSuccess) {
    invalidateStoresCache();
  }
  return response.data;
};
