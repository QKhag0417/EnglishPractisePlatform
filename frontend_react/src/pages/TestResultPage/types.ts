export type LocalDateTimeArray = [
  number, // year
  number, // month
  number, // day
  number, // hour
  number, // minute
  number, // second
  number, // nanosecond
];

export type PracticeSubmissionDTO = {
  id: string;
  userId: string;
  practiceContentId: string;
  timeSpentSeconds: number;
  score: number;
  correctAnswerCount: number;
  wrongAnswerCount: number;
  skipAnswerCount: number;
  submittedAt: LocalDateTimeArray;
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
  "submittedAt",
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

export type PracticeContentDTO = {
  id: string;
  title: string;
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  instructionsParsed: string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
};

export type PracticeContent = PracticeContentDTO;

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "title",
  "skill",
  "instructionsParsed",
  "task",
] as const;

export const PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type UserDataDTO = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type UserData = UserDataDTO;

export const USER_DATA_DTO_INCLUDE_FIELDS = [
  "userId",
  "email",
  "firstname",
  "lastname",
] as const;

export const USER_DATA_DTO_INCLUDE_FIELDS_QUERY =
  USER_DATA_DTO_INCLUDE_FIELDS.join(",");

export type UserPracticeWritingAnswerDTO = {
  id: string;
  orderIndex: number;
  essayText: string;
  wordCount: number;
};

export type UserPracticeWritingAnswer = UserPracticeWritingAnswerDTO;

export const USER_PRACTICE_WRITING_ANSWER_DTO_INCLUDE_FIELDS = [
  "orderIndex",
  "essayText",
  "wordCount",
] as const;

export const USER_PRACTICE_WRITING_ANSWER_DTO_INCLUDE_FIELDS_QUERY =
  USER_PRACTICE_WRITING_ANSWER_DTO_INCLUDE_FIELDS.join(",");
