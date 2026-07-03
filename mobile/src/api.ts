import { API_URL, DEMO_MODE } from './config';
import { demoResolve, demoUpload } from './demo/demoApi';

export class ApiError extends Error {
  status: number;
  timestamp?: string;
  constructor(status: number, message: string, timestamp?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.timestamp = timestamp;
  }
  /** True when the backend answered 402 PAYMENT_REQUIRED (premium feature). */
  get premiumRequired(): boolean {
    return this.status === 402;
  }
}

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

export function getToken(): string | null {
  return authToken;
}

type Query = Record<string, string | number | boolean | null | undefined>;

function qs(params?: Query): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (entries.length === 0) return '';
  return (
    '?' +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  );
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Query
): Promise<T> {
  if (DEMO_MODE) {
    return demoResolve<T>(method, path, body, params);
  }
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}${qs(params)}`, {
      method,
      headers,
      body: payload,
    });
  } catch (e) {
    // Backend unreachable — auto-fall back to the offline demo backend so the
    // app stays fully inspectable.
    return demoResolve<T>(method, path, body, params);
  }

  const text = await res.text();
  let json: any = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const message =
      (json && (json.message || json.error)) || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, json?.timestamp);
  }
  return json as T;
}

export const api = {
  get: <T>(path: string, params?: Query) => request<T>('GET', path, undefined, params),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
  /** POST /media multipart upload. `file` = { uri, name, mimeType }. Returns { url }. */
  upload: async (file: { uri: string; name: string; mimeType: string }) => {
    if (DEMO_MODE) return demoUpload(file);
    const form = new FormData();
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any);
    return request<{ url: string }>('POST', '/media', form);
  },
};
