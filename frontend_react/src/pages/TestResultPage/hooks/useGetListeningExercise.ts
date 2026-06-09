import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  ListeningExercise,
  PracticeListeningContentDTO,
  PRACTICE_LISTENING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeListeningContentDTOToListeningExercise(
  dto: PracticeListeningContentDTO,
): ListeningExercise {
  return {
    id: dto.id ?? "",
    instructionsParsed: dto.instructionsParsed ?? "",
    audioUrl: dto.audioUrl ?? "",
    transcriptParsed: dto.transcriptParsed ?? "",
  };
}

const initialListeningExercise: ListeningExercise = {
  id: "",
  instructionsParsed: "",
  audioUrl: "",
  transcriptParsed: "",
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
