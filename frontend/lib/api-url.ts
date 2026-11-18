/**
 * Builds a backend API URL. Safe to import from both server and client code.
 *
 * NEXT_PUBLIC_API_URL may be configured with or without a trailing "/api";
 * either way the result is `<base>/api<path>`.
 * Server code may set API_URL to reach the backend over a private address.
 */
export function apiUrl(path: string): string {
    // `||` (not `??`) so empty env values fall through to the next option.
    const raw =
        (typeof window === "undefined" ? process.env.API_URL : undefined) ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000/api";
    const base = raw.replace(/\/+$/, "");
    const withApi = base.endsWith("/api") ? base : `${base}/api`;
    return `${withApi}${path.startsWith("/") ? path : `/${path}`}`;
}
