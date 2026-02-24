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
  id: string;
  skill: Skill | string;
  task: number;
  duration: number;
  passageTitle?: string;
  passageText?: string;
  audioUrl?: string;
  examText: string;
  totalQuestions: number;
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
