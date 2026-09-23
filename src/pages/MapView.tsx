import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import MapBottomSheet from "../common/MapBottomSheet";
import type { KakaoPlace } from "../common/MapBottomSheet";

import {
  getFavoriteStores,
  addFavoriteStore,
  deleteFavoriteStore,
  type FavoriteStoreResponse,
} from "../api/stores";

import LaundryMarker from "../assets/markers/LaundryMarker.webp";
import MyLocationMarker from "../assets/markers/MyLocationMarker.svg";
import { useFeedbackModal } from "../hooks/useFeedbackModal";

declare global {
  interface Window {
    kakao: KakaoSdk;
  }
}

interface KakaoPlaceSearchResult {
  id: string;
  place_name: string;
  road_address_name?: string;
  address_name: string;
  phone: string;
  place_url: string;
  x: string;
  y: string;
}

interface KakaoMapInstance {
  setCenter: (position: unknown) => void;
  panTo: (position: unknown) => void;
  getCenter: () => KakaoLatLng;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMarkerInstance {
  setMap: (map: KakaoMapInstance | null) => void;
}

interface KakaoPlacesService {
  keywordSearch: (
    keyword: string,
    callback: (data: KakaoPlaceSearchResult[], status: string) => void,
    options?: Record<string, unknown>,
  ) => void;
}

interface KakaoSdk {
  maps: {
    load: (callback: () => void) => void;
    LatLng: new (
      latitude: number | string,
      longitude: number | string,
    ) => KakaoLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: unknown; level: number },
    ) => KakaoMapInstance;
    Size: new (width: number, height: number) => unknown;
    Point: new (x: number, y: number) => unknown;
    MarkerImage: new (
      imageSrc: string,
      imageSize: unknown,
      imageOption?: Record<string, unknown>,
    ) => unknown;
    Marker: new (options: {
      map: KakaoMapInstance;
      position: unknown;
      image?: unknown;
    }) => KakaoMarkerInstance;
    services: {
      Places: new () => KakaoPlacesService;
      Status: {
        OK: string;
      };
    };
    event: {
      addListener: (
        target: unknown,
        eventName: string,
        handler: () => void,
      ) => void;
    };
  };
}

const KAKAO_APP_KEY = (import.meta.env.VITE_KAKAO_APP_KEY ||
  import.meta.env.VITE_KAKAO_MAP_API_KEY) as string | undefined;
const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;
const LAUNDRY_SEARCH_KEYWORDS = ["세탁소", "코인세탁", "빨래방"] as const;
const GEOLOCATION_OPTIONS: PositionOptions = {
  timeout: 5000,
  maximumAge: 600000,
  enableHighAccuracy: false,
};

