import { useCallback, useEffect, useRef, useState } from "react";

type Args = {
  onGoToResults: () => void;
  onPostSubmission: () => Promise<unknown>;
  onPostSubmissionAnswers: () => Promise<unknown>;
  onPostAttemptIncrement: () => Promise<unknown>;
};

type ConfirmSubmitStep =
  | "idle"
  | "postingSubmission"
  | "postingSubmissionAnswers"
  | "postingAttemptIncrement"
  | "done"
  | "error";

export function useSubmitModal({
  onGoToResults,
  onPostSubmission,
  onPostSubmissionAnswers,
  onPostAttemptIncrement,
}: Args) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const runningRef = useRef(false);
  const [confirmSubmitStep, setConfirmSubmitStep] =
    useState<ConfirmSubmitStep>("idle");

  const isSubmitting =
    confirmSubmitStep === "postingSubmission" ||
    confirmSubmitStep === "postingSubmissionAnswers" ||
    confirmSubmitStep === "postingAttemptIncrement";

  const openSubmitModal = useCallback(() => setShowSubmitModal(true), []);
  const cancelSubmitModal = useCallback(() => setShowSubmitModal(false), []);

  const confirmSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setConfirmSubmitStep("postingSubmission");
  }, [isSubmitting]);

  useEffect(() => {
    if (confirmSubmitStep !== "postingSubmission") return;
    if (runningRef.current) return;

    runningRef.current = true;

    (async () => {
      try {
        await onPostSubmission();
        setConfirmSubmitStep("postingSubmissionAnswers");
      } catch {
        setConfirmSubmitStep("error");
      } finally {
        runningRef.current = false;
      }
    })();
  }, [confirmSubmitStep, onPostSubmission]);

  useEffect(() => {
    if (confirmSubmitStep !== "postingSubmissionAnswers") return;
    if (runningRef.current) return;

    runningRef.current = true;

    (async () => {
      try {
        await onPostSubmissionAnswers();
        setConfirmSubmitStep("postingAttemptIncrement");
      } catch {
        setConfirmSubmitStep("error");
      } finally {
        runningRef.current = false;
      }
    })();
  }, [confirmSubmitStep, onPostSubmissionAnswers]);

  useEffect(() => {
    if (confirmSubmitStep !== "postingAttemptIncrement") return;
    if (runningRef.current) return;

    runningRef.current = true;

    (async () => {
      try {
        await onPostAttemptIncrement();
        setConfirmSubmitStep("done");
      } catch {
        setConfirmSubmitStep("error");
      } finally {
        runningRef.current = false;
      }
    })();
  }, [confirmSubmitStep, onPostAttemptIncrement]);

  useEffect(() => {
    if (confirmSubmitStep !== "done") return;

    setShowSubmitModal(false);
    onGoToResults();
  }, [confirmSubmitStep, onGoToResults]);

  return {
    showSubmitModal,
    setShowSubmitModal,
    openSubmitModal,
    cancelSubmitModal,
    confirmSubmit,
  };
}
