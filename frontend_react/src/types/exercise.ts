export type Exercise = {
  id: string;
  title: string;
  attempts: string;
  image: string;
  task: number[];
  questionTypes: string[];
  topics: string[];
  status: "draft" | "published";
  updated: string;
  questions: number;
  duration: number;
};
