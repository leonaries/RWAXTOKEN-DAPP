export type ApiResponse<T> = {
  code?: number;
  data?: T;
  message?: string;
  success?: boolean;
};

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, number | string | undefined>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function buildUrl(path: string, query?: ApiRequestOptions["query"]) {
  const url = new URL(path, apiBaseUrl || "http://localhost");

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  if (!apiBaseUrl && url.origin === "http://localhost") {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data ? String(data.message) : response.statusText || "请求失败";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { body, headers, query, ...requestOptions } = options;
  const isJsonBody = body && typeof body === "object" && !(body instanceof FormData);

  return parseResponse<T>(
    await fetch(buildUrl(path, query), {
      credentials: "include",
      ...requestOptions,
      body: isJsonBody ? JSON.stringify(body) : body,
      headers: {
        Accept: "application/json",
        ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
        ...headers
      }
    })
  );
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: ApiRequestOptions["body"], options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, body, method: "POST" }),
  put: <T>(path: string, body?: ApiRequestOptions["body"], options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, body, method: "PUT" }),
  delete: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "DELETE" })
};
