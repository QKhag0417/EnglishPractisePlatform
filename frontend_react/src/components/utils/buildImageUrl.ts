import { API_BASE } from "../../env";

export const buildImageUrl = (img?: string) => {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
};
