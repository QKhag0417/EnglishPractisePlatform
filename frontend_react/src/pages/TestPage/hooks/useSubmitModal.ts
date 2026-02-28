import { useCallback, useEffect, useRef, useState } from "react";

type Args = {
  onGoToResults: () => void;
  onPostSubmission: () => Promise<unknown>;
  onPostSubmissionAnswers: () => Promise<unknown>;
};

export function useSubmitModal({
  onGoToResults,
  onPostSubmission,
  onPostSubmissionAnswers,
}: Args) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [pendingAnswersPost, setPendingAnswersPost] = useState(false);
  const runningRef = useRef(false);

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = useCallback(async () => {
    runningRef.current = false;
    await onPostSubmission();
    setPendingAnswersPost(true);
  }, [onPostSubmission]);

  useEffect(() => {
    if (!pendingAnswersPost) return;
    if (runningRef.current) return;
    runningRef.current = true;

    (async () => {
      try {
        await onPostSubmissionAnswers();
        setShowSubmitModal(false);
        onGoToResults();
      } finally {
        setPendingAnswersPost(false);
        runningRef.current = false;
      }
    })();
  }, [pendingAnswersPost, onPostSubmissionAnswers, onGoToResults]);

  return {
    showSubmitModal,
    setShowSubmitModal,
    openSubmitModal,
    cancelSubmitModal,
    confirmSubmit,
  };
}
