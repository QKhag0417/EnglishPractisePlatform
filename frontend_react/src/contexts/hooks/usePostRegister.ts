import { API_BASE } from "../../env";
import { useApiPost } from "../../utils/api/useApiPost";
import {
  RegisterRequestBody,
  RegisterResponseDTO,
  RegisterResult,
} from "../types";

const initialBody: RegisterRequestBody = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

const initialRegisterResult: RegisterResult = {
  email: "",
  firstname: "",
  lastname: "",
};

function mapRegisterDTOToResult(dto: RegisterResponseDTO): RegisterResult {
  return {
    email: dto.email ?? "",
    firstname: dto.firstname ?? "",
    lastname: dto.lastname ?? "",
  };
}

export function usePostRegister(params?: RegisterRequestBody) {
  const body = params ?? initialBody;

  const {
    item: registerResult,
    setItem: setRegisterResult,
    loading,
    error,
    post,
  } = useApiPost<RegisterResponseDTO, RegisterResult, RegisterRequestBody>({
    request: {
      apiBase: API_BASE,
      path: "/api/auth/register",
      body,
    },
    initialItem: initialRegisterResult,
    mapItem: mapRegisterDTOToResult,
  });

  return {
    registerResult,
    setRegisterResult,
    loading,
    error,
    post,
  };
}
