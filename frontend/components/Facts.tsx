import type { Fact } from "@/lib/types";
import { cn, surface } from "./ui";

// Literal class names so Tailwind can detect them.
const COLS: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
};

/** Company facts strip (e.g. established, ownership, bases, business number). Hidden when empty. */
export default function Facts({ facts, className }: { facts: Fact[]; className?: string }) {
    const items = facts.filter((f) => f.label?.trim() || f.value?.trim());
    if (items.length === 0) return null;

    return (
        <dl className={cn(surface.card, "grid gap-2 p-2", COLS[items.length] ?? "grid-cols-2 lg:grid-cols-4", className)}>
            {items.map((f, i) => (
                <div key={i} className="rounded-[22px] bg-slate-50 p-5 sm:p-6">
                    <dt className="text-sm font-medium text-slate-600">{f.label}</dt>
                    <dd className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-grpsi-blue break-words">{f.value}</dd>
                </div>
            ))}
        </dl>
    );
}
