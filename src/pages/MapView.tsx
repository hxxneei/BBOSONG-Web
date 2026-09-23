import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import MapBottomSheet from "../common/MapBottomSheet";
import type { KakaoPlace } from "../common/MapBottomSheet";

import ConfirmModal from "../components/Modal/ConfirmModal";

import {
  getFavoriteStores,
  addFavoriteStore,
  deleteFavoriteStore,
  type FavoriteStoreResponse,
} from "../api/stores";

import LaundryMarker from "../assets/markers/LaundryMarker.webp";
import MyLocationMarker from "../assets/markers/MyLocationMarker.svg";

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
    LatLng: new (latitude: number | string, longitude: number | string) => unknown;
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
    }) => unknown;
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
const GEOLOCATION_OPTIONS: PositionOptions = {
  timeout: 5000,
  maximumAge: 600000,
  enableHighAccuracy: false,
};

export default function MapView() {
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

  // 유저가 저장해둔 즐겨찾기 매장 목록 상태창
  const [myFavorites, setMyFavorites] = useState<FavoriteStoreResponse[]>([]);
  const favoritesRef = useRef<FavoriteStoreResponse[]>([]);

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
        showAlertModal("즐겨찾기 목록을\n불러오지 못했습니다. ");
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    let isMounted = true;
    let script: HTMLScriptElement | null = null;
    let usesLoadEventListener = false;

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

      const searchNearbyLaundries = (
        latitude: number,
        longitude: number,
        showCurrentLocation: boolean,
      ) => {
        if (!isMounted) return;

        const location = new kakao.maps.LatLng(latitude, longitude);
        map.setCenter(location);

        if (showCurrentLocation) {
          const markerImage = new kakao.maps.MarkerImage(
            MyLocationMarker,
            new kakao.maps.Size(57, 73),
            { offset: new kakao.maps.Point(24, 48) },
          );

          new kakao.maps.Marker({
            map,
            position: location,
            image: markerImage,
          });
        }

        const places = new kakao.maps.services.Places();

        places.keywordSearch(
          "세탁소",
          (data: KakaoPlaceSearchResult[], status: string) => {
            if (!isMounted || status !== kakao.maps.services.Status.OK) return;

            const laundryMarkerImage = new kakao.maps.MarkerImage(
              LaundryMarker,
              new kakao.maps.Size(57, 73),
              { offset: new kakao.maps.Point(23, 46) },
            );

            data.forEach((place) => {
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
                  road_address_name:
                    place.road_address_name || place.address_name,
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
            });
          },
          { location, radius: 2000 },
        );
      };

      const searchDefaultLocation = () => {
        searchNearbyLaundries(SEOUL_LAT, SEOUL_LON, false);
      };

      if (!navigator.geolocation) {
        searchDefaultLocation();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          searchNearbyLaundries(
            position.coords.latitude,
            position.coords.longitude,
            true,
          );
        },
        (error) => {
          console.error("위치 정보 획득 실패", error);
          searchDefaultLocation();
        },
        GEOLOCATION_OPTIONS,
      );
    }

    return () => {
      isMounted = false;

      if (script && usesLoadEventListener) {
        script.removeEventListener("load", handleScriptLoad);
      } else if (script?.onload === handleScriptLoad) {
        script.onload = null;
      }
    };
  }, []);

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
          showAlertModal("즐겨찾기가 해제되었습니다. ");
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
          showAlertModal("즐겨찾기 매장으로\n등록되었습니다! ");
        }
      }
    } catch (err) {
      console.error("즐겨찾기 처리 중 오류 발생 :", err);
    }
  };

  return (
    <>
      <MapContainer id="map" />
      <MapBottomSheet
        isOpen={isSheetOpen && !!selectedPlace}
        place={selectedPlace}
        onClose={() => setIsSheetOpen(false)}
        isFavorite={selectedPlace?.isFavorite || false}
        onToggleFavorite={handleToggleFavorite}
      />
      <ConfirmModal
        open={isAlertModalOpen}
        title={alertModalTitle}
        confirmText="확인"
        cancelText=""
        onConfirm={() => setIsAlertModalOpen(false)}
      />
    </>
  );
}

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
