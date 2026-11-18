/**
 * Company facts and capability content from the 2026 GRP Capability Statement.
 * Static (not admin-editable) because it changes rarely; update here when a new
 * capability statement is issued.
 */

export const COMPANY = {
    name: "GRP & Associates Ltd",
    tagline: "Local Delivery. Global Standards.",
    disciplines: ["Earthworks", "Civil engineering", "Construction", "Logistics"],
    established: "1987",
    ownership: "100% Solomon Islands owned",
    businessNumber: "SBN1000097",
    operations: "Honiara and Gizo operations",
    postalAddress: "P.O. Box 1289, KG Market, East Honiara, Solomon Islands",
};

export const FACTS = [
    { value: "1987", label: "Established" },
    { value: "100%", label: "Locally owned" },
    { value: "Honiara & Gizo", label: "Operating bases" },
    { value: COMPANY.businessNumber, label: "Business number" },
];

export const BACKGROUND = [
    "GRP & Associates Ltd is a 100% locally owned Solomon Islands company established in 1987. From its origins in business consulting and fuel operations, GRP has developed into a multidisciplinary project delivery business serving mining, civil construction, infrastructure, logistics, marine and property projects across the country.",
    "GRP combines local knowledge, remote-site operating experience, practical engineering capability and an established logistics network. Our teams mobilise people, equipment, fuel and materials to difficult locations and manage delivery from planning through construction, commissioning and handover.",
];

export const SERVICE_DELIVERY = [
    "Project mobilisation and delivery in remote and logistically constrained locations",
    "Earthworks, roads, drainage, site development and structural civil works",
    "Mine development support, production infrastructure, stockpiles and port interfaces",
    "Marine construction, wharf works, piling and coastal infrastructure",
    "Shipping, fuel, freight, stores, procurement and supply-chain coordination",
    "Local workforce development, practical training and supervised skills transfer",
];

/** Icon names resolve through components/icons.ts. */
export const CAPABILITIES = [
    {
        title: "Civil & infrastructure",
        icon: "HardHat",
        description:
            "Bulk earthworks; road construction and rehabilitation; drainage; retaining and coastal works; concrete structures; commercial and industrial facilities.",
    },
    {
        title: "Mining & project support",
        icon: "Pickaxe",
        description:
            "Pit and access development; overburden and ore movement; stockpile management; mine infrastructure; camp and service-area construction; port and ship-loading support.",
    },
    {
        title: "Marine & wharf works",
        icon: "Anchor",
        description:
            "Wharf rehabilitation and construction; piling; concrete precasting; coastal access; marine plant coordination; barge and vessel interfaces.",
    },
    {
        title: "Logistics & supply chain",
        icon: "Ship",
        description:
            "International cargo clearance; devanning and transit storage; inter-island freight; fuel distribution; project mobilisation; critical spares and site delivery.",
    },
    {
        title: "Project management",
        icon: "ClipboardList",
        description:
            "Programming; procurement; contractor coordination; cost and progress control; client reporting; quality records; construction and as-built documentation.",
    },
    {
        title: "Property & industrial assets",
        icon: "Warehouse",
        description:
            "Fuel and logistics facilities; warehouses; land development; site planning; phased commercial and rental property delivery.",
    },
];

export const EQUIPMENT = {
    intro: "GRP maintains and coordinates the plant, workshops, marine interfaces and support resources needed for multi-site project delivery. Final equipment schedules are prepared for each tender or project based on scope, productivity, location and mobilisation requirements.",
    groups: [
        {
            title: "Earthworks & roads",
            items: ["20–35 tonne excavators", "Bulldozers and graders", "Compactors and rollers", "Loaders and backhoes", "Tipper and haul trucks"],
        },
        {
            title: "Civils & infrastructure",
            items: ["Concrete batching resources", "Piling and lifting equipment", "Cranes and rigging support", "Marine construction equipment", "Barge and vessel coordination"],
        },
        {
            title: "Support & logistics",
            items: ["Fully equipped workshops", "Mobile service units", "Fuel storage and distribution", "Transit storage and stores", "Procurement and freight coordination"],
        },
    ],
};

