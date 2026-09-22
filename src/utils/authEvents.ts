const AUTH_EXPIRED_EVENT = "bbosong:auth-expired";

let hasNotifiedAuthExpired = false;

export const notifyAuthExpired = () => {
  if (hasNotifiedAuthExpired) return;

  hasNotifiedAuthExpired = true;
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
};

export const markAuthSessionActive = () => {
  hasNotifiedAuthExpired = false;
};

export const subscribeToAuthExpired = (listener: () => void) => {
  window.addEventListener(AUTH_EXPIRED_EVENT, listener);

  if (hasNotifiedAuthExpired) {
    listener();
  }

  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
};
