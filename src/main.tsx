// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { createRoot } from "react-dom/client";

import GlobalStyle from "./styles/GlobalStyles.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
// 좀 더 편하게 개발하기 위해 Strict Mode 제거.
