import { buildAudioUrl } from "../utils/tempUtils";

export function useAudioSrc(apiBase: string, audioUrl?: string) {
  return buildAudioUrl(apiBase, audioUrl);
}
