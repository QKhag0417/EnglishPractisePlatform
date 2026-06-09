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
  isTutorReviewRequested: boolean;
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
  "isTutorReviewRequested",
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

export type SubmissionFeedbackAuthorDTO = {
  firstname: string;
  lastname: string;
  avatarUrl: string;
};

export type SubmissionFeedbackDTO = {
  id: string;
  feedbackContent: string;
  updatedAt: LocalDateTimeArray;
  author: SubmissionFeedbackAuthorDTO;
};

export type SubmissionFeedback = SubmissionFeedbackDTO;

export const SUBMISSION_FEEDBACK_DTO_INCLUDE_FIELDS = [
  "feedbackContent",
  "author.firstname",
  "author.lastname",
  "author.avatarUrl",
  "updatedAt",
] as const;

export const SUBMISSION_FEEDBACK_DTO_INCLUDE_FIELDS_QUERY =
  SUBMISSION_FEEDBACK_DTO_INCLUDE_FIELDS.join(",");

export type AuthorType = "TUTOR" | "AI" | string;

export interface CreatedSubmissionFeedback {
  id: string;
}

export type CreateSubmissionFeedbackResponseDTO = {
  id: string;
};

export type CreateSubmissionFeedbackRequestBody = {
  submissionId: string;
  authorId: string;
  authorType: AuthorType;
  feedbackContent: string;
};

export type UpdatePracticeSubmissionByIdParams = {
  practiceSubmissionId: string;
};

export type UpdatePracticeSubmissionByIdBody = {
  isTutorReviewRequested: boolean;
};

export type UpdatePracticeSubmissionByIdResponseDTO = {
  id: string;
};

export type UpdatePracticeSubmissionByIdResponse = {
  id: string;
};

export type ListeningExercise = {
  id: string;
  instructionsParsed: string;
  audioUrl: string;
  transcriptParsed: string;
};

export type PracticeListeningContentDTO = {
  id: string;
  instructionsParsed: string;
  audioUrl: string;
  transcriptParsed: string;
};

export const PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS = [
  "instructionsParsed",
  "audioUrl",
  "transcriptParsed",
] as const;

export const PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type ReadingExercise = {
  id: string;
  instructionsParsed: string;
  passageParsed: string;
};

export type PracticeReadingContentDTO = {
  id: string;
  instructionsParsed: string;
  passageParsed: string;
};

export const PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS = [
  "instructionsParsed",
  "passageParsed",
] as const;

export const PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS.join(",");

export type GetTutorUserPracticeSubmissionByTutorIdAndSubmissionIdParams = {
  tutorId: string;
  submissionId: string;
};

export type TutorStatus = "PENDING" | "IN_REVIEW" | "COMPLETED" | string;

export type TutorUserPracticeSubmissionDTO = {
  id: string;
  tutorStatus: TutorStatus;
};

export type TutorUserPracticeSubmission = {
  id: string;
  tutorStatus: TutorStatus;
};

export const TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS = [
  "tutorStatus",
] as const;

export const TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY =
  TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS.join(",");

export type SetTutorStatusParams = {
  tutorId: string;
  submissionId: string;
};

export type SetTutorStatusBody = {
  tutorStatus: TutorStatus;
};

export type SetTutorStatusResponseDTO = {
  id: string;
};

export type SetTutorStatusResponse = {
  id: string;
};

// =========================
// Enum for Writing Feedback
// =========================

export type WritingCriterionType =
  | "TASK_ACHIEVEMENT" // Task 1 only
  | "TASK_RESPONSE" // Task 2 only
  | "COHERENCE_AND_COHESION"
  | "LEXICAL_RESOURCE"
  | "GRAMMATICAL_RANGE_AND_ACCURACY";

