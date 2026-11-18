/**
 * Default company content, taken from the 2026 GRP Capability Statement.
 *
 * These defaults fill any admin-editable field that hasn't been saved to the CMS yet,
 * so the site shows this content until someone changes it in the admin portal.
 * Safe to import from both server and client code.
 */
import type { AboutContent, FooterContent, HomeContent, PhotoItem, ServicesPageContent } from "./types";

export const COMPANY_NAME = "GRP & Associates Ltd";

/** Shown on About when the admin hasn't written a company description. */
export const BACKGROUND = [
    "GRP & Associates Ltd is a 100% locally owned Solomon Islands company established in 1987. From its origins in business consulting and fuel operations, GRP has developed into a multidisciplinary project delivery business serving mining, civil construction, infrastructure, logistics, marine and property projects across the country.",
    "GRP combines local knowledge, remote-site operating experience, practical engineering capability and an established logistics network. Our teams mobilise people, equipment, fuel and materials to difficult locations and manage delivery from planning through construction, commissioning and handover.",
];

/** Lucide icon names offered in the admin icon pickers (all resolvable by components/icons.ts). */
export const ICON_CHOICES = [
    "HardHat", "Pickaxe", "Anchor", "Ship", "ClipboardList", "Warehouse", "Fuel", "Truck", "Drill", "Factory",
    "Waves", "Wrench", "ShieldCheck", "BadgeCheck", "Users", "GraduationCap", "Leaf", "Scale", "Globe",
];

const photo = (src: string, alt: string): PhotoItem => ({ src, alt });

const PHOTOS = {
    cover: photo("/images/cover.jpeg", "Landing craft unloading at a remote beach as the community helps bring cargo ashore"),
    interIslandShipping: photo("/images/inter-island-shipping.jpeg", "Inter-island shipping"),
    mineSiteFleet: photo("/images/mine-site-fleet.jpeg", "Mine-site plant and haulage fleet"),
    bulkEarthworks: photo("/images/bulk-earthworks.jpeg", "Bulk earthworks in challenging terrain"),
    gizoFuel: photo("/images/gizo-fuel-storage.jpeg", "Gizo fuel storage infrastructure"),
    mobilisation: photo("/images/heavy-equipment-mobilisation.jpeg", "Heavy-equipment mobilisation to project site"),
    groundbreaking: photo("/images/choiseul-bay-groundbreaking.jpeg", "Choiseul Bay Township groundbreaking"),
    toolbox: photo("/images/toolbox-briefing.jpeg", "On-site toolbox and workforce briefing"),
};

export const DEFAULT_HOME_EXTRAS: Pick<HomeContent, "aboutPhoto"> = {
    aboutPhoto: PHOTOS.bulkEarthworks,
};

export const DEFAULT_FOOTER_EXTRAS: Pick<FooterContent, "tagline" | "ownership" | "businessNumber" | "operations"> = {
    tagline: "Local Delivery. Global Standards.",
    ownership: "100% Solomon Islands owned",
    businessNumber: "SBN1000097",
    operations: "Honiara & Gizo",
};

