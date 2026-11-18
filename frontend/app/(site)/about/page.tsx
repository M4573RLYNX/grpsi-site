import type { Metadata } from "next";
import { Globe, Shield, Target } from "lucide-react";
import { getContent } from "@/lib/content";
import Stats from "@/components/Stats";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import SafeImage from "@/components/SafeImage";
import { Container, Eyebrow, IconBadge, PageHeader, SectionHeading, cn, surface } from "@/components/ui";

export const metadata: Metadata = {
    title: "About us",
    description: "Linking the Solomon Islands through maritime logistics, civil engineering and fuel distribution.",
};

const VALUES = [
    { title: "Integrity", description: "Honesty and transparency in every contract and maritime operation.", icon: Shield },
    { title: "Excellence", description: "Setting the standard for engineering and logistical support in the Solomon Islands.", icon: Target },
    { title: "Sustainability", description: "Committed to long-term regional growth and environmentally conscious practice.", icon: Globe },
];

export default async function AboutPage() {
    const { about, home } = await getContent();

    return (
        <>
            <PageHeader eyebrow={about.subtitle || "About us"} title={about.title} />

            <Container>
                <Reveal className="grid gap-5 lg:grid-cols-5">
                    <div className={cn(surface.media, "min-h-72 lg:col-span-2 shadow-premium")}>
                        <SafeImage src="/gprsi_team_operations_image_1774928148738.png" alt="The GPRSI team on site" sizes="(min-width: 1024px) 440px, 100vw" />
                    </div>
                    <div className={cn(surface.card, "lg:col-span-3 p-6 sm:p-10")}>
                        <h2 className="text-2xl font-black tracking-tight text-grpsi-blue">Our story</h2>
                        {about.description && <p className="mt-4 text-slate-600 leading-relaxed text-lg">{about.description}</p>}
                        {about.mission && (
                            <blockquote className="mt-6 border-l-4 border-grpsi-gold pl-5 text-slate-700 leading-relaxed">
                                <Eyebrow className="mb-2">Our mission</Eyebrow>
                                {about.mission}
                            </blockquote>
                        )}
                    </div>
                </Reveal>

                <Stats stats={about.stats} className="mt-5" />
            </Container>

            <section className="py-20 sm:py-24">
                <Container>
                    <SectionHeading eyebrow="What guides us" title="Our values" />
                    <ul className="mt-10 grid gap-5 md:grid-cols-3">
                        {VALUES.map((v, i) => (
                            <li key={v.title}>
                                <Reveal delay={i * 0.08} className={cn(surface.card, "h-full p-6 sm:p-8")}>
                                    <IconBadge icon={v.icon} tone="solid" />
                                    <h3 className="mt-5 text-xl font-bold text-grpsi-blue">{v.title}</h3>
                                    <p className="mt-2 text-slate-600 leading-relaxed">{v.description}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <CtaBand cta={home.cta} />
        </>
    );
}