export const LEADERSHIP = {
    intro: "GRP combines local executive leadership with experienced project, engineering, mining, commercial, legal and operational personnel. The project team is selected to suit each assignment and supported by specialist consultants and subcontractors where required.",
    people: [
        { name: "Donald Hemmer", role: "Managing Director", focus: "Operations, strategy, commercial leadership and stakeholder engagement." },
        { name: "Constance Hemmer", role: "Director – Corporate & Legal Affairs", focus: "Corporate governance, legal, compliance, risk and organisational support." },
        { name: "Simas Tekulu", role: "Projects Manager", focus: "Mining, maintenance, construction, manufacturing and project start-up experience." },
        { name: "Albert Jammie Stanley", role: "Logistics & Procurement", focus: "Vessel management, loading operations, logistics coordination and procurement." },
        { name: "Paul MacMillan", role: "Project Manager / Training Specialist", focus: "Civil construction, heavy plant operations, training and assessment." },
    ],
};

export const COMMITMENTS = [
    { title: "Safety", icon: "ShieldCheck", description: "Project-specific planning, inductions, supervision, plant controls, incident reporting and corrective actions." },
    { title: "Quality", icon: "BadgeCheck", description: "Inspection and test records, measurement controls, material verification, hold points, document control and as-builts." },
    { title: "Community", icon: "Users", description: "Respectful landowner and community engagement, local recruitment, grievance pathways and clear communication of commitments." },
    { title: "Local capability", icon: "GraduationCap", description: "Practical skills transfer, supervised work experience, operator development and pathways for Solomon Islanders to progress into technical and leadership roles." },
    { title: "Environment", icon: "Leaf", description: "Work planning that addresses erosion, drainage, waste, fuel handling, rehabilitation and project-specific environmental obligations." },
    { title: "Governance", icon: "Scale", description: "Clear authorities, procurement controls, commercial records, approvals, progress reporting and escalation of material risks." },
];

export const COMMITMENT_STATEMENT =
    "GRP is committed to delivering practical, durable infrastructure and project services that create long-term value in Solomon Islands. We bring together local ownership, established in-country capability and fit-for-purpose specialist support to deliver safely, responsibly and commercially.";

export const PARTNERS = {
    intro: "GRP supports government agencies, resource companies, private enterprises, development partners and contractors requiring reliable in-country execution.",
    clients: ["Government agencies", "Resource companies", "Private enterprises", "Development partners", "Contractors"],
    engagements: ["Principal contractor", "Civil works contractor", "Logistics provider", "Local delivery partner", "Project-services provider"],
};

/** Photos from the capability statement (public/images). */
export const PHOTOS = {
    cover: { src: "/images/cover.jpeg", alt: "Landing craft unloading at a remote beach as the community helps bring cargo ashore" },
    interIslandShipping: { src: "/images/inter-island-shipping.jpeg", alt: "Inter-island shipping" },
    mineSiteFleet: { src: "/images/mine-site-fleet.jpeg", alt: "Mine-site plant and haulage fleet" },
    bulkEarthworks: { src: "/images/bulk-earthworks.jpeg", alt: "Bulk earthworks in challenging terrain" },
    transport: { src: "/images/transport.jpeg", alt: "Heavy transport on site" },
    soltunaJetty: { src: "/images/soltuna-jetty-noro.jpeg", alt: "SolTuna commercial jetty, Noro" },
    gizoSeaWall: { src: "/images/gizo-market-sea-wall.jpeg", alt: "Gizo Market sea wall" },
    gizoFuel: { src: "/images/gizo-fuel-storage.jpeg", alt: "Gizo fuel storage infrastructure" },
    mobilisation: { src: "/images/heavy-equipment-mobilisation.jpeg", alt: "Heavy-equipment mobilisation to project site" },
    groundbreaking: { src: "/images/choiseul-bay-groundbreaking.jpeg", alt: "Choiseul Bay Township groundbreaking" },
    toolbox: { src: "/images/toolbox-briefing.jpeg", alt: "On-site toolbox and workforce briefing" },
};
