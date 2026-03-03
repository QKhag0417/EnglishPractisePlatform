export type PracticeSubmissionDTO = {
  id: string;
  userId: string;
  practiceContentId: string;
  timeSpentSeconds: number;
  score: number;
  correctAnswerCount: number;
  wrongAnswerCount: number;
  skipAnswerCount: number;
};

export type PracticeSubmission = PracticeSubmissionDTO;

export const PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS = [
  "userId",
  "practiceContentId",
  "timeSpentSeconds",
  "score",
  "correctAnswerCount",
  "wrongAnswerCount",
  "skipAnswerCount",
] as const;

export const PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS.join(",");

export type AnswerResult = "CORRECT" | "WRONG" | "SKIPPED";

export type PracticeSubmissionAnswerDTO = {
  id: string;
  orderIndex: number;
  answers: string[];
  result: AnswerResult | string;
};

export type PracticeSubmissionAnswer = PracticeSubmissionAnswerDTO;

export const PRACTICE_SUBMISSION_ANSWER_DTO_INCLUDE_FIELDS = [
  "orderIndex",
  "answers",
  "result",
] as const;

export const PRACTICE_SUBMISSION_ANSWER_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_SUBMISSION_ANSWER_DTO_INCLUDE_FIELDS.join(",");

export type PracticeContentAnswerDTO = {
  id: string;
  orderIndex: number;
  correctAnswers: string[];
};

export type PracticeContentAnswer = PracticeContentAnswerDTO;

export const PRACTICE_CONTENT_ANSWER_DTO_INCLUDE_FIELDS = [
  "orderIndex",
  "correctAnswers",
] as const;

export const PRACTICE_CONTENT_ANSWER_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_CONTENT_ANSWER_DTO_INCLUDE_FIELDS.join(",");
