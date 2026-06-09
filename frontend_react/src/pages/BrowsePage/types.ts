import { BackendTopicTag, TopicTag } from "../ListeningContentEditorPage/types";
import { BackendQuestionType, UIQuestionType } from "../MyProfilePage/types";

export type TaskFilter = "all" | number;
export type TagFilter = "all" | UIQuestionType;
export type TopicFilter = "all" | TopicTag;

export type SortBy = "newest" | "oldest" | "attempts" | "a-z" | "z-a";

export interface ExerciseMetadata {
  id: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  title: string;
  attempts: number;
  image: string;
  task: number;
  questionTypes: UIQuestionType[];
  topics: TopicTag[];
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
  task: "ALL" | "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  questionTypeTags: BackendQuestionType[];
  topicTags: BackendTopicTag[];
  status: "DRAFT" | "PUBLISHED" | string;
  updatedOn: number[];
  questionCount: number;
  durationMinutes: number;
  attemptCount: number;
}

export type UserPracticeContentProgressPutBody = {
  isBookmarked: boolean;
};

export type UserPracticeContentProgressPutDTO = {
  id?: string;
};

export type UserPracticeContentProgressPut = {
  userPracticeContentProgressId: string;
};

export type UserPracticeContentProgressGetDTO = {
  id?: string;
  practiceContentId?: string;
  isBookmarked?: boolean;
  attemptCount?: number;
};

export type UserPracticeContentProgressGet = {
  id: string;
  practiceContentId: string;
  isBookmarked: boolean;
  attemptCount: number;
};

export const USER_PRACTICE_CONTENT_PROGRESS_GET_DTO_INCLUDE_FIELDS = [
  "practiceContentId",
  "isBookmarked",
  "attemptCount",
] as const;

export const USER_PRACTICE_CONTENT_PROGRESS_GET_DTO_INCLUDE_FIELDS_QUERY =
  USER_PRACTICE_CONTENT_PROGRESS_GET_DTO_INCLUDE_FIELDS.join(",");
