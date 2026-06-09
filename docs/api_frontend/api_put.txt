import { API_BASE } from "../../../env";
import { useApiPutByParams } from "../../../utils/api";
import {
  UpdateUserByIdBody,
  UpdateUserByIdParams,
  UpdateUserByIdResponseDTO,
  UpdateUserByIdResponse,
} from "../types";

const initialParams: UpdateUserByIdParams = {
  userId: "",
};

const initialBody: UpdateUserByIdBody = {
  firstname: "",
  lastname: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  phoneNumber: "",
  avatarUrl: "",
};

const initialUser: UpdateUserByIdResponse = {
  userId: "",
};

function mapUpdateUserByIdDTOToUser(
  dto: UpdateUserByIdResponseDTO,
): UpdateUserByIdResponse {
  return {
    userId: dto.userId ?? "",
  };
}

export function usePutUserById(
  params?: UpdateUserByIdParams,
  body?: UpdateUserByIdBody,
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
    UpdateUserByIdResponseDTO,
    UpdateUserByIdResponse,
    UpdateUserByIdParams,
    UpdateUserByIdBody
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
    mapItem: mapUpdateUserByIdDTOToUser,
  });

  return {
    user,
    setUser,
    loading,
    error,
    put,
  };
}
