import axiosInstance from "./axiosInstance";

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

// 즐겨찾기 매장 목록 조회
export const getFavoriteStores = async (): Promise<
  BaseResponse<FavoriteStoreResponse[]>
> => {
  const response = await axiosInstance.get("stores/favorites"); // 중복 api 제거 규칙 반영!
  return response.data;
};

//  즐겨찾기 매장 저장
export const addFavoriteStore = async (
  data: FavoriteStoreRequest,
): Promise<BaseResponse<FavoriteStoreResponse>> => {
  const response = await axiosInstance.post("stores/favorites", data);
  return response.data;
};

// 즐겨찾기 매장 삭제
export const deleteFavoriteStore = async (
  storeId: number,
): Promise<BaseResponse<string>> => {
  const response = await axiosInstance.delete(`stores/favorites/${storeId}`);
  return response.data;
};
