import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/auth";
import type { ClothesAnalysisResult } from "../types/clothes";

// 의류 분석
export const postClothesAnalysis = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const token =
    localStorage.getItem("authorization") ||
    localStorage.getItem("accessToken");

  console.log("새로 로그인 후 토큰", token);

  const response = await axiosInstance.post<ApiResponse<ClothesAnalysisResult>>(
    "/clothes/analysis",
    formData,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "", // 대문자 버전
        authorization: token ? `Bearer ${token}` : "", // 소문자 버전
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

// 의류 저장
export const postSaveClothes = async (formData: FormData) => {
  const response = await axiosInstance.post<SaveClothesResponse>(
    "/clothes",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export interface SaveClothesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    clothesId: number;
    categoryName: string;
    name: string;
    createdAt: string;
  };
}

// closet
export interface ClosetItemData {
  clothesId: number;
  categoryName: string;
  name: string;
  color: string;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface GetClosetResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ClosetItemData[];
}

export const getClothesByCategory = async (category: string) => {
  const response = await axiosInstance.get<GetClosetResponse>("/clothes", {
    params: {
      category: category,
    },
  });
  return response.data;
};

// 의류 삭제
export interface ClothesDetailData {
  clothesId: number;
  categoryName: string;
  name: string;
  material: string;
  color: string;
  washingMethod: string;
  caution: string;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface GetClothesDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ClothesDetailData;
}

// 상세 조회
export const getClothesDetail = async (clothesId: number) => {
  const response = await axiosInstance.get<GetClothesDetailResponse>(
    `/clothes/${clothesId}`,
  );
  return response.data;
};

// 삭제
export const deleteClothes = async (clothesId: number) => {
  const response = await axiosInstance.delete<{
    isSuccess: boolean;
    message: string;
  }>(`/clothes/${clothesId}`);
  return response.data;
};

// 홈 요약
export interface HomeClothingItem {
  clothesId: number;
  categoryName: string;
  name: string;
  color: string;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface HomeSummaryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    recentClothes: HomeClothingItem[];
    favoriteClothes: HomeClothingItem[];
  };
}

// 홈 옷장 요약 조회
export const getHomeSummary = async (): Promise<HomeSummaryResponse> => {
  const response = await axiosInstance.get("/clothes/home");
  return response.data;
};
export interface ClothesItem {
  clothesId: number;
  categoryName: string;
  name: string;
  color: string;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 옷장 목록 최신순 조회
export const getClothesList = async (
  category?: string,
): Promise<BaseResponse<ClothesItem[]>> => {
  const url = category
    ? `clothes?category=${encodeURIComponent(category)}`
    : "clothes";
  const response = await axiosInstance.get(url);
  return response.data;
};

//  의류 즐겨찾기 북마크 토글
export const toggleClothesFavorite = async (
  clothesId: number,
  isFavorite: boolean,
): Promise<BaseResponse<{ clothesId: number; isFavorite: boolean }>> => {
  const response = await axiosInstance.patch(`clothes/${clothesId}/favorite`, {
    favorite: isFavorite,
  });
  return response.data;
};

export interface SearchClothesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ClosetItemData[];
}

// 의류 검색
export const getSearchClothes = async (
  keyword: string,
  category?: string,
): Promise<SearchClothesResponse> => {
  const response = await axiosInstance.get<SearchClothesResponse>(
    "/clothes/search",
    {
      params: {
        keyword: keyword,
        category: category,
      },
    },
  );
  return response.data;
};
