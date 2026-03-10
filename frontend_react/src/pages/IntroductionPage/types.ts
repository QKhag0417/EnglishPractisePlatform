export type Skill = "listening" | "reading" | "writing" | "speaking" | string;

export interface ExerciseIntroduction {
  id: string;
  skill: Skill | string;
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
}
