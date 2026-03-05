export type TaskFilter = "all" | number;
export type TagFilter = "all" | string;

export type SortBy = "newest" | "oldest" | "attempts" | "a-z" | "z-a";

export interface ExerciseMetadata {
  id: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  title: string;
  attempts: number;
  image: string;
  task: number;
  questionTypes: string[];
  topics: string[];
  status: "DRAFT" | "PUBLISHED" | string;
  updated: string;
  questions: number;
  duration: number;
}

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "skill",
  "title",
  "thumbnailUrl",
  "task",
  "questionTypeTags",
  "topicTags",
  "status",
  "updatedOn",
  "questionCount",
  "durationMinutes",
  "attemptCount",
] as const;

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export interface PracticeContentDTO {
  id: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  title: string;
  thumbnailUrl: string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  questionTypeTags: string[];
  topicTags: string[];
  status: "DRAFT" | "PUBLISHED" | string;
  updatedOn: number[];
  questionCount: number;
  durationMinutes: number;
  attemptCount: number;
}
