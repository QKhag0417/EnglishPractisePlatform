export type LearnerExerciseStatus = {
  exerciseId: string;
  userId: string;
  status: "not-started" | "in-progress" | "completed";
};

export const mockLearnerExerciseStatus: LearnerExerciseStatus = {
  exerciseId: "1",
  userId: "1",
  status: "not-started",
};
