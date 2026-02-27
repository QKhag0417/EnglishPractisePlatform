import { useCallback, useState } from "react";

type Args = {
  onExit: () => void;
};

export function useExitModal({ onExit }: Args) {
  const [showExitModal, setShowExitModal] = useState(false);

  const openExitModal = useCallback(() => setShowExitModal(true), []);

  const cancelExitModal = useCallback(() => setShowExitModal(false), []);

  const confirmExit = useCallback(() => {
    setShowExitModal(false);
    onExit();
  }, [onExit]);

  return {
    showExitModal,
    setShowExitModal,
    openExitModal,
    cancelExitModal,
    confirmExit,
  };
}
