import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/types";
import { resolveIcon } from "./icons";
import SafeImage from "./SafeImage";
import { Button, IconBadge, cn, surface } from "./ui";

/** Compact service card used on the home page preview. */
export function ServiceCard({ service }: { service: Service }) {
    const Icon = resolveIcon(service.icon);
    return (
        <article className={cn(surface.card, "group h-full p-6 sm:p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-float")}>
            <IconBadge icon={Icon} tone="solid" />
            <h3 className="mt-5 text-xl font-bold text-grpsi-blue">{service.title}</h3>
            <p className="mt-2 text-slate-600 leading-relaxed line-clamp-4">{service.description}</p>
            {service.features.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {service.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex gap-2">
                            <Check className="w-4 h-4 mt-0.5 text-grpsi-blue-light shrink-0" aria-hidden />
                            {f}
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}

/** Full service block used on the services page; alternates image side. */
export function ServiceDetail({ service, index }: { service: Service; index: number }) {
    const Icon = resolveIcon(service.icon);
    const reversed = index % 2 === 1;
    return (
        <article id={service.id ? `service-${service.id}` : undefined} className={cn(surface.card, "scroll-mt-28 p-3 sm:p-4")}>
            <div className={cn("grid gap-6 lg:gap-10 lg:grid-cols-2 items-center", reversed && "lg:[&>*:first-child]:order-2")}>
                <div className="relative aspect-[4/3] rounded-[22px] overflow-hidden bg-slate-100">
                    <SafeImage src={service.image} alt={service.title} sizes="(min-width: 1024px) 560px, 100vw" />
                </div>
                <div className="px-3 pb-5 sm:px-4 lg:px-2 lg:py-6">
                    <div className="flex items-center gap-3">
                        <IconBadge icon={Icon} tone="solid" />
                        <span className="text-sm font-semibold text-slate-500">0{index + 1}</span>
                    </div>
                    <h2 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight text-grpsi-blue">{service.title}</h2>
                    <p className="mt-3 text-slate-600 leading-relaxed">{service.description}</p>
                    {service.features.length > 0 && (
                        <ul className="mt-6 grid sm:grid-cols-2 gap-2">
                            {service.features.filter(Boolean).map((f, i) => (
                                <li key={i} className={cn(surface.tile, "flex gap-2.5 px-3.5 py-3 text-sm font-medium text-slate-700")}>
                                    <Check className="w-4 h-4 mt-0.5 text-grpsi-blue-light shrink-0" aria-hidden />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    )}
                    <Button href={`/contact?subject=${encodeURIComponent(`Enquiry: ${service.title}`)}`} variant="secondary" className="mt-7">
                        Request a quote
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </Button>
                </div>
            </div>
        </article>
    );
}
