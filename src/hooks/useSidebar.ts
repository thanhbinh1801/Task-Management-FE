import { useState } from "react";

export const useSidebar  = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  return {
    isOpen,
    toggleSidebar,
  };
}