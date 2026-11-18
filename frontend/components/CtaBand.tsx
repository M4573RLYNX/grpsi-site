import { ArrowRight, Phone } from "lucide-react";
import type { HomeContent } from "@/lib/types";
import { Button, Container, SectionHeading, telHref } from "./ui";

/** Navy call-to-action panel used at the bottom of most pages. */
export default function CtaBand({ cta }: { cta: HomeContent["cta"] }) {
    return (
        <section className="py-12 sm:py-16">
            <Container>
                <div className="relative overflow-hidden rounded-[32px] bg-grpsi-blue px-6 py-12 sm:px-12 sm:py-16 shadow-float">
                    <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-grpsi-gold/20 blur-3xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-grpsi-blue-light/50 blur-3xl" />
                    <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <SectionHeading onDark eyebrow="Let's talk" title={cta.title || "Ready to start your next project?"} description={cta.description} />
                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            <Button href="/contact" variant="gold" size="lg">
                                Contact us
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Button>
                            {cta.phone && (
                                <Button href={telHref(cta.phone)} variant="ghostOnDark" size="lg">
                                    <Phone className="w-4 h-4" aria-hidden />
                                    {cta.phone}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
