import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  PracticeContent,
  PracticeContentDTO,
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapPracticeContentDTOToPracticeContent(
  dto: PracticeContentDTO,
): PracticeContent {
  return {
    id: dto.id ?? "",
    title: dto.title ?? "",
    skill: dto.skill ?? "",
    instructionsParsed: dto.instructionsParsed ?? "",
    task: dto.task ?? "",
  };
}

const initialPracticeContent: PracticeContent = {
  id: "",
  title: "",
  skill: "",
  instructionsParsed: "",
  task: "",
};

export function useGetPracticeContent(practiceContentId: string) {
  const {
    item: practiceContent,
    setItem: setPracticeContent,
    loading,
    error,
    get,
  } = useApiGet<PracticeContentDTO, PracticeContent>({
    request: {
      apiBase: API_BASE,
      path: `/api/practice-content/${practiceContentId}`,
      include: PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialPracticeContent,
    mapItem: mapPracticeContentDTOToPracticeContent,
  });

  return {
    practiceContent,
    setPracticeContent,
    loading,
    error,
    get,
  };
}