export type WritingFeedbackLabel =
  // Strength labels
  // Task Response / Task Achievement
  | "FULL_TASK_COVERAGE"
  | "CLEAR_POSITION"
  | "CONSISTENT_POSITION"
  | "RELEVANT_IDEAS"
  | "GOOD_IDEA_DEVELOPMENT"
  | "ADEQUATE_SUPPORT"
  | "APPROPRIATE_FORMAT"
  | "SUFFICIENT_LENGTH"

  // Task 1
  | "CLEAR_OVERVIEW"
  | "GOOD_KEY_FEATURE_SELECTION"
  | "GOOD_DATA_SUPPORT"

  // Task 2
  | "CLEAR_CONCLUSION"

  // Coherence & cohesion
  | "LOGICAL_ORGANISATION"
  | "CLEAR_PROGRESSION"
  | "EFFECTIVE_PARAGRAPHING"
  | "EFFECTIVE_COHESIVE_DEVICES"
  | "NATURAL_LINKER_USE"
  | "GOOD_REFERENCE_USE"
  | "MINIMAL_REPETITION"
  | "CLEAR_PARAGRAPH_FOCUS"

  // Lexical resource
  | "VARIED_VOCABULARY"
  | "PRECISE_VOCABULARY"
  | "APPROPRIATE_WORD_CHOICE"
  | "GOOD_COLLOCATION"
  | "APPROPRIATE_STYLE"
  | "GOOD_SPELLING"
  | "GOOD_WORD_FORMATION"
  | "NATURAL_LANGUAGE_USE"

  // Grammar
  | "VARIED_SENTENCE_STRUCTURES"
  | "GOOD_COMPLEX_STRUCTURE_USE"
  | "GRAMMAR_WELL_CONTROLLED"
  | "GOOD_PUNCTUATION"
  | "WELL_FORMED_SENTENCES"

  // Weakness labels
  // Task Response / Task Achievement
  | "PARTIAL_TASK_COVERAGE"
  | "UNCLEAR_POSITION"
  | "INCONSISTENT_POSITION"
  | "IRRELEVANT_IDEAS"
  | "INSUFFICIENT_IDEA_DEVELOPMENT"
  | "INSUFFICIENT_SUPPORT"
  | "INAPPROPRIATE_FORMAT"
  | "UNDER_LENGTH_RESPONSE"

  // Task 1
  | "MISSING_OVERVIEW"
  | "MISSING_KEY_FEATURES"
  | "INSUFFICIENT_DATA_SUPPORT"

  // Task 2
  | "WEAK_CONCLUSION"

  // Coherence & cohesion
  | "WEAK_ORGANISATION"
  | "UNCLEAR_PROGRESSION"
  | "WEAK_PARAGRAPHING"
  | "MISUSED_COHESIVE_DEVICES"
  | "OVERUSE_OF_LINKERS"
  | "UNCLEAR_REFERENCING"
  | "REPETITION"
  | "UNCLEAR_PARAGRAPH_FOCUS"

  // Lexical resource
  | "LIMITED_VOCABULARY"
  | "IMPRECISE_VOCABULARY"
  | "INAPPROPRIATE_WORD_CHOICE"
  | "WEAK_COLLOCATION"
  | "STYLE_INAPPROPRIATE"
  | "SPELLING_ERRORS"
  | "WORD_FORMATION_ERRORS"
  | "MEMORISED_LANGUAGE_OVERUSE"

  // Grammar
  | "LIMITED_GRAMMATICAL_RANGE"
  | "FAULTY_COMPLEX_SENTENCES"
  | "GRAMMAR_ERRORS"
  | "PUNCTUATION_ERRORS"
  | "SENTENCE_FRAGMENT_OR_RUN_ON";

export type FeedbackAuthorType = "TUTOR" | "AI";

export type WritingFeedbackType = "STRENGTH" | "WEAKNESS";

// =========================
// Create Writing Feedback
// =========================

export type CreateWritingCriterionFeedbackRequestBody = {
  authorType: FeedbackAuthorType;
  criterionName: WritingCriterionType;
  feedbackType: WritingFeedbackType;
  label: WritingFeedbackLabel;
  description: string;
  explanation: string;
  evidenceSentences: string[];
  recommendedActionDescription: string;
  recommendedActionExplanation: string;
  userPracticeWritingAnswerId: string;
  reviewedByUserId: string;
};

export type CreateWritingCriterionFeedbackResponseDTO = {
  id: string;
};

export type CreatedWritingCriterionFeedback = {
  id: string;
};

// =========================
// Get Writing Feedback By Submission Id
// =========================

export type WritingCriterionFeedbackReviewerDTO = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type WritingCriterionFeedbackReviewer = {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
};

export type WritingCriterionFeedbackBySubmissionItemDTO = {
  id: string;
  authorType: FeedbackAuthorType;
  criterionName: WritingCriterionType;
  feedbackType: WritingFeedbackType;
  label: WritingFeedbackLabel;
  description: string;
  explanation: string;
  evidenceSentences: string[];
  recommendedActionDescription: string;
  recommendedActionExplanation: string;
  reviewedByUser: WritingCriterionFeedbackReviewerDTO;
};

