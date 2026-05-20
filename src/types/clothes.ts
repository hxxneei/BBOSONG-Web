export interface ClothesAnalysisResult {
  categoryName: string; // 종류
  name: string;
  material: string; // 소재
  color: string; // 색상
  washingMethod: string; // 세탁 방법
  caution: string; // 주의사항
  recommendedSymbols?: string[]; // 권장심볼
}
