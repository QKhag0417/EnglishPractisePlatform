import { API_BASE } from "../../../env";
import { useApiDeleteByParams } from "../../../utils/api";
import type {
  DeleteWritingCriterionFeedbackByIdBody,
  DeleteWritingCriterionFeedbackByIdParams,
} from "../types";

const initialParams: DeleteWritingCriterionFeedbackByIdParams = {
  writingCriterionFeedbackId: "",
};

const initialBody: DeleteWritingCriterionFeedbackByIdBody = {};

export function useDeleteWritingCriterionFeedbackById(
  params?: DeleteWritingCriterionFeedbackByIdParams,
  body?: DeleteWritingCriterionFeedbackByIdBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: deletedWritingCriterionFeedback,
    setItem: setDeletedWritingCriterionFeedback,
    loading,
    error,
    remove,
  } = useApiDeleteByParams<
    null,
    null,
    DeleteWritingCriterionFeedbackByIdParams,
    DeleteWritingCriterionFeedbackByIdBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-writing-criterion-feedback/${resolvedParams.writingCriterionFeedbackId}`,
        body: defaultBody,
      };
    },
    initialItem: null,
    mapItem: () => null,
  });

  return {
    deletedWritingCriterionFeedback,
    setDeletedWritingCriterionFeedback,
    loading,
    error,
    remove,
  };
}
