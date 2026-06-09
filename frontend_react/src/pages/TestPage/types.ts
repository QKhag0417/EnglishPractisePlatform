export type LocalDateTimeArray = [
  number, // year
  number, // month
  number, // day
  number, // hour
  number, // minute
  number, // second
  number, // nanosecond
];

export type Skill = "listening" | "reading" | "writing" | "speaking" | string;

export interface ExerciseInstruction {
  id: string;
  skill: Skill | string;
  title: string;
  timeInfo: string;
  candidateInstructions: string[];
  candidateInfo: string[];
}

export type UserAnswers = Record<number, string[]>;

export type TestState = "instruction" | "test" | "results";

export type ExerciseBase = {
  id: string;
  task: number;
  duration: number;
  examText: string;
  totalQuestions: number;
};

export type ListeningExercise = ExerciseBase & {
  skill: "listening";
  audioUrl: string;
};

export type ReadingExercise = ExerciseBase & {
  skill: "reading";
  passageParsed: string;
};

export type WritingExercise = ExerciseBase & {
  skill: "writing";
};

export type PracticeContentDTO = {
  id: string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  durationMinutes: number;
  instructionsParsed: string;
  questionCount: number;
};

export const PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "task",
  "durationMinutes",
  "instructionsParsed",
  "questionCount",
  "audioUrl",
] as const;

export const PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type PracticeListeningContentDTO = PracticeContentDTO & {
  audioUrl: string;
};

export const PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "task",
  "durationMinutes",
  "instructionsParsed",
  "questionCount",
  "passageParsed",
] as const;

export const PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type PracticeReadingContentDTO = PracticeContentDTO & {
  passageParsed: string;
};

export const PRACTICE_WRITING_CONTENT_DTO_INCLUDE_FIELDS = [
  "id",
  "task",
  "durationMinutes",
  "instructionsParsed",
] as const;

export const PRACTICE_WRITING_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_WRITING_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type PracticeWritingContentDTO = PracticeContentDTO;

export type ExerciseAnswer = {
  id: string;
  correctAnswers: Record<number, string | string[]>;
};

export type PracticeSubmissionDTO = {
  id: string;
};

export type PracticeSubmission = {
  practiceSubmissionId: string;
};

export type PracticeSubmissionPostBody = {
  userId: string;
  practiceContentId: string;
  timeSpentSeconds: number;
  learnerTestActivities: LearnerTestActivity[];
};

export type UserAnswerDTO = {
  userAnswerId: string;
};

export type UserAnswer = {
  userAnswerId: string;
};

export type UserAnswerPostBody = {
  userPracticeSubmissionId: string;
  orderIndex: string;
  answers: string[];
};

export type BulkSubmissionAnswerRowPostBody = {
  orderIndex: number;
  answers: string[];
};

export type BulkSubmissionAnswerPostBody = {
  userPracticeSubmissionId: string;
  answers: BulkSubmissionAnswerRowPostBody[];
};

export type BulkSubmissionAnswerRowDTO = {
  id?: string;
};

export type BulkSubmissionAnswerResponseDTO = BulkSubmissionAnswerRowDTO[];

export type BulkSubmissionAnswerResponse = {
  ids: string[];
};

export type UserPracticeWritingAnswerDTO = {
  id: string;
};

export type UserPracticeWritingAnswer = {
  userPracticeWritingAnswerId: string;
};

export type UserPracticeWritingAnswerPostBody = {
  userPracticeSubmissionId: string;
  orderIndex: string;
  essayText: string;
};

export type UserPracticeContentProgressAttemptIncrementDTO = {
  id: string;
};

export type UserPracticeContentProgressAttemptIncrement = {
  userPracticeContentProgressId: string;
};

export type LearnerTestActivityType =
  | "GAP_FOCUS"
  | "GAP_INPUT"
  | "GAP_BLUR"
  | "MCQ_SELECT"
  | "MCQ_DESELECT"
  | "TEST_START"
  | "TEST_SUBMIT";

export type LogActivityInput = {
  activityType: LearnerTestActivityType;
  questionNumber?: number;
  value?: string;
};

export type LearnerTestActivity = LogActivityInput & {
  offsetMs: number;
};

// =========================
// Create Writing AI Feedback
// =========================

export type CreateWritingAIFeedbackRequestBody = {
  submissionId: string;
};

export type CreateWritingAIFeedbackResponseDTO = {
  status: string;
  message: string;
  data: string;
};

export type CreateWritingAIFeedback = {
  submissionId: string;
};