export default function MapView() {
  const { showAlert } = useFeedbackModal();
  const [selectedPlace, setSelectedPlace] = useState<
    | (KakaoPlace & {
        x?: string;
        y?: string;
        storeId?: number;
        isFavorite?: boolean;
      })
    | null
  >(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const researchCurrentAreaRef = useRef<(() => void) | null>(null);

  // 유저가 저장해둔 즐겨찾기 매장 목록 상태창
  const [myFavorites, setMyFavorites] = useState<FavoriteStoreResponse[]>([]);
  const favoritesRef = useRef<FavoriteStoreResponse[]>([]);

  useEffect(() => {
    favoritesRef.current = myFavorites;
  }, [myFavorites]);

  // 1. 처음 켜질 때 서버에서 내 즐겨찾기 목록 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavoriteStores();
        if (res.isSuccess) {
          setMyFavorites(res.result);
        }
      } catch (err) {
        console.error("즐겨찾기 매장 목록을 가져오지 못했습니다. ", err);
        void showAlert("즐겨찾기 목록을\n불러오지 못했습니다. ");
      }
    };
    fetchFavorites();
  }, [showAlert]);

  useEffect(() => {
    let isMounted = true;
    let script: HTMLScriptElement | null = null;
    let usesLoadEventListener = false;
    let currentLocationMarker: KakaoMarkerInstance | null = null;
    let laundryMarkers: KakaoMarkerInstance[] = [];
    let latestSearchRequestId = 0;

    const handleScriptLoad = () => {
      if (!isMounted) return;
      window.kakao.maps.load(initMap);
    };

    if (!KAKAO_APP_KEY) {
      console.error("Kakao map app key is missing.");
      return () => {
        isMounted = false;
      };
    }

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
    } else {
      script = document.querySelector(
        'script[data-kakao-sdk="true"]',
      ) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement("script");
        script.dataset.kakaoSdk = "true";
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
        script.onload = handleScriptLoad;
        script.onerror = (event) => {
          if (isMounted) {
            console.error("카카오 SDK 로드 실패", event);
          }
        };
        document.head.appendChild(script);
      } else {
        usesLoadEventListener = true;
        script.addEventListener("load", handleScriptLoad);
      }
    }

    function initMap() {
      if (!isMounted) return;

      const { kakao } = window;
      const container = document.getElementById("map");
      if (!container) return;

      const defaultLocation = new kakao.maps.LatLng(SEOUL_LAT, SEOUL_LON);
      const map = new kakao.maps.Map(container, {
        center: defaultLocation,
        level: 4,
      });

      const clearLaundryMarkers = () => {
        laundryMarkers.forEach((marker) => marker.setMap(null));
        laundryMarkers = [];
      };

      const searchNearbyLaundries = async (
        latitude: number,
        longitude: number,
        showCurrentLocation: boolean,
        moveToLocation = true,
      ) => {
        if (!isMounted) return;

        const searchRequestId = ++latestSearchRequestId;
        const location = new kakao.maps.LatLng(latitude, longitude);
        if (moveToLocation) {
          map.setCenter(location);
        }
        setIsMapReady(true);
        setIsSearching(true);

        if (showCurrentLocation) {
          const markerImage = new kakao.maps.MarkerImage(
            MyLocationMarker,
            new kakao.maps.Size(57, 73),
            { offset: new kakao.maps.Point(24, 48) },
          );

          currentLocationMarker?.setMap(null);
          currentLocationMarker = new kakao.maps.Marker({
            map,
            position: location,
            image: markerImage,
          });
        }

        const places = new kakao.maps.services.Places();

        const searchResults = await Promise.all(
          LAUNDRY_SEARCH_KEYWORDS.map(
            (keyword) =>
              new Promise<KakaoPlaceSearchResult[]>((resolve) => {
                places.keywordSearch(
                  keyword,
                  (data, status) => {
                    resolve(
                      status === kakao.maps.services.Status.OK ? data : [],
                    );
                  },
                  { location, radius: 2000 },
                );
              }),
          ),
        );

        if (!isMounted || searchRequestId !== latestSearchRequestId) return;

        const uniquePlaces = new Map<string, KakaoPlaceSearchResult>();
        searchResults.flat().forEach((place) => {
          uniquePlaces.set(place.id, place);
        });

        clearLaundryMarkers();

        const laundryMarkerImage = new kakao.maps.MarkerImage(
          LaundryMarker,
          new kakao.maps.Size(57, 73),
          { offset: new kakao.maps.Point(23, 46) },
        );

        laundryMarkers = Array.from(uniquePlaces.values()).map((place) => {
          const position = new kakao.maps.LatLng(place.y, place.x);
          const marker = new kakao.maps.Marker({
            map,
            position,
            image: laundryMarkerImage,
          });

          kakao.maps.event.addListener(marker, "click", () => {
            if (!isMounted) return;

            const matchedFavorite = favoritesRef.current.find(
              (favorite) => favorite.kakaoPlaceId === place.id,
            );

            setSelectedPlace({
              id: place.id,
              place_name: place.place_name,
              road_address_name: place.road_address_name || place.address_name,
              address_name: place.address_name,
              phone: place.phone,
              place_url: place.place_url,
              x: place.x,
              y: place.y,
              storeId: matchedFavorite?.storeId,
              isFavorite: Boolean(matchedFavorite),
            });

            setIsSheetOpen(true);
            map.panTo(position);
          });

          return marker;
        });

        setIsSearching(false);
      };

      researchCurrentAreaRef.current = () => {
        const center = map.getCenter();
        void searchNearbyLaundries(
          center.getLat(),
          center.getLng(),
          false,
          false,
        );
      };

      const searchDefaultLocation = () => {
        void searchNearbyLaundries(SEOUL_LAT, SEOUL_LON, false);
      };

      if (!navigator.geolocation) {
        void searchDefaultLocation();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          void searchNearbyLaundries(
            position.coords.latitude,
            position.coords.longitude,
            true,
          );
        },
        (error) => {
          console.error("위치 정보 획득 실패", error);
          void searchDefaultLocation();
        },
        GEOLOCATION_OPTIONS,
      );
    }

    return () => {
      isMounted = false;
      latestSearchRequestId += 1;
      researchCurrentAreaRef.current = null;
      laundryMarkers.forEach((marker) => marker.setMap(null));
      laundryMarkers = [];
      currentLocationMarker?.setMap(null);

      if (script && usesLoadEventListener) {
        script.removeEventListener("load", handleScriptLoad);
      } else if (script?.onload === handleScriptLoad) {
        script.onload = null;
      }
    };
  }, []);

  const handleResearchCurrentArea = () => {
    setIsSheetOpen(false);
    setSelectedPlace(null);
    researchCurrentAreaRef.current?.();
  };

  // 북마크 토글 이벤트 핸들러
  const handleToggleFavorite = async () => {
    if (!selectedPlace) return;

    try {
      if (selectedPlace.isFavorite && selectedPlace.storeId) {
        // 북마크 해제 -> 삭제 API 호출
        const res = await deleteFavoriteStore(selectedPlace.storeId);
        if (res.isSuccess) {
          setMyFavorites((prev) =>
            prev.filter((fav) => fav.storeId !== selectedPlace.storeId),
          );
          setSelectedPlace((prev) =>
            prev ? { ...prev, isFavorite: false, storeId: undefined } : null,
          );
          void showAlert("즐겨찾기가 해제되었습니다. ");
        }
      } else {
        // 북마크 등록 -> 저장 API 호출
        const res = await addFavoriteStore({
          kakaoPlaceId: selectedPlace.id,
          name: selectedPlace.place_name,
          address: selectedPlace.road_address_name,
          phone: selectedPlace.phone || "",
          latitude: Number(selectedPlace.y || 0),
          longitude: Number(selectedPlace.x || 0),
          placeUrl: selectedPlace.place_url,
        });

        if (res.isSuccess) {
          setMyFavorites((prev) => [...prev, res.result]);
          setSelectedPlace((prev) =>
            prev
              ? { ...prev, isFavorite: true, storeId: res.result.storeId }
              : null,
          );
          void showAlert("즐겨찾기 매장으로\n등록되었습니다! ");
        }
      }
    } catch (err) {
      console.error("즐겨찾기 처리 중 오류 발생 :", err);
    }
  };

  return (
    <MapPage>
      <MapContainer id="map" />
      {isMapReady && (
        <ResearchButton
          type="button"
          onClick={handleResearchCurrentArea}
          disabled={isSearching}
        >
          {isSearching ? "검색 중..." : "이 지역 재검색"}
        </ResearchButton>
      )}
      <MapBottomSheet
        isOpen={isSheetOpen && !!selectedPlace}
        place={selectedPlace}
        onClose={() => setIsSheetOpen(false)}
        isFavorite={selectedPlace?.isFavorite || false}
        onToggleFavorite={handleToggleFavorite}
      />
    </MapPage>
  );
}

const MapPage = styled.main`
  position: relative;
  width: 100%;
`;

const MapContainer = styled.div`
  width: 100%;
  height: calc(
    100vh - var(--bottom-nav-height) - env(safe-area-inset-bottom, 0px)
  );
  height: calc(
    100dvh - var(--bottom-nav-height) - env(safe-area-inset-bottom, 0px)
  );
  background: #eee;
`;

const ResearchButton = styled.button`
  position: absolute;
  top: 16px;
  left: 50%;
  z-index: 20;
  transform: translateX(-50%);
  min-width: 132px;
  height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #4b80fc;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
  cursor: pointer;

  &:disabled {
    color: #94a3b8;
    cursor: wait;
  }
`;
