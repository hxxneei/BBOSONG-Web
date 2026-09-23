import { useContext } from "react";
import { FeedbackModalContext } from "../context/FeedbackModalContext";

export const useFeedbackModal = () => {
  const context = useContext(FeedbackModalContext);

  if (!context) {
    throw new Error(
      "useFeedbackModal must be used within FeedbackModalProvider.",
    );
  }

  return context;
};
