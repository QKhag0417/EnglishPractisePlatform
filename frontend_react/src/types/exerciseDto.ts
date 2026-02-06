export type ExerciseDto = {
  id: string;
  title: string;
  thumbnailUrl?: string;
  task?: string;
  questionTypeTags?: string[];
  topicTags?: string[];
  status?: string;
  updatedOn?: number[];
  questionCount?: number;
  durationMinutes?: number;
};
