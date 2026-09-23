import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ChevronLeft, Heart, HeartCrack, Search } from "lucide-react";
import {
  getFavoriteClothes,
  toggleClothesFavorite,
  type ClothesListItem,
} from "../api/clothes";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import {
  getClothesImageUrl,
  handleClothesImageError,
} from "../utils/clothesImage";

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
      } catch (err) {
        console.error("즐겨찾기 옷 목록을 가져오지 못했습니다. ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoriteClothes();
  }, []);

  const handleHeartToggle = async (id: number) => {
    const shouldRemove = await showConfirm("즐겨찾기를 해제하시겠습니까?");
    if (!shouldRemove) return;

    try {
      const res = await toggleClothesFavorite(id, false);
      if (res.isSuccess) {
        setFavorites((prev) =>
          prev.filter((item) => item.clothesId !== id),
        );
      }
    } catch (err) {
      console.error("하트 해제 처리 중 오류 발생 :", err);
    }
  };

  const filteredClothes = clothes.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  if (isLoading) {
    return (
      <CenterMessage>즐겨찾기한 옷들을 불러오는 중입니다... 🧺</CenterMessage>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <BackButton type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </BackButton>
        <HeaderTitle>저장한 옷</HeaderTitle>
        <EmptySpace />
      </Header>

      <SearchContainer>
        <SearchInputWrapper>
          <SearchInput
            type="text"
            aria-label="저장한 옷 검색"
            placeholder="검색어를 입력하세요."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Search size={20} color="#4B80FC" />
        </SearchInputWrapper>
      </SearchContainer>

      <ContentZone>
        {filteredClothes.length === 0 ? (
          <NoDataWrapper>
            <HeartCrack size={64} color="#BFC5D2" />
            <NoDataText>
              즐겨찾기한 옷이 없거나 검색 결과가 없습니다.
              <br />
              옷장에서 마음에 드는 옷에 하트를 눌러보세요!
            </NoDataText>
          </NoDataWrapper>
        ) : (
          <ClothesGrid>
            {filteredClothes.map((item) => {
              return (
                <ClothesCard key={item.clothesId}>
                  <CardOpenButton
                    type="button"
                    aria-label={`${item.name} 상세 보기`}
                    onClick={() => navigate(`/my-closet/${item.clothesId}`)}
                  />
                  <ImageSection>
                    <ClothesImg
                      src={getClothesImageUrl(item.imageUrl)}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      onError={handleClothesImageError}
                    />

                    <HeartBtn
                      type="button"
                      aria-label={`${item.name} 즐겨찾기 해제`}
                      $active={true}
                      onClick={() => void handleHeartToggle(item.clothesId)}
                    >
                      <Heart size={20} fill="currentColor" />
                    </HeartBtn>
                  </ImageSection>

                  <InfoSection>
                    <CategoryTag>{item.categoryName}</CategoryTag>
                    <BrandName>{item.color || "색상 정보 없음"}</BrandName>
                    <ClothesName>{item.name}</ClothesName>
                  </InfoSection>
                </ClothesCard>
              );
            })}
          </ClothesGrid>
        )}
      </ContentZone>
    </PageWrapper>
  );
}
const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #334155;
  padding: 0;
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

const EmptySpace = styled.div`
  width: 24px;
`;

const SearchContainer = styled.div`
  padding: 0 20px 16px;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 10px 16px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 90%;
  font-size: 16px;
  outline: none;
  color: #334155;
  &::placeholder {
    color: #94a3b8;
  }
`;

const ContentZone = styled.div`
  flex: 1;
  padding: 0 20px
    calc(
      var(--bottom-nav-height) + 24px + env(safe-area-inset-bottom, 0px)
    );
`;

const ClothesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const ClothesCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
`;

const CardOpenButton = styled.button`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  border-radius: 20px;
`;

const ImageSection = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f8fafc;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const ClothesImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const HeartBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${({ $active }) => ($active ? "#4B80FC" : "#BFC5D2")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoSection = styled.div`
  padding: 12px 14px 16px;
  display: flex;
  flex-direction: column;
`;

const CategoryTag = styled.span`
  font-size: 11px;
  color: #4b80fc;
  font-weight: 600;
  margin-bottom: 4px;
`;

const BrandName = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const ClothesName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 2px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CenterMessage = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: calc(
    var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px)
  );
  font-size: 15px;
  color: #64748b;
`;

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 120px;
`;

const NoDataText = styled.p`
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;
