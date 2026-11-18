"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn, focusRing } from "./ui";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
];

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

/** Floating pill navbar. Transparent over the home hero until scrolled; white glass elsewhere. */
export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);

    // Close the menu on any route change (link click, back/forward), adjusting state during render.
    const [lastPath, setLastPath] = useState(pathname);
    if (pathname !== lastPath) {
        setLastPath(pathname);
        setOpen(false);
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        const frame = requestAnimationFrame(onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setOpen(false);
            toggleRef.current?.focus();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const overHero = pathname === "/" && !scrolled && !open;

    return (
        <header className="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-50">
            <nav
                aria-label="Primary"
                className={cn(
                    "relative mx-auto max-w-6xl flex items-center gap-2 rounded-full pl-4 pr-2 py-2 transition-all duration-300 backdrop-blur-xl",
                    overHero
                        ? "bg-white/10 ring-1 ring-white/20 text-white"
                        : "bg-white/85 ring-1 ring-slate-200/70 shadow-premium text-grpsi-blue",
                )}
            >
                <Link href="/" className={cn(focusRing, "flex items-center shrink-0 rounded-full focus-visible:ring-grpsi-gold")} aria-label="GRP & Associates — home">
                    <Image
                        src="/logo.png"
                        alt="GPRSI"
                        width={200}
                        height={26}
                        priority
                        className={cn("h-6 sm:h-7 w-auto transition-[filter] duration-300", !overHero && "filter-grpsi-blue")}
                    />
                </Link>

                <ul className="hidden md:flex items-center gap-1 mx-auto">
                    {NAV_LINKS.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        focusRing, "block rounded-full px-4 py-2 text-sm font-semibold transition-all",
                                        overHero ? "focus-visible:ring-white" : "focus-visible:ring-grpsi-blue",
                                        active
                                            ? overHero ? "bg-white text-grpsi-blue" : "bg-grpsi-blue text-white"
                                            : overHero ? "text-white/85 hover:bg-white/15 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-grpsi-blue",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <Link
                    href="/contact"
                    className={cn(
                        focusRing, "hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus-visible:ring-offset-2",
                        overHero ? "bg-grpsi-gold text-grpsi-blue hover:bg-grpsi-gold-muted focus-visible:ring-white" : "bg-grpsi-blue text-white hover:bg-grpsi-blue-light focus-visible:ring-grpsi-blue",
                    )}
                >
                    Get a quote
                    <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>

                <button
                    ref={toggleRef}
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label={open ? "Close menu" : "Open menu"}
                    className={cn(
                        focusRing, "md:hidden ml-auto h-10 w-10 rounded-full flex items-center justify-center transition-all",
                        overHero ? "bg-white/15 hover:bg-white/25 focus-visible:ring-white" : "bg-slate-100 hover:bg-slate-200 focus-visible:ring-grpsi-blue",
                    )}
                >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Mobile menu */}
                <div
                    id="mobile-menu"
                    hidden={!open}
                    className="md:hidden absolute top-full inset-x-0 mt-2 rounded-[28px] bg-white ring-1 ring-slate-200/70 shadow-float p-3"
                >
                    <ul className="space-y-1">
                        {NAV_LINKS.map((link) => {
                            const active = isActive(pathname, link.href);
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex items-center min-h-12 rounded-2xl px-4 text-base font-semibold transition-all",
                                            active ? "bg-grpsi-blue text-white" : "text-slate-700 hover:bg-slate-100",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="mt-2 flex items-center justify-center gap-2 min-h-12 rounded-2xl bg-grpsi-gold text-grpsi-blue font-semibold"
                    >
                        Get a quote
                        <ArrowRight className="w-4 h-4" aria-hidden />
                    </Link>
                </div>
            </nav>
        </header>
    );
}
