import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { BACKGROUND, COMMITMENT_STATEMENT, COMMITMENTS, LEADERSHIP, PHOTOS } from "@/lib/company";
import Stats from "@/components/Stats";
import Facts from "@/components/Facts";
import Photo from "@/components/Photo";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { resolveIcon } from "@/components/icons";
import { Container, Eyebrow, IconBadge, PageHeader, SectionHeading, cn, surface } from "@/components/ui";

export const metadata: Metadata = {
    title: "About us",
    description:
        "A 100% Solomon Islands owned company established in 1987, delivering earthworks, civil engineering, construction and logistics from Honiara and Gizo.",
};

const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

export default async function AboutPage() {
    const { about, home } = await getContent();
    // Admin-entered description first; the capability-statement background is the fallback.
    const story = about.description?.trim() ? [about.description] : BACKGROUND;

    return (
        <>
            <PageHeader eyebrow={about.subtitle || "About us"} title={about.title} />

            {/* Story */}
            <Container>
                <Reveal className="grid gap-5 lg:grid-cols-5">
                    <Photo {...PHOTOS.cover} sizes="(min-width: 1024px) 440px, 100vw" className="min-h-96 lg:col-span-2" />
                    <div className={cn(surface.card, "lg:col-span-3 p-6 sm:p-10")}>
                        <h2 className="text-2xl font-black tracking-tight text-grpsi-blue">Our story</h2>
                        {story.map((p, i) => (
                            <p key={i} className="mt-4 text-slate-600 leading-relaxed text-lg whitespace-pre-line">{p}</p>
                        ))}
                        {about.mission && (
                            <blockquote className="mt-6 border-l-4 border-grpsi-gold pl-5 text-slate-700 leading-relaxed">
                                <Eyebrow className="mb-2">Our mission</Eyebrow>
                                {about.mission}
                            </blockquote>
                        )}
                    </div>
                </Reveal>

                <Facts className="mt-5" />
                <Stats stats={about.stats} className="mt-5" />
            </Container>

            {/* Leadership */}
            <section className="py-20 sm:py-24">
                <Container>
                    <SectionHeading eyebrow="Our people" title="Leadership & key personnel" description={LEADERSHIP.intro} />
                    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {LEADERSHIP.people.map((p, i) => (
                            <li key={p.name}>
                                <Reveal delay={i * 0.05} className={cn(surface.card, "h-full p-6 sm:p-7")}>
                                    <div className="flex items-center gap-4">
                                        <div
                                            aria-hidden
                                            className="h-14 w-14 shrink-0 rounded-2xl bg-grpsi-blue text-grpsi-gold flex items-center justify-center text-lg font-black shadow-lg shadow-grpsi-blue/20"
                                        >
                                            {initials(p.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-grpsi-blue leading-tight">{p.name}</h3>
                                            <p className="text-sm font-semibold text-grpsi-blue-light">{p.role}</p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-slate-600 leading-relaxed">{p.focus}</p>
                                </Reveal>
                            </li>
                        ))}
                        {/* Fills the sixth slot of the 3-column grid */}
                        <li className="hidden lg:block">
                            <Photo {...PHOTOS.groundbreaking} sizes="360px" className="h-full min-h-48" />
                        </li>
                    </ul>
                </Container>
            </section>

            {/* Commitments */}
            <section className="pb-8">
                <Container>
                    <SectionHeading eyebrow="How we work" title="Safety, quality, community & local development" />
                    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {COMMITMENTS.map((c, i) => (
                            <li key={c.title}>
                                <Reveal delay={i * 0.05} className={cn(surface.card, "h-full p-6 sm:p-7")}>
                                    <IconBadge icon={resolveIcon(c.icon)} tone="solid" />
                                    <h3 className="mt-5 text-lg font-bold text-grpsi-blue">{c.title}</h3>
                                    <p className="mt-2 text-slate-600 leading-relaxed">{c.description}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ul>

                    <Reveal className={cn(surface.dark, "mt-5 grid gap-6 lg:grid-cols-2 items-center p-3 sm:p-4")}>
                        <div className="p-4 sm:p-6">
                            <Eyebrow onDark className="mb-3">Our commitment</Eyebrow>
                            <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-balance">{COMMITMENT_STATEMENT}</p>
                        </div>
                        <Photo {...PHOTOS.toolbox} sizes="(min-width: 1024px) 540px, 100vw" className="aspect-[16/9] ring-white/10" />
                    </Reveal>
                </Container>
            </section>

            <CtaBand cta={home.cta} />
        </>
    );
}
