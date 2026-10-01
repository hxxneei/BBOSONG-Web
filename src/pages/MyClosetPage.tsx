import { useCallback, useEffect, useMemo, useState } from "react";
import { HeartCrack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getFavoriteClothes,
  toggleClothesFavorite,
  type ClothesListItem,
} from "../api/clothes";
import SearchBar from "../common/SearchBar";
import ClothGrid, {
  type ClothGridItem,
} from "../components/CategoryPage/ClothGrid";
import Header from "../components/CategoryPage/Header";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

export default function MyClosetPage() {
  const navigate = useNavigate();
  const { showConfirm } = useFeedbackModal();
  const [clothes, setFavorites] = useState<ClothesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchFavoriteClothes = async () => {
      try {
        const res = await getFavoriteClothes();
        if (res.isSuccess) {
          setFavorites(res.result);
        }
      } catch (error) {
        console.error("즐겨찾기 옷 목록을 가져오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFavoriteClothes();
  }, []);

  const handleHeartToggle = useCallback(async (clothesId: number) => {
    const shouldRemove = await showConfirm("즐겨찾기를 해제하시겠습니까?");
    if (!shouldRemove) return;

    try {
      const res = await toggleClothesFavorite(clothesId, false);
      if (res.isSuccess) {
        setFavorites((currentClothes) =>
          currentClothes.filter((item) => item.clothesId !== clothesId),
        );
      }
    } catch (error) {
      console.error("하트 해제 처리 중 오류가 발생했습니다.", error);
    }
  }, [showConfirm]);

  const clothesGridItems = useMemo<ClothGridItem[]>(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return clothes
      .filter((item) =>
        item.name.toLowerCase().includes(normalizedKeyword),
      )
      .map((item) => ({
        id: item.clothesId,
        category: item.categoryName,
        name: item.name,
        color: item.color || "색상 정보 없음",
        imageUrl: item.imageUrl,
        isFavorite: true,
        onToggleFavorite: () => void handleHeartToggle(item.clothesId),
      }));
  }, [clothes, handleHeartToggle, searchKeyword]);

  const handleClothClick = useCallback((clothesId: number) => {
    navigate(`/my-closet/${clothesId}`);
  }, [navigate]);

  if (isLoading) {
    return <CenterMessage>즐겨찾기한 옷들을 불러오는 중입니다... 🧺</CenterMessage>;
  }

  return (
    <PageWrapper>
      <Header title="저장한 옷" onBack={() => navigate(-1)} />
      <SearchBar
        value={searchKeyword}
        onChange={setSearchKeyword}
        placeholder="검색어를 입력하세요"
      />

      <ContentZone>
        <ClothGrid
          items={clothesGridItems}
          onItemClick={handleClothClick}
          emptyState={
            <NoDataWrapper>
              <HeartCrack size={64} color="#BFC5D2" />
              <NoDataText>
                즐겨찾기한 옷이 없거나 검색 결과가 없습니다.
                <br />
                옷장에서 마음에 드는 옷에 하트를 눌러보세요!
              </NoDataText>
            </NoDataWrapper>
          }
        />
      </ContentZone>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;
  background: #ffffff;
  position: relative;
`;

const ContentZone = styled.div`
  padding-bottom: calc(
    var(--bottom-nav-height) + 24px + env(safe-area-inset-bottom, 0px)
  );
`;

const CenterMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 430px;
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  padding-bottom: calc(
    var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px)
  );
  color: #64748b;
  font-size: 15px;
`;

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 120px 20px 0;
`;

const NoDataText = styled.p`
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
`;
