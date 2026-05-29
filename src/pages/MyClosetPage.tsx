import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { toggleClothesFavorite, type ClothesItem } from "../api/clothes";
import axiosInstance from "../api/axiosInstance";
import ConfirmModal from "../components/Modal/ConfirmModal";

export default function MyClosetPage() {
  const navigate = useNavigate();
  const [clothes, setFavorites] = useState<ClothesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    open: boolean;
    title: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    open: false,
    title: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchFavoriteClothes = async () => {
      try {
        const res = await axiosInstance.get("clothes/favorites");
        if (res.data.isSuccess) {
          setFavorites(res.data.result);
        }
      } catch (err) {
        console.error("즐겨찾기 옷 목록을 가져오지 못했습니다. ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoriteClothes();
  }, []);

  const closeConfirmModal = () => {
    setConfirmModalConfig((prev) => ({ ...prev, open: false }));
  };

  const handleHeartToggle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    setConfirmModalConfig({
      open: true,
      title: "즐겨찾기를 해제하시겠습니까?",
      onCancel: closeConfirmModal,
      onConfirm: async () => {
        closeConfirmModal();
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
      },
    });
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
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="mingcute:left-line" width={24} height={24} />
        </BackButton>
        <HeaderTitle>저장한 옷</HeaderTitle>
        <EmptySpace />
      </Header>

      <SearchContainer>
        <SearchInputWrapper>
          <SearchInput
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Icon
            icon="mingcute:search-line"
            width={20}
            height={20}
            color="#4B80FC"
          />
        </SearchInputWrapper>
      </SearchContainer>

      <ContentZone>
        {filteredClothes.length === 0 ? (
          <NoDataWrapper>
            <Icon icon="mdi:heart-broken" width="64" color="#BFC5D2" />
            <NoDataText>
              즐겨찾기한 옷이 없거나 검색 결과가 없습니다.
              <br />
              옷장에서 마음에 드는 옷에 하트를 눌러보세요!
            </NoDataText>
          </NoDataWrapper>
        ) : (
          <ClothesGrid>
            {filteredClothes.map((item) => {
              const cleanImgUrl =
                item.imageUrl && !item.imageUrl.includes("example.com")
                  ? item.imageUrl.trim()
                  : "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500";

              return (
                <ClothesCard
                  key={item.clothesId}
                  onClick={() => navigate(`/my-closet/${item.clothesId}`)}
                >
                  <ImageSection>
                    <ClothesImg
                      src={cleanImgUrl}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // 이미지 로딩 실패 시 더미 이미지 교체
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500";
                      }}
                    />

                    <HeartBtn
                      $active={true}
                      onClick={(e) => handleHeartToggle(item.clothesId, e)}
                    >
                      <Icon icon="mdi:heart" width="20" />
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

      <ConfirmModal
        open={confirmModalConfig.open}
        title={confirmModalConfig.title}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={confirmModalConfig.onCancel}
      />
    </PageWrapper>
  );
}
const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
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
  font-size: 14px;
  outline: none;
  color: #334155;
  &::placeholder {
    color: #94a3b8;
  }
`;

const ContentZone = styled.div`
  flex: 1;
  padding: 0 20px calc(120px + env(safe-area-inset-bottom, 0px));
`;

const ClothesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const ClothesCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  cursor: pointer;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 170px;
  background: #f8fafc;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const ClothesImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const HeartBtn = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
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

const FloatingMenuBtn = styled.button`
  position: fixed;
  bottom: 40px;
  right: calc(50% - 195px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ffffff;
  color: #4b80fc;
  border: none;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 90;
`;

const CenterMessage = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
