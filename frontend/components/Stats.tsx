import type { AboutContent } from "@/lib/types";
import { cn, surface } from "./ui";

const LABELS: { key: keyof AboutContent["stats"]; label: string }[] = [
    { key: "experience", label: "Years of experience" },
    { key: "staff", label: "Team members" },
    { key: "vessels", label: "Vessels in fleet" },
    { key: "provinces", label: "Provinces served" },
];

// Literal class names so Tailwind can detect them.
const COLS: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
};

/** Key company figures. Empty values are hidden; renders nothing if all are empty. */
export default function Stats({ stats, className }: { stats: AboutContent["stats"]; className?: string }) {
    const items = LABELS.filter(({ key }) => String(stats[key] ?? "").trim());
    if (items.length === 0) return null;

    return (
        <dl className={cn(surface.card, "grid gap-2 p-2", COLS[items.length], className)}>
            {items.map(({ key, label }) => (
                <div key={key} className="rounded-[22px] bg-gradient-to-br from-grpsi-blue/[0.03] to-grpsi-blue/[0.08] p-5 sm:p-6">
                    <dt className="text-sm font-medium text-slate-600">{label}</dt>
                    <dd className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-grpsi-blue tabular-nums">{stats[key]}</dd>
                </div>
            ))}
        </dl>
    );
}
