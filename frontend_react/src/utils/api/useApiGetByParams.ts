import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "./apiGet";

export function useApiGetByParams<TDto, TItem, TParams>(opts: {
  buildRequest: (params?: TParams) => {
    apiBase: string;
    path: string;
    include?: string;
  };
  mapItem: (dto: TDto) => TItem;
  initialItem: TItem;
}) {
  const { buildRequest, mapItem, initialItem } = opts;

  const [item, setItem] = useState<TItem>(initialItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const get = useCallback(
    async (params?: TParams): Promise<TItem | null> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const request = buildRequest(params);

      try {
        const res = await apiGet<TDto>({
          apiBase: request.apiBase,
          path: request.path,
          include: request.include,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return null;
        }

        if (!res.ok) {
          setError(res.message);
          throw new Error(res.message);
        }

        if (res.data == null) {
          const msg = "No data returned";
          setError(msg);
          throw new Error(msg);
        }

        const mappedItem = mapItem(res.data);
        setItem(mappedItem);
        return mappedItem;
      } finally {
        setLoading(false);
      }
    },
    [buildRequest, mapItem],
  );

  return { item, setItem, loading, error, get };
}
