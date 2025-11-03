import { createRoot } from "react-dom/client";

import GlobalStyle from "./styles/GlobalStyles.tsx";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
