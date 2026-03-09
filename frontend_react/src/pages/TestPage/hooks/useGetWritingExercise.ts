import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  WritingExercise,
  PracticeWritingContentDTO,
  PRACTICE_WRITING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapTask(task: string): number {
  const match = task.match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

function mapPracticeWritingContentDTOToWritingExercise(
  dto: PracticeWritingContentDTO,
): WritingExercise {
  return {
    id: dto.id ?? "",
    skill: "writing",
    task: mapTask(dto.task),
    duration: dto.durationMinutes ?? 0,
    examText: dto.instructionsParsed ?? "",
    totalQuestions: dto.questionCount ?? 0,
  };
}

const initialWritingExercise: WritingExercise = {
  id: "",
  skill: "writing",
  task: -1,
  duration: 0,
  examText: "",
  totalQuestions: 0,
};

export function useGetWritingExercise(exerciseId: string) {
  const {
    item: exercise,
    setItem: setExercise,
    loading,
    error,
    get,
  } = useApiGet<PracticeWritingContentDTO, WritingExercise>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-content/${exerciseId}`,
      include: PRACTICE_WRITING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialWritingExercise,
    mapItem: mapPracticeWritingContentDTOToWritingExercise,
  });

  return {
    exercise,
    setExercise,
    loading,
    error,
    get,
  };
}
