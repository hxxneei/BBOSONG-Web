import { createContext } from "react";

export type FeedbackModalOptions = {
  confirmText?: string;
  cancelText?: string;
};

export type FeedbackModalContextValue = {
  showAlert: (
    message: string,
    options?: Omit<FeedbackModalOptions, "cancelText">,
  ) => Promise<void>;
  showConfirm: (
    message: string,
    options?: FeedbackModalOptions,
  ) => Promise<boolean>;
};

export const FeedbackModalContext =
  createContext<FeedbackModalContextValue | null>(null);
