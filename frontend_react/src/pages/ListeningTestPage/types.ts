export type Skill = "LISTENING" | "READING" | "WRITING" | "SPEAKING";

export interface ExerciseInstruction {
  id: string;
  skill: Skill | string;
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
}
