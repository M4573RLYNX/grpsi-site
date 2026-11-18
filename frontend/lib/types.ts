/** Shape of the CMS document served by GET /api/content. */

export type LinkButton = { label: string; link: string };

/** An image with its caption/alt text. `src` is a URL or a /public path. */
export type PhotoItem = { src: string; alt: string };
/** A titled card with a lucide icon name (resolved by components/icons.ts). */
export type IconCard = { title: string; icon: string; description: string };
export type Fact = { label: string; value: string };
export type Person = { name: string; role: string; focus: string };
export type EquipmentGroup = { title: string; items: string[] };

/** Editable content of the /services page (besides the service lines themselves). */
export interface ServicesPageContent {
    header: { eyebrow: string; title: string; description: string };
    capabilities: IconCard[];
    delivery: { title: string; items: string[] };
    deliveryPhotos: PhotoItem[];
    equipment: { intro: string; groups: EquipmentGroup[] };
    equipmentPhotos: PhotoItem[];
    partners: { intro: string; clients: string[]; engagements: string[] };
}

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
    /** Photo beside the "who we are" section on the home page. */
    aboutPhoto: PhotoItem;
}

export interface AboutContent {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    stats: { staff: string; experience: string; vessels: string; provinces: string };
    facts: Fact[];
    leadershipIntro: string;
    leadership: Person[];
    commitments: IconCard[];
    commitmentStatement: string;
    photos: { story: PhotoItem; leadership: PhotoItem; commitment: PhotoItem };
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
    tagline: string;
    ownership: string;
    businessNumber: string;
    operations: string;
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
    servicesPage: ServicesPageContent;
    projects: ResolvedProject[];
}
