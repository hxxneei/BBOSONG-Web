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
import Mypage from "./pages/MyPage.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <Mypage />
  </>
);
