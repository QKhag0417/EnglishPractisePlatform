// usePostUserAnswer.ts
import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type { UserAnswerDTO, UserAnswer, UserAnswerPostBody } from "../types";

const initialBody: UserAnswerPostBody = {
  userPracticeSubmissionId: "",
  orderIndex: "",
  answers: [],
};

const initialUserAnswer: UserAnswer = {
  userAnswerId: "",
};

function mapUserAnswerDTOToUserAnswer(dto: UserAnswerDTO): UserAnswer {
  return {
    userAnswerId: dto.userAnswerId ?? "",
  };
}

export function usePostUserAnswer(params?: UserAnswerPostBody) {
  const body = params ?? initialBody;

  const {
    item: userAnswer,
    setItem: setUserAnswer,
    loading,
    error,
    post,
  } = useApiPost<UserAnswerDTO, UserAnswer, UserAnswerPostBody>({
    request: {
      apiBase: API_BASE,
      path: "/api/practice-submission-answer",
      body,
    },
    initialItem: initialUserAnswer,
    mapItem: mapUserAnswerDTOToUserAnswer,
  });

  return {
    userAnswer,
    setUserAnswer,
    loading,
    error,
    post,
  };
}
