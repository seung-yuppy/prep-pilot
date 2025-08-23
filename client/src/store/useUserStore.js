import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: () => set({ isLoggedIn: true }),
      logOut: () => {
        localStorage.removeItem("access");
        set({ isLoggedIn: false });
      },
    }),
  )
);

export default useUserStore;