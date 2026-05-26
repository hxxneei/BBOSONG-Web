import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import {
  getFavoriteStores,
  deleteFavoriteStore,
  type FavoriteStoreResponse,
} from "../api/stores";

export default function FavoriteStoresPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteStoreResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavoriteStores();
        if (res.isSuccess) {
          setFavorites(res.result);
        }
      } catch (err) {
        console.error("즐겨찾기 매장을 불러오지 못했습니다. 😭", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleDelete = async (storeId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm("즐겨찾는 매장에서 삭제하시겠습니까?")) return;

    try {
      const res = await deleteFavoriteStore(storeId);
      if (res.isSuccess) {
        setFavorites((prev) => prev.filter((item) => item.storeId !== storeId));
      }
    } catch (err) {
      console.error("즐겨찾기 삭제 중 오류 발생 😭", err);
    }
  };

  if (isLoading) {
    return <CenterMessage>매장 목록을 불러오는 중입니다... 🧺</CenterMessage>;
  }

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="mingcute:left-line" width={24} height={24} />
        </BackButton>
        <HeaderTitle>즐겨찾는 매장</HeaderTitle>
        <EmptySpace />
      </Header>

      <ContentZone>
        {favorites.length === 0 ? (
          <NoDataWrapper>
            <Icon icon="mdi:store-marker-outline" width="64" color="#BFC5D2" />
            <NoDataText>
              아직 즐겨찾기한 매장이 없습니다.
              <br />
              지도에서 단골 매장을 등록해 보세요!
            </NoDataText>
          </NoDataWrapper>
        ) : (
          // 즐겨찾기 목록 리스트 구조
          <StoreList>
            {favorites.map((store) => (
              <StoreCard
                key={store.storeId}
                onClick={() => window.open(store.placeUrl, "_blank")}
              >
                <StoreInfo>
                  <StoreName>{store.name}</StoreName>
                  <StoreAddress>{store.address}</StoreAddress>
                  {store.phone && <StorePhone>☎ {store.phone}</StorePhone>}
                </StoreInfo>

                <BookmarkBtn onClick={(e) => handleDelete(store.storeId, e)}>
                  <Icon icon="mdi:bookmark" width="28" />
                </BookmarkBtn>
              </StoreCard>
            ))}
          </StoreList>
        )}
      </ContentZone>
    </PageWrapper>
  );
}

// 🎨 떡볶이님 앱 특유의 뽀송한 UI 스펙 디자인 시스템 CSS
const PageWrapper = styled.div`
  width: 100%;
  max-width: 430px; // 당근/보송이 앱 디자인 컨테이너 국룰 규격
  margin: 0 auto;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
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
  margin: 0;
  color: #1e293b;
`;

const EmptySpace = styled.div`
  width: 24px; // 제목 정중앙 맞춤용 더미 공간
`;

const ContentZone = styled.div`
  flex: 1;
  padding: 20px;
`;

const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const StoreCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  padding-right: 12px;
`;

const StoreName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const StoreAddress = styled.p`
  font-size: 13px;
  color: #4b80fc; // 떡볶이님 시그니처 보송이 블루 칼라 반영
  font-weight: 500;
  margin: 0;
`;

const StorePhone = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const BookmarkBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #4b80fc; // 활성화 상태의 보송이 블루 반영
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding-top: 100px;
`;

const NoDataText = styled.p`
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
  margin: 0;
`;
