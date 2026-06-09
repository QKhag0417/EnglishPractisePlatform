import { useState } from "react";

export function useReviewRequested(initialValue = false) {
  const [reviewRequested, setReviewRequested] = useState(initialValue);

  return {
    reviewRequested,
    setReviewRequested,
  };
}
