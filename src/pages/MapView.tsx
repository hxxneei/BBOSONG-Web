import { useEffect, useState } from "react";

import MapBottomSheet from "../common/MapBottomSheet";
import type { KakaoPlace } from "../common/MapBottomSheet";

import LaundryMarker from "../assets/markers/LaundryMarker.svg";
import MyLocationMarker from "../assets/markers/MyLocationMarker.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

console.log("🔑 Kakao key from env:", KAKAO_APP_KEY);

export default function MapView() {
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

      console.log("📡 카카오 SDK 요청 URL:", script.src);

      script.onload = () => {
        console.log("카카오 SDK 로드 완료");
        window.kakao.maps.load(initMap);
      };

      script.onerror = (e) => {
        console.error(" 카카오 SDK 로드 실패", e);
      };

      document.head.appendChild(script);
    } else {
      // 이미 head에 붙어 있지만 아직 안 끝났을 수 있을 때
      script.addEventListener("load", () => {
        console.log(" 카카오 SDK (기존 script) 로드 완료");
        window.kakao.maps.load(initMap);
      });
      script.addEventListener("error", (e) => {
        console.error(" 카카오 SDK 로드 실패(기존 script)", e);
      });
    }

    function initMap() {
      const { kakao } = window;

      const container = document.getElementById("map");
      if (!container) {
        console.error("#map 엘리먼트를 찾을 수 없습니다.");
        return;
      }

      // 기본 지도
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 일단 서울
        level: 4,
      };

      const map = new kakao.maps.Map(container, options);
      console.log(" 지도 생성 완료");

      //  내 위치로 이동 + 마커
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const loc = new kakao.maps.LatLng(lat, lon);

            map.setCenter(loc);

            const imageSrc = MyLocationMarker; // import한 SVG 경로
            const imageSize = new kakao.maps.Size(57, 73); // 아이콘 실제 크기 (px)
            const imageOption = {
              // 마커 기준점 (아이콘의 어디가 좌표에 꽂힐지)
              offset: new kakao.maps.Point(24, 48), // 중앙 아래가 좌표에 오도록
            };

            const markerImage = new kakao.maps.MarkerImage(
              imageSrc,
              imageSize,
              imageOption,
            );

            new kakao.maps.Marker({
              map,
              position: loc,
              image: markerImage,
            });
            const ps = new kakao.maps.services.Places();

            ps.keywordSearch(
              "세탁소",
              (data: any[], status: string) => {
                if (status === kakao.maps.services.Status.OK) {
                  console.log(" 세탁소 검색 결과:", data);
                  // SVG 세탁소 마커 이미지 세팅
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
                      image: laundryMarkerImage, // ✅ SVG 마커 적용
                    });

                    const infowindow = new kakao.maps.InfoWindow({
                      content: `
                        <div style="padding:6px;font-size:12px;white-space:nowrap;">
                          ${place.place_name}
                        </div>
                      `,
                    });

                    kakao.maps.event.addListener(marker, "click", () => {
                      setSelectedPlace({
                        id: place.id,
                        place_name: place.place_name,
                        road_address_name: place.road_address_name,
                        address_name: place.address_name,
                        phone: place.phone,
                        place_url: place.place_url,
                      });

                      setIsSheetOpen(true); // 시트 열기
                      map.panTo(position); // 선택된 세탁소로 지도 센터 이동 (선택 사항)
                    });
                  });
                } else {
                  console.warn("세탁소 검색 실패 상태:", status);
                }
              },
              {
                location: loc, // 내 위치 기준으로 검색
                radius: 2000, // 반경 2km
              },
            );
          },
          (err) => {
            console.error("위치 정보를 가져오지 못했습니다.", err);
          },
        );
      } else {
        console.error("이 브라우저는 geolocation을 지원하지 않습니다.");
      }
    }
  }, []);

  return (
    <>
      <div
        id="map"
        style={{
          width: "100%",
          height: "100vh",
          background: "#eee",
        }}
      />
      <MapBottomSheet
        isOpen={isSheetOpen && !!selectedPlace}
        place={selectedPlace}
        onClose={() => {
          setIsSheetOpen(false);
          // 필요하면 선택도 같이 초기화
          // setSelectedPlace(null);
        }}
      />
    </>
  );
}
