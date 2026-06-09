export type TutorStatus = "PENDING" | "IN_REVIEW" | "COMPLETED";

export type LocalDateTimeArray = [
  number, // year
  number, // month
  number, // day
  number, // hour
  number, // minute
  number, // second
  number, // nanosecond
];

export type PracticeSubmissionParams = Record<string, never>;

export type PracticeSubmissionUserDTO = {
  firstname: string;
  lastname: string;
  email: string;
};

export type PracticeSubmissionPracticeContentDTO = {
  skill: "LISTENING" | "READING" | "WRITING" | "SPEAKING" | string;
  task: "TASK_1" | "TASK_2" | "TASK_3" | "TASK_4" | string;
  title: string;
};

export type PracticeSubmissionDTO = {
  id: string;
  submittedAt: LocalDateTimeArray;
  timeSpentSeconds: number;
  tutorStatus: TutorStatus;
  user: PracticeSubmissionUserDTO;
  practiceContent: PracticeSubmissionPracticeContentDTO;
};

export type PracticeSubmission = {
  id: string;
  studentName: string;
  studentEmail: string;
  skill: "Listening" | "Reading" | "Writing" | "Speaking";
  task: string;
  title: string;
  submittedAt: string;
  timeTaken: string;
  tutorStatus: TutorStatus;
};

export const PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS = [
  "user.lastname",
  "user.firstname",
  "user.email",
  "practicecontent.skill",
  "practicecontent.task",
  "practicecontent.title",
  "submittedat",
  "timespentseconds",
  "tutorstatus",
] as const;

export const PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY =
  PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS.join(",");

export type GetAllTutorUserPracticeSubmissionsByTutorIdParams = {
  tutorId: string;
};

export type TutorUserPracticeSubmissionStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "COMPLETED"
  | string;

export type TutorUserPracticeSubmissionDTO = {
  id: string;
  userPracticeSubmissionId: string;
  tutorStatus: TutorUserPracticeSubmissionStatus;
};

export type TutorUserPracticeSubmission = {
  id: string;
  userPracticeSubmissionId: string;
  tutorStatus: TutorUserPracticeSubmissionStatus;
};

export const TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS = [
  "userpracticesubmissionid",
  "tutorStatus",
] as const;

export const TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS_QUERY =
  TUTOR_USER_PRACTICE_SUBMISSION_DTO_INCLUDE_FIELDS.join(",");
