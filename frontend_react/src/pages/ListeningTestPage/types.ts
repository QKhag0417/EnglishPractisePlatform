export type Skill = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

export interface ExerciseInstruction {
  id: string;
  skill: Skill | string;
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
}

export type UserAnswers = Record<number, string | string[]>;

export type TestState = "instruction" | "test" | "results";

export type ExercisePrompt = {
  id: string | number;
  task: number;
  duration: number;
  audioUrl: string;
  examText: string;
  totalQuestions: number;
};

export type ExerciseAnswer = {
  id: string | number;
  correctAnswers: Record<number, string | string[]>;
};
