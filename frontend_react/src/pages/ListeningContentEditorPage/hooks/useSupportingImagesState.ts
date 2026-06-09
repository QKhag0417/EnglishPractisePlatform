import { useRef, useState } from "react";
import { useListeningEditorApi } from "./useListeningEditorApi";
import { API_BASE } from "../../../env";

export interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  saved: boolean;
  url?: string;
}

export function useSupportingImagesState(
  exerciseId?: string,
  markImageChanged?: () => void,
) {
  const multiImageInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImages, deleteImages } = useListeningEditorApi(); // dùng API cũ

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const getSavedImageUrls = () => {
    return uploadedImages
      .filter((img) => img.saved && img.url)
      .map((img) => img.url as string);
  };

  const loadExistingImages = (urls: string[]) => {
    const images: UploadedImage[] = urls.map((url) => ({
      id: crypto.randomUUID(),
      preview: `${API_BASE}${url}`, //
      saved: true,
      url, //
    }));

    setUploadedImages(images);
  };

  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      saved: false,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleSaveImage = async (id: string) => {
    const image = uploadedImages.find((img) => img.id === id);
    if (!image || !image.file) return;

    try {
      const url = await uploadImages(image.file);

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, saved: true, url: url ?? undefined } : img,
        ),
      );

      markImageChanged?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = async (id: string) => {
    const image = uploadedImages.find((img) => img.id === id);
    if (!image) return;

    if (image.preview.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    if (image.saved && image.url) {
      await deleteImages(image.url);
    }

    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    markImageChanged?.();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return {
    multiImageInputRef,
    uploadedImages,
    handleMultiImageChange,
    handleSaveImage,
    handleRemoveImage,
    handleCopyUrl,
    getSavedImageUrls,
    loadExistingImages,
  };
}
