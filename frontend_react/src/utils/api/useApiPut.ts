import { useCallback, useEffect, useRef, useState } from "react";
import { apiPut } from "./apiPut";

export function useApiPut<TDto, TItem, TBody = unknown>(opts: {
  request: { apiBase: string; path: string; body?: TBody };
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

  const put = useCallback(async () => {
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const promise = (async () => {
      try {
        const res = await apiPut<TDto>({
          apiBase: request.apiBase,
          path: request.path,
          body: request.body,
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
    })();

    return promise;
  }, [request.apiBase, request.path, request.body, mapItem]);

  return { item, setItem, loading, error, put };
}
