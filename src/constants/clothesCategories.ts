export const CLOTHING_CATEGORIES = [
  "상의",
  "아우터",
  "하의",
  "원피스/세트",
  "이너웨어",
  "트레이닝",
] as const;

export const ACCESSORY_CATEGORIES = [
  "모자",
  "스카프/머플러",
  "양말",
  "장갑",
  "가방",
  "침구류",
] as const;

export const CLOTHES_CATEGORIES = [
  ...CLOTHING_CATEGORIES,
  ...ACCESSORY_CATEGORIES,
] as const;

export type ClothesCategory = (typeof CLOTHES_CATEGORIES)[number];

export const isClothesCategory = (
  category: string | undefined,
): category is ClothesCategory =>
  CLOTHES_CATEGORIES.some((validCategory) => validCategory === category);
