import { create } from "zustand";

const useModalStore = create((set, get) => ({
  modals: {},

  openModal: (key) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: true,
      },
    })),

  closeModal: (key) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [key]: false,
      },
    })),

  isOpen: (key) => !!get().modals[key],
}));

export default useModalStore;