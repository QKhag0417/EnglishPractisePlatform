import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type {
  UserPracticeContentProgressAttemptIncrementDTO,
  UserPracticeContentProgressAttemptIncrement,
} from "../types";

const initialUserPracticeContentProgressAttemptIncrement: UserPracticeContentProgressAttemptIncrement =
  {
    userPracticeContentProgressId: "",
  };

function mapUserPracticeContentProgressAttemptIncrementDTOToUserPracticeContentProgressAttemptIncrement(
  dto: UserPracticeContentProgressAttemptIncrementDTO,
): UserPracticeContentProgressAttemptIncrement {
  return {
    userPracticeContentProgressId: dto.id ?? "",
  };
}

export function usePostUserPracticeContentProgressAttemptIncrement(
  userId: string,
  practiceContentId: string | number,
) {
  const {
    item: userPracticeContentProgressAttemptIncrement,
    setItem: setUserPracticeContentProgressAttemptIncrement,
    loading,
    error,
    post,
  } = useApiPost<
    UserPracticeContentProgressAttemptIncrementDTO,
    UserPracticeContentProgressAttemptIncrement,
    undefined
  >({
    request: {
      apiBase: API_BASE,
      path: `/api/user-practice-content-progress/user/${userId}/practice-content/${practiceContentId}/attempt-count/increment`,
    },
    initialItem: initialUserPracticeContentProgressAttemptIncrement,
    mapItem:
      mapUserPracticeContentProgressAttemptIncrementDTOToUserPracticeContentProgressAttemptIncrement,
  });

  return {
    userPracticeContentProgressAttemptIncrement,
    setUserPracticeContentProgressAttemptIncrement,
    loading,
    error,
    post,
  };
}
