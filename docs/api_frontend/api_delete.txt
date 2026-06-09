import { API_BASE } from "../../../env";
import { useApiDeleteByParams } from "../../../utils/api";
import { DeleteAvatarBody, DeleteAvatarParams } from "../types";

const initialParams: DeleteAvatarParams = {};

const initialBody: DeleteAvatarBody = {
  fileUrl: "",
};

export function useDeleteAvatar(
  params?: DeleteAvatarParams,
  body?: DeleteAvatarBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: deletedAvatar,
    setItem: setDeletedAvatar,
    loading,
    error,
    remove,
  } = useApiDeleteByParams<null, null, DeleteAvatarParams, DeleteAvatarBody>({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: "/api/files/avatars",
        body: defaultBody,
      };
    },
    initialItem: null,
    mapItem: () => null,
  });

  return {
    deletedAvatar,
    setDeletedAvatar,
    loading,
    error,
    remove,
  };
}
