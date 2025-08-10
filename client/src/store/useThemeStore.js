import { create } from "zustand";
import { persist } from "zustand/middleware";

const savedTheme = localStorage.getItem("theme")
  ? JSON.parse(localStorage.getItem("theme")).state.theme
  : "light";

document.documentElement.setAttribute("data-theme", savedTheme);

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        set({ theme: next });
      },
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
    }),
    {
      name: "theme",
    }
  )
);

export default useThemeStore;