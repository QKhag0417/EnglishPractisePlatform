import { useCallback } from "react";
import { API_BASE } from "../../../env";
import { useApiPost } from "../../../utils/api/useApiPost";
import type { UploadAvatarResponseDTO } from "../types";

const initialAvatarUrl = "";

function mapUploadAvatarDTOToUrl(dto: UploadAvatarResponseDTO): string {
  return dto;
}

export function usePostAvatar() {
  const {
    item: avatarUrl,
    setItem: setAvatar,
    loading,
    error,
    post: postFormData,
  } = useApiPost<UploadAvatarResponseDTO, string, FormData>({
    request: {
      apiBase: API_BASE,
      path: "/api/files/avatar",
      isFormData: true,
    },
    initialItem: initialAvatarUrl,
    mapItem: mapUploadAvatarDTOToUrl,
  });

  const post = useCallback(
    async (file: File): Promise<string | null> => {
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File must be smaller than 25MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload a valid image file");
      }

      const formData = new FormData();
      formData.append("file", file);

      return await postFormData(formData);
    },
    [postFormData],
  );

  return {
    avatarUrl,
    setAvatar,
    loading,
    error,
    post,
  };
}
