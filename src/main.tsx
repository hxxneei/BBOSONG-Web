import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import FeedbackModalProvider from "./providers/FeedbackModalProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <FeedbackModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FeedbackModalProvider>
    </ErrorBoundary>
  </StrictMode>,
);
