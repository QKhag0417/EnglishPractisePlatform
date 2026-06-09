import { API_BASE } from "../../env";
import { useApiGet } from "../../utils/api/useApiGet";
import {
  HomeInfo,
  HomeInfoDTO,
  HOME_INFO_DTO_INCLUDE_FIELDS_QUERY,
} from "../types";

function mapHomeInfoDTOToHomeInfo(dto: HomeInfoDTO): HomeInfo {
  return {
    id: dto.id ?? "",
    email: dto.email ?? "",
    role: dto.role ?? "",
  };
}

const initialHomeInfo: HomeInfo = {
  id: "",
  email: "",
  role: "",
};

export function useGetHome() {
  const {
    item: homeInfo,
    setItem: setHomeInfo,
    loading,
    error,
    get,
  } = useApiGet<HomeInfoDTO, HomeInfo>({
    request: {
      apiBase: API_BASE,
      path: "/api/home",
      include: HOME_INFO_DTO_INCLUDE_FIELDS_QUERY,
    },
    initialItem: initialHomeInfo,
    mapItem: mapHomeInfoDTOToHomeInfo,
  });

  return {
    homeInfo,
    setHomeInfo,
    loading,
    error,
    get,
  };
}
