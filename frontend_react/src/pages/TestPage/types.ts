export type Skill = "listening" | "reading" | "writing" | "speaking" | string;

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

export type ExerciseBase = {
  id: string;
  task: number;
  duration: number;
  examText: string;
  totalQuestions: number;
};

export type ListeningExercise = ExerciseBase & {
  skill: "listening";
  audioUrl: string;
};

export type ReadingExercise = ExerciseBase & {
  skill: "reading";
  passageText: string;
};

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "skill",
  "task",
  "durationMinutes",
  "audioUrl",
  "instructionsParsed",
  "questionCount",
] as const;

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export interface PracticeContentDTO {
  id: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  durationMinutes: number;
  audioUrl: string;
  instructionsParsed: string;
  questionCount: number;
}

export type ExerciseAnswer = {
  id: string;
  correctAnswers: Record<number, string | string[]>;
};
