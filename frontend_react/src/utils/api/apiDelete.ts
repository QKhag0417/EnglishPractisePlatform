import { ApiResponse } from "./apiResponse";
import { ApiResult } from "./apiResult";

export async function apiDelete<T>(params: {
  apiBase: string;
  path: string;
  body?: unknown; // optional: some APIs support DELETE with a body
  signal?: AbortSignal;
}): Promise<ApiResult<T>> {
  const { apiBase, path, body, signal } = params;

  const url = new URL(path, apiBase);

  try {
    const res = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...(signal ? { signal } : {}),
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    let json: ApiResponse<T> | null = null;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      json = null;
    }

    const apiSuccess = (json?.status ?? "").toLowerCase() === "success";
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
    const message =
      e?.name === "AbortError"
        ? "Request aborted"
        : (e?.message ?? "Network error");

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
