import styled from "styled-components";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClothDetailView, {
  type ClothItem,
} from "../components/CategoryPage/ClothDetailView";
import {
  getClothesDetail,
  deleteClothes,
  toggleClothesFavorite,
} from "../api/clothes";
import DeleteModal from "./DeleteModal";
import ConfirmModal from "../components/Modal/ConfirmModal";

export default function ClosetDetailPage() {
  //const location = useLocation();
  const navigate = useNavigate();
  // const clothesId = location.state?.clothesId;

  const { id } = useParams<{ id: string }>();
  const clothesId = id ? parseInt(id, 10) : null;

  const [clothItem, setClothItem] = useState<ClothItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState<boolean>(false);

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    open: boolean;
    title: string;
    onConfirm: () => void;
    onCancel?: () => void;
    cancelText?: string;
  }>({
    open: false,
    title: "",
    onConfirm: () => {},
    cancelText: "취소",
  });

  useEffect(() => {
    if (!clothesId || isNaN(clothesId)) {
      alert("올바르지 않은 접근입니다.");
      navigate(-1);
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
            image:
              item.imageUrl ||
              "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
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
  }, [clothesId, navigate]);

  const closeConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, open: false }));
  };

  const handleToggleFavoriteAPI = () => {
    if (!clothItem || !clothesId) return;

    const nextFavoriteState = !clothItem.isFavorite;

    if (clothItem.isFavorite) {
      setConfirmModalConfig({
        open: true,
        title: "즐겨찾기를 해제하시겠습니까?",
        cancelText: "취소",
        onCancel: closeConfirmModal,
        onConfirm: async () => {
          closeConfirmModal();
          await executeToggleAPI(nextFavoriteState, "해제");
        },
      });
    } else {
      executeToggleAPI(nextFavoriteState, "추가");
    }
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

        setConfirmModalConfig({
          open: true,
          title:
            mode === "추가"
              ? "즐겨찾기에 추가되었습니다! "
              : "즐겨찾기가 취소되었습니다. ",
          cancelText: "",
          onConfirm: closeConfirmModal,
        });
      } else {
        alert("즐겨찾기 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("즐겨찾기 통신 중 오류 발생:", error);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isDeletedSuccess) {
      navigate(-1);
    }
  };

  const handleRealDeleteAPI = async (): Promise<boolean> => {
    if (!clothesId) return false;
    try {
      const res = await deleteClothes(clothesId);
      if (res.isSuccess) {
        setIsDeletedSuccess(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("진짜 삭제 실패:", error);
      alert("삭제 중 서버 에러가 발생했습니다.");
      return false;
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
        rightIcon="mdi:trash-can-outline"
        onRightIconClick={handleOpenDeleteModal}
        onToggleFavorite={handleToggleFavoriteAPI}
      />

      {isModalOpen && (
        <DeleteModal
          onClose={handleCloseModal}
          onConfirm={handleRealDeleteAPI}
        />
      )}
      <ConfirmModal
        open={confirmModalConfig.open}
        title={confirmModalConfig.title}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={confirmModalConfig.onCancel}
        cancelText={confirmModalConfig.cancelText}
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
