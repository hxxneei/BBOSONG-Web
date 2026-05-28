import { useEffect, useState } from "react";

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

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

export default function MapView() {
  // ⭕ 타입 에러 해결: KakaoPlace 타입에 x, y 및 서버 데이터 속성들을 안전하게 확장해 줍니다!
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

  // 1. 처음 켜질 때 서버에서 내 즐겨찾기 목록 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getFavoriteStores();
        if (res.isSuccess) {
          setMyFavorites(res.result);
        }
      } catch (err) {
        console.error("즐겨찾기 매장 목록을 가져오지 못했습니다. 😭", err);
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
              (data: any[], status: string) => {
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

                    // ⭕ 'marker를 찾을 수 없습니다' 에러 해결: 선언부(const marker) 정상 복구!
                    const marker = new kakao.maps.Marker({
                      map,
                      position,
                      image: laundryMarkerImage,
                    });

                    // 이미 즐겨찾기한 매장인지 매칭 체크
                    const matchedFavorite = myFavorites.find(
                      (fav) => fav.kakaoPlaceId === place.id,
                    );

                    kakao.maps.event.addListener(marker, "click", () => {
                      setSelectedPlace({
                        id: place.id,
                        place_name: place.place_name,
                        road_address_name:
                          place.road_address_name || place.address_name,
                        address_name: place.address_name,
                        phone: place.phone,
                        place_url: place.place_url,
                        x: place.x, // ⭕ 'x' 속성 에러 방지를 위해 명시적으로 주입!
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
  }, [myFavorites]);

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
        }
      }
    } catch (err) {
      console.error("즐겨찾기 처리 중 오류 발생 😭:", err);
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
    </>
  );
}
// import { useEffect, useState } from "react";

// import MapBottomSheet from "../common/MapBottomSheet";
// import type { KakaoPlace } from "../common/MapBottomSheet";

// import LaundryMarker from "../assets/markers/LaundryMarker.webp";
// import MyLocationMarker from "../assets/markers/MyLocationMarker.svg";

// declare global {
//   interface Window {
//     kakao: any;
//   }
// }

// const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY as string;

// console.log(" Kakao key from env:", KAKAO_APP_KEY);

// export default function MapView() {
//   const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
//   const [isSheetOpen, setIsSheetOpen] = useState(false);

//   useEffect(() => {
//     if (window.kakao && window.kakao.maps) {
//       window.kakao.maps.load(initMap);
//       return;
//     }

//     let script = document.querySelector(
//       'script[data-kakao-sdk="true"]',
//     ) as HTMLScriptElement | null;

//     if (!script) {
//       script = document.createElement("script");
//       script.dataset.kakaoSdk = "true";
//       script.async = true;
//       script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;

//       console.log("📡 카카오 SDK 요청 URL:", script.src);

//       script.onload = () => {
//         console.log("카카오 SDK 로드 완료");
//         window.kakao.maps.load(initMap);
//       };

//       script.onerror = (e) => {
//         console.error(" 카카오 SDK 로드 실패", e);
//       };

//       document.head.appendChild(script);
//     } else {
//       // 이미 head에 붙어 있지만 아직 안 끝났을 수 있을 때
//       script.addEventListener("load", () => {
//         console.log(" 카카오 SDK (기존 script) 로드 완료");
//         window.kakao.maps.load(initMap);
//       });
//       script.addEventListener("error", (e) => {
//         console.error(" 카카오 SDK 로드 실패(기존 script)", e);
//       });
//     }

//     function initMap() {
//       const { kakao } = window;

//       const container = document.getElementById("map");
//       if (!container) {
//         console.error("#map 엘리먼트를 찾을 수 없습니다.");
//         return;
//       }

//       // 기본 지도
//       const options = {
//         center: new kakao.maps.LatLng(37.5665, 126.978), // 일단 서울
//         level: 4,
//       };

//       const map = new kakao.maps.Map(container, options);
//       console.log(" 지도 생성 완료");

//       //  내 위치로 이동 + 마커
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const lat = pos.coords.latitude;
//             const lon = pos.coords.longitude;
//             const loc = new kakao.maps.LatLng(lat, lon);

//             map.setCenter(loc);

//             const imageSrc = MyLocationMarker; // import한 SVG 경로
//             const imageSize = new kakao.maps.Size(57, 73); // 아이콘 실제 크기 (px)
//             const imageOption = {
//               // 마커 기준점 (아이콘의 어디가 좌표에 꽂힐지)
//               offset: new kakao.maps.Point(24, 48), // 중앙 아래가 좌표에 오도록
//             };

//             const markerImage = new kakao.maps.MarkerImage(
//               imageSrc,
//               imageSize,
//               imageOption,
//             );

//             new kakao.maps.Marker({
//               map,
//               position: loc,
//               image: markerImage,
//             });
//             const ps = new kakao.maps.services.Places();

//             ps.keywordSearch(
//               "세탁소",
//               (data: any[], status: string) => {
//                 if (status === kakao.maps.services.Status.OK) {
//                   console.log(" 세탁소 검색 결과:", data);
//                   // SVG 세탁소 마커 이미지 세팅
//                   const laundryImageSize = new kakao.maps.Size(57, 73);
//                   const laundryImageOption = {
//                     offset: new kakao.maps.Point(23, 46),
//                   };
//                   const laundryMarkerImage = new kakao.maps.MarkerImage(
//                     LaundryMarker,
//                     laundryImageSize,
//                     laundryImageOption,
//                   );

//                   data.forEach((place) => {
//                     const position = new kakao.maps.LatLng(place.y, place.x);

//                     const marker = new kakao.maps.Marker({
//                       map,
//                       position,
//                       image: laundryMarkerImage,
//                     });

//                     const infowindow = new kakao.maps.InfoWindow({
//                       content: `
//                         <div style="padding:6px;font-size:12px;white-space:nowrap;">
//                           ${place.place_name}
//                         </div>
//                       `,
//                     });

//                     kakao.maps.event.addListener(marker, "click", () => {
//                       setSelectedPlace({
//                         id: place.id,
//                         place_name: place.place_name,
//                         road_address_name: place.road_address_name,
//                         address_name: place.address_name,
//                         phone: place.phone,
//                         place_url: place.place_url,
//                       });

//                       setIsSheetOpen(true); // 시트 열기
//                       map.panTo(position); // 선택된 세탁소로 지도 센터 이동 (선택 사항)
//                     });
//                   });
//                 } else {
//                   console.warn("세탁소 검색 실패 상태:", status);
//                 }
//               },
//               {
//                 location: loc, // 내 위치 기준으로 검색
//                 radius: 2000, // 반경 2km
//               },
//             );
//           },
//           (err) => {
//             console.error("위치 정보를 가져오지 못했습니다.", err);
//           },
//         );
//       } else {
//         console.error("이 브라우저는 geolocation을 지원하지 않습니다.");
//       }
//     }
//   }, []);

//   return (
//     <>
//       <div
//         id="map"
//         style={{
//           width: "100%",
//           height: "100vh",
//           background: "#eee",
//         }}
//       />
//       <MapBottomSheet
//         isOpen={isSheetOpen && !!selectedPlace}
//         place={selectedPlace}
//         onClose={() => {
//           setIsSheetOpen(false);
//         }}
//       />
//     </>
//   );
// }
