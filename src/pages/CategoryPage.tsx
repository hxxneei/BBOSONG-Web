import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import styled from "styled-components";
import ClothGrid from "../components/CategoryPage/ClothGrid"; // 격자 부품
import Header from "../components/CategoryPage/Header";
import {
  getClothesByCategory,
  toggleClothesFavorite,
  getSearchClothes,
  type ClosetItemData,
} from "../api/clothes";

export default function TopPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentCategory = location.state?.categoryName || "상의";

  const [clothesList, setClothesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const formatClothesData = (data: ClosetItemData[]) => {
    return data.map((item: ClosetItemData) => ({
      id: item.clothesId,
      category: item.categoryName,
      brand: "BBOSONG",
      name: item.name,
      image:
        item.imageUrl ||
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
      isFavorite: item.isFavorite,
    }));
  };

  const fetchClothes = async () => {
    try {
      setIsLoading(true);
      const res = await getClothesByCategory(currentCategory);

      if (res.isSuccess) {
        const formatted = res.result.map((item: ClosetItemData) => ({
          id: item.clothesId,
          category: item.categoryName,
          brand: "BBOSONG",
          name: item.name,
          image:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",

          isFavorite: item.isFavorite,
        }));
        setClothesList(formatted);
      }
    } catch (error) {
      console.error(`${currentCategory} 의류 로딩 실패:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, [currentCategory]);

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      fetchClothes();
      return;
    }

    try {
      setIsLoading(true);
      const res = await getSearchClothes(searchQuery, currentCategory);
      if (res.isSuccess) {
        setClothesList(formatClothesData(res.result));
      }
    } catch (error) {
      console.error("의류 이름 검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavoriteAPI = async (
    clothesId: number,
    currentFavorite: boolean,
  ) => {
    const nextFavoriteState = !currentFavorite; // 뒤집힐 상태값 미리 계산

    try {
      const res = await toggleClothesFavorite(clothesId, nextFavoriteState);

      if (res.isSuccess) {
        setClothesList((prevList) =>
          prevList.map((cloth) =>
            cloth.id === clothesId
              ? { ...cloth, isFavorite: nextFavoriteState }
              : cloth,
          ),
        );
      } else {
        alert("즐겨찾기 변경 실패");
      }
    } catch (error) {
      console.error("목록 즐겨찾기 토글 중 오류 발생:", error);
    }
  };

  const handleClothClick = (clothesId: number) => {
    navigate(`/my-closet/${clothesId}`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/closetpage");
  };

  return (
    <PageWrapper>
      <Header title={currentCategory} onBack={handleBack} />
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={`${currentCategory}에서 검색어를 입력하세요.`}
        onSubmit={handleSearchSubmit}
      />

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          옷장 여는 중...
        </div>
      ) : (
        <ClothGrid
          items={clothesList.map((cloth) => ({
            ...cloth,
            onToggleFavorite: () =>
              handleToggleFavoriteAPI(cloth.id, cloth.isFavorite),
          }))}
          onItemClick={handleClothClick}
        />
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background: white;
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
`;
