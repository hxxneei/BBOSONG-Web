import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/auth";
import type { ClothesAnalysisResult } from "../types/clothes";

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
// import axiosInstance from "./axiosInstance";
// import type { ApiResponse } from "../types/auth";
// import type { ClothesAnalysisResult } from "../types/clothes";

// export const postClothesAnalysis = async (imageFile: File) => {
//   const formData = new FormData();

//   formData.append("image", imageFile);

//   const response = await axiosInstance.post<ApiResponse<ClothesAnalysisResult>>(
//     "/clothes/analysis",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data", // 파일 전송을 위한 헤더 설정
//       },
//     },
//   );
//   return response.data;
// };
