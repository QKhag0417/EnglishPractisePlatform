import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  ListeningExercise,
  PracticeListeningContentDTO,
  PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapTask(task: string): number {
  const match = task.match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

function mapPracticeListeningContentDTOToListeningExercise(
  dto: PracticeListeningContentDTO,
): ListeningExercise {
  return {
    id: dto.id ?? "",
    skill: "listening",
    task: mapTask(dto.task),
    duration: dto.durationMinutes ?? 0,
    examText: dto.instructionsParsed ?? "",
    totalQuestions: dto.questionCount ?? 0,
    audioUrl: dto.audioUrl ?? "",
  };
}

const initialListeningExercise: ListeningExercise = {
  id: "",
  skill: "listening",
  task: -1,
  duration: 0,
  examText: "",
  totalQuestions: 0,
  audioUrl: "",
};

export function useGetListeningExercise(exerciseId: string) {
  const {
    item: exercise,
    setItem: setExercise,
    loading,
    error,
    get,
  } = useApiGet<PracticeListeningContentDTO, ListeningExercise>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-content/${exerciseId}`,
      include: PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialListeningExercise,
    mapItem: mapPracticeListeningContentDTOToListeningExercise,
  });

  return {
    exercise,
    setExercise,
    loading,
    error,
    get,
  };
}
