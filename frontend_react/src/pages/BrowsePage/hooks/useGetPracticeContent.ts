import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import { mapTopicTagApiToUi } from "../../ListeningContentEditorPage/types";
import { mapQuestionApiTypeToUi } from "../../MyProfilePage/types";
import {
  ExerciseMetadata,
  PracticeContentDTO,
  PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapTime(arr?: number[]): string {
  if (!arr || arr.length < 3) return "";

  const [y, m, d] = arr;

  const yyyy = String(y).padStart(4, "0");
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function mapTask(task: string): number {
  switch (task) {
    case "ALL":
      return 0;
    case "TASK_1":
      return 1;
    case "TASK_2":
      return 2;
    case "TASK_3":
      return 3;
    case "TASK_4":
      return 4;
    default:
      return 0;
  }
}

function mapPracticeContentDTOToExerciseMetadata(
  dto: PracticeContentDTO,
): ExerciseMetadata {
  return {
    id: dto.id ?? "",
    skill: dto.skill ?? "",
    title: dto.title ?? "",
    attempts: dto.attemptCount ?? 0,
    image: dto.thumbnailUrl ?? "",
    task: mapTask(dto.task),
    questionTypes:
      dto.questionTypeTags?.map((type) =>
        mapQuestionApiTypeToUi(dto.skill ?? "", type),
      ) ?? [],
    topics: dto.topicTags?.map(mapTopicTagApiToUi) ?? [],
    status: dto.status,
    updated: mapTime(dto.updatedOn),
    questions: dto.questionCount ?? 0,
    duration: dto.durationMinutes ?? 0,
  };
}

const initialExercises: ExerciseMetadata[] = [];

function mapPracticeContentDTOListToExerciseMetadataList(
  dtos: PracticeContentDTO[] | null,
): ExerciseMetadata[] {
  return (dtos ?? []).map(mapPracticeContentDTOToExerciseMetadata);
}

export function useGetPracticeContent() {
  const {
    item: exercises,
    setItem: setExercises,
    loading,
    error,
    get,
  } = useApiGet<PracticeContentDTO[], ExerciseMetadata[]>({
    request: {
      apiBase: API_BASE,
      path: "/api/practice-content",
      include: PRACTICE_CONTENT_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialExercises,
    mapItem: mapPracticeContentDTOListToExerciseMetadataList,
  });

  return {
    exercises,
    setExercises,
    loading,
    error,
    get,
  };
}
