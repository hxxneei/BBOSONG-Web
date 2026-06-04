import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/auth";
import type { ClothesAnalysisResult } from "../types/clothes";

const CLOTHES_CACHE_TTL_MS = 2 * 60 * 1000;

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const clothesCache = new Map<string, CacheEntry<unknown>>();

const getCachedData = <T>(key: string) => {
  const cached = clothesCache.get(key) as CacheEntry<T> | undefined;

  if (!cached || cached.expiresAt <= Date.now()) {
    clothesCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedData = <T>(key: string, data: T) => {
  clothesCache.set(key, {
    data,
    expiresAt: Date.now() + CLOTHES_CACHE_TTL_MS,
  });
};

export const invalidateClothesCache = () => {
  clothesCache.clear();
};

export type ClothesAnalysisStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED";

export interface ClothesAnalysisJob {
  jobId: number;
  status: ClothesAnalysisStatus;
}

export interface ClothesAnalysisJobResult extends ClothesAnalysisJob {
  result: ClothesAnalysisResult | null;
  errorMessage: string | null;
}

// 의류 분석
export const postClothesAnalysis = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post<ApiResponse<ClothesAnalysisJob>>(
    "/clothes/analysis",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getClothesAnalysisResult = async (jobId: number) => {
  const response =
    await axiosInstance.get<ApiResponse<ClothesAnalysisJobResult>>(
      `/clothes/analysis/${jobId}`,
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
  if (response.data.isSuccess) {
    invalidateClothesCache();
  }
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
  const cacheKey = `clothes:category:${category}`;
  const cached = getCachedData<GetClosetResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await axiosInstance.get<GetClosetResponse>("/clothes", {
    params: {
      category: category,
    },
  });
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
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
  const cacheKey = `clothes:detail:${clothesId}`;
  const cached = getCachedData<GetClothesDetailResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await axiosInstance.get<GetClothesDetailResponse>(
    `/clothes/${clothesId}`,
  );
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
  return response.data;
};

// 삭제
export const deleteClothes = async (clothesId: number) => {
  const response = await axiosInstance.delete<{
    isSuccess: boolean;
    message: string;
  }>(`/clothes/${clothesId}`);
  if (response.data.isSuccess) {
    invalidateClothesCache();
  }
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
  const cacheKey = "clothes:home-summary";
  const cached = getCachedData<HomeSummaryResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await axiosInstance.get("/clothes/home");
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
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
  const cacheKey = `clothes:list:${category || "all"}`;
  const cached = getCachedData<BaseResponse<ClothesItem[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  const url = category
    ? `clothes?category=${encodeURIComponent(category)}`
    : "clothes";
  const response = await axiosInstance.get(url);
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
  return response.data;
};

export const getFavoriteClothes = async (): Promise<
  BaseResponse<ClothesItem[]>
> => {
  const cacheKey = "clothes:favorites";
  const cached = getCachedData<BaseResponse<ClothesItem[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await axiosInstance.get("clothes/favorites");
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
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
  if (response.data.isSuccess) {
    invalidateClothesCache();
  }
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
