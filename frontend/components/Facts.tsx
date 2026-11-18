import { FACTS } from "@/lib/company";
import { cn, surface } from "./ui";

/** Company facts from the capability statement (established, ownership, bases, business number). */
export default function Facts({ className }: { className?: string }) {
    return (
        <dl className={cn(surface.card, "grid grid-cols-2 lg:grid-cols-4 gap-2 p-2", className)}>
            {FACTS.map((f) => (
                <div key={f.label} className="rounded-[22px] bg-slate-50 p-5 sm:p-6">
                    <dt className="text-sm font-medium text-slate-600">{f.label}</dt>
                    <dd className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-grpsi-blue break-words">{f.value}</dd>
                </div>
            ))}
        </dl>
    );
}
