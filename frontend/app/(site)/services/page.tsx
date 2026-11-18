import type { Metadata } from "next";
import { Drill, Factory, Truck, Waves } from "lucide-react";
import { getContent } from "@/lib/content";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { ServiceDetail } from "@/components/Services";
import { Container, IconBadge, PageHeader, SectionHeading, cn, surface } from "@/components/ui";

export const metadata: Metadata = {
    title: "Services",
    description: "Maritime logistics, civil engineering and fuel distribution services across the Solomon Islands.",
};

const INDUSTRIES = [
    { name: "Public sector", icon: Factory },
    { name: "Mining & resources", icon: Drill },
    { name: "Retail & distribution", icon: Truck },
    { name: "Maritime transport", icon: Waves },
];

export default async function ServicesPage() {
    const { services, home } = await getContent();

    return (
        <>
            <PageHeader
                eyebrow="Our expertise"
                title="Services built for island logistics"
                description="From landing-craft charters to civil works and bulk fuel, we deliver end-to-end support to every province."
            />

            <Container>
                {services.length > 0 ? (
                    <ul className="space-y-5">
                        {services.map((s, i) => (
                            <li key={s.id || i}>
                                <Reveal>
                                    <ServiceDetail service={s} index={i} />
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={cn(surface.card, "p-10 text-center text-slate-600")}>Our service details are being updated. Please check back soon.</p>
                )}
            </Container>

            <section className="py-20 sm:py-24">
                <Container>
                    <div className={cn(surface.dark, "p-6 sm:p-10")}>
                        <SectionHeading onDark eyebrow="Market reach" title="Industries we serve" />
                        <ul className="mt-10 grid gap-3 grid-cols-2 lg:grid-cols-4">
                            {INDUSTRIES.map((ind) => (
                                <li key={ind.name} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                                    <IconBadge icon={ind.icon} tone="onDark" />
                                    <p className="mt-4 font-semibold">{ind.name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
            </section>

            <CtaBand cta={home.cta} />
        </>
    );
}
