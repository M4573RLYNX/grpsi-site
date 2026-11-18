import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { FooterContent } from "@/lib/types";
import { COMPANY } from "@/lib/company";
import { resolveIcon } from "./icons";
import { Container, Eyebrow, cn, focusRing, telHref } from "./ui";

const LINKS = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
];

export default function Footer({ footer }: { footer: FooterContent }) {
    const social = footer.social.filter((s) => /^https?:\/\//.test(s.url));
    const year = new Date().getFullYear();

    return (
        <footer className="px-3 sm:px-4 pb-3 sm:pb-4 mt-8">
            <div className="mx-auto max-w-[1400px] rounded-[32px] bg-grpsi-blue text-white overflow-hidden relative">
                <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-grpsi-blue-light/40 blur-3xl" />
                <Container className="relative py-14 sm:py-16">
                    <div className="grid gap-10 md:grid-cols-12">
                        <div className="md:col-span-5 space-y-5">
                            <Image src="/logo.png" alt="GPRSI" width={200} height={26} className="h-7 w-auto" />
                            {footer.description && <p className="text-white/70 leading-relaxed max-w-md">{footer.description}</p>}
                            {social.length > 0 && (
                                <ul className="flex gap-2">
                                    {social.map((s, i) => {
                                        const Icon = resolveIcon(s.platform, Globe);
                                        return (
                                            <li key={i}>
                                                <a
                                                    href={s.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${s.platform} (opens in new tab)`}
                                                    className={cn(focusRing, "h-10 w-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center hover:bg-grpsi-gold hover:text-grpsi-blue transition-all focus-visible:ring-white")}
                                                >
                                                    <Icon className="w-4 h-4" aria-hidden />
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        <nav aria-label="Footer" className="md:col-span-3">
                            <Eyebrow onDark className="mb-4">Explore</Eyebrow>
                            <ul className="space-y-2.5">
                                {LINKS.map((l) => (
                                    <li key={l.href}>
                                        <Link href={l.href} className="text-white/80 hover:text-grpsi-gold transition-colors">
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="md:col-span-4">
                            <Eyebrow onDark className="mb-4">Get in touch</Eyebrow>
                            <ul className="space-y-3 text-white/80">
                                {footer.address && (
                                    <li className="flex gap-3">
                                        <MapPin className="w-5 h-5 text-grpsi-gold shrink-0" aria-hidden />
                                        <span>{footer.address}</span>
                                    </li>
                                )}
                                {footer.phone && (
                                    <li>
                                        <a href={telHref(footer.phone)} className="flex gap-3 hover:text-grpsi-gold transition-colors">
                                            <Phone className="w-5 h-5 text-grpsi-gold shrink-0" aria-hidden />
                                            {footer.phone}
                                        </a>
                                    </li>
                                )}
                                {footer.email && (
                                    <li>
                                        <a href={`mailto:${footer.email}`} className="flex gap-3 hover:text-grpsi-gold transition-colors break-all">
                                            <Mail className="w-5 h-5 text-grpsi-gold shrink-0" aria-hidden />
                                            {footer.email}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-sm text-white/50">
                        <p>
                            © {year} {COMPANY.name}. {COMPANY.ownership}. Business number {COMPANY.businessNumber}.
                        </p>
                        <p>{COMPANY.tagline}</p>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
