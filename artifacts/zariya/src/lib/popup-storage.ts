const BRAND_POPUP_KEY = "zariya_brand_popup_seen";
const WELCOME_LOGIN_KEY = "zariya_welcome_login_dismissed";

export function hasSeenBrandPopup(): boolean {
  try {
    return localStorage.getItem(BRAND_POPUP_KEY) === "1";
  } catch {
    return false;
  }
}

export function markBrandPopupSeen(): void {
  try {
    localStorage.setItem(BRAND_POPUP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasDismissedWelcomeLogin(): boolean {
  try {
    return sessionStorage.getItem(WELCOME_LOGIN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeLoginDismissed(): void {
  try {
    sessionStorage.setItem(WELCOME_LOGIN_KEY, "1");
  } catch {
    /* ignore */
  }
}

function tourKey(userId: string) {
  return `zariya_tour_completed_${userId}`;
}

export function hasCompletedTour(userId: string): boolean {
  try {
    return localStorage.getItem(tourKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function markTourCompleted(userId: string): void {
  try {
    localStorage.setItem(tourKey(userId), "1");
  } catch {
    /* ignore */
  }
}
