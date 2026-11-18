import { apiUrl } from "./api-url";

/**
 * Verifies the request's admin JWT with the backend (which owns the signing secret).
 * Returns an error Response to send back, or null when the caller is an authenticated admin.
 */
export async function requireAdmin(request: Request): Promise<Response | null> {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let verify: Response;
    try {
        verify = await fetch(apiUrl("/admin/verify"), {
            headers: { Authorization: authorization },
            cache: "no-store",
            signal: AbortSignal.timeout(8000),
        });
    } catch {
        return Response.json({ error: "Auth server unreachable" }, { status: 503 });
    }
    return verify.ok ? null : Response.json({ error: "Unauthorized" }, { status: 401 });
}
