import { API_BASE } from "../../../env";
import { useApiGetByParams } from "../../../utils/api";
import {
  UserTargetBand,
  UserTargetBandDTO,
  UserTargetBandParams,
  USER_TARGET_BAND_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapUserTargetBandDTOToUserTargetBand(
  dto: UserTargetBandDTO,
): UserTargetBand {
  return {
    userId: dto.userId ?? "",
    targetListeningBand: dto.targetListeningBand ?? 0,
    targetReadingBand: dto.targetReadingBand ?? 0,
    targetWritingBand: dto.targetWritingBand ?? 0,
    targetSpeakingBand: dto.targetSpeakingBand ?? 0,
  };
}

const initialParams: UserTargetBandParams = {
  userId: "",
};

const initialUserTargetBand: UserTargetBand = {
  userId: "",
  targetListeningBand: 0,
  targetReadingBand: 0,
  targetWritingBand: 0,
  targetSpeakingBand: 0,
};

export function useGetUserTargetBandById(params?: UserTargetBandParams) {
  const defaultParams = params ?? initialParams;

  const {
    item: userTargetBand,
    setItem: setUserTargetBand,
    loading,
    error,
    get,
  } = useApiGetByParams<
    UserTargetBandDTO,
    UserTargetBand,
    UserTargetBandParams
  >({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/user/${userId}`,
        include: USER_TARGET_BAND_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialUserTargetBand,
    mapItem: mapUserTargetBandDTOToUserTargetBand,
  });

  return {
    userTargetBand,
    setUserTargetBand,
    loading,
    error,
    get,
  };
}
