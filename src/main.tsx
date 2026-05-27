// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>,
// );

// 📄 src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ⭕ [여기에 이 코드를 그대로 복사해서 붙여넣으세요!]
// Vercel 금고에서 키를 안전하게 꺼내와 동적으로 스크립트를 주입합니다.
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
