/**
 * Server-side content access for the public site.
 *
 * - One cached request to GET /api/content per revalidation window, tagged "content"
 *   so the admin can invalidate it on publish (see app/api/revalidate/route.ts).
 * - Never throws: if the backend is unreachable or returns garbage, pages render
 *   from FALLBACK_CONTENT so the build and the site stay up.
 *
 * Only import this from Server Components / route handlers.
 */
import { cache } from "react";
import { apiUrl } from "./api-url";
import type { Project, ResolvedProject, SiteContent } from "./types";

export const CONTENT_TAG = "content";
const REVALIDATE_SECONDS = 300;

const FALLBACK_CONTENT: SiteContent = {
    home: {
        hero: {
            title: "GRP & Associates Ltd",
            highlight: "Associates",
            subtitle: "Maritime logistics, engineering and fuel distribution across the Solomon Islands.",
            backgroundImage: "/images/cover.jpeg",
            establishedText: "",
            buttons: {
                primary: { label: "Our services", link: "/services" },
                secondary: { label: "Contact us", link: "/contact" },
            },
        },
        cta: { title: "Ready to start your next project?", description: "", phone: "" },
    },
    about: { title: "About GPRSI", subtitle: "", description: "", mission: "", stats: { staff: "", experience: "", vessels: "", provinces: "" } },
    footer: { description: "", address: "", email: "", phone: "", social: [] },
    services: [],
    projects: [],
};

function slugify(text: string): string {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** Slug format used before the redesign; still accepted so old links keep working. */
const legacySlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

/** Resolves a unique slug per project (explicit slug, else derived from title), suffixing duplicates. */
function resolveProjects(projects: Project[]): ResolvedProject[] {
    const seen = new Map<string, number>();
    return projects.map((p, i) => {
        const base = p.slug?.trim() || slugify(p.title) || `project-${i + 1}`;
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return { ...p, slug: count === 0 ? base : `${base}-${count + 1}` };
    });
}

const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Merges a possibly partial/malformed payload over the fallback, one section at a time. */
function normalize(raw: unknown): SiteContent {
    const data = obj(raw);
    const home = obj(data.home);
    const F = FALLBACK_CONTENT;
    return {
        home: {
            hero: { ...F.home.hero, ...obj(home.hero), buttons: { ...F.home.hero.buttons, ...obj(obj(home.hero).buttons) } },
            cta: { ...F.home.cta, ...obj(home.cta) },
        },
        about: { ...F.about, ...obj(data.about), stats: { ...F.about.stats, ...obj(obj(data.about).stats) } },
        footer: { ...F.footer, ...obj(data.footer), social: arr(obj(data.footer).social) },
        services: arr<SiteContent["services"][number]>(data.services).map((s) => ({ ...s, features: arr<string>(s.features) })),
        projects: resolveProjects(arr<Project>(data.projects).filter((p) => p && p.title)),
    };
}

/** Deduplicated per render; cached across requests by the Next data cache. */
export const getContent = cache(async (): Promise<SiteContent> => {
    try {
        const res = await fetch(apiUrl("/content"), {
            next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return normalize(await res.json());
    } catch (err) {
        console.error("[content] falling back to defaults:", err instanceof Error ? err.message : err);
        return FALLBACK_CONTENT;
    }
});

/** Finds a project by slug and the one after it (for "next project" navigation). */
export async function getProject(slug: string) {
    const { projects } = await getContent();
    let wanted = slug;
    try {
        wanted = decodeURIComponent(slug);
    } catch {
        // malformed escape sequence — match the raw value
    }
    let index = projects.findIndex((p) => p.slug === wanted);
    if (index === -1) index = projects.findIndex((p) => legacySlug(p.title) === wanted);
    if (index === -1) return null;
    const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
    return { project: projects[index], next };
}
