import { useState } from "react";

export function useTutorStatusDropdown(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return {
    isOpen,
    setIsOpen,
  };
}
