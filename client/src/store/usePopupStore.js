import { create } from 'zustand';

const usePopupStore = create((set) => ({
  visible: false,
  content: '',
  color: '#4CAF50',
  showPopup: (content, color = '#4CAF50') => set({ visible: true, content, color }),
  hidePopup: () => set({ visible: false }),
}));

export default usePopupStore;
