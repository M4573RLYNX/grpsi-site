import {
    Anchor, Drill, Factory, Fuel, Globe, HardHat, Ship, Truck, Users, Waves, Wrench, type LucideIcon,
} from "lucide-react";

/** Icon names that can be entered in the admin (service.icon, footer.social[].platform). */
const REGISTRY: Record<string, LucideIcon> = {
    Anchor, Drill, Factory, Fuel, Globe, HardHat, Ship, Truck, Users, Waves, Wrench,
};

export function resolveIcon(name: string | undefined, fallback: LucideIcon = Ship): LucideIcon {
    return (name && REGISTRY[name.trim()]) || fallback;
}
