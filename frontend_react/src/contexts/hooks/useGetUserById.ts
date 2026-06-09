import { API_BASE } from "../../env";
import { useApiGetByParams } from "../../utils/api";
import {
  UserProfile,
  UserProfileDTO,
  UserProfileParams,
  USER_PROFILE_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapUserProfileDTOToUserProfile(dto: UserProfileDTO): UserProfile {
  return {
    userId: dto.userId ?? "",
    email: dto.email ?? "",
    firstname: dto.firstname ?? "",
    lastname: dto.lastname ?? "",
    role: dto.role ?? "",
    avatarUrl: dto.avatarUrl ?? "",
    gender: dto.gender ?? "",
    phoneNumber: dto.phoneNumber ?? "",
    dateOfBirth: dto.dateOfBirth ?? "",
  };
}

const initialParams: UserProfileParams = {
  userId: "",
};

const initialUserProfile: UserProfile = {
  userId: "",
  email: "",
  firstname: "",
  lastname: "",
  role: "",
  avatarUrl: "",
  gender: "",
  phoneNumber: "",
  dateOfBirth: "",
};

export function useGetUserById(params?: UserProfileParams) {
  const defaultParams = params ?? initialParams;

  const {
    item: userProfile,
    setItem: setUserProfile,
    loading,
    error,
    get,
  } = useApiGetByParams<UserProfileDTO, UserProfile, UserProfileParams>({
    buildRequest: (requestParams) => {
      const resolvedParams = requestParams ?? defaultParams;
      const userId = resolvedParams.userId ?? "";

      return {
        apiBase: API_BASE,
        path: `/api/user/${userId}`,
        include: USER_PROFILE_DTO_INCLUDE_FIELDS_QUERY,
      };
    },
    initialItem: initialUserProfile,
    mapItem: mapUserProfileDTOToUserProfile,
  });

  return {
    userProfile,
    setUserProfile,
    loading,
    error,
    get,
  };
}
