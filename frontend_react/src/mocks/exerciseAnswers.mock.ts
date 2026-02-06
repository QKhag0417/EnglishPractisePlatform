export type ExerciseAnswers = {
  id: string;
  correctAnswers: Record<number, string | string[]>;
};

export const mockExerciseAnswers: ExerciseAnswers = {
  id: "ex-1",
  correctAnswers: {
    1: "B",
    2: "C",
    3: "A",
    4: ["A", "C"],
    5: "TRUE",
    6: "FALSE",
    7: "Not Given",
    8: "Reception",
    9: ["$25", "25 dollars"],
    10: "Platform 3",
  },
};
