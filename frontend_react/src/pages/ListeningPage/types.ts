export type TaskFilter = "all" | number;
export type TagFilter = "all" | string;

export type SortBy = "newest" | "oldest" | "attempts" | "a-z" | "z-a";

export interface ExerciseMetadata {
  id: string;
  title: string;
  attempts: string;
  image: string;
  task: number;
  questionTypes: string[];
  topics: string[];
  status: "draft" | "published" | string;
  updated: string;
  questions: number;
  duration: number;
}

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "title",
  "thumbnailUrl",
  "task",
  "questionTypeTags",
  "topicTags",
  "status",
  "updatedOn",
  "questionCount",
  "durationMinutes",
] as const;

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export interface PracticeContentDTO {
  id: string;
  title: string;
  thumbnailUrl: string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  questionTypeTags: string[];
  topicTags: string[];
  status: "DRAFT" | "PUBLISHED" | string;
  updatedOn: number[];
  questionCount: number;
  durationMinutes: number;
}

export interface PracticeContentResponseDTO {
  data?: PracticeContentDTO[];
}
