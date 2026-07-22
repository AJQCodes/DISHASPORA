/** Base URL of the Dishaspora backend. Change here (or set VITE_API_BASE_URL) to point elsewhere. */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";

/** Prefix relative API image paths (/images/..., /uploads/...) with the API host. */
export function imgUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return API_BASE_URL + path;
}
