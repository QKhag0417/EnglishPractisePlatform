export type ExerciseAnswer = {
  id: string;
  correctAnswers: Record<number, string | string[]>;
};

export const mockExerciseAnswers: ExerciseAnswer = {
  id: "1",
  correctAnswers: {
    1: "Ben Carter",
    2: "Photography",
    3: "B",
    4: ["A", "C"],
    5: "TRUE",
  },
};
