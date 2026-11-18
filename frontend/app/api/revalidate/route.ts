import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { CONTENT_TAG } from "@/lib/content";

/**
 * POST /api/revalidate — called by the admin after a successful publish.
 * Expires the public site's cached content once the admin's token is verified.
 */
export async function POST(request: Request) {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    // Expire the content fetch immediately, and every page under the site layout
    // (covers pages that were rendered from fallback content and never tagged).
    revalidateTag(CONTENT_TAG, { expire: 0 });
    revalidatePath("/", "layout");

    return Response.json({ revalidated: true });
}
