import axiosInstance from "./axiosInstance";

export interface WeatherLaundryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
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
  };
}

export const getWeatherLaundry = async (
  latitude: number,
  longitude: number,
) => {
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
