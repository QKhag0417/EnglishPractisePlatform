export type ExerciseMetadata = {
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

export const mockExercises: ExerciseMetadata[] = [
  {
    id: "1",
    title: "Transport survey",
    attempts: "8k attempts",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400",
    task: [1],
    questionTypes: ["Multiple Choice", "Gap Filling"],
    topics: ["Transport"],
    status: "published",
    updated: "2024-03-15",
    questions: 10,
    duration: 15,
  },
  {
    id: "2",
    title: "Advice on Holidays",
    attempts: "4k attempts",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    task: [2],
    questionTypes: ["Matching"],
    topics: ["Travel/Tourism"],
    status: "published",
    updated: "2024-03-14",
    questions: 10,
    duration: 15,
  },
  {
    id: "3",
    title: "Housing development",
    attempts: "5k attempts",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    task: [3],
    questionTypes: ["Map and Plan Labeling"],
    topics: ["Social", "Accommodation"],
    status: "published",
    updated: "2024-03-13",
    questions: 10,
    duration: 15,
  },
  {
    id: "4",
    title: "Traffic Issues",
    attempts: "5k attempts",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
    task: [4],
    questionTypes: ["Multiple Choice", "Pick from a list"],
    topics: ["Transport"],
    status: "published",
    updated: "2024-03-12",
    questions: 10,
    duration: 15,
  },
  {
    id: "5",
    title: "Working as an volunteer",
    attempts: "3k attempts",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
    task: [1],
    questionTypes: ["Gap Filling"],
    topics: ["Work/Careers", "Social"],
    status: "published",
    updated: "2024-03-11",
    questions: 10,
    duration: 15,
  },
  {
    id: "6",
    title: "Power of Media",
    attempts: "4k attempts",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400",
    task: [2],
    questionTypes: ["Multiple Choice", "Matching"],
    topics: ["Culture & Arts"],
    status: "published",
    updated: "2024-03-10",
    questions: 10,
    duration: 15,
  },
];
