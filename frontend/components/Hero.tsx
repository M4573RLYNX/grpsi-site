import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/lib/types";
import SafeImage from "./SafeImage";
import { Button, Container } from "./ui";

/** Wraps the first occurrence of `highlight` in the title with an accent span. */
function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
    const i = highlight ? title.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
    if (i === -1) return <>{title}</>;
    return (
        <>
            {title.slice(0, i)}
            <span className="text-grpsi-gold">{title.slice(i, i + highlight.length)}</span>
            {title.slice(i + highlight.length)}
        </>
    );
}

export default function Hero({ hero }: { hero: HomeContent["hero"] }) {
    const { primary, secondary } = hero.buttons;

    return (
        <section className="relative isolate min-h-[92svh] flex items-end overflow-hidden bg-grpsi-blue">
            <SafeImage src={hero.backgroundImage} alt="" sizes="100vw" priority className="-z-20" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-grpsi-blue via-grpsi-blue/60 to-grpsi-blue/30" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-grpsi-blue/70 to-transparent" />

            <Container className="pt-36 pb-28 sm:pb-36">
                <div className="max-w-3xl">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white text-balance leading-[1.05]">
                        <HighlightedTitle title={hero.title} highlight={hero.highlight} />
                    </h1>
                    {hero.subtitle && <p className="mt-6 text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl">{hero.subtitle}</p>}

                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        {primary?.label && primary?.link && (
                            <Button href={primary.link} variant="gold" size="lg">
                                {primary.label}
                                <ArrowRight className="w-4 h-4" aria-hidden />
                            </Button>
                        )}
                        {secondary?.label && secondary?.link && (
                            <Button href={secondary.link} variant="ghostOnDark" size="lg">
                                {secondary.label}
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
