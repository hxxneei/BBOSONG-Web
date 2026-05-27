// import GlobalStyle from "./styles/GlobalStyles";
// import FabricScanner from "./pages/FabricScanner";
// import ResultPage from "./pages/ResultPage";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import ChatPage from "./pages/ChatPage";
// import BottomNav from "./common/BottomNav";

// import React from "react";
// import { useState } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Firstpage from "./pages/Firstpage";
// import SignupComplete from "./pages/SignupCompelet";
// import MainHome from "./pages/MainHome";
// import MyPage from "./pages/MyPage";
// import MapView from "./pages/MapView";
// import ClosetPage from "./pages/ClosetPage";

// import TopPage from "./pages/CategoryPage";
// import ClosetDetailPage from "./pages/ClosetDetailPage";
// import OAuthCallbackPage from "./pages/OAuthCallbackPage";
// import FavoriteStoresPage from "./pages/FavoriteStoresPage";
// import MyClosetPage from "./pages/MyClosetPage";

// const App: React.FC = () => {
//   const [chatStep, setChatStep] = useState(1);
//   const location = useLocation();
//   const hideNavPaths = [
//     "/",
//     "/login",
//     "/signup",
//     "/signup-compelet",
//     "/category-card",
//     "/closetpage",
//     "/result",
//   ];
//   const isBaseHidePath = hideNavPaths.includes(location.pathname.toLowerCase());
//   const isChatSubStep =
//     location.pathname.toLowerCase() === "/chatpage" && chatStep !== 1;

//   const shouldHideNav = isBaseHidePath || isChatSubStep;

//   // const shouldHideNav = hideNavPaths.includes(location.pathname.toLowerCase());

//   return (
//     <>
//       <GlobalStyle />
//       <Routes>
//         <Route path="/" element={<Firstpage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/chatpage"
//           element={<ChatPage onStepChange={(step) => setChatStep(step)} />}
//         />
//         <Route path="/fabric-scanner" element={<FabricScanner />} />
//         <Route path="/result" element={<ResultPage />} />
//         <Route path="/signup-compelet" element={<SignupComplete />} />
//         <Route path="/main-home" element={<MainHome />} />
//         <Route path="/mypage" element={<MyPage />} />
//         <Route path="/mapview" element={<MapView />} />
//         <Route path="/closetpage" element={<ClosetPage />} />
//         <Route path="/category-card" element={<TopPage />} />
//         <Route path="/my-closet/:id" element={<ClosetDetailPage />} />
//         <Route path="/oauth/success" element={<OAuthCallbackPage />} />
//         <Route path="/favorite-stores" element={<FavoriteStoresPage />} />
//         <Route path="/my-closet" element={<MyClosetPage />} />
//       </Routes>
//       {!shouldHideNav && <BottomNav />}
//     </>
//   );
// };

// export default App;
// 📄 src/App.tsx (최종 수정본)
import GlobalStyle from "./styles/GlobalStyles";
import FabricScanner from "./pages/FabricScanner";
import ResultPage from "./pages/ResultPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import BottomNav from "./common/BottomNav";

import React from "react";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Firstpage from "./pages/Firstpage";
import SignupCompelet from "./pages/SignupCompelet";
import MainHome from "./pages/MainHome";
import MyPage from "./pages/MyPage";
import MapView from "./pages/MapView";
import ClosetPage from "./pages/ClosetPage";

import TopPage from "./pages/CategoryPage";
import ClosetDetailPage from "./pages/ClosetDetailPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import FavoriteStoresPage from "./pages/FavoriteStoresPage";
import MyClosetPage from "./pages/MyClosetPage";

const App: React.FC = () => {
  const [chatStep, setChatStep] = useState(1);
  const location = useLocation(); // 👈 main.tsx의 BrowserRouter 덕분에 이제 완벽 작동합니다!

  const hideNavPaths = [
    "/",
    "/login",
    "/signup",
    "/signup-compelet",
    "/category-card",
    "/closetpage",
    "/result",
  ];

  const isBaseHidePath = hideNavPaths.includes(location.pathname.toLowerCase());
  const isChatSubStep =
    location.pathname.toLowerCase() === "/chatpage" && chatStep !== 1;

  const shouldHideNav = isBaseHidePath || isChatSubStep;

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chatpage"
          element={<ChatPage onStepChange={(step) => setChatStep(step)} />}
        />
        <Route path="/fabric-scanner" element={<FabricScanner />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/signup-compelet" element={<SignupCompelet />} />
        <Route path="/main-home" element={<MainHome />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/closetpage" element={<ClosetPage />} />
        <Route path="/category-card" element={<TopPage />} />
        <Route path="/my-closet/:id" element={<ClosetDetailPage />} />
        <Route path="/oauth/success" element={<OAuthCallbackPage />} />
        <Route path="/favorite-stores" element={<FavoriteStoresPage />} />
        <Route path="/my-closet" element={<MyClosetPage />} />
      </Routes>
      {!shouldHideNav && <BottomNav />}
    </>
  );
};

export default App;
