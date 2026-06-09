import { API_BASE } from "../../../env";
import { useApiDeleteByParams } from "../../../utils/api";
import { DeletePracticeSubmissionByIdParams } from "../types";

const initialParams: DeletePracticeSubmissionByIdParams = {
  id: "",
};

export function useDeletePracticeSubmissionById(
  params?: DeletePracticeSubmissionByIdParams,
) {
  const defaultParams = params ?? initialParams;

  const {
    item: deletedPracticeSubmission,
    setItem: setDeletedPracticeSubmission,
    loading,
    error,
    remove,
  } = useApiDeleteByParams<null, null, DeletePracticeSubmissionByIdParams>({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/practice-submission/${resolvedParams.id}`,
      };
    },
    initialItem: null,
    mapItem: () => null,
  });

  return {
    deletedPracticeSubmission,
    setDeletedPracticeSubmission,
    loading,
    error,
    remove,
  };
}
