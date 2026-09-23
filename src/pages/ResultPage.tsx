import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TopBar from "../components/Result/TopBar";
import ResultCard from "../components/Result/ResultCard";
import type { ResultData } from "../components/Result/ResultCard";
import { useLocation, useNavigate } from "react-router-dom";
import type { ClothesAnalysisResult } from "../types/clothes";
import ResultButtonGroup from "../components/Result/ResultBtnGroup";
import { postSaveClothes } from "../api/clothes";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

interface ResultPageLocationState {
  serverData?: ClothesAnalysisResult;
  imageUrl?: string;
  imageFile?: File;
}

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

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useFeedbackModal();
  const { serverData, imageUrl, imageFile } =
    (location.state as ResultPageLocationState | null) || {};
  const hasValidResult = Boolean(
    serverData && imageUrl && imageFile instanceof File,
  );
  const displayData =
    serverData && imageUrl ? transformServerData(serverData, imageUrl) : null;
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!hasValidResult) {
      navigate("/fabric-scanner", { replace: true });
    }
  }, [hasValidResult, navigate]);

  useEffect(() => {
    return () => {
      if (typeof imageUrl === "string" && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (!hasValidResult || !serverData || !imageFile || !displayData) {
    return null;
  }

  const handleBack = () => window.history.back();

  const handleRetryClick = () => {
    if (isSavingRef.current) return;
    navigate("/fabric-scanner", { replace: true });
  };

  const handleSaveClick = async () => {
    if (isSavingRef.current) return;

    isSavingRef.current = true;
    setIsSaving(true);
    let saveSucceeded = false;

    try {
      const clothData = {
        categoryName: serverData.categoryName.trim(),
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

      formData.append("image", imageFile);

      const res = await postSaveClothes(formData);

      if (res.isSuccess) {
        saveSucceeded = true;
        await showAlert("내 옷장에 저장되었습니다! 🧺");
        navigate("/closetpage", { replace: true });
        return;
      }

      void showAlert(
        res.message || "저장 처리에 실패했습니다.\n다시 시도해 주세요.",
      );
    } catch (err) {
      console.error("의류 저장 통신 중 프론트엔드 예외 발생:", err);
      void showAlert("저장 처리에 실패했습니다.\n다시 시도해 주세요.");
    } finally {
      if (!saveSucceeded) {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    }
  };

  return (
    <Shell>
      <Phone>
        <TopBar
          title="분석 결과"
          onBack={handleBack}
          showBookmark={false}
        />

        <ContentArea>
          <ResultCard data={displayData} />
        </ContentArea>

        <Bottom>
          <ResultButtonGroup
            onRetry={handleRetryClick}
            onSave={handleSaveClick}
            isSaving={isSaving}
          />
        </Bottom>
      </Phone>
    </Shell>
  );
}

const Shell = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
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
