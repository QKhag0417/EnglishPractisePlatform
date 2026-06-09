import { useCallback, useEffect, useRef, useState } from "react";
import { apiDelete } from "./apiDelete";

export function useApiDeleteByParams<
  TDto,
  TItem,
  TParams,
  TBody = unknown,
>(opts: {
  buildRequest: (params?: TParams) => {
    apiBase: string;
    path: string;
    body?: TBody;
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

  const remove = useCallback(
    async (params?: TParams, body?: TBody): Promise<TItem | null> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const request = buildRequest(params);

      try {
        const res = await apiDelete<TDto>({
          apiBase: request.apiBase,
          path: request.path,
          body: body ?? request.body,
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
          return null;
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

  return { item, setItem, loading, error, remove };
}
