import { useCallback, useState } from "react";

type Args = {};

export function useSubmitModal({}: Args) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = useCallback(() => {
    setShowSubmitModal(false);
  }, []);

  return {
    showSubmitModal,
    setShowSubmitModal,
    openSubmitModal,
    cancelSubmitModal,
    confirmSubmit,
  };
}
