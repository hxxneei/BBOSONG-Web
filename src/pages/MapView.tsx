import { useEffect, useRef, useState } from "react";

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

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

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
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    let script = document.querySelector(
      'script[data-kakao-sdk="true"]',
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.dataset.kakaoSdk = "true";
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;

      script.onload = () => {
        window.kakao.maps.load(initMap);
      };

      script.onerror = (e) => {
        console.error("카카오 SDK 로드 실패", e);
      };

      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => {
        window.kakao.maps.load(initMap);
      });
    }

    function initMap() {
      const { kakao } = window;
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      };

      const map = new kakao.maps.Map(container, options);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const loc = new kakao.maps.LatLng(lat, lon);

            map.setCenter(loc);

            const imageSrc = MyLocationMarker;
            const imageSize = new kakao.maps.Size(57, 73);
            const imageOption = { offset: new kakao.maps.Point(24, 48) };
            const markerImage = new kakao.maps.MarkerImage(
              imageSrc,
              imageSize,
              imageOption,
            );

            new kakao.maps.Marker({ map, position: loc, image: markerImage });

            const ps = new kakao.maps.services.Places();

            ps.keywordSearch(
              "세탁소",
              (data: KakaoPlaceSearchResult[], status: string) => {
                if (status === kakao.maps.services.Status.OK) {
                  const laundryImageSize = new kakao.maps.Size(57, 73);
                  const laundryImageOption = {
                    offset: new kakao.maps.Point(23, 46),
                  };
                  const laundryMarkerImage = new kakao.maps.MarkerImage(
                    LaundryMarker,
                    laundryImageSize,
                    laundryImageOption,
                  );

                  data.forEach((place) => {
                    const position = new kakao.maps.LatLng(place.y, place.x);

                    const marker = new kakao.maps.Marker({
                      map,
                      position,
                      image: laundryMarkerImage,
                    });

                    kakao.maps.event.addListener(marker, "click", () => {
                      const matchedFavorite = favoritesRef.current.find(
                        (fav) => fav.kakaoPlaceId === place.id,
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
                        storeId: matchedFavorite
                          ? matchedFavorite.storeId
                          : undefined,
                        isFavorite: !!matchedFavorite,
                      });

                      setIsSheetOpen(true);
                      map.panTo(position);
                    });
                  });
                }
              },
              { location: loc, radius: 2000 },
            );
          },
          (err) => {
            console.error("위치 정보 획득 실패", err);
          },
        );
      }
    }
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
          phone: selectedPlace.phone || "전화번호 정보 없음",
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
      <div
        id="map"
        style={{ width: "100%", height: "100vh", background: "#eee" }}
      />
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
