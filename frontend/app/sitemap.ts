import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { projects } = await getContent();
    const pages = ["", "/about", "/services", "/projects", "/contact"].map((path) => ({
        url: `${SITE_URL}${path}`,
        changeFrequency: "monthly" as const,
        priority: path === "" ? 1 : 0.8,
    }));
    const projectPages = projects.map((p) => ({
        url: `${SITE_URL}/projects/${p.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.6,
    }));
    return [...pages, ...projectPages];
}
