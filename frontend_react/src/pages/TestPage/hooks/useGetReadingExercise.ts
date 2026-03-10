import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  PracticeReadingContentDTO,
  PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
  ReadingExercise,
} from "../types";

function mapTask(task: string): number {
  const match = task.match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

function mapPracticeReadingContentDTOToReadingExercise(
  dto: PracticeReadingContentDTO,
): ReadingExercise {
  return {
    id: dto.id ?? "",
    skill: "reading",
    task: mapTask(dto.task),
    duration: dto.durationMinutes ?? 0,
    examText: dto.instructionsParsed ?? "",
    totalQuestions: dto.questionCount ?? 0,
    passageParsed: dto.passageParsed ?? "",
  };
}

const initialReadingExercise: ReadingExercise = {
  id: "",
  skill: "reading",
  task: -1,
  duration: 0,
  examText: "",
  totalQuestions: 0,
  passageParsed: "",
};

export function useGetReadingExercise(exerciseId: string) {
  const {
    item: exercise,
    setItem: setExercise,
    loading,
    error,
    get,
  } = useApiGet<PracticeReadingContentDTO, ReadingExercise>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-content/${exerciseId}`,
      include: PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialReadingExercise,
    mapItem: mapPracticeReadingContentDTOToReadingExercise,
  });

  return {
    exercise,
    setExercise,
    loading,
    error,
    get,
  };
}
