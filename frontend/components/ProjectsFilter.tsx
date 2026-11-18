"use client";

import { useMemo, useState } from "react";
import type { ResolvedProject } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import { cn, focusRing } from "./ui";

const ALL = "All";

export default function ProjectsFilter({ projects }: { projects: ResolvedProject[] }) {
    const categories = useMemo(() => [ALL, ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
    const [active, setActive] = useState(ALL);
    const visible = active === ALL ? projects : projects.filter((p) => p.category === active);

    return (
        <div>
            {categories.length > 2 && (
                <div role="group" aria-label="Filter projects by category" className="no-scrollbar -mx-4 px-4 sm:-mx-1 sm:px-1 -my-2 py-2 flex gap-2 overflow-x-auto">
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            aria-pressed={active === c}
                            onClick={() => setActive(c)}
                            className={cn(
                                focusRing,
                                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:ring-grpsi-blue focus-visible:ring-offset-2",
                                active === c
                                    ? "bg-grpsi-blue text-white shadow-lg shadow-grpsi-blue/20"
                                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-grpsi-blue/40",
                            )}
                        >
                            {c}
                            <span className={cn("ml-2 text-xs", active === c ? "text-white/70" : "text-slate-500")}>
                                {c === ALL ? projects.length : projects.filter((p) => p.category === c).length}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <p className="sr-only" aria-live="polite">
                Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((p, i) => (
                    <li key={p.slug} className="animate-[fadeIn_.4s_ease-out]">
                        <ProjectCard project={p} priority={i < 3} headingLevel="h2" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
