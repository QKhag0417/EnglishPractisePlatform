import { API_BASE } from "../../env";
import { useApiPost } from "../../utils/api/useApiPost";
import type {
  LogoutResponseDTO,
  LogoutResult,
  LogoutRequestBody,
} from "../types";

const initialBody: LogoutRequestBody = {};

const initialLogoutResult: LogoutResult = {};

function mapLogoutDTOToResult(_: LogoutResponseDTO): LogoutResult {
  return {};
}

export function usePostLogout(params?: LogoutRequestBody) {
  const body = params ?? initialBody;

  const {
    item: logoutResult,
    setItem: setLogoutResult,
    loading,
    error,
    post,
  } = useApiPost<LogoutResponseDTO, LogoutResult, LogoutRequestBody>({
    request: {
      apiBase: API_BASE,
      path: "/api/auth/logout",
      body,
    },
    initialItem: initialLogoutResult,
    mapItem: mapLogoutDTOToResult,
  });

  return {
    logoutResult,
    setLogoutResult,
    loading,
    error,
    post,
  };
}
