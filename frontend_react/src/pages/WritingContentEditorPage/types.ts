export type WritingQuestionType =
  | "Line Graph"
  | "Bar Chart"
  | "Pie Chart"
  | "Table"
  | "Process Diagram"
  | "Map"
  | "Mixed Visuals"
  | "Agree-Disagree"
  | "Opinion"
  | "Discussion"
  | "Problem-Solution"
  | "Advantages-Disadvantages"
  | "Two-part Question";

export type BackendWritingQuestionType =
  | "LINE_GRAPH"
  | "BAR_CHART"
  | "PIE_CHART"
  | "TABLE"
  | "PROCESS_DIAGRAM"
  | "MAP"
  | "MIXED_VISUALS"
  | "AGREE_DISAGREE"
  | "OPINION"
  | "DISCUSSION"
  | "PROBLEM_SOLUTION"
  | "ADVANTAGES_DISADVANTAGES"
  | "TWO_PART_QUESTION";

export function mapWritingApiTypeToUi(
  apiType: BackendWritingQuestionType,
): WritingQuestionType {
  switch (apiType) {
    case "LINE_GRAPH":
      return "Line Graph";
    case "BAR_CHART":
      return "Bar Chart";
    case "PIE_CHART":
      return "Pie Chart";
    case "TABLE":
      return "Table";
    case "PROCESS_DIAGRAM":
      return "Process Diagram";
    case "MAP":
      return "Map";
    case "MIXED_VISUALS":
      return "Mixed Visuals";
    case "AGREE_DISAGREE":
      return "Agree-Disagree";
    case "OPINION":
      return "Opinion";
    case "DISCUSSION":
      return "Discussion";
    case "PROBLEM_SOLUTION":
      return "Problem-Solution";
    case "ADVANTAGES_DISADVANTAGES":
      return "Advantages-Disadvantages";
    case "TWO_PART_QUESTION":
      return "Two-part Question";
    default:
      return "Line Graph";
  }
}

export function mapWritingUiTypeToApi(
  type: WritingQuestionType,
): BackendWritingQuestionType {
  switch (type) {
    case "Line Graph":
      return "LINE_GRAPH";
    case "Bar Chart":
      return "BAR_CHART";
    case "Pie Chart":
      return "PIE_CHART";
    case "Table":
      return "TABLE";
    case "Process Diagram":
      return "PROCESS_DIAGRAM";
    case "Map":
      return "MAP";
    case "Mixed Visuals":
      return "MIXED_VISUALS";
    case "Agree-Disagree":
      return "AGREE_DISAGREE";
    case "Opinion":
      return "OPINION";
    case "Discussion":
      return "DISCUSSION";
    case "Problem-Solution":
      return "PROBLEM_SOLUTION";
    case "Advantages-Disadvantages":
      return "ADVANTAGES_DISADVANTAGES";
    case "Two-part Question":
      return "TWO_PART_QUESTION";
    default:
      return "LINE_GRAPH";
  }
}

export type UploadValue = File | string | null;
