import { useState } from "react";
import styled from "styled-components";
import TopBar from "../components/Result/TopBar";
import ResultCard from "../components/Result/ResultCard";
import type { ResultData } from "../components/Result/ResultCard";
import { useLocation } from "react-router-dom";
import type { ClothesAnalysisResult } from "../types/clothes";

import ResultDummy from "../assets/ResultDummy.png";

const transformServerData = (
  serverData: ClothesAnalysisResult,
  imageUrl: string,
): ResultData => {
  return {
    categoryPath: `의류 / ${serverData.categoryName}`,
    name: serverData.name || "분석된 의류",
    image: imageUrl, // 분석에 사용했던 이미지 주소
    material: serverData.material,
    color: serverData.color,
    wash: {
      title: "세탁 방법",
      items: serverData.washingMethod
        .split(".")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim() + "."),
    },
    caution: {
      title: "주의사항",
      items: serverData.caution
        .split(".")
        .filter((item) => item.trim() !== "")
        .map((item) => item.trim() + "."),
    },
  };
};

const mock: ResultData = {
  categoryPath: "의류 / 니트",
  name: "폴로 코튼 케이블 니트",
  image: ResultDummy,
  material: "피마코튼",
  color: "검정색",
  wash: {
    title: "세탁 방법",
    items: [
      "드라이클리닝 권장",
      "약 30도 / 중성세제로 세탁기 사용가능",
      "산소표백제로 표백",
      "140~160도 다림질 가능",
    ],
  },
  caution: { title: "주의사항", items: ["건조기 사용 금지", "뒤집어 세탁"] },
};

type Props = {
  data?: ResultData;
  bookmarked?: boolean; // 초기 북마크 상태 (선택)
  onBack?: () => void; // 외부에서 뒤로가기 주입 시
  onToggleBookmark?: () => void; // 외부에서 토글 주입 시
  onRescan?: () => void;
  onSave?: (data: ResultData) => void;

  title?: string; // 기본 "분석 결과"
  rightIcon?: string; // 예: "mdi:trash-can-outline"
  onRightIconClick?: () => void; // 우측 아이콘 클릭
  tags?: string[]; // 해시태그 (없으면 표시 안함)
  showButtons?: boolean; // 하단 버튼 노출 (기본 true)
  showBookmark?: boolean;
};

export default function ResultPage({
  bookmarked = false,
  onBack,
  onToggleBookmark,
  onRescan,
  onSave,
  tags,
  showButtons = true,
  showBookmark = true,
}: Props) {
  const loction = useLocation();
  const { serverData, imageUrl } = loction.state || {};

  const displayData = serverData
    ? transformServerData(serverData, imageUrl)
    : mock; // 데이터 없으면 mock 띄움

  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);
  const handleBack = onBack ?? (() => window.history.back());
  const handleToggleBookmark =
    onToggleBookmark ?? (() => setIsBookmarked((prev) => !prev));
  return (
    <Shell>
      <Phone>
        <TopBar
          title="분석 결과"
          bookmarked={isBookmarked}
          onBack={handleBack}
          onToggleBookmark={handleToggleBookmark}
          showBookmark={showBookmark}
        />

        <ResultCard data={displayData} tags={tags} />

        {showButtons && (
          <Bottom>
            <BtnRow>
              <GhostBtn onClick={onRescan}>다시 검색하기</GhostBtn>
              <PrimaryBtn onClick={() => onSave?.(displayData)}>
                결과 저장하기
              </PrimaryBtn>
            </BtnRow>
          </Bottom>
        )}
      </Phone>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: start center;
  background: #ffffff;
  color: #111827;
  padding: 24px 16px 0px;
`;
const Phone = styled.main``;

const Bottom = styled.footer`
  position: sticky;

  background: linear-gradient(to top, #ffffff 70%, rgba(255, 255, 255, 0));
  padding: 36px 0 0;
`;
const BtnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;
const GhostBtn = styled.button`
  height: 61px;
  width: 157px;
  border-radius: 16px;

  background: #efefef;
  color: #aeaeae;
  font-weight: 500;
  font-size: 18px;
  box-shadow: 0 4px 8px rgba(100, 100, 100, 0.09);
`;
const PrimaryBtn = styled.button`
  height: 61px;
  border-radius: 16px;
  border: 0;
  background: #4b80fc;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(75, 128, 252, 0.71);
  width: 157px;
  font-size: 18px;
`;
