export type Skill = "Listening" | "Reading" | "Writing" | "Speaking";
export type Status = "Published" | "Draft";

export interface PracticeContentMetadata {
  id: string;
  title: string;
  skill: Skill;
  updatedOn: string;
  questions: number;
  duration: number;
  attempts: number;
  status: Status;
}