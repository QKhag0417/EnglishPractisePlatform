import {
  BackendListeningQuestionType,
  ListeningQuestionType,
  mapListeningApiTypeToUi,
  mapListeningUiTypeToApi,
} from "../ListeningContentEditorPage/types";
import {
  BackendReadingQuestionType,
  mapReadingApiTypeToUi,
  mapReadingUiTypeToApi,
  ReadingQuestionType,
} from "../ReadingContentEditorPage/types";
import {
  BackendWritingQuestionType,
  mapWritingApiTypeToUi,
  mapWritingUiTypeToApi,
  WritingQuestionType,
} from "../WritingContentEditorPage/types";

export type LocalDateTimeArray = [
  number, // year
  number, // month
  number, // day
  number, // hour
  number, // minute
  number, // second
  number, // nanosecond
];

export type skillTypes =
  | "LISTENING"
  | "READING"
  | "WRITING"
  | "SPEAKING"
  | string;

export type BackendQuestionType =
  | BackendListeningQuestionType
  | BackendReadingQuestionType
  | BackendWritingQuestionType;

export type UIQuestionType =
  | ListeningQuestionType
  | ReadingQuestionType
  | WritingQuestionType;

export function mapQuestionApiTypeToUi(
  skill: skillTypes,
  apiType: BackendQuestionType,
): UIQuestionType {
  switch (skill) {
    case "LISTENING":
      return mapListeningApiTypeToUi(apiType as BackendListeningQuestionType);
    case "READING":
      return mapReadingApiTypeToUi(apiType as BackendReadingQuestionType);
    case "WRITING":
      return mapWritingApiTypeToUi(apiType as BackendWritingQuestionType);
    default:
      throw new Error(`Unsupported skill: ${skill}`);
  }
}

export function mapQuestionUiTypeToApi(
  skill: skillTypes,
  type: UIQuestionType,
): BackendQuestionType {
  switch (skill) {
    case "LISTENING":
      return mapListeningUiTypeToApi(type as ListeningQuestionType);
    case "READING":
      return mapReadingUiTypeToApi(type as ReadingQuestionType);
    case "WRITING":
      return mapWritingUiTypeToApi(type as WritingQuestionType);
    default:
      throw new Error(`Unsupported skill: ${skill}`);
  }
}

export type GetAllPracticeSubmissionsByUserIdParams = {
  userId: string;
};

export type PracticeSubmissionByUserIdDTO = {
  id?: string;
  timeSpentSeconds?: number;
  submittedAt?: LocalDateTimeArray;
  score?: number;
  correctAnswerPercentage?: number;
  practiceContent?: PracticeSubmissionByUserIdPracticeContentDTO;
};

export type PracticeSubmissionByUserIdPracticeContentDTO = {
  title?: string;
  skill?: skillTypes;
};

export type PracticeSubmissionByUserId = {
  id: string;
  title: string;
  submittedAt: string;
  score: number;
  correctAnswerPercentage: number;
  timeTaken: string;
  skill: skillTypes;
};

export const PRACTICE_SUBMISSION_BY_USER_ID_DTO_INCLUDE_FIELDS = [
  "submittedat",
  "practicecontent.title",
  "score",
  "correctanswerpercentage",
  "timespentseconds",
  "practicecontent.skill",
] as const;

export const PRACTICE_SUBMISSION_BY_USER_ID_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_SUBMISSION_BY_USER_ID_DTO_INCLUDE_FIELDS.join(",");

export type DeletePracticeSubmissionByIdParams = {
  id: string;
};

export type PracticeSubmissionSummaryParams = {
  userId: string;
  days: number;
};

export type PracticeSubmissionSummaryPracticeContentDTO = {
  skill: skillTypes;
  title: string;
};

export type PracticeSubmissionQuestionTypeAccuracyDTO = {
  questionType: BackendQuestionType;
  correctAnswerPercentage: number;
};

export type PracticeSubmissionSummaryDTO = {
  id: string;
  timeSpentSeconds: number;
  submittedAt: LocalDateTimeArray;
  correctAnswerPercentage: number;
  correctAnswerCount: number;
  wrongAnswerCount: number;
  skipAnswerCount: number;
  practiceContent: PracticeSubmissionSummaryPracticeContentDTO;
  questionTypeAccuracies: PracticeSubmissionQuestionTypeAccuracyDTO[];
};

export type PracticeSubmissionSummaryPracticeContent = {
  skill: skillTypes;
  title: string;
};

export type PracticeSubmissionQuestionTypeAccuracy = {
  questionType: BackendQuestionType;
  correctAnswerPercentage: number;
};

export type PracticeSubmissionSummary = {
  id: string;
  timeSpentSeconds: number;
  submittedAt: LocalDateTimeArray;
  correctAnswerPercentage: number;
  correctAnswerCount: number;
  wrongAnswerCount: number;
  skipAnswerCount: number;
  practiceContent: PracticeSubmissionSummaryPracticeContent;
  questionTypeAccuracies: PracticeSubmissionQuestionTypeAccuracy[];
};

export const PRACTICE_SUBMISSION_SUMMARY_INCLUDE_FIELDS = [
  "practicecontent.title",
  "practicecontent.skill",
  "submittedat",
  "correctanswerpercentage",
  "correctanswercount",
  "wronganswercount",
  "skipanswercount",
  "timespentseconds",
  "questiontypeaccuracies.questiontype",
  "questiontypeaccuracies.correctanswerpercentage",
] as const;

export const PRACTICE_SUBMISSION_SUMMARY_INCLUDE_FIELDS_QUERY =
  PRACTICE_SUBMISSION_SUMMARY_INCLUDE_FIELDS.join(",");

export type UserTargetBandParams = {
  userId: string;
};

export type UserTargetBandDTO = {
  userId: string;
  targetListeningBand: number;
  targetReadingBand: number;
  targetWritingBand: number;
  targetSpeakingBand: number;
};

export type UserTargetBand = UserTargetBandDTO;

export const USER_TARGET_BAND_DTO_INCLUDE_FIELDS = [
  "targetlisteningband",
  "targetreadingband",
  "targetwritingband",
  "targetspeakingband",
] as const;

export const USER_TARGET_BAND_DTO_INCLUDE_FIELDS_QUERY =
  USER_TARGET_BAND_DTO_INCLUDE_FIELDS.join(",");

export type UpdateUserTargetBandByIdParams = {
  userId: string;
};

export type UpdateUserTargetBandByIdBody = {
  targetListeningBand: number;
  targetReadingBand: number;
  targetWritingBand: number;
  targetSpeakingBand: number;
};

export type UpdateUserTargetBandByIdResponseDTO = {
  userId: string;
};

export type UpdateUserTargetBandByIdResponse =
  UpdateUserTargetBandByIdResponseDTO;
