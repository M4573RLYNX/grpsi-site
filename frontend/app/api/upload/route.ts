import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-auth";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/** Keeps a safe, readable file name: letters, digits, dot, dash, underscore. */
function safeFilename(name: string): string {
    const base = name.split(/[\\/]/).pop() ?? "";
    return base.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").slice(-100);
}

/**
 * POST /api/upload?filename=<name> — admin-only image upload to Vercel Blob.
 * Body: the raw image file. Returns the blob (including its public `url`).
 */
export async function POST(request: Request) {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    const filename = safeFilename(new URL(request.url).searchParams.get("filename") ?? "");
    if (!filename || !request.body) {
        return Response.json({ error: "A filename and an image file are required." }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
        return Response.json({ error: "Only image files can be uploaded." }, { status: 415 });
    }

    const length = Number(request.headers.get("content-length"));
    if (!length) {
        return Response.json({ error: "Upload size is required." }, { status: 411 });
    }
    if (length > MAX_BYTES) {
        return Response.json({ error: "Images must be 10 MB or smaller." }, { status: 413 });
    }

    try {
        const blob = await put(filename, request.body, {
            access: "public",
            contentType,
            // Never overwrite an existing image that may already be in use on the site.
            addRandomSuffix: true,
        });
        return Response.json(blob);
    } catch (error) {
        console.error("[upload] failed:", error);
        return Response.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }
}
