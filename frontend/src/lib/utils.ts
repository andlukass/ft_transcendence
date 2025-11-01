import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DARK_MODE_STORAGE_KEY = "darkMode";

export function getDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
  if (stored === null) {
    // Default to dark mode if not set
    return true;
  }
  return stored === "true";
}

export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(DARK_MODE_STORAGE_KEY, enabled.toString());
  if (enabled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  // Dispatch custom event for dark mode change
  document.dispatchEvent(new CustomEvent("darkModeChange", { detail: { enabled } }));
}

export function initDarkMode(): void {
  const isDark = getDarkMode();
  setDarkMode(isDark);
}

export function isMobile(): boolean {
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}
