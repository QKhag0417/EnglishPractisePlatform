import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  UserPracticeContentProgressGetDTO,
  UserPracticeContentProgressGet,
  USER_PRACTICE_CONTENT_PROGRESS_GET_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapUserPracticeContentProgressDTOsToUserPracticeContentProgresses(
  dtos: UserPracticeContentProgressGetDTO[],
): UserPracticeContentProgressGet[] {
  return (dtos ?? []).map((dto) => ({
    id: dto.id ?? "",
    practiceContentId: dto.practiceContentId ?? "",
    isBookmarked: dto.isBookmarked ?? false,
    attemptCount: dto.attemptCount ?? 0,
  }));
}

const initialUserPracticeContentProgresses: UserPracticeContentProgressGet[] =
  [];

export function useGetUserPracticeContentProgresses(userId: string) {
  const {
    item: progresses,
    setItem: setProgresses,
    loading,
    error,
    get,
  } = useApiGet<
    UserPracticeContentProgressGetDTO[],
    UserPracticeContentProgressGet[]
  >({
    request: {
      apiBase: API_BASE,
      path: `/api/user-practice-content-progress/user/${userId}`,
      include: USER_PRACTICE_CONTENT_PROGRESS_GET_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialUserPracticeContentProgresses,
    mapItem: mapUserPracticeContentProgressDTOsToUserPracticeContentProgresses,
  });

  return {
    progresses,
    setProgresses,
    loading,
    error,
    get,
  };
}
