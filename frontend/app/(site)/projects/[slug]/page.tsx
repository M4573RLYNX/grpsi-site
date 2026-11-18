import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Lightbulb, MapPin, Tag, Target, Trophy } from "lucide-react";
import { getContent, getProject } from "@/lib/content";
import { BASE_OPEN_GRAPH } from "@/lib/site";
import SafeImage from "@/components/SafeImage";
import Reveal from "@/components/Reveal";
import { Button, Container, Eyebrow, IconBadge, Pill, cn, focusRing, surface } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const { projects } = await getContent();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const found = await getProject(slug);
    if (!found) return { title: "Project not found" };
    const { project } = found;
    const description = project.description?.slice(0, 160);
    return {
        title: project.title,
        description,
        openGraph: {
            ...BASE_OPEN_GRAPH,
            title: project.title,
            description,
            ...(project.image ? { images: [project.image] } : {}),
        },
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const found = await getProject(slug);
    if (!found) notFound();
    const { project, next } = found;

    const caseStudy = [
        { key: "challenge", title: "The challenge", text: project.challenge, icon: Target },
        { key: "solution", title: "Our solution", text: project.solution, icon: Lightbulb },
        { key: "result", title: "The result", text: project.result, icon: Trophy },
    ].filter((s) => s.text?.trim());

    const details = [
        { label: "Category", value: project.category, icon: Tag },
        { label: "Location", value: project.location, icon: MapPin },
        { label: "Year", value: project.year, icon: Calendar },
    ].filter((d) => d.value);

    return (
        <article className="pt-28 sm:pt-32">
            <Container>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 -ml-3 text-sm font-semibold text-slate-600 hover:text-grpsi-blue hover:bg-white/70 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" aria-hidden />
                    All projects
                </Link>

                {/* Hero */}
                <header className="relative mt-4 overflow-hidden rounded-[32px] min-h-[420px] sm:min-h-[520px] flex items-end bg-grpsi-blue shadow-float">
                    <SafeImage src={project.image} alt="" sizes="(min-width: 1152px) 1104px, 100vw" priority />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-grpsi-blue via-grpsi-blue/50 to-transparent" />
                    <div className="relative p-6 sm:p-10 max-w-3xl">
                        {project.category && <Pill tone="gold">{project.category}</Pill>}
                        <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance">{project.title}</h1>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-white/85 font-medium">
                            {project.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4" aria-hidden />
                                    {project.location}
                                </span>
                            )}
                            {project.year && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" aria-hidden />
                                    {project.year}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                {/* Body */}
                <div className="mt-5 grid gap-5 lg:grid-cols-3 items-start">
                    <div className="lg:col-span-2 space-y-5">
                        {project.description && (
                            <Reveal className={cn(surface.card, "p-6 sm:p-10")}>
                                <h2 className="text-2xl font-black tracking-tight text-grpsi-blue">Overview</h2>
                                <p className="mt-4 text-lg text-slate-600 leading-relaxed">{project.description}</p>
                            </Reveal>
                        )}
                        {caseStudy.map((s) => (
                            <Reveal key={s.key} className={cn(surface.card, "p-6 sm:p-8 flex flex-col sm:flex-row gap-5")}>
                                <IconBadge icon={s.icon} tone="solid" />
                                <div>
                                    <h2 className="text-xl font-bold text-grpsi-blue">{s.title}</h2>
                                    <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line">{s.text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <aside className="lg:sticky lg:top-28 space-y-5">
                        {details.length > 0 && (
                            <div className={cn(surface.card, "p-6")}>
                                <Eyebrow as="h2">Project details</Eyebrow>
                                <dl className="mt-4 space-y-2">
                                    {details.map((d) => (
                                        <div key={d.label} className={cn(surface.tile, "flex items-center gap-3 p-3")}>
                                            <d.icon className="w-4 h-4 text-grpsi-blue-light shrink-0" aria-hidden />
                                            <dt className="text-sm text-slate-500">{d.label}</dt>
                                            <dd className="ml-auto text-sm font-semibold text-slate-900 text-right">{d.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                        <div className={cn(surface.dark, "p-6")}>
                            <p className="font-bold text-lg">Planning something similar?</p>
                            <p className="mt-1 text-white/75 text-sm">Tell us about your project and we&apos;ll get back to you.</p>
                            <Button href={`/contact?subject=${encodeURIComponent(`Enquiry about: ${project.title}`)}`} variant="gold" className="mt-5 w-full">
                                Start a conversation
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Button>
                        </div>
                    </aside>
                </div>

                {/* Next project */}
                {next && (
                    <Link
                        href={`/projects/${next.slug}`}
                        className={cn(surface.card, focusRing, "group mt-5 mb-8 flex items-center gap-4 p-3 pr-6 transition-all hover:shadow-float focus-visible:ring-grpsi-blue")}
                    >
                        <div className="relative h-20 w-28 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-[20px] bg-slate-100">
                            <SafeImage src={next.image} alt="" sizes="144px" className="transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                            <Eyebrow>Next project</Eyebrow>
                            <p className="mt-1 text-lg sm:text-xl font-bold text-grpsi-blue truncate">{next.title}</p>
                        </div>
                        <span className="ml-auto h-11 w-11 shrink-0 rounded-full bg-grpsi-blue text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                            <ArrowRight className="w-5 h-5" aria-hidden />
                        </span>
                    </Link>
                )}
            </Container>
        </article>
    );
}
