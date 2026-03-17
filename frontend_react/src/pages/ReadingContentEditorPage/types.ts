
export type QuestionType =
  | "Multiple Choice"
  | "Identifying Information (True/False/Not Given)"
  | "Identifying Writer's Views/Claims (Yes/No/Not Given)"
  | "Matching Information"
  | "Matching Headings"
  | "Matching Features"
  | "Matching Sentence Endings"
  | "Sentence Completion"
  | "Summary Completion"
  | "Note Completion"
  | "Table Completion"
  | "Flow-chart Completion"
  | "Diagram Label Completion"
  | "Short-answer Questions";

/**
 * Backend -> UI
 */
export function mapApiTypeToUi(apiType: string): QuestionType {
  switch (apiType) {
      case "MULTIPLE_CHOICE":
        return "Multiple Choice";
      case "IDENTIFYING_INFORMATION_TRUE_FALSE_NOT_GIVEN":
        return "Identifying Information (True/False/Not Given)";
      case "IDENTIFYING_WRITERS_VIEWS_CLAIMS_YES_NO_NOT_GIVEN":
        return "Identifying Writer's Views/Claims (Yes/No/Not Given)";
      case "MATCHING_INFORMATION":
        return "Matching Information";
      case "MATCHING_HEADINGS":
        return "Matching Headings";
      case "MATCHING_FEATURES":
        return "Matching Features";
      case "MATCHING_SENTENCE_ENDINGS":
        return "Matching Sentence Endings";
      case "SENTENCE_COMPLETION":
        return "Sentence Completion";
      case "SUMMARY_COMPLETION":
        return "Summary Completion";
      case "NOTE_COMPLETION":
        return "Note Completion";
      case "TABLE_COMPLETION":
        return "Table Completion";
      case "FLOW_CHART_COMPLETION":
        return "Flow-chart Completion";
      case "DIAGRAM_LABEL_COMPLETION":
        return "Diagram Label Completion";
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
      case "Identifying Information (True/False/Not Given)":
        return "IDENTIFYING_INFORMATION_TRUE_FALSE_NOT_GIVEN";
      case "Identifying Writer's Views/Claims (Yes/No/Not Given)":
        return "IDENTIFYING_WRITERS_VIEWS_CLAIMS_YES_NO_NOT_GIVEN";
      case "Matching Information":
        return "MATCHING_INFORMATION";
      case "Matching Headings":
        return "MATCHING_HEADINGS";
      case "Matching Features":
        return "MATCHING_FEATURES";
      case "Matching Sentence Endings":
        return "MATCHING_SENTENCE_ENDINGS";
      case "Sentence Completion":
        return "SENTENCE_COMPLETION";
      case "Summary Completion":
        return "SUMMARY_COMPLETION";
      case "Note Completion":
        return "NOTE_COMPLETION";
      case "Table Completion":
        return "TABLE_COMPLETION";
      case "Flow-chart Completion":
        return "FLOW_CHART_COMPLETION";
      case "Diagram Label Completion":
        return "DIAGRAM_LABEL_COMPLETION";
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

