import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://grpsi-site.vercel.app";
export const SITE_NAME = "GRP & Associates Ltd";

/**
 * Next merges metadata shallowly, so any page that sets `openGraph` must spread this
 * to keep the site-wide fields.
 */
export const BASE_OPEN_GRAPH = {
    type: "website",
    siteName: SITE_NAME,
    locale: "en",
} satisfies Metadata["openGraph"];
