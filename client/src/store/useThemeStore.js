import { create } from "zustand";

const isClient = typeof window !== "undefined";

export const useThemeStore = create((set) => ({
  theme: isClient ? localStorage.getItem("theme") || "dark" : "dark",

  setTheme: (theme) => {
    set({ theme });
    if (isClient) {
      localStorage.setItem("theme", theme);
    }
  },
}));
