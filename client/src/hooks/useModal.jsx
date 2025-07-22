import { useState } from "react";

export default function useModal() {
  const [modals, setModals] = useState({});

  const openModal = (key) => {
    setModals(prev => ({
      ...prev,
      [key]: true
    }))
  };

  const closeModal = (key) => {
    setModals(prev => ({
      ...prev,
      [key]: false
    }))
  };

  const isOpen = (key) => modals[key]

  return { isOpen, openModal, closeModal };
}