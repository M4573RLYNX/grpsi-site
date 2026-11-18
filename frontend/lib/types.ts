/** Shape of the CMS document served by GET /api/content. */

export type LinkButton = { label: string; link: string };

export interface HomeContent {
    hero: {
        title: string;
        highlight: string;
        subtitle: string;
        backgroundImage: string;
        establishedText: string;
        buttons: { primary: LinkButton; secondary: LinkButton };
    };
    cta: { title: string; description: string; phone: string };
}

export interface AboutContent {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    stats: { staff: string; experience: string; vessels: string; provinces: string };
}

export interface SocialLink {
    /** lucide icon name, e.g. "Globe" */
    platform: string;
    url: string;
}

export interface FooterContent {
    description: string;
    address: string;
    email: string;
    phone: string;
    social: SocialLink[];
}

export interface Service {
    id: string;
    title: string;
    description: string;
    /** lucide icon name, e.g. "Ship" | "Fuel" | "HardHat" */
    icon: string;
    features: string[];
    image: string;
}

export interface Project {
    title: string;
    location: string;
    year: string;
    category: string;
    image: string;
    description: string;
    slug?: string;
    challenge?: string;
    solution?: string;
    result?: string;
}

/** A project whose slug has been resolved (explicit slug or derived from title). */
export type ResolvedProject = Project & { slug: string };

export interface SiteContent {
    home: HomeContent;
    about: AboutContent;
    footer: FooterContent;
    services: Service[];
    projects: ResolvedProject[];
}
