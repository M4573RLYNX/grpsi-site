import {
    Anchor, BadgeCheck, ClipboardList, Drill, Factory, Fuel, Globe, GraduationCap, HardHat, Leaf, Pickaxe,
    Scale, ShieldCheck, Ship, Truck, Users, Warehouse, Waves, Wrench, type LucideIcon,
} from "lucide-react";

/** Icon names usable in content (service.icon, footer.social[].platform, lib/company.ts). */
const REGISTRY: Record<string, LucideIcon> = {
    Anchor, BadgeCheck, ClipboardList, Drill, Factory, Fuel, Globe, GraduationCap, HardHat, Leaf, Pickaxe,
    Scale, ShieldCheck, Ship, Truck, Users, Warehouse, Waves, Wrench,
};

export function resolveIcon(name: string | undefined, fallback: LucideIcon = Ship): LucideIcon {
    return (name && REGISTRY[name.trim()]) || fallback;
}
