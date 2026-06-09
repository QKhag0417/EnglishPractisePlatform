import { API_BASE } from "../../env";
import { useApiPost } from "../../utils/api/useApiPost";
import type { User } from "../types";
import type { LoginRequestBody, LoginResponseDTO } from "../types";

function mapLoginDTOToUser(dto: LoginResponseDTO): User {
  return {
    id: dto.id ?? "",
    firstname: dto.firstname ?? "",
    lastname: dto.lastname ?? "",
    name: dto.name ?? "",
    email: dto.email ?? "",
    role: dto.role,
    gender: dto.gender,
    phoneNumber: dto.phoneNumber,
    dateOfBirth: dto.dateOfBirth,
    avatarUrl: dto.avatarUrl,
  };
}

const initialBody: LoginRequestBody = {
  email: "",
  password: "",
};

const initialUser: User = {
  id: "",
  firstname: "",
  lastname: "",
  name: "",
  email: "",
  role: "learner",
};

export function usePostLogin(params?: LoginRequestBody) {
  const defaultBody = params ?? initialBody;

  const {
    item: user,
    setItem: setUser,
    loading,
    error,
    post,
  } = useApiPost<LoginResponseDTO, User, LoginRequestBody>({
    request: {
      apiBase: API_BASE,
      path: "/api/auth/login",
      body: defaultBody,
    },
    initialItem: initialUser,
    mapItem: mapLoginDTOToUser,
  });

  return {
    user,
    setUser,
    loading,
    error,
    post,
  };
}
