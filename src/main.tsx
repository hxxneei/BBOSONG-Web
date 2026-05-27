//import { createRoot } from "react-dom/client";

// import GlobalStyle from "./styles/GlobalStyles.tsx";
// import App from "./App";

// createRoot(document.getElementById("root")!).render(
//   <>
//     <GlobalStyle />
//     <App />
//   </>,
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
