import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getContent } from "@/lib/content";
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

const nonEmpty = (items: string[]) => items.filter((s) => s?.trim());

export default async function ServicesPage() {
    const { services, servicesPage: page, home } = await getContent();
    const capabilities = page.capabilities.filter((c) => c.title?.trim());
    const deliveryItems = nonEmpty(page.delivery.items);
    const deliveryPhotos = page.deliveryPhotos.filter((p) => p.src).slice(0, 2);
    const groups = page.equipment.groups.filter((g) => g.title?.trim() || nonEmpty(g.items).length);
    const equipmentPhotos = page.equipmentPhotos.filter((p) => p.src);
    const partnerGroups = [
        { title: "Who we work with", items: nonEmpty(page.partners.clients) },
        { title: "How we engage", items: nonEmpty(page.partners.engagements) },
    ].filter((g) => g.items.length);

    return (
        <>
            <PageHeader eyebrow={page.header.eyebrow} title={page.header.title} description={page.header.description} />

            {/* Capabilities */}
            {capabilities.length > 0 && (
                <Container>
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {capabilities.map((c, i) => (
                            <li key={`${c.title}-${i}`}>
                                <Reveal delay={i * 0.05} className={cn(surface.card, "h-full p-6 sm:p-7")}>
                                    <IconBadge icon={resolveIcon(c.icon)} tone="solid" />
                                    <h2 className="mt-5 text-xl font-bold text-grpsi-blue">{c.title}</h2>
                                    <p className="mt-2 text-slate-600 leading-relaxed">{c.description}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ul>
                </Container>
            )}

            {/* Service delivery & reliability */}
            {deliveryItems.length > 0 && (
                <section className="pt-16 sm:pt-20">
                    <Container>
                        <div className={cn("grid gap-5 items-stretch", deliveryPhotos.length > 0 && "lg:grid-cols-2")}>
                            <Reveal className={cn(surface.card, "p-6 sm:p-10")}>
                                <SectionHeading eyebrow="Service delivery & reliability" title={page.delivery.title} />
                                <ul className="mt-8 space-y-3">
                                    {deliveryItems.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-slate-700">
                                            <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-grpsi-blue/10 text-grpsi-blue flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5" aria-hidden />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                            {deliveryPhotos.length > 0 && (
                                <div className={cn("grid gap-5", deliveryPhotos.length === 2 && "grid-cols-2")}>
                                    {deliveryPhotos.map((p, i) => (
                                        <Photo key={i} {...p} sizes="(min-width: 1024px) 270px, 50vw" className="aspect-[4/5] lg:aspect-auto min-h-64" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </Container>
                </section>
            )}

            {/* Admin-managed service divisions */}
            {services.length > 0 && (
                <section className="pt-16 sm:pt-20">
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
            {(groups.length > 0 || page.equipment.intro) && (
                <section className="pt-16 sm:pt-20">
                    <Container>
                        <SectionHeading eyebrow="Plant & equipment" title="Operating resources" description={page.equipment.intro} />
                        {groups.length > 0 && (
                            <div className="mt-10 grid gap-5 md:grid-cols-3">
                                {groups.map((g, i) => (
                                    <Reveal key={`${g.title}-${i}`} className={cn(surface.card, "p-6 sm:p-7")}>
                                        <h3 className="text-lg font-bold text-grpsi-blue">{g.title}</h3>
                                        <ul className="mt-4 space-y-2">
                                            {nonEmpty(g.items).map((item, j) => (
                                                <li key={j} className={cn(surface.tile, "flex gap-2.5 px-3.5 py-2.5 text-sm font-medium text-slate-700")}>
                                                    <Check className="w-4 h-4 mt-0.5 text-grpsi-blue-light shrink-0" aria-hidden />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                        {equipmentPhotos.length > 0 && (
                            <div className="mt-5 grid gap-5 sm:grid-cols-3">
                                {equipmentPhotos.map((p, i) => (
                                    <Photo key={i} {...p} sizes="(min-width: 640px) 360px, 100vw" className="aspect-[4/3]" />
                                ))}
                            </div>
                        )}
                    </Container>
                </section>
            )}

            {/* Partner with GRP */}
            {(partnerGroups.length > 0 || page.partners.intro) && (
                <section className="pt-16 sm:pt-20 pb-8">
                    <Container>
                        <div className={cn(surface.dark, "p-6 sm:p-10")}>
                            <SectionHeading onDark eyebrow="Partner with GRP" title="Reliable in-country execution" description={page.partners.intro} />
                            {partnerGroups.length > 0 && (
                                <div className="mt-10 grid gap-5 md:grid-cols-2">
                                    {partnerGroups.map((group) => (
                                        <div key={group.title} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
                                            <Eyebrow onDark className="mb-4">{group.title}</Eyebrow>
                                            <ul className="flex flex-wrap gap-2">
                                                {group.items.map((item, i) => (
                                                    <li key={i} className="rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-2 text-sm font-semibold">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Container>
                </section>
            )}

            <CtaBand cta={home.cta} />
        </>
    );
}
