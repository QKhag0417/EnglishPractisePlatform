import { ApiResponse } from "./apiResponse";
import { ApiResult } from "./apiResult";

export async function apiGet<T>(params: {
  apiBase: string;
  path: string;
  include?: string;
  signal?: AbortSignal;
}): Promise<ApiResult<T>> {
  const { apiBase, path, include, signal } = params;

  const url = new URL(path, apiBase);

  if (include) {
    url.searchParams.set("include", include);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
      credentials: "include",
      ...(signal ? { signal } : {}),
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

    (ok ? console.info : console.error)("[apiGet]", result);
    return result;
  } catch (e: any) {
    const message = e?.message ?? "Network error";
    const result: ApiResult<T> = {
      ok: false,
      data: null,
      message,
      url: url.toString(),
    };

    console.error("[apiGet]", result, e);
    return result;
  }
}
