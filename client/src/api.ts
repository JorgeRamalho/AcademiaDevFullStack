export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function apiOrigin(): string {
  if (import.meta.env.DEV) {
    return "";
  }
  const configured = import.meta.env.VITE_API_ORIGIN;
  if (typeof configured === "string" && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  return "http://127.0.0.1:4000";
}

export async function api<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiOrigin()}${path}`, { ...options, headers });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const data = isRecord(payload) ? payload : {};
    const message = typeof data.error === "string" ? data.error : "Não foi possível concluir.";
    const fields = isRecord(data.fields)
      ? Object.fromEntries(Object.entries(data.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
      : {};
    throw new ApiError(response.status, message, fields);
  }
  return payload as T;
}
