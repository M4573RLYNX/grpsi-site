import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrl } from "@/lib/api-url";
import { CONTENT_TAG } from "@/lib/content";

/**
 * POST /api/revalidate — called by the admin after a successful publish.
 * The admin's JWT is verified by the backend (which owns the secret) before
 * the public site's cached content is expired.
 */
export async function POST(request: Request) {
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
    if (!verify.ok) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expire the content fetch immediately, and every page under the site layout
    // (covers pages that were rendered from fallback content and never tagged).
    revalidateTag(CONTENT_TAG, { expire: 0 });
    revalidatePath("/", "layout");

    return Response.json({ revalidated: true });
}