export const DEFAULT_ABOUT_EXTRAS: Omit<AboutContent, "title" | "subtitle" | "description" | "mission" | "stats"> = {
    facts: [
        { label: "Established", value: "1987" },
        { label: "Locally owned", value: "100%" },
        { label: "Operating bases", value: "Honiara & Gizo" },
        { label: "Business number", value: "SBN1000097" },
    ],
    leadershipIntro:
        "GRP combines local executive leadership with experienced project, engineering, mining, commercial, legal and operational personnel. The project team is selected to suit each assignment and supported by specialist consultants and subcontractors where required.",
    leadership: [
        { name: "Donald Hemmer", role: "Managing Director", focus: "Operations, strategy, commercial leadership and stakeholder engagement." },
        { name: "Constance Hemmer", role: "Director – Corporate & Legal Affairs", focus: "Corporate governance, legal, compliance, risk and organisational support." },
        { name: "Simas Tekulu", role: "Projects Manager", focus: "Mining, maintenance, construction, manufacturing and project start-up experience." },
        { name: "Albert Jammie Stanley", role: "Logistics & Procurement", focus: "Vessel management, loading operations, logistics coordination and procurement." },
        { name: "Paul MacMillan", role: "Project Manager / Training Specialist", focus: "Civil construction, heavy plant operations, training and assessment." },
    ],
    commitments: [
        { title: "Safety", icon: "ShieldCheck", description: "Project-specific planning, inductions, supervision, plant controls, incident reporting and corrective actions." },
        { title: "Quality", icon: "BadgeCheck", description: "Inspection and test records, measurement controls, material verification, hold points, document control and as-builts." },
        { title: "Community", icon: "Users", description: "Respectful landowner and community engagement, local recruitment, grievance pathways and clear communication of commitments." },
        { title: "Local capability", icon: "GraduationCap", description: "Practical skills transfer, supervised work experience, operator development and pathways for Solomon Islanders to progress into technical and leadership roles." },
        { title: "Environment", icon: "Leaf", description: "Work planning that addresses erosion, drainage, waste, fuel handling, rehabilitation and project-specific environmental obligations." },
        { title: "Governance", icon: "Scale", description: "Clear authorities, procurement controls, commercial records, approvals, progress reporting and escalation of material risks." },
    ],
    commitmentStatement:
        "GRP is committed to delivering practical, durable infrastructure and project services that create long-term value in Solomon Islands. We bring together local ownership, established in-country capability and fit-for-purpose specialist support to deliver safely, responsibly and commercially.",
    photos: { story: PHOTOS.cover, leadership: PHOTOS.groundbreaking, commitment: PHOTOS.toolbox },
};

export const DEFAULT_SERVICES_PAGE: ServicesPageContent = {
    header: {
        eyebrow: "Earthworks · Civil engineering · Construction · Logistics",
        title: "Practical delivery, wherever the project is",
        description:
            "We mobilise people, equipment, fuel and materials to difficult locations and manage delivery from planning through construction, commissioning and handover.",
    },
    capabilities: [
        { title: "Civil & infrastructure", icon: "HardHat", description: "Bulk earthworks; road construction and rehabilitation; drainage; retaining and coastal works; concrete structures; commercial and industrial facilities." },
        { title: "Mining & project support", icon: "Pickaxe", description: "Pit and access development; overburden and ore movement; stockpile management; mine infrastructure; camp and service-area construction; port and ship-loading support." },
        { title: "Marine & wharf works", icon: "Anchor", description: "Wharf rehabilitation and construction; piling; concrete precasting; coastal access; marine plant coordination; barge and vessel interfaces." },
        { title: "Logistics & supply chain", icon: "Ship", description: "International cargo clearance; devanning and transit storage; inter-island freight; fuel distribution; project mobilisation; critical spares and site delivery." },
        { title: "Project management", icon: "ClipboardList", description: "Programming; procurement; contractor coordination; cost and progress control; client reporting; quality records; construction and as-built documentation." },
        { title: "Property & industrial assets", icon: "Warehouse", description: "Fuel and logistics facilities; warehouses; land development; site planning; phased commercial and rental property delivery." },
    ],
    delivery: {
        title: "Built for remote, constrained sites",
        items: [
            "Project mobilisation and delivery in remote and logistically constrained locations",
            "Earthworks, roads, drainage, site development and structural civil works",
            "Mine development support, production infrastructure, stockpiles and port interfaces",
            "Marine construction, wharf works, piling and coastal infrastructure",
            "Shipping, fuel, freight, stores, procurement and supply-chain coordination",
            "Local workforce development, practical training and supervised skills transfer",
        ],
    },
    deliveryPhotos: [PHOTOS.interIslandShipping, PHOTOS.mineSiteFleet],
    equipment: {
        intro: "GRP maintains and coordinates the plant, workshops, marine interfaces and support resources needed for multi-site project delivery. Final equipment schedules are prepared for each tender or project based on scope, productivity, location and mobilisation requirements.",
        groups: [
            { title: "Earthworks & roads", items: ["20–35 tonne excavators", "Bulldozers and graders", "Compactors and rollers", "Loaders and backhoes", "Tipper and haul trucks"] },
            { title: "Civils & infrastructure", items: ["Concrete batching resources", "Piling and lifting equipment", "Cranes and rigging support", "Marine construction equipment", "Barge and vessel coordination"] },
            { title: "Support & logistics", items: ["Fully equipped workshops", "Mobile service units", "Fuel storage and distribution", "Transit storage and stores", "Procurement and freight coordination"] },
        ],
    },
    equipmentPhotos: [PHOTOS.mobilisation, PHOTOS.bulkEarthworks, PHOTOS.gizoFuel],
    partners: {
        intro: "GRP supports government agencies, resource companies, private enterprises, development partners and contractors requiring reliable in-country execution.",
        clients: ["Government agencies", "Resource companies", "Private enterprises", "Development partners", "Contractors"],
        engagements: ["Principal contractor", "Civil works contractor", "Logistics provider", "Local delivery partner", "Project-services provider"],
    },
};

