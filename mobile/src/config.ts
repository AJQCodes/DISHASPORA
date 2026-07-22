// Backend base URL — the ONE place to change it.
// - Android emulator: 10.0.2.2 maps to the host PC's localhost, so the default below works.
// - Physical device via Expo Go: replace with your PC's LAN IP, e.g. "http://192.168.1.23:8080"
//   (find it with `ipconfig`; phone and PC must be on the same Wi-Fi network).
export const API_URL = 'http://10.0.2.2:8080';

// DEMO MODE — when true the app runs fully offline against rich local demo data
// (src/demo) with real photography, so every screen is inspectable in Expo Go with
// zero backend. Set to false to hit the real backend; the app still auto-falls back
// to demo data if the backend is unreachable.
export const DEMO_MODE = true;

/** Prefix relative /images or /uploads paths served by the backend with API_URL. */
export function IMG(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('/images') || url.startsWith('/uploads') || url.startsWith('/')) {
    return API_URL + url;
  }
  return url;
}
