import styled from "styled-components";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClothDetailView, {
  type ClothItem,
} from "../components/CategoryPage/ClothDetailView";
import {
  getClothesDetail,
  deleteClothes,
  toggleClothesFavorite,
} from "../api/clothes";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import { getClothesImageUrl } from "../utils/clothesImage";

export default function ClosetDetailPage() {
  //const location = useLocation();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useFeedbackModal();
  // const clothesId = location.state?.clothesId;

  const { id } = useParams<{ id: string }>();
  const clothesId = id ? parseInt(id, 10) : null;

  const [clothItem, setClothItem] = useState<ClothItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasHandledInvalidIdRef = useRef(false);

  useEffect(() => {
    if (!clothesId || isNaN(clothesId)) {
      if (hasHandledInvalidIdRef.current) return;

      hasHandledInvalidIdRef.current = true;
      void showAlert("올바르지 않은 접근입니다.").then(() => navigate(-1));
      return;
    }

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getClothesDetail(clothesId);

        if (res.isSuccess) {
          const item = res.result;

          const washArray = item.washingMethod
            ? item.washingMethod
                .split(/[.,]/)
                .map((s: string) => s.trim())
                .filter(Boolean)
            : ["세탁 정보 없음"];

          const cautionArray = item.caution
            ? item.caution
                .split(/[.,]/)
                .map((s: string) => s.trim())
                .filter(Boolean)
            : ["주의사항 정보 없음"];

          const formattedItem: ClothItem = {
            id: item.clothesId,
            category: item.categoryName,
            brand: "BBOSONG",
            name: item.name,
            image: getClothesImageUrl(item.imageUrl),
            material: item.material || "정보 없음",
            color: item.color || "정보 없음",
            wash: washArray,
            caution: cautionArray,
            tags: [`#${item.categoryName}`, "#의류", `#${item.color || "옷"}`],

            isFavorite: item.isFavorite || false,
          };

          setClothItem(formattedItem);
        }
      } catch (error) {
        console.error("의류 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [clothesId, navigate, showAlert]);

  const handleToggleFavoriteAPI = async () => {
    if (!clothItem || !clothesId) return;

    const nextFavoriteState = !clothItem.isFavorite;

    if (clothItem.isFavorite) {
      const shouldRemove = await showConfirm("즐겨찾기를 해제하시겠습니까?");
      if (!shouldRemove) return;
    }

    await executeToggleAPI(
      nextFavoriteState,
      clothItem.isFavorite ? "해제" : "추가",
    );
  };

  const executeToggleAPI = async (
    nextState: boolean,
    mode: "추가" | "해제",
  ) => {
    if (!clothesId) return;
    try {
      const res = await toggleClothesFavorite(clothesId, nextState);
      if (res.isSuccess) {
        setClothItem((prev) =>
          prev ? { ...prev, isFavorite: nextState } : null,
        );

        await showAlert(
          mode === "추가"
            ? "즐겨찾기에 추가되었습니다!"
            : "즐겨찾기가 취소되었습니다.",
        );
      } else {
        await showAlert("즐겨찾기 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("즐겨찾기 통신 중 오류 발생:", error);
      await showAlert("즐겨찾기 상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!clothesId || isDeleting) return;

    const shouldDelete = await showConfirm("정말 삭제하시겠습니까?");
    if (!shouldDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteClothes(clothesId);
      if (res.isSuccess) {
        await showAlert("삭제가 완료되었습니다.");
        navigate(-1);
        return;
      }

      await showAlert(res.message || "삭제에 실패했습니다.");
    } catch (error) {
      console.error("진짜 삭제 실패:", error);
      await showAlert("삭제 중 서버 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>로딩 중...</div>
    );
  if (!clothItem)
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>데이터 없음</div>
    );

  return (
    <ViewWrapper>
      <ClothDetailView
        title="상세 보기"
        item={clothItem}
        onRightIconClick={() => void handleDelete()}
        onToggleFavorite={handleToggleFavoriteAPI}
      />
    </ViewWrapper>
  );
}
const ViewWrapper = styled.div`
  max-width: 430px;

  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;
