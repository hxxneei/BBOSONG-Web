import GlobalStyle from "./styles/GlobalStyles";
import FabricScanner from "./pages/FabricScanner";
import ResultPage from "./pages/ResultPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";

import BottomNav from "./common/BottomNav";

// export default App;

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SignupComplete from "./pages/SignupCompelet";
import MainHome from "./pages/MainHome";
import MyPage from "./pages/MyPage";
import MapView from "./pages/MapView";
import ClosetPage from "./pages/ClosetPage";

const App: React.FC = () => {
  const location = useLocation();
  const hideNavPaths = ["/login", "/signup", "/signup-compelet"];

  const shouldHideNav = hideNavPaths.includes(location.pathname.toLowerCase());
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chatpage" element={<ChatPage />} />{" "}
        <Route path="/fabric-scanner" element={<FabricScanner />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/signup-compelet" element={<SignupComplete />} />
        <Route path="/main-home" element={<MainHome />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/closetpage" element={<ClosetPage />} />
      </Routes>
      {!shouldHideNav && <BottomNav />}
    </>
  );
};
export default App;