export type WritingCriterionFeedbackBySubmissionItem = {
  id: string;
  authorType: FeedbackAuthorType;
  criterionName: WritingCriterionType;
  feedbackType: WritingFeedbackType;
  label: WritingFeedbackLabel;
  description: string;
  explanation: string;
  evidenceSentences: string[];
  recommendedActionDescription: string;
  recommendedActionExplanation: string;
  reviewedByUser: WritingCriterionFeedbackReviewer;
};

export type WritingCriterionFeedbackBySubmissionParams = {
  submissionId: string;
};

export const WRITING_CRITERION_FEEDBACK_BY_SUBMISSION_DTO_INCLUDE_FIELDS = [
  "criterionname",
  "authortype",
  "feedbacktype",
  "label",
  "description",
  "explanation",
  "evidencesentences",
  "recommendedactiondescription",
  "recommendedactionexplanation",
  "reviewedbyuser.userid",
  "reviewedbyuser.email",
  "reviewedbyuser.firstname",
  "reviewedbyuser.lastname",
] as const;

export const WRITING_CRITERION_FEEDBACK_BY_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY =
  WRITING_CRITERION_FEEDBACK_BY_SUBMISSION_DTO_INCLUDE_FIELDS.join(",");

// =========================
// Update Writing Feedback By Id
// =========================

export type UpdateWritingCriterionFeedbackByIdParams = {
  writingCriterionFeedbackId: string;
};

export type UpdateWritingCriterionFeedbackByIdBody = {
  label: WritingFeedbackLabel;
  description: string;
  explanation: string;
  evidenceSentences: string[];
  recommendedActionDescription: string;
  recommendedActionExplanation: string;
};

export type UpdateWritingCriterionFeedbackByIdResponseDTO = {
  id: string;
};

export type UpdateWritingCriterionFeedbackByIdResponse = {
  id: string;
};

// =========================
// Delete Writing Feedback By Id
// =========================

export type DeleteWritingCriterionFeedbackByIdParams = {
  writingCriterionFeedbackId: string;
};

export type DeleteWritingCriterionFeedbackByIdBody = {};

// =========================
// Tutor Score
// =========================

export type TutorScore = {
  criterion: WritingCriterionType;
  score: string;
};

// =========================
// Get All Tutor Band Score By Writing Id
// =========================

export type WritingReviewBandScoreParams = {
  writingAnswerId: string;
};

export type WritingReviewBandScoreDTO = {
  id: string;
  overallTutorBand: number;
  tutorTaskResponseBand: number;
  tutorTaskAchievementBand: number;
  tutorCoherenceAndCohesionBand: number;
  tutorLexicalResourceBand: number;
  tutorGrammaticalRangeAndAccuracyBand: number;
  reviewedByUser: {
    userId: string;
    email: string;
    firstname: string;
    lastname: string;
  };
};

export type WritingReviewBandScore = {
  id: string;
  overallTutorBand: number;
  tutorTaskResponseBand: number;
  tutorTaskAchievementBand: number;
  tutorCoherenceAndCohesionBand: number;
  tutorLexicalResourceBand: number;
  tutorGrammaticalRangeAndAccuracyBand: number;
  reviewedByUser: {
    userId: string;
    email: string;
    firstname: string;
    lastname: string;
  };
};

export const WRITING_REVIEW_BAND_SCORE_DTO_INCLUDE_FIELDS = [
  "overallTutorBand",
  "tutorTaskResponseBand",
  "tutorTaskAchievementBand",
  "tutorCoherenceAndCohesionBand",
  "tutorLexicalResourceBand",
  "tutorGrammaticalRangeAndAccuracyBand",
  "reviewedByUser.userId",
  "reviewedByUser.email",
  "reviewedByUser.firstname",
  "reviewedByUser.lastname",
] as const;

export const WRITING_REVIEW_BAND_SCORE_DTO_INCLUDE_FIELDS_QUERY =
  WRITING_REVIEW_BAND_SCORE_DTO_INCLUDE_FIELDS.join(",");

// =========================
// Upsert Tutor Band Score
// =========================

export type UpsertTutorBandScoreParams = {
  reviewedByUserId: string;
  writingAnswerId: string;
};

export type UpsertTutorBandScoreBody = {
  tutorTaskAchievementBand: number;
  tutorTaskResponseBand: number;
  tutorCoherenceAndCohesionBand: number;
  tutorLexicalResourceBand: number;
  tutorGrammaticalRangeAndAccuracyBand: number;
};

export type UpsertTutorBandScoreResponseDTO = {
  id: string;
};

export type UpsertTutorBandScoreResponse = {
  id: string;
};
