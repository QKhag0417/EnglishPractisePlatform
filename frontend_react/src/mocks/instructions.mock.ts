export type ExerciseInstruction = {
  id: string;
  skill: "listening" | "reading" | "writing" | "speaking";
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
};

export const exerciseInstructions: ExerciseInstruction = {
  id: "1",
  skill: "listening",
  title: "IELTS Academic Listening",
  timeInfo: "Time: Approximately 12 minutes",
  candidateInstructions: [
    "Answer all the questions.",
    "You can change your answers at any time during the test.",
    "Do not click 'Start test' until you are told to do so.",
  ],
  candidateInfo: [
    "There are 10 questions in this test.",
    "Each question carries one mark.",
    "You will hear the recording once.",
    "For this part of the test there will be time for you to look through the questions and time for you to check your answers.",
  ],
};
