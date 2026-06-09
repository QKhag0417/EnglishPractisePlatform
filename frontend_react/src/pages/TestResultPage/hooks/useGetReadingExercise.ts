import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  ReadingExercise,
  PracticeReadingContentDTO,
  PRACTICE_READING_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeReadingContentDTOToReadingExercise(
  dto: PracticeReadingContentDTO,
): ReadingExercise {
  return {
    id: dto.id ?? "",
    instructionsParsed: dto.instructionsParsed ?? "",
    passageParsed: dto.passageParsed ?? "",
  };
}

const initialReadingExercise: ReadingExercise = {
  id: "",
  instructionsParsed: "",
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
