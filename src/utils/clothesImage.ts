import type { SyntheticEvent } from "react";
import clothesPlaceholder from "../assets/ClothesPlaceholder.svg";

export const getClothesImageUrl = (imageUrl?: string | null) => {
  const normalizedUrl = imageUrl?.replace(/^"|"$/g, "").trim();

  if (!normalizedUrl || normalizedUrl.includes("example.com")) {
    return clothesPlaceholder;
  }

  return normalizedUrl;
};

export const handleClothesImageError = (
  event: SyntheticEvent<HTMLImageElement>,
) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = clothesPlaceholder;
};
