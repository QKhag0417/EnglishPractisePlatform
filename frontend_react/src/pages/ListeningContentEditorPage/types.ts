
export type QuestionType =
  | "Multiple Choice"
  | "Matching"
  | "Plan Labelling"
  | "Map Labelling"
  | "Diagram Labelling"
  | "Form Completion"
  | "Note Completion"
  | "Table Completion"
  | "Flow-chart Completion"
  | "Summary Completion"
  | "Sentence Completion"
  | "Short-answer Questions";

/**
 * Backend -> UI
 */
export function mapApiTypeToUi(apiType: string): QuestionType {
  switch (apiType) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";
    case "MATCHING":
      return "Matching";
    case "PLAN_LABELLING":
      return "Plan Labelling";
    case "MAP_LABELLING":
      return "Map Labelling";
    case "DIAGRAM_LABELLING":
      return "Diagram Labelling";
    case "FORM_COMPLETION":
      return "Form Completion";
    case "NOTE_COMPLETION":
      return "Note Completion";
    case "TABLE_COMPLETION":
      return "Table Completion";
    case "FLOW_CHART_COMPLETION":
      return "Flow-chart Completion";
    case "SUMMARY_COMPLETION":
      return "Summary Completion";
    case "SENTENCE_COMPLETION":
      return "Sentence Completion";
    case "SHORT_ANSWER_QUESTIONS":
      return "Short-answer Questions";
    default:
      return "Multiple Choice";
  }
}

/**
 * UI -> Backend
 */
export function mapUiTypeToApi(type: QuestionType) {
  switch (type) {
    case "Multiple Choice":
      return "MULTIPLE_CHOICE";
    case "Matching":
      return "MATCHING";
    case "Plan Labelling":
      return "PLAN_LABELLING";
    case "Map Labelling":
      return "MAP_LABELLING";
    case "Diagram Labelling":
      return "DIAGRAM_LABELLING";
    case "Form Completion":
      return "FORM_COMPLETION";
    case "Note Completion":
      return "NOTE_COMPLETION";
    case "Table Completion":
      return "TABLE_COMPLETION";
    case "Flow-chart Completion":
      return "FLOW_CHART_COMPLETION";
    case "Summary Completion":
      return "SUMMARY_COMPLETION";
    case "Sentence Completion":
      return "SENTENCE_COMPLETION";
    case "Short-answer Questions":
      return "SHORT_ANSWER_QUESTIONS";
  }
}


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

