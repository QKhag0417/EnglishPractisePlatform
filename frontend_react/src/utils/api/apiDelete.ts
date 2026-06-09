import { ApiResponse } from "./apiResponse";
import { ApiResult } from "./apiResult";

export async function apiDelete<T>(params: {
  apiBase: string;
  path: string;
  body?: unknown;
  signal?: AbortSignal;
  isFormData?: boolean;
}): Promise<ApiResult<T>> {
  const { apiBase, path, body, signal, isFormData } = params;

  const url = new URL(path, apiBase);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers,
      credentials: "include",
      ...(signal ? { signal } : {}),
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as BodyInit)
            : JSON.stringify(body),
    });

    let json: ApiResponse<T> | null = null;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      json = null;
    }

    const apiSuccess = String(json?.status ?? "").toLowerCase() === "success";
    const ok = res.ok && apiSuccess;

    const result: ApiResult<T> = {
      ok,
      data: ok ? (json?.data ?? null) : null,
      message:
        json?.message ?? (ok ? "OK" : `Request failed (HTTP ${res.status})`),
      apiStatus: json?.status,
      httpStatus: res.status,
      url: url.toString(),
    };

    (ok ? console.info : console.error)("[apiDelete]", result);
    return result;
  } catch (e: any) {
    const message = e?.message ?? "Network error";
    const result: ApiResult<T> = {
      ok: false,
      data: null,
      message,
      url: url.toString(),
    };

    console.error("[apiDelete]", result, e);
    return result;
  }
}
