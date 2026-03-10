import { API_BASE } from "../../../env";
import { useApiGet } from "../../../utils/api/useApiGet";
import {
  UserData,
  UserDataDTO,
  USER_DATA_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapUserDataDTOToUserData(dto: UserDataDTO): UserData {
  return {
    userId: dto.userId ?? "",
    email: dto.email ?? "",
    firstname: dto.firstname ?? "",
    lastname: dto.lastname ?? "",
  };
}

const initialUserData: UserData = {
  userId: "",
  email: "",
  firstname: "",
  lastname: "",
};

export function useGetUserData(userId: string) {
  const {
    item: userData,
    setItem: setUserData,
    loading,
    error,
    get,
  } = useApiGet<UserDataDTO, UserData>({
    request: {
      apiBase: API_BASE,
      path: `/api/user/${userId}`,
      include: USER_DATA_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialUserData,
    mapItem: mapUserDataDTOToUserData,
  });

  return {
    userData,
    setUserData,
    loading,
    error,
    get,
  };
}
