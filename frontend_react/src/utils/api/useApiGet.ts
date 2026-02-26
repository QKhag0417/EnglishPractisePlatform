import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "./apiGet";

export function useApiGet<TDto, TItem>(opts: {
  request: { apiBase: string; path: string; include?: string };
  mapItem: (dto: TDto) => TItem;
  initialItem: TItem;
}) {
  const { request, mapItem, initialItem } = opts;

  const [item, setItem] = useState<TItem>(initialItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const get = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await apiGet<TDto>({
        apiBase: request.apiBase,
        path: request.path,
        include: request.include,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return res;

      if (!res.ok) {
        setError(res.message);
        return res;
      }

      if (res.data != null) {
        setItem(mapItem(res.data));
      }

      return res;
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [request.apiBase, request.path, request.include, mapItem]);

  return { item, setItem, loading, error, get };
}
