import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";
import type { ClothesAnalysisResult } from "../types/clothes";
import { registerSessionResetter } from "../utils/authStorage";

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
  clothesCacheGeneration += 1;
  homeSummaryRequest = null;
};

registerSessionResetter(invalidateClothesCache);

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
export const postClothesAnalysis = async (
  imageFile: File,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post<ApiResponse<ClothesAnalysisJob>>(
    "/clothes/analysis",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal,
    },
  );

  return response.data;
};

export const getClothesAnalysisResult = async (
  jobId: number,
  signal?: AbortSignal,
) => {
  const response =
    await axiosInstance.get<ApiResponse<ClothesAnalysisJobResult>>(
      `/clothes/analysis/${jobId}`,
      { signal },
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

export type SaveClothesResponse = ApiResponse<{
    clothesId: number;
    categoryName: string;
    name: string;
    createdAt: string;
}>;

// closet
export interface ClothesListItem {
  clothesId: number;
  categoryName: string;
  name: string;
  color: string;
  imageUrl: string;
  isFavorite: boolean;
  createdAt: string;
}

export type GetClosetResponse = ApiResponse<ClothesListItem[]>;

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
export type HomeSummaryResponse = ApiResponse<{
  recentClothes: ClothesListItem[];
  favoriteClothes: ClothesListItem[];
}>;

let clothesCacheGeneration = 0;
let homeSummaryRequest: Promise<HomeSummaryResponse> | null = null;

// 홈 옷장 요약 조회
export const getHomeSummary = async (): Promise<HomeSummaryResponse> => {
  const cacheKey = "clothes:home-summary";
  const cached = getCachedData<HomeSummaryResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  if (homeSummaryRequest) {
    return homeSummaryRequest;
  }

  const requestGeneration = clothesCacheGeneration;
  const request = axiosInstance
    .get<HomeSummaryResponse>("/clothes/home")
    .then((response) => {
      if (
        response.data.isSuccess &&
        requestGeneration === clothesCacheGeneration
      ) {
        setCachedData(cacheKey, response.data);
      }
      return response.data;
    });

  homeSummaryRequest = request;

  try {
    return await request;
  } finally {
    if (homeSummaryRequest === request) {
      homeSummaryRequest = null;
    }
  }
};
// 옷장 목록 최신순 조회
export const getClothesList = async (
  category?: string,
): Promise<ApiResponse<ClothesListItem[]>> => {
  const cacheKey = `clothes:list:${category || "all"}`;
  const cached = getCachedData<ApiResponse<ClothesListItem[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  const url = category
    ? `clothes?category=${encodeURIComponent(category)}`
    : "clothes";
  const response = await axiosInstance.get<ApiResponse<ClothesListItem[]>>(
    url,
  );
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
  return response.data;
};

export const getFavoriteClothes = async (): Promise<
  ApiResponse<ClothesListItem[]>
> => {
  const cacheKey = "clothes:favorites";
  const cached = getCachedData<ApiResponse<ClothesListItem[]>>(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await axiosInstance.get<ApiResponse<ClothesListItem[]>>(
    "clothes/favorites",
  );
  if (response.data.isSuccess) {
    setCachedData(cacheKey, response.data);
  }
  return response.data;
};

//  의류 즐겨찾기 북마크 토글
export const toggleClothesFavorite = async (
  clothesId: number,
  isFavorite: boolean,
): Promise<ApiResponse<{ clothesId: number; isFavorite: boolean }>> => {
  const response = await axiosInstance.patch<
    ApiResponse<{ clothesId: number; isFavorite: boolean }>
  >(`clothes/${clothesId}/favorite`, {
    favorite: isFavorite,
  });
  if (response.data.isSuccess) {
    invalidateClothesCache();
  }
  return response.data;
};

export type SearchClothesResponse = ApiResponse<ClothesListItem[]>;

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
