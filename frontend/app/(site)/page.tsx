import { ArrowRight, Target } from "lucide-react";
import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CtaBand from "@/components/CtaBand";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SafeImage from "@/components/SafeImage";
import { ServiceCard } from "@/components/Services";
import { Button, Container, IconBadge, SectionHeading, cn, surface } from "@/components/ui";

export default async function HomePage() {
    const { home, about, services, projects } = await getContent();
    const featured = projects.slice(0, 3);

    return (
        <>
            <Hero hero={home.hero} />

            <Container className="relative z-10 -mt-16 sm:-mt-20">
                <Stats stats={about.stats} />
            </Container>

            {/* About summary */}
            {(about.description || about.mission) && (
                <section className="py-20 sm:py-28">
                    <Container>
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                            <Reveal>
                                <div className={cn(surface.media, "aspect-[4/3] shadow-float")}>
                                    <SafeImage src="/gprsi_team_operations_image_1774928148738.png" alt="GPRSI operations team at work" sizes="(min-width: 1024px) 560px, 100vw" />
                                </div>
                            </Reveal>
                            <Reveal delay={0.1}>
                                <SectionHeading eyebrow={about.subtitle || "Who we are"} title={about.title} description={about.description} />
                                {about.mission && (
                                    <div className={cn(surface.tile, "mt-8 flex gap-4 p-5")}>
                                        <IconBadge icon={Target} />
                                        <div>
                                            <p className="font-bold text-grpsi-blue">Our mission</p>
                                            <p className="mt-1 text-slate-600 leading-relaxed">{about.mission}</p>
                                        </div>
                                    </div>
                                )}
                                <Button href="/about" variant="secondary" className="mt-8">
                                    More about us
                                    <ArrowRight className="w-4 h-4" aria-hidden />
                                </Button>
                            </Reveal>
                        </div>
                    </Container>
                </section>
            )}

            {/* Services preview */}
            {services.length > 0 && (
                <section className="py-16 sm:py-20">
                    <Container>
                        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <SectionHeading eyebrow="What we do" title="Integrated services for the archipelago" />
                            <Button href="/services" variant="secondary" className="shrink-0">
                                All services
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Button>
                        </Reveal>
                        <ul className="mt-10 grid gap-5 md:grid-cols-3">
                            {services.slice(0, 3).map((s, i) => (
                                <li key={s.id || i}>
                                    <Reveal delay={i * 0.08} className="h-full">
                                        <ServiceCard service={s} />
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {/* Featured projects */}
            {featured.length > 0 && (
                <section className="py-16 sm:py-20">
                    <Container>
                        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <SectionHeading eyebrow="Our work" title="Recent projects" description="A selection of engineering, logistics and fuel projects delivered across the provinces." />
                            <Button href="/projects" variant="secondary" className="shrink-0">
                                All projects
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Button>
                        </Reveal>
                        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((p, i) => (
                                <li key={p.slug}>
                                    <Reveal delay={i * 0.08} className="h-full">
                                        <ProjectCard project={p} />
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            <CtaBand cta={home.cta} />
        </>
    );
}
