import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";

export type WeatherLaundryResponse = ApiResponse<{
    weatherSummary: {
      temperature: number;
      humidity: number;
      rainProbability: number;
      skyStatus: string;
      precipitationType: string;
    };
    recommendations: {
      title: string;
      description: string;
      iconType: string;
    }[];
}>;

export const getWeatherLaundry = async (
  latitude: number,
  longitude: number,
): Promise<WeatherLaundryResponse> => {
  const response = await axiosInstance.get<WeatherLaundryResponse>(
    "/weather/laundry",
    {
      params: {
        latitude,
        longitude,
      },
    },
  );
  return response.data;
};
