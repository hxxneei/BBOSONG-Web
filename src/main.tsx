import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import FeedbackModalProvider from "./providers/FeedbackModalProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeedbackModalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FeedbackModalProvider>
  </StrictMode>,
);
