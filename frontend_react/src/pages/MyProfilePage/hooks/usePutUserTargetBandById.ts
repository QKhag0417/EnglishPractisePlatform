import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpdateUserTargetBandByIdBody,
  UpdateUserTargetBandByIdParams,
  UpdateUserTargetBandByIdResponseDTO,
  UpdateUserTargetBandByIdResponse,
} from "../types";

const initialParams: UpdateUserTargetBandByIdParams = {
  userId: "",
};

const initialBody: UpdateUserTargetBandByIdBody = {
  targetListeningBand: 0,
  targetReadingBand: 0,
  targetWritingBand: 0,
  targetSpeakingBand: 0,
};

const initialUser: UpdateUserTargetBandByIdResponse = {
  userId: "",
};

function mapUpdateUserTargetBandByIdDTOToUser(
  dto: UpdateUserTargetBandByIdResponseDTO,
): UpdateUserTargetBandByIdResponse {
  return {
    userId: dto.userId ?? "",
  };
}

export function usePutUserTargetBandById(
  params?: UpdateUserTargetBandByIdParams,
  body?: UpdateUserTargetBandByIdBody,
) {
  const defaultParams = params ?? initialParams;
  const defaultBody = body ?? initialBody;

  const {
    item: user,
    setItem: setUser,
    loading,
    error,
    put,
  } = useApiPutByParams<
    UpdateUserTargetBandByIdResponseDTO,
    UpdateUserTargetBandByIdResponse,
    UpdateUserTargetBandByIdParams,
    UpdateUserTargetBandByIdBody
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;

      return {
        apiBase: API_BASE,
        path: `/api/user/${resolvedParams.userId}`,
        body: defaultBody,
      };
    },
    initialItem: initialUser,
    mapItem: mapUpdateUserTargetBandByIdDTOToUser,
  });

  return {
    user,
    setUser,
    loading,
    error,
    put,
  };
}
