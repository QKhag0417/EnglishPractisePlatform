export interface Option {
  id: string;
  text: string;
  feedback: string;
  isCorrect: boolean;
}

export type QuestionType =
  | "mcq-single"
  | "mcq-multiple"
  | "short-text"
  | "written-response";

export interface Question {
  id?: string;            // DB id (chỉ có khi BE trả về)
  tempId: string;
  number: number;
  type: "Short Text" | "MCQ - Single" | "MCQ - Multiple" | "Written Response";
  points: number;
  correctAnswer: string;

  questionType: QuestionType;
  questionText: string;
  correctAnswers: string[];
  explanation: string;
}

export type UploadValue = File | string | null;

export const DEFAULT_OPTIONS: Option[] = [
  { id: "1", text: "", feedback: "", isCorrect: false },
  { id: "2", text: "", feedback: "", isCorrect: false },
  { id: "3", text: "", feedback: "", isCorrect: false },
  { id: "4", text: "", feedback: "", isCorrect: false },
];