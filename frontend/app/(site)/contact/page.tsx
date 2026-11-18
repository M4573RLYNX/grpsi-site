import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getContent } from "@/lib/content";
import { COMPANY } from "@/lib/company";
import ContactForm from "@/components/ContactForm";
import { Container, IconBadge, PageHeader, cn, focusRing, surface, telHref } from "@/components/ui";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with GRP & Associates in Honiara about logistics, engineering or fuel supply.",
};

export default async function ContactPage() {
    const { footer } = await getContent();

    const details = [
        footer.phone && { label: "Call us", value: footer.phone, href: telHref(footer.phone), icon: Phone },
        footer.email && { label: "Email us", value: footer.email, href: `mailto:${footer.email}`, icon: Mail },
        footer.address && { label: "Visit us", value: footer.address, icon: MapPin },
    ].filter(Boolean) as { label: string; value: string; href?: string; icon: typeof Phone }[];

    return (
        <>
            <PageHeader
                eyebrow="Contact"
                title="Let's talk about your project"
                description="Whether it's a charter, a construction tender or a fuel contract, our Honiara team is ready to help."
            />

            <Container className="pb-12">
                <div className="grid gap-5 lg:grid-cols-5 items-start">
                    <div className={cn(surface.dark, "lg:col-span-2 p-6 sm:p-8")}>
                        <h2 className="text-xl font-bold">Contact details</h2>
                        {details.length > 0 ? (
                            <ul className="mt-6 space-y-3">
                                {details.map((d) => {
                                    const inner = (
                                        <>
                                            <IconBadge icon={d.icon} tone="onDark" />
                                            <span className="min-w-0">
                                                <span className="block text-sm text-white/60">{d.label}</span>
                                                <span className="block font-semibold break-words">{d.value}</span>
                                            </span>
                                        </>
                                    );
                                    return (
                                        <li key={d.label}>
                                            {d.href ? (
                                                <a href={d.href} className={cn(focusRing, "flex items-center gap-4 rounded-2xl p-2 -m-2 hover:bg-white/5 transition-all focus-visible:ring-white")}>
                                                    {inner}
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-4">{inner}</div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="mt-4 text-white/70">Contact details are being updated.</p>
                        )}
                        <dl className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-white/60">Operations</dt>
                                <dd className="font-semibold">Honiara &amp; Gizo</dd>
                            </div>
                            <div>
                                <dt className="text-white/60">Business number</dt>
                                <dd className="font-semibold">{COMPANY.businessNumber}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className={cn(surface.card, "lg:col-span-3 p-6 sm:p-8")}>
                        <h2 className="text-xl font-bold text-grpsi-blue mb-6">Send us a message</h2>
                        <Suspense fallback={<div className="h-96" />}>
                            <ContactForm to={footer.email} />
                        </Suspense>
                    </div>
                </div>
            </Container>
        </>
    );
}
