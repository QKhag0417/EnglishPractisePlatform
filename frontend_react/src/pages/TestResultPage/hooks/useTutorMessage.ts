import { useState } from "react";

export const useTutorMessage = (initialValue = "") => {
  const [tutorMessage, setTutorMessage] = useState(initialValue);

  return {
    tutorMessage,
    setTutorMessage,
  };
};