/* ---------- Merging saved content over the defaults ---------- */

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {});
/** Saved array if it is one (an empty saved list stays empty), otherwise the default. */
const list = <T,>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) ? (v as T[]) : fallback);
/** Saved string if one was saved (an empty saved string stays empty), otherwise the default. */
const text = (v: unknown, fallback: string): string => (typeof v === "string" ? v : fallback);
const photoOr = (v: unknown, fallback: PhotoItem): PhotoItem => {
    const p = obj(v);
    return typeof p.src === "string" ? { src: p.src, alt: text(p.alt, "") } : fallback;
};
const photos = (v: unknown, fallback: PhotoItem[]) => list<PhotoItem>(v, fallback).map((p) => photoOr(p, { src: "", alt: "" }));

/**
 * Fills the editable company-profile fields (added for the capability statement) with
 * defaults where nothing has been saved yet. Leaves every other field untouched, so the
 * admin can use it on raw content without changing what gets saved elsewhere.
 */
export function withCompanyDefaults<T extends Obj>(raw: T): T & Pick<Obj, "home" | "about" | "footer" | "servicesPage"> {
    const home = obj(raw.home);
    const about = obj(raw.about);
    const footer = obj(raw.footer);
    const sp = obj(raw.servicesPage);
    const D = DEFAULT_SERVICES_PAGE;
    const A = DEFAULT_ABOUT_EXTRAS;
    const aboutPhotos = obj(about.photos);

    return {
        ...raw,
        home: { ...home, aboutPhoto: photoOr(home.aboutPhoto, DEFAULT_HOME_EXTRAS.aboutPhoto) },
        about: {
            ...about,
            facts: list(about.facts, A.facts),
            leadershipIntro: text(about.leadershipIntro, A.leadershipIntro),
            leadership: list(about.leadership, A.leadership),
            commitments: list(about.commitments, A.commitments),
            commitmentStatement: text(about.commitmentStatement, A.commitmentStatement),
            photos: {
                story: photoOr(aboutPhotos.story, A.photos.story),
                leadership: photoOr(aboutPhotos.leadership, A.photos.leadership),
                commitment: photoOr(aboutPhotos.commitment, A.photos.commitment),
            },
        },
        footer: {
            ...footer,
            tagline: text(footer.tagline, DEFAULT_FOOTER_EXTRAS.tagline),
            ownership: text(footer.ownership, DEFAULT_FOOTER_EXTRAS.ownership),
            businessNumber: text(footer.businessNumber, DEFAULT_FOOTER_EXTRAS.businessNumber),
            operations: text(footer.operations, DEFAULT_FOOTER_EXTRAS.operations),
        },
        servicesPage: {
            header: { ...D.header, ...obj(sp.header) },
            capabilities: list(sp.capabilities, D.capabilities),
            delivery: { title: text(obj(sp.delivery).title, D.delivery.title), items: list(obj(sp.delivery).items, D.delivery.items) },
            deliveryPhotos: photos(sp.deliveryPhotos, D.deliveryPhotos),
            equipment: {
                intro: text(obj(sp.equipment).intro, D.equipment.intro),
                groups: list<SrvGroup>(obj(sp.equipment).groups, D.equipment.groups).map((g) => ({ title: text(g?.title, ""), items: list(g?.items, []) })),
            },
            equipmentPhotos: photos(sp.equipmentPhotos, D.equipmentPhotos),
            partners: {
                intro: text(obj(sp.partners).intro, D.partners.intro),
                clients: list(obj(sp.partners).clients, D.partners.clients),
                engagements: list(obj(sp.partners).engagements, D.partners.engagements),
            },
        },
    };
}

type SrvGroup = { title?: unknown; items?: unknown };
