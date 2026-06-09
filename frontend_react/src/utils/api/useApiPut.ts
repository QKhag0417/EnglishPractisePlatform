import { useCallback, useEffect, useRef, useState } from "react";
import { apiPut } from "./apiPut";

export function useApiPut<TDto, TItem, TBody = unknown>(opts: {
  request: {
    apiBase: string;
    path: string;
    body?: TBody;
    isFormData?: boolean;
  };
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

  const put = useCallback(
    async (body?: TBody): Promise<TItem | null> => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await apiPut<TDto>({
          apiBase: request.apiBase,
          path: request.path,
          body: body ?? request.body,
          signal: controller.signal,
          isFormData: request.isFormData,
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
    [request.apiBase, request.path, request.body, request.isFormData, mapItem],
  );

  return { item, setItem, loading, error, put };
}
