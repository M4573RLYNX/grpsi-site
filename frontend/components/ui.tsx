/**
 * Shared design primitives for the public site.
 * Visual vocabulary mirrors the admin panel: floating rounded cards with thin rings,
 * navy primary, gold used only as an accent.
 * All components here are server-safe (no hooks).
 */
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Keyboard focus ring; pair with a `focus-visible:ring-{color}` class. */
export const focusRing = "focus-visible:outline-none focus-visible:ring-2";

/** tel: link from a display phone number, e.g. "+677 24567" → "tel:+67724567". */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/* ---------- Surfaces ---------- */

export const surface = {
    card: "rounded-[28px] bg-white/80 backdrop-blur ring-1 ring-slate-200/70 shadow-premium",
    tile: "rounded-2xl bg-slate-50 ring-1 ring-slate-200/70",
    /** Rounded frame for a fill image (parent must not be `static`). */
    media: "relative overflow-hidden rounded-[28px] ring-1 ring-slate-200/70",
    dark: "rounded-[28px] bg-grpsi-blue text-white ring-1 ring-white/10 shadow-float",
} as const;

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

/* ---------- Buttons ---------- */

const buttonVariants = {
    primary: "bg-grpsi-blue text-white shadow-lg shadow-grpsi-blue/20 hover:bg-grpsi-blue-light focus-visible:ring-grpsi-blue",
    secondary: "bg-white text-grpsi-blue ring-1 ring-slate-200 hover:ring-grpsi-blue/40 hover:bg-slate-50 focus-visible:ring-grpsi-blue",
    gold: "bg-grpsi-gold text-grpsi-blue shadow-lg shadow-black/10 hover:bg-grpsi-gold-muted focus-visible:ring-white",
    ghostOnDark: "bg-white/10 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 focus-visible:ring-white",
} as const;

const buttonSizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-4 text-base",
} as const;

type ButtonProps = {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    className?: string;
    children: React.ReactNode;
} & (
    | { href: string; type?: never; disabled?: never; onClick?: never }
    | { href?: undefined; type?: "button" | "submit"; disabled?: boolean; onClick?: () => void }
);

/**
 * Renders a Next <Link> for internal paths, an <a> for external/mailto/tel links,
 * and a <button> otherwise — so buttons are never nested inside links.
 */
export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
    const classes = cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all",
        focusRing,
        "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className,
    );

    if (rest.href !== undefined) {
        const href = rest.href;
        const internal = (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");
        if (internal) {
            return <Link href={href} className={classes}>{children}</Link>;
        }
        const external = /^https?:\/\//.test(href);
        return (
            <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
            </a>
        );
    }
    return (
        <button type={rest.type ?? "button"} disabled={rest.disabled} onClick={rest.onClick} className={classes}>
            {children}
        </button>
    );
}

/* ---------- Text ---------- */

export function Eyebrow({
    onDark,
    as: Tag = "p",
    className,
    children,
}: {
    onDark?: boolean;
    as?: "p" | "h2" | "span";
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Tag className={cn("block text-[11px] uppercase tracking-[0.2em] font-bold", onDark ? "text-white/70" : "text-grpsi-blue-light", className)}>
            {children}
        </Tag>
    );
}

const pillTones = {
    blue: "bg-grpsi-blue/10 text-grpsi-blue",
    slate: "bg-white/90 text-slate-700 ring-1 ring-slate-200",
    gold: "bg-grpsi-gold text-grpsi-blue",
    onDark: "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur",
} as const;

export function Pill({ tone = "blue", className, children }: { tone?: keyof typeof pillTones; className?: string; children: React.ReactNode }) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider", pillTones[tone], className)}>
            {children}
        </span>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    align = "left",
    as: Tag = "h2",
    onDark,
    className,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
    as?: "h1" | "h2";
    onDark?: boolean;
    className?: string;
}) {
    return (
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
            {eyebrow && <Eyebrow onDark={onDark} className="mb-3">{eyebrow}</Eyebrow>}
            <Tag
                className={cn(
                    "font-black tracking-tight text-balance",
                    Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
                    onDark ? "text-white" : "text-grpsi-blue",
                )}
            >
                {title}
            </Tag>
            {description && (
                <p className={cn("mt-4 text-base sm:text-lg leading-relaxed", onDark ? "text-white/80" : "text-slate-600")}>{description}</p>
            )}
        </div>
    );
}

/** Top-of-page header for inner pages; clears the floating navbar. */
export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: React.ReactNode }) {
    return (
        <header className="relative pt-32 sm:pt-40 pb-10 sm:pb-14 overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-grpsi-blue/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute top-10 -left-20 h-64 w-64 rounded-full bg-grpsi-gold/20 blur-3xl" />
            <Container className="relative">
                <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
                {children}
            </Container>
        </header>
    );
}

/* ---------- Icons ---------- */

const iconBadgeTones = {
    light: "bg-grpsi-blue/5 text-grpsi-blue ring-1 ring-grpsi-blue/10",
    solid: "bg-grpsi-blue text-grpsi-gold shadow-lg shadow-grpsi-blue/20",
    onDark: "bg-white/10 text-grpsi-gold ring-1 ring-white/15",
} as const;

export function IconBadge({ icon: Icon, tone = "light", className }: { icon: LucideIcon; tone?: keyof typeof iconBadgeTones; className?: string }) {
    return (
        <div className={cn("h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center", iconBadgeTones[tone], className)}>
            <Icon className="w-5 h-5" aria-hidden />
        </div>
    );
}
