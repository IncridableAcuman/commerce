import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("shopluxe-theme") as ThemeMode | null;
  if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
    return saved;
  }
  return "dark";
};

const applyDocumentTheme = (theme: ThemeMode): "light" | "dark" => {
  if (typeof document === "undefined") return "dark";

  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }

  root.style.colorScheme = resolved;
  return resolved;
};

const initialTheme = getInitialTheme();
const initialResolved = typeof window !== "undefined" ? applyDocumentTheme(initialTheme) : "dark";

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: initialResolved,

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem("shopluxe-theme", theme);
    const resolved = applyDocumentTheme(theme);
    set({ theme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const next: ThemeMode = current === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
}));

// Tizim preferensiyasini tinglash
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = () => {
    const currentTheme = useThemeStore.getState().theme;
    if (currentTheme === "system") {
      const resolved = applyDocumentTheme("system");
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  };

  try {
    mediaQuery.addEventListener?.("change", handleSystemChange);
  } catch {
    // fallback for older browsers
    mediaQuery.addListener?.(handleSystemChange);
  }
}
