import { create } from "zustand";
import { persist } from "zustand/middleware";

const savedTheme = localStorage.getItem("theme")
  ? JSON.parse(localStorage.getItem("theme")).state.theme
  : "light";

document.documentElement.setAttribute("data-theme", savedTheme);

const useThemeStore = create(
  persist(
    (set) => ({
      theme: savedTheme,
      setLightTheme: () => {
        document.documentElement.setAttribute("data-theme", "light");
        set({ theme: "light" });
      },

      setDarkTheme: () => {
        document.documentElement.setAttribute("data-theme", "dark");
        set({ theme: "dark" });
      },
    }),
    {
      name: "theme",
    }
  )
);

export default useThemeStore;