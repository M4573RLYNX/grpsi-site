import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getContent } from "@/lib/content";
import { CAPABILITIES, EQUIPMENT, PARTNERS, PHOTOS, SERVICE_DELIVERY } from "@/lib/company";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { ServiceDetail } from "@/components/Services";
import { resolveIcon } from "@/components/icons";
import { Container, Eyebrow, IconBadge, PageHeader, SectionHeading, cn, surface } from "@/components/ui";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Earthworks, civil and marine construction, mining support, logistics and project management delivered in remote locations across the Solomon Islands.",
};

export default async function ServicesPage() {
    const { services, home } = await getContent();

    return (
        <>
            <PageHeader
                eyebrow="Earthworks · Civil engineering · Construction · Logistics"
                title="Practical delivery, wherever the project is"
                description="We mobilise people, equipment, fuel and materials to difficult locations and manage delivery from planning through construction, commissioning and handover."
            />

            {/* Capabilities */}
            <Container>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {CAPABILITIES.map((c, i) => (
                        <li key={c.title}>
                            <Reveal delay={i * 0.05} className={cn(surface.card, "h-full p-6 sm:p-7")}>
                                <IconBadge icon={resolveIcon(c.icon)} tone="solid" />
                                <h2 className="mt-5 text-xl font-bold text-grpsi-blue">{c.title}</h2>
                                <p className="mt-2 text-slate-600 leading-relaxed">{c.description}</p>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </Container>

            {/* Service delivery & reliability */}
            <section className="py-16 sm:py-20">
                <Container>
                    <div className="grid gap-5 lg:grid-cols-2 items-stretch">
                        <Reveal className={cn(surface.card, "p-6 sm:p-10")}>
                            <SectionHeading eyebrow="Service delivery & reliability" title="Built for remote, constrained sites" />
                            <ul className="mt-8 space-y-3">
                                {SERVICE_DELIVERY.map((item) => (
                                    <li key={item} className="flex gap-3 text-slate-700">
                                        <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-grpsi-blue/10 text-grpsi-blue flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5" aria-hidden />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                        <div className="grid grid-cols-2 gap-5">
                            <Photo {...PHOTOS.interIslandShipping} sizes="(min-width: 1024px) 270px, 50vw" className="aspect-[4/5] lg:aspect-auto" />
                            <Photo {...PHOTOS.mineSiteFleet} sizes="(min-width: 1024px) 270px, 50vw" className="aspect-[4/5] lg:aspect-auto" />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Admin-managed service divisions */}
            {services.length > 0 && (
                <section className="pb-16 sm:pb-20">
                    <Container>
                        <SectionHeading eyebrow="Our divisions" title="Core service lines" />
                        <ul className="mt-10 space-y-5">
                            {services.map((s, i) => (
                                <li key={s.id || i}>
                                    <Reveal>
                                        <ServiceDetail service={s} index={i} />
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {/* Plant & equipment */}
            <section className="pb-16 sm:pb-20">
                <Container>
                    <SectionHeading eyebrow="Plant & equipment" title="Operating resources" description={EQUIPMENT.intro} />
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {EQUIPMENT.groups.map((g) => (
                            <Reveal key={g.title} className={cn(surface.card, "p-6 sm:p-7")}>
                                <h3 className="text-lg font-bold text-grpsi-blue">{g.title}</h3>
                                <ul className="mt-4 space-y-2">
                                    {g.items.map((item) => (
                                        <li key={item} className={cn(surface.tile, "flex gap-2.5 px-3.5 py-2.5 text-sm font-medium text-slate-700")}>
                                            <Check className="w-4 h-4 mt-0.5 text-grpsi-blue-light shrink-0" aria-hidden />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        ))}
                    </div>
                    <div className="mt-5 grid gap-5 sm:grid-cols-3">
                        <Photo {...PHOTOS.mobilisation} sizes="(min-width: 640px) 360px, 100vw" className="aspect-[4/3]" />
                        <Photo {...PHOTOS.bulkEarthworks} sizes="(min-width: 640px) 360px, 100vw" className="aspect-[4/3]" />
                        <Photo {...PHOTOS.gizoFuel} sizes="(min-width: 640px) 360px, 100vw" className="aspect-[4/3]" />
                    </div>
                </Container>
            </section>

            {/* Partner with GRP */}
            <section className="pb-8">
                <Container>
                    <div className={cn(surface.dark, "p-6 sm:p-10")}>
                        <SectionHeading onDark eyebrow="Partner with GRP" title="Reliable in-country execution" description={PARTNERS.intro} />
                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {[
                                { title: "Who we work with", items: PARTNERS.clients },
                                { title: "How we engage", items: PARTNERS.engagements },
                            ].map((group) => (
                                <div key={group.title} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
                                    <Eyebrow onDark className="mb-4">{group.title}</Eyebrow>
                                    <ul className="flex flex-wrap gap-2">
                                        {group.items.map((item) => (
                                            <li key={item} className="rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm font-semibold">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            <CtaBand cta={home.cta} />
        </>
    );
}
