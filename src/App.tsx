import GlobalStyle from "./styles/GlobalStyles";
import BottomNav from "./common/BottomNav";

import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";
import Firstpage from "./pages/Firstpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupComplete from "./pages/SignupCompelet";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { hasAuthTokens } from "./utils/authStorage";

const importFabricScanner = () => import("./pages/FabricScanner");
const importResultPage = () => import("./pages/ResultPage");
const importChatPage = () => import("./pages/ChatPage");
const importMainHome = () => import("./pages/MainHome");
const importMyPage = () => import("./pages/MyPage");
const importMapView = () => import("./pages/MapView");
const importClosetPage = () => import("./pages/ClosetPage");
const importTopPage = () => import("./pages/CategoryPage");
const importClosetDetailPage = () => import("./pages/ClosetDetailPage");
const importOAuthCallbackPage = () => import("./pages/OAuthCallbackPage");
const importFavoriteStoresPage = () => import("./pages/FavoriteStoresPage");
const importMyClosetPage = () => import("./pages/MyClosetPage");

const FabricScanner = lazy(importFabricScanner);
const ResultPage = lazy(importResultPage);
const ChatPage = lazy(importChatPage);
const MainHome = lazy(importMainHome);
const MyPage = lazy(importMyPage);
const MapView = lazy(importMapView);
const ClosetPage = lazy(importClosetPage);
const TopPage = lazy(importTopPage);
const ClosetDetailPage = lazy(importClosetDetailPage);
const OAuthCallbackPage = lazy(importOAuthCallbackPage);
const FavoriteStoresPage = lazy(importFavoriteStoresPage);
const MyClosetPage = lazy(importMyClosetPage);

const withAuth = (element: ReactNode) => <ProtectedRoute>{element}</ProtectedRoute>;

const App = () => {
  const [chatStep, setChatStep] = useState(1);
  const [isScannerCameraActive, setIsScannerCameraActive] = useState(false);
  const location = useLocation();
  const hideNavPaths = [
    "/",
    "/login",
    "/signup",
    "/signup-complete",
    "/category-card",
    "/closetpage",
    "/result",
  ];
  const isBaseHidePath = hideNavPaths.includes(location.pathname.toLowerCase());
  const isChatSubStep =
    location.pathname.toLowerCase() === "/chatpage" && chatStep !== 1;
  const isScannerCameraPath =
    location.pathname.toLowerCase() === "/fabric-scanner" &&
    isScannerCameraActive;

  const shouldHideNav = isBaseHidePath || isChatSubStep || isScannerCameraPath;

  // const shouldHideNav = hideNavPaths.includes(location.pathname.toLowerCase());

  useEffect(() => {
    if (!hasAuthTokens() || location.pathname !== "/main-home") {
      return;
    }

    const prefetchTimer = window.setTimeout(() => {
      void Promise.allSettled([
        importChatPage(),
        importMapView(),
        importMyPage(),
        importClosetPage(),
        importFabricScanner(),
      ]);
    }, 800);

    return () => window.clearTimeout(prefetchTimer);
  }, [location.pathname]);

  return (
    <>
      <GlobalStyle />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Firstpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chatpage"
            element={withAuth(
              <ChatPage onStepChange={(step) => setChatStep(step)} />,
            )}
          />
          <Route
            path="/fabric-scanner"
            element={withAuth(
              <FabricScanner onCameraActiveChange={setIsScannerCameraActive} />
            )}
          />
          <Route path="/result" element={withAuth(<ResultPage />)} />
          <Route path="/signup-complete" element={<SignupComplete />} />
          <Route path="/main-home" element={withAuth(<MainHome />)} />
          <Route path="/mypage" element={withAuth(<MyPage />)} />
          <Route path="/mapview" element={withAuth(<MapView />)} />
          <Route path="/closetpage" element={withAuth(<ClosetPage />)} />
          <Route path="/category-card" element={withAuth(<TopPage />)} />
          <Route
            path="/my-closet/:id"
            element={withAuth(<ClosetDetailPage />)}
          />
          <Route path="/oauth/success" element={<OAuthCallbackPage />} />
          <Route
            path="/favorite-stores"
            element={withAuth(<FavoriteStoresPage />)}
          />
          <Route path="/my-closet" element={withAuth(<MyClosetPage />)} />
        </Routes>
      </Suspense>
      {!shouldHideNav && <BottomNav />}
    </>
  );
};

export default App;

const RouteFallback = styled.div`
  min-height: 100vh;
  min-height: 100svh;
  background-color: white;
`;
