export const buildAudioUrl = (apiBase: string, path?: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;
};
