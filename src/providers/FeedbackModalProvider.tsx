import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import ConfirmModal from "../components/Modal/ConfirmModal";
import {
  FeedbackModalContext,
  type FeedbackModalContextValue,
  type FeedbackModalOptions,
} from "../context/FeedbackModalContext";

type DialogRequest = {
  message: string;
  confirmText: string;
  cancelText: string;
  resolve: (confirmed: boolean) => void;
};

type FeedbackModalProviderProps = {
  children: ReactNode;
};

export default function FeedbackModalProvider({
  children,
}: FeedbackModalProviderProps) {
  const [activeDialog, setActiveDialog] = useState<DialogRequest | null>(null);
  const activeDialogRef = useRef<DialogRequest | null>(null);
  const dialogQueueRef = useRef<DialogRequest[]>([]);

  const enqueueDialog = useCallback(
    (
      message: string,
      { confirmText = "확인", cancelText = "취소" }: FeedbackModalOptions = {},
    ) =>
      new Promise<boolean>((resolve) => {
        const request = { message, confirmText, cancelText, resolve };

        if (activeDialogRef.current) {
          dialogQueueRef.current.push(request);
          return;
        }

        activeDialogRef.current = request;
        setActiveDialog(request);
      }),
    [],
  );

  const closeDialog = useCallback((confirmed: boolean) => {
    const currentDialog = activeDialogRef.current;
    if (!currentDialog) return;

    activeDialogRef.current = null;
    currentDialog.resolve(confirmed);

    const nextDialog = dialogQueueRef.current.shift() ?? null;
    activeDialogRef.current = nextDialog;
    setActiveDialog(nextDialog);
  }, []);

  useEffect(() => {
    return () => {
      activeDialogRef.current?.resolve(false);
      dialogQueueRef.current.forEach((dialog) => dialog.resolve(false));
      activeDialogRef.current = null;
      dialogQueueRef.current = [];
    };
  }, []);

  const value = useMemo<FeedbackModalContextValue>(
    () => ({
      showAlert: async (message, options) => {
        await enqueueDialog(message, { ...options, cancelText: "" });
      },
      showConfirm: (message, options) => enqueueDialog(message, options),
    }),
    [enqueueDialog],
  );

  return (
    <FeedbackModalContext.Provider value={value}>
      {children}
      <ConfirmModal
        open={Boolean(activeDialog)}
        title={activeDialog?.message}
        confirmText={activeDialog?.confirmText}
        cancelText={activeDialog?.cancelText}
        onConfirm={() => closeDialog(true)}
        onCancel={() => closeDialog(false)}
      />
    </FeedbackModalContext.Provider>
  );
}
