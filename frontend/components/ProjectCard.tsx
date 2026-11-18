import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { ResolvedProject } from "@/lib/types";
import SafeImage from "./SafeImage";
import { Pill, cn, focusRing, surface } from "./ui";

/** Whole card is a single link to the case study. Pure (no hooks) so it works in server and client trees. */
export default function ProjectCard({
    project,
    priority,
    headingLevel: Heading = "h3",
}: {
    project: ResolvedProject;
    priority?: boolean;
    /** Use "h2" when the card grid sits directly under the page h1. */
    headingLevel?: "h2" | "h3";
}) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className={cn(surface.card, focusRing, "group flex h-full flex-col p-2 transition-all hover:-translate-y-1 hover:shadow-float focus-visible:ring-grpsi-blue")}
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-slate-100">
                <SafeImage
                    src={project.image}
                    alt={project.title}
                    priority={priority}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                />
                {project.category && (
                    <Pill tone="slate" className="absolute top-3 left-3 backdrop-blur">
                        {project.category}
                    </Pill>
                )}
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <Heading className="text-lg font-bold text-grpsi-blue leading-snug">{project.title}</Heading>
                    <span className="h-9 w-9 shrink-0 rounded-full bg-slate-100 text-grpsi-blue flex items-center justify-center transition-all group-hover:bg-grpsi-blue group-hover:text-white">
                        <ArrowUpRight className="w-4 h-4" aria-hidden />
                    </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">{project.description}</p>
                <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                    {project.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" aria-hidden />
                            {project.location}
                        </span>
                    )}
                    {project.year && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" aria-hidden />
                            {project.year}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
