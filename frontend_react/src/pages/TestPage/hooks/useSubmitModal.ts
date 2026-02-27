import { useCallback, useState } from "react";

type Args = { onSubmitTest: () => void };

export function useSubmitModal({ onSubmitTest }: Args) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = useCallback(() => {
    setShowSubmitModal(false);
    onSubmitTest();
  }, [onSubmitTest]);

  return {
    showSubmitModal,
    setShowSubmitModal,
    openSubmitModal,
    cancelSubmitModal,
    confirmSubmit,
  };
}
