import { useState } from "react";
import styled from "styled-components";
import TopBar from "../components/Result/TopBar";
import ResultCard from "../components/Result/ResultCard";
import type { ResultData } from "../components/Result/ResultCard";
import { useLocation, useNavigate } from "react-router-dom";
import type { ClothesAnalysisResult } from "../types/clothes";
import ResultButtonGroup from "../components/Result/ResultBtnGroup";
import { postSaveClothes } from "../api/clothes";

import ConfirmModal from "../components/Modal/ConfirmModal";

import ResultDummy from "../assets/ResultDummy.png";

const transformServerData = (
  serverData: ClothesAnalysisResult,
  imageUrl: string,
): ResultData => {
  return {
    categoryPath: `의류 / ${serverData.categoryName}`,
    name: serverData.name || "분석된 의류",
    image: imageUrl,
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
  bookmarked?: boolean;
  onBack?: () => void;
  onToggleBookmark?: () => void;
  onRescan?: () => void;
  onSave?: (data: ResultData) => void;

  title?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  tags?: string[];
  showButtons?: boolean;
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
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { serverData, imageUrl, imageFile } = (location.state as any) || {};

  const displayData = serverData
    ? transformServerData(serverData, imageUrl)
    : mock;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked);

  // 모달
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");

  const showAlertModal = (message: string) => {
    setAlertModalTitle(message);
    setIsAlertModalOpen(true);

    setTimeout(() => {
      setIsAlertModalOpen(false);
    }, 1200);
  };

  const handleBack = onBack ?? (() => window.history.back());

  const myToggleBookmark = () => {
    setIsBookmarked((prev) => {
      const nextState = !prev;
      if (nextState) {
        showAlertModal("즐겨찾는 옷으로 등록되었습니다! ❤️");
      } else {
        showAlertModal("즐겨찾기가 취소되었습니다. 💔");
      }
      return nextState;
    });
  };

  const handleRetryClick = () => {
    if (onRescan) {
      onRescan();
    } else {
      navigate("/fabric-scanner");
    }
  };

  const handleSaveClick = async () => {
    if (onSave) {
      onSave(displayData);
      return;
    }

    try {
      let finalCategory = "상의"; // 기본값 안전망

      if (serverData?.categoryName) {
        finalCategory = serverData.categoryName.trim();
      } else if (displayData.categoryPath) {
        const parts = displayData.categoryPath.split("/");
        if (parts.length > 1) {
          finalCategory = parts[1].trim();
        }
      }

      const clothData = {
        categoryName: finalCategory,
        name: displayData.name,
        material: displayData.material || "정보 없음",
        color: displayData.color || "정보 없음",
        washingMethod: displayData.wash.items.join(" "),
        caution: displayData.caution.items.join(" "),
      };

      const formData = new FormData();

      formData.append(
        "request",
        new Blob([JSON.stringify(clothData)], { type: "application/json" }),
      );

      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        const response = await fetch(displayData.image);
        const blob = await response.blob();
        const file = new File([blob], "clothes_image.png", {
          type: "image/png",
        });
        formData.append("image", file);
      }

      const res = await postSaveClothes(formData);

      if (res.isSuccess) {
        console.log("저장 완료, 등록 결과:", res.result);
        showAlertModal("내 옷장에 \n저장되었습니다! ");
        setTimeout(() => {
          navigate("/closetpage");
        }, 1100);
      }
    } catch (err) {
      console.error("의류 저장 통신 중 프론트엔드 예외 발생:", err);
      showAlertModal("저장 처리에 실패했습니다.\n다시 시도해 주세요.");
    }
  };

  return (
    <Shell>
      <Phone>
        <TopBar
          title="분석 결과"
          bookmarked={isBookmarked}
          onBack={handleBack}
          onToggleBookmark={myToggleBookmark}
          showBookmark={true}
        />

        <ContentArea>
          <ResultCard data={displayData} tags={tags} />
        </ContentArea>

        {showButtons && (
          <Bottom>
            <ResultButtonGroup
              onRetry={handleRetryClick}
              onSave={handleSaveClick}
            />
          </Bottom>
        )}
      </Phone>
      <ConfirmModal
        open={isAlertModalOpen}
        title={alertModalTitle}
        confirmText="확인"
        cancelText=""
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </Shell>
  );
}

const Shell = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #ffffff;
  color: #111827;
`;

const Phone = styled.main`
  width: 100%;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  padding: 2px 6px 0px;
  box-sizing: border-box;
  position: relative;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Bottom = styled.footer`
  width: 100%;
  flex-shrink: 0;
  background: white;
  padding: 1px 0 30px 0;
  border-top: 1px solid #f3f4f6;
`;
