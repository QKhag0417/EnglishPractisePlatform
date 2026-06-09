import { API_BASE } from "../../../env";
import { apiGet } from "../../../utils/api/apiGet";
import { apiDelete } from "../../../utils/api/apiDelete";
import { apiPost } from "../../../utils/api/apiPost";
import { apiPut } from "../../../utils/api/apiPut";

export function useWritingEditorApi() {
  // ================================
  // Get detail (edit mode)
  // ================================
  const fetchDetail = async (id: string) => {
    const result = await apiGet<any>({
      apiBase: API_BASE,
      path: `/api/practice-content/${id}?include=id,skill,title,instructions,instructionsParsed,task,questionTypeTags,topicTags,thumbnailUrl,durationMinutes,createdOn,updatedOn,status,imageurls`,
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.data;
  };

  // ================================
  // Upload image
  // ================================
  const uploadImages = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await apiPost<string>({
      apiBase: API_BASE,
      path: "/api/files/images",
      body: formData,
      isFormData: true,
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.data; // imageUrl
  };

  // ================================
  // Upload thumbnail
  // ================================
  const uploadThumbnail = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await apiPost<string>({
      apiBase: API_BASE,
      path: "/api/files/thumbnails",
      body: formData,
      isFormData: true,
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.data; // thumbnailUrl
  };

  // ================================
  // Delete Image
  // ================================
  const deleteImages = async (url: string) => {
    const result = await apiDelete<void>({
      apiBase: API_BASE,
      path: "/api/files/images",
      body: {
        fileUrl: url,
      },
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return true;
  };

  // ================================
  // Delete thumbnail
  // ================================
  const deleteThumbnail = async (url: string) => {
    const result = await apiDelete<void>({
      apiBase: API_BASE,
      path: "/api/files/thumbnails",
      body: {
        fileUrl: url, //
      },
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return true;
  };

  // ================================
  // Create content
  // ================================
  const createContent = async (payload: any) => {
    const result = await apiPost<any>({
      apiBase: API_BASE,
      path: "/api/practice-content",
      body: payload,
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.data;
  };

  // ================================
  //  Update content
  // ================================
  const updateContent = async (id: string, payload: any) => {
    const result = await apiPut<any>({
      apiBase: API_BASE,
      path: `/api/practice-content/${id}`,
      body: payload,
    });

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.data;
  };

  // ================================
  //  Save (auto detect create/update)
  // ================================
  const saveContent = async (
    payload: any,
    isEditMode: boolean,
    editId?: string,
  ) => {
    if (isEditMode && editId) {
      return await updateContent(editId, payload);
    }

    return await createContent(payload);
  };

  return {
    fetchDetail,

    uploadImages,
    deleteImages,
    uploadThumbnail,
    deleteThumbnail,

    createContent,
    updateContent,
    saveContent,
  };
}
