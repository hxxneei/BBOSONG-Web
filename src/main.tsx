// 📄 src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

if (KAKAO_MAP_KEY && !document.getElementById("kakao-map-script")) {
  const script = document.createElement("script");
  script.id = "kakao-map-script";
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
  script.type = "text/javascript";
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
