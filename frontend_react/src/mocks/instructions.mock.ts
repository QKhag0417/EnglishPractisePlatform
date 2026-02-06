export type ExerciseInstruction = {
  id: string;
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
};

export const mockExerciseInstruction1: ExerciseInstruction = {
  id: "1",
  title: "Workplace Safety Briefing",
  timeInfo: "Time: 12 minutes",
  candidateInstructions: [
    "You will hear a short safety briefing.",
    "Choose the correct answer for each question.",
  ],
  candidateInfo: ["Topic: Workplace", "Focus: Instructions & details"],
};
