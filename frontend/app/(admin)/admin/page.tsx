"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/lib/api-url";
import { withCompanyDefaults } from "@/lib/company";
import {
    RefreshCw, Trash2, Loader2, CheckCircle2, AlertCircle, Globe, Briefcase, FileText,
    Settings, Image as ImageIcon, Ship, Users, Link2, BookOpen, Target, Lightbulb, Trophy,
    ChevronDown, House, Sparkles, MousePointerClick, Megaphone, BarChart3, Mail, MapPin, Phone,
    ExternalLink, X, Layers, Share2, Save, Plus, BadgeInfo, UserRound, ShieldCheck, Images, Heading,
    ListChecks, Wrench, Handshake, Building2,
} from "lucide-react";
import { AddButton, Field, IconButton, ImageUploader, SectionCard, TextArea, TextInput, inputCls } from "./_components/fields";
import {
    EquipmentGroupsEditor, FactsEditor, IconCardsEditor, PeopleEditor, PhotoEditor, PhotoListEditor, StringListEditor,
} from "./_components/list-editors";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

/** Each tab edits (and publishes) one or more top-level content collections. */
const TABS: Record<string, { title: string; description: string; icon: any; collections: string[]; viewHref: string }> = {
    home: { title: "Landing Page", description: "Hero banner, call-to-action buttons and contact strip shown on the homepage.", icon: House, collections: ["home"], viewHref: "/" },
    about: { title: "About Page", description: "Company story, facts, leadership team, commitments and photos.", icon: FileText, collections: ["about"], viewHref: "/about" },
    services: { title: "Services", description: "Services page content: capabilities, delivery, equipment, partners and your core service lines.", icon: Ship, collections: ["servicesPage", "services"], viewHref: "/services" },
    projects: { title: "Projects", description: "Portfolio entries and their case-study pages.", icon: Briefcase, collections: ["projects"], viewHref: "/projects" },
    footer: { title: "Global Settings", description: "Contact details, company details, footer copy and social links used on every page.", icon: Settings, collections: ["footer"], viewHref: "/" },
};

const ARRAY_COLLECTIONS = new Set(["services", "projects"]);

/** Asks the public site to drop its cached content so the publish shows up immediately. */
const refreshPublicSite = (token: string | null) =>
    fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {
        // Non-fatal: the public site also refreshes on its own every 5 minutes.
    });

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <AdminEditor />
        </Suspense>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white shadow-premium ring-1 ring-slate-200/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-grpsi-blue" />
            </div>
            <p className="text-sm font-medium text-slate-400">Loading content…</p>
        </div>
    );
}

function AdminEditor() {
    const searchParams = useSearchParams();
    const activeTab = TABS[searchParams.get("tab") || ""] ? (searchParams.get("tab") as string) : "about";
    const tab = TABS[activeTab];

    const [content, setContent] = useState<any>(null);
    const [saved, setSaved] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchContent();
    }, []);

    useEffect(() => {
        if (!toast || toast.type === "error") return;
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const showError = (message: string) => setToast({ type: "error", message });

    const fetchContent = async () => {
        setLoading(true);
        setToast(null);
        try {
            const res = await fetch(apiUrl("/content"));
            if (!res.ok) throw new Error();
            // Fill not-yet-saved company-profile fields with the site's defaults, so the
            // editors show exactly what the public site currently displays.
            const data = withCompanyDefaults(await res.json());
            setContent(data);
            setSaved(data);
        } catch {
            setContent(null);
        } finally {
            setLoading(false);
        }
    };

    const dirtyCollections = useMemo(() => {
        if (!content || !saved) return [];
        return tab.collections.filter((c) => JSON.stringify(content[c]) !== JSON.stringify(saved[c]));
    }, [content, saved, tab.collections]);
    const isDirty = dirtyCollections.length > 0;

    /** Publishes every changed collection on the current tab, then refreshes the public site once. */
    const handleSave = async () => {
        setIsSaving(true);
        setToast(null);
        const token = localStorage.getItem("gprsi_admin_token");

        try {
            for (const collection of dirtyCollections) {
                const updatedData = content[collection] ?? (ARRAY_COLLECTIONS.has(collection) ? [] : {});
                const res = await fetch(apiUrl("/admin/update"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ collection, fullCollection: updatedData }),
                });

                if (res.status === 403 || res.status === 401) {
                    showError("Your session has expired. Log out and log in again to continue.");
                    return;
                }
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    showError(errData.error || "Update failed.");
                    return;
                }
                setSaved((prev: any) => ({ ...prev, [collection]: updatedData }));
            }
            refreshPublicSite(token);
            setToast({ type: "success", message: "Changes published to the live site." });
        } catch (err: any) {
            console.error("Save failed:", err);
            const detail = err?.name === "TypeError" ? " (possible CORS/network issue)" : "";
            showError(`Could not reach the server${detail}.`);
        } finally {
            setIsSaving(false);
        }
    };

    const discardChanges = () =>
        setContent((prev: any) => ({ ...prev, ...Object.fromEntries(tab.collections.map((c) => [c, saved[c]])) }));

    // Deep update helper: updateDeep(['home','hero','title'], value)
    const updateDeep = (path: string[], value: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev };
            let current = newContent;
            for (let i = 0; i < path.length - 1; i++) {
                current[path[i]] = { ...current[path[i]] };
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newContent;
        });
    };

    // List helpers for services/projects
    const updateItem = (key: "services" | "projects", index: number, patch: any) =>
        setContent((prev: any) => {
            const next = [...(prev[key] || [])];
            next[index] = { ...next[index], ...patch };
            return { ...prev, [key]: next };
        });
    const removeItem = (key: "services" | "projects", index: number) => {
        const name = content[key]?.[index]?.title || "this item";
        if (!window.confirm(`Remove "${name}"? This takes effect when you save.`)) return;
        setContent((prev: any) => ({ ...prev, [key]: prev[key].filter((_: any, i: number) => i !== index) }));
    };
    const addItem = (key: "services" | "projects", item: any) => {
        const index = (content[key] || []).length;
        setContent((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), item] }));
        setExpanded((e) => ({ ...e, [`${key}-${index}`]: true }));
    };
    const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

    if (loading) return <LoadingState />;

    if (!content) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-[28px] ring-1 ring-slate-200/70 shadow-premium p-10 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Couldn&apos;t load content</h2>
                    <p className="text-sm text-slate-500 mb-6">The content server didn&apos;t respond. Check the backend and try again.</p>
                    <button
                        onClick={fetchContent}
                        className="inline-flex items-center gap-2 bg-grpsi-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-grpsi-blue-light transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const services = content.services || [];
    const projects = content.projects || [];

    return (
        <div className="space-y-6 pb-32">
            {/* Page header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 rounded-[20px] bg-grpsi-blue text-white flex items-center justify-center shadow-lg shadow-grpsi-blue/20">
                        <tab.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-grpsi-blue/50">Content editor</p>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{tab.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (isDirty && !window.confirm("Reloading will discard unsaved changes. Continue?")) return;
                            fetchContent();
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:ring-slate-300 hover:text-slate-900 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload
                    </button>
                    <Link
                        href={tab.viewHref}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white ring-1 ring-slate-200 rounded-xl text-slate-600 font-semibold text-sm hover:ring-slate-300 hover:text-slate-900 transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View live
                    </Link>
                </div>
            </header>
            <p className="text-sm text-slate-500 -mt-2 max-w-2xl">{tab.description}</p>

            {/* HOME */}
            {activeTab === "home" && content.home && (
                <>
                    <SectionCard icon={Sparkles} title="Hero section" description="The first thing visitors see on the homepage.">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Main title">
                                <TextInput value={content.home.hero?.title} onChange={(e) => updateDeep(["home", "hero", "title"], e.target.value)} />
                            </Field>
                            <Field label="Highlight word" hint="Rendered in the accent colour.">
                                <TextInput value={content.home.hero?.highlight} onChange={(e) => updateDeep(["home", "hero", "highlight"], e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Subtitle">
                            <TextArea value={content.home.hero?.subtitle} onChange={(e) => updateDeep(["home", "hero", "subtitle"], e.target.value)} />
                        </Field>
                        <ImageUploader
                            label="Background image"
                            currentUrl={content.home.hero?.backgroundImage}
                            onUpload={(url) => updateDeep(["home", "hero", "backgroundImage"], url)}
                            onError={showError}
                        />
                    </SectionCard>

                    <SectionCard icon={MousePointerClick} title="Hero buttons">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {(["primary", "secondary"] as const).map((kind) => (
                                <div key={kind} className="p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 space-y-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${kind === "primary" ? "bg-grpsi-blue text-white" : "bg-white ring-1 ring-slate-200 text-slate-500"}`}>
                                        {kind}
                                    </span>
                                    <Field label="Label">
                                        <TextInput value={content.home.hero?.buttons?.[kind]?.label} onChange={(e) => updateDeep(["home", "hero", "buttons", kind, "label"], e.target.value)} />
                                    </Field>
                                    <Field label="Link">
                                        <TextInput placeholder="/contact" className="font-mono" value={content.home.hero?.buttons?.[kind]?.link} onChange={(e) => updateDeep(["home", "hero", "buttons", kind, "link"], e.target.value)} />
                                    </Field>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard icon={Megaphone} title="Call to action" description="The banner near the bottom of the homepage.">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="CTA title">
                                <TextInput value={content.home.cta?.title} onChange={(e) => updateDeep(["home", "cta", "title"], e.target.value)} />
                            </Field>
                            <Field label="Contact phone" icon={Phone}>
                                <TextInput value={content.home.cta?.phone} onChange={(e) => updateDeep(["home", "cta", "phone"], e.target.value)} />
                            </Field>
                        </div>
                        <Field label="CTA description" hint="Also shown at the bottom of the About, Services and Projects pages.">
                            <TextArea rows={2} value={content.home.cta?.description} onChange={(e) => updateDeep(["home", "cta", "description"], e.target.value)} />
                        </Field>
                    </SectionCard>

                    <SectionCard icon={ImageIcon} title="Who we are photo" description="Shown beside the company summary on the homepage.">
                        <PhotoEditor label="Photo" photo={content.home.aboutPhoto} onChange={(p) => updateDeep(["home", "aboutPhoto"], p)} onError={showError} />
                    </SectionCard>
                </>
            )}

            {/* ABOUT */}
            {activeTab === "about" && content.about && (
                <>
                    <SectionCard icon={FileText} title="Page copy">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Main title">
                                <TextInput value={content.about.title} onChange={(e) => updateDeep(["about", "title"], e.target.value)} />
                            </Field>
                            <Field label="Subtitle">
                                <TextInput value={content.about.subtitle} onChange={(e) => updateDeep(["about", "subtitle"], e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Full description" hint="Leave empty to show the company background from the capability statement.">
                            <TextArea rows={7} value={content.about.description} onChange={(e) => updateDeep(["about", "description"], e.target.value)} />
                        </Field>
                        <Field label="Mission statement">
                            <TextArea rows={3} value={content.about.mission} onChange={(e) => updateDeep(["about", "mission"], e.target.value)} />
                        </Field>
                    </SectionCard>

                    <SectionCard icon={BadgeInfo} title="Company facts" description="The facts strip under the story (e.g. established, ownership, business number).">
                        <FactsEditor facts={content.about.facts} onChange={(v) => updateDeep(["about", "facts"], v)} />
                    </SectionCard>

                    <SectionCard icon={BarChart3} title="Key metrics" description="Shown as highlight figures on the site.">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { key: "experience", label: "Years experience" },
                                { key: "staff", label: "Team size" },
                                { key: "vessels", label: "Vessels" },
                                { key: "provinces", label: "Provinces" },
                            ].map((s) => (
                                <div key={s.key} className="p-4 rounded-2xl bg-gradient-to-br from-grpsi-blue/[0.03] to-grpsi-blue/[0.08] ring-1 ring-grpsi-blue/10">
                                    <Field label={s.label}>
                                        <TextInput
                                            className="text-xl font-black text-grpsi-blue"
                                            value={content.about.stats?.[s.key]}
                                            onChange={(e) => updateDeep(["about", "stats", s.key], e.target.value)}
                                        />
                                    </Field>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard icon={UserRound} title="Leadership & key personnel" description="Remove everyone to hide this section.">
                        <Field label="Introduction">
                            <TextArea rows={3} value={content.about.leadershipIntro} onChange={(e) => updateDeep(["about", "leadershipIntro"], e.target.value)} />
                        </Field>
                        <PeopleEditor people={content.about.leadership} onChange={(v) => updateDeep(["about", "leadership"], v)} />
                    </SectionCard>

                    <SectionCard icon={ShieldCheck} title="Safety, quality, community & local development" description="Commitment cards and the closing commitment statement.">
                        <IconCardsEditor cards={content.about.commitments} onChange={(v) => updateDeep(["about", "commitments"], v)} addLabel="Add commitment" />
                        <Field label="Our commitment statement">
                            <TextArea rows={3} value={content.about.commitmentStatement} onChange={(e) => updateDeep(["about", "commitmentStatement"], e.target.value)} />
                        </Field>
                    </SectionCard>

                    <SectionCard icon={Images} title="Page photos">
                        <div className="grid lg:grid-cols-3 gap-5">
                            {([
                                ["story", "Beside the story"],
                                ["leadership", "Leadership grid"],
                                ["commitment", "Commitment statement"],
                            ] as const).map(([key, label]) => (
                                <PhotoEditor
                                    key={key}
                                    label={label}
                                    photo={content.about.photos[key]}
                                    onChange={(p) => updateDeep(["about", "photos", key], p)}
                                    onError={showError}
                                />
                            ))}
                        </div>
                    </SectionCard>
                </>
            )}

            {/* SERVICES PAGE CONTENT */}
            {activeTab === "services" && content.servicesPage && (
                <>
                    <SectionCard icon={Heading} title="Page header" description="The headline at the top of the Services page.">
                        <Field label="Eyebrow" hint="Small label above the title.">
                            <TextInput value={content.servicesPage.header.eyebrow} onChange={(e) => updateDeep(["servicesPage", "header", "eyebrow"], e.target.value)} />
                        </Field>
                        <Field label="Title">
                            <TextInput value={content.servicesPage.header.title} onChange={(e) => updateDeep(["servicesPage", "header", "title"], e.target.value)} />
                        </Field>
                        <Field label="Description">
                            <TextArea rows={2} value={content.servicesPage.header.description} onChange={(e) => updateDeep(["servicesPage", "header", "description"], e.target.value)} />
                        </Field>
                    </SectionCard>

                    <SectionCard icon={Layers} title="Capabilities" description="The capability cards at the top of the page.">
                        <IconCardsEditor cards={content.servicesPage.capabilities} onChange={(v) => updateDeep(["servicesPage", "capabilities"], v)} addLabel="Add capability" />
                    </SectionCard>

                    <SectionCard icon={ListChecks} title="Service delivery & reliability">
                        <Field label="Title">
                            <TextInput value={content.servicesPage.delivery.title} onChange={(e) => updateDeep(["servicesPage", "delivery", "title"], e.target.value)} />
                        </Field>
                        <div className="space-y-2">
                            <span className="block text-xs font-semibold text-slate-600">Points</span>
                            <StringListEditor items={content.servicesPage.delivery.items} onChange={(v) => updateDeep(["servicesPage", "delivery", "items"], v)} addLabel="Add point" />
                        </div>
                        <PhotoListEditor photos={content.servicesPage.deliveryPhotos} onChange={(v) => updateDeep(["servicesPage", "deliveryPhotos"], v)} onError={showError} hint="Up to 2 photos are shown beside the list." />
                    </SectionCard>

                    <SectionCard icon={Wrench} title="Plant & equipment">
                        <Field label="Introduction">
                            <TextArea rows={3} value={content.servicesPage.equipment.intro} onChange={(e) => updateDeep(["servicesPage", "equipment", "intro"], e.target.value)} />
                        </Field>
                        <EquipmentGroupsEditor groups={content.servicesPage.equipment.groups} onChange={(v) => updateDeep(["servicesPage", "equipment", "groups"], v)} />
                        <PhotoListEditor photos={content.servicesPage.equipmentPhotos} onChange={(v) => updateDeep(["servicesPage", "equipmentPhotos"], v)} onError={showError} hint="Shown in a row under the equipment lists." />
                    </SectionCard>

                    <SectionCard icon={Handshake} title="Partner with GRP">
                        <Field label="Introduction">
                            <TextArea rows={2} value={content.servicesPage.partners.intro} onChange={(e) => updateDeep(["servicesPage", "partners", "intro"], e.target.value)} />
                        </Field>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <span className="block text-xs font-semibold text-slate-600">Who we work with</span>
                                <StringListEditor items={content.servicesPage.partners.clients} onChange={(v) => updateDeep(["servicesPage", "partners", "clients"], v)} />
                            </div>
                            <div className="space-y-2">
                                <span className="block text-xs font-semibold text-slate-600">How we engage</span>
                                <StringListEditor items={content.servicesPage.partners.engagements} onChange={(v) => updateDeep(["servicesPage", "partners", "engagements"], v)} />
                            </div>
                        </div>
                    </SectionCard>

                    <div className="pt-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-grpsi-blue/50">Core service lines</p>
                        <p className="text-sm text-slate-500 mt-1">The detailed service divisions shown further down the Services page and on the homepage.</p>
                    </div>
                </>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
                <div className="space-y-4">
                    {services.length === 0 && (
                        <div className="text-center py-12 text-sm text-slate-400">No services yet. Add your first one below.</div>
                    )}
                    {services.map((service: any, index: number) => {
                        const id = `services-${index}`;
                        const open = !!expanded[id];
                        return (
                            <article key={service.id || index} className="bg-white/80 backdrop-blur rounded-[24px] ring-1 ring-slate-200/70 shadow-premium overflow-hidden">
                                <div className="flex items-center gap-4 p-4 sm:p-5">
                                    <button type="button" onClick={() => toggle(id)} className="flex flex-1 min-w-0 items-center gap-4 text-left" aria-expanded={open}>
                                        <div className="h-14 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                                            {service.image
                                                ? // eslint-disable-next-line @next/next/no-img-element
                                                  <img src={service.image} alt="" className="w-full h-full object-cover" />
                                                : <Ship className="w-5 h-5 text-slate-300" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-900 truncate">{service.title || "Untitled service"}</p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {(service.features || []).length} capabilities · icon: {service.icon || "—"}
                                            </p>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                                    </button>
                                    <IconButton danger label="Remove service" onClick={() => removeItem("services", index)}>
                                        <Trash2 className="w-4 h-4" />
                                    </IconButton>
                                </div>

                                {open && (
                                    <div className="px-4 sm:px-6 pb-6 pt-2 space-y-5 border-t border-slate-100">
                                        <div className="grid sm:grid-cols-2 gap-5 pt-4">
                                            <Field label="Service title">
                                                <TextInput className="font-semibold" value={service.title} onChange={(e) => updateItem("services", index, { title: e.target.value })} />
                                            </Field>
                                            <Field label="Icon" hint="One of: Ship, Fuel, HardHat">
                                                <TextInput value={service.icon} onChange={(e) => updateItem("services", index, { icon: e.target.value })} />
                                            </Field>
                                        </div>
                                        <Field label="Description">
                                            <TextArea value={service.description} onChange={(e) => updateItem("services", index, { description: e.target.value })} />
                                        </Field>
                                        <ImageUploader label="Service image" currentUrl={service.image} onUpload={(url) => updateItem("services", index, { image: url })} onError={showError} />

                                        <div className="space-y-2">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                                Capabilities
                                            </span>
                                            <div className="space-y-2">
                                                {(service.features || []).map((feature: string, fIndex: number) => (
                                                    <div key={fIndex} className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-grpsi-gold shrink-0" />
                                                        <TextInput
                                                            className="py-2.5"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const nextFeatures = [...(service.features || [])];
                                                                nextFeatures[fIndex] = e.target.value;
                                                                updateItem("services", index, { features: nextFeatures });
                                                            }}
                                                        />
                                                        <IconButton danger label="Remove capability" onClick={() =>
                                                            updateItem("services", index, { features: (service.features || []).filter((_: string, i: number) => i !== fIndex) })
                                                        }>
                                                            <X className="w-4 h-4" />
                                                        </IconButton>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => updateItem("services", index, { features: [...(service.features || []), ""] })}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-grpsi-blue hover:bg-grpsi-blue/5 transition-all"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add capability
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                    <AddButton
                        onClick={() =>
                            addItem("services", { id: `service-${Date.now()}`, title: "New Service", description: "", icon: "Ship", features: [], image: "" })
                        }
                    >
                        Add service
                    </AddButton>
                </div>
            )}

            {/* PROJECTS */}
            {activeTab === "projects" && (
                <div className="space-y-4">
                    {projects.length === 0 && (
                        <div className="text-center py-12 text-sm text-slate-400">No projects yet. Add your first one below.</div>
                    )}
                    {projects.map((project: any, index: number) => {
                        const id = `projects-${index}`;
                        const open = !!expanded[id];
                        return (
                            <article key={index} className="bg-white/80 backdrop-blur rounded-[24px] ring-1 ring-slate-200/70 shadow-premium overflow-hidden">
                                <div className="flex items-center gap-4 p-4 sm:p-5">
                                    <button type="button" onClick={() => toggle(id)} className="flex flex-1 min-w-0 items-center gap-4 text-left" aria-expanded={open}>
                                        <div className="h-14 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                                            {project.image
                                                ? // eslint-disable-next-line @next/next/no-img-element
                                                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                                                : <ImageIcon className="w-5 h-5 text-slate-300" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-900 truncate">{project.title || "Untitled project"}</p>
                                                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-grpsi-gold/20 text-[10px] font-bold uppercase tracking-wider text-grpsi-blue">
                                                    {project.category || "Engineering"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 truncate">
                                                {[project.location, project.year].filter(Boolean).join(" · ") || "No location set"}
                                            </p>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
                                    </button>
                                    <IconButton danger label="Remove project" onClick={() => removeItem("projects", index)}>
                                        <Trash2 className="w-4 h-4" />
                                    </IconButton>
                                </div>

                                {open && (
                                    <div className="px-4 sm:px-6 pb-6 pt-2 space-y-5 border-t border-slate-100">
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5 pt-4">
                                            <Field label="Project name" className="sm:col-span-2 lg:col-span-3">
                                                <TextInput className="font-semibold" value={project.title} onChange={(e) => updateItem("projects", index, { title: e.target.value })} />
                                            </Field>
                                            <Field label="Category" className="lg:col-span-3">
                                                <select
                                                    className={inputCls}
                                                    value={project.category || "Engineering"}
                                                    onChange={(e) => updateItem("projects", index, { category: e.target.value })}
                                                >
                                                    <option>Engineering</option>
                                                    <option>Logistics</option>
                                                    <option>Fuel</option>
                                                </select>
                                            </Field>
                                            <Field label="URL slug" icon={Link2} hint={project.slug ? `/projects/${project.slug}` : undefined} className="lg:col-span-2">
                                                <TextInput
                                                    className="font-mono"
                                                    placeholder="auk-port-2024"
                                                    value={project.slug}
                                                    onChange={(e) => updateItem("projects", index, { slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                                                />
                                            </Field>
                                            <Field label="Location" icon={MapPin} className="lg:col-span-2">
                                                <TextInput value={project.location} onChange={(e) => updateItem("projects", index, { location: e.target.value })} />
                                            </Field>
                                            <Field label="Year" className="lg:col-span-2">
                                                <TextInput value={project.year} onChange={(e) => updateItem("projects", index, { year: e.target.value })} />
                                            </Field>
                                        </div>
                                        <Field label="Short summary" hint="Shown on the project card in the portfolio grid.">
                                            <TextArea rows={2} value={project.description} onChange={(e) => updateItem("projects", index, { description: e.target.value })} />
                                        </Field>
                                        <ImageUploader label="Showcase image" currentUrl={project.image} onUpload={(url) => updateItem("projects", index, { image: url })} onError={showError} />

                                        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 p-4 sm:p-5 space-y-4">
                                            <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                                <BookOpen className="w-4 h-4 text-grpsi-blue" />
                                                Case study
                                            </p>
                                            <Field label="The challenge" icon={Target}>
                                                <TextArea placeholder="What were the maritime or logistical obstacles?" value={project.challenge} onChange={(e) => updateItem("projects", index, { challenge: e.target.value })} />
                                            </Field>
                                            <Field label="Our solution" icon={Lightbulb}>
                                                <TextArea placeholder="How did GPRSI overcome them?" value={project.solution} onChange={(e) => updateItem("projects", index, { solution: e.target.value })} />
                                            </Field>
                                            <Field label="The result" icon={Trophy}>
                                                <TextArea placeholder="What was the lasting impact on the region?" value={project.result} onChange={(e) => updateItem("projects", index, { result: e.target.value })} />
                                            </Field>
                                        </div>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                    <AddButton
                        onClick={() =>
                            addItem("projects", {
                                title: "New Project", slug: "", location: "", year: String(new Date().getFullYear()), category: "Engineering",
                                image: "", description: "", challenge: "", solution: "", result: "",
                            })
                        }
                    >
                        Add project
                    </AddButton>
                </div>
            )}

            {/* GLOBAL SETTINGS */}
            {activeTab === "footer" && content.footer && (
                <>
                    <SectionCard icon={Globe} title="Contact information" description="Used in the footer and contact page.">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Headquarters address" icon={MapPin} className="sm:col-span-2">
                                <TextInput value={content.footer.address} onChange={(e) => updateDeep(["footer", "address"], e.target.value)} />
                            </Field>
                            <Field label="Email" icon={Mail}>
                                <TextInput type="email" value={content.footer.email} onChange={(e) => updateDeep(["footer", "email"], e.target.value)} />
                            </Field>
                            <Field label="Phone" icon={Phone}>
                                <TextInput value={content.footer.phone} onChange={(e) => updateDeep(["footer", "phone"], e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Footer description">
                            <TextArea value={content.footer.description} onChange={(e) => updateDeep(["footer", "description"], e.target.value)} />
                        </Field>
                    </SectionCard>

                    <SectionCard icon={Building2} title="Company details" description="Shown in the footer and on the contact page.">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <Field label="Tagline">
                                <TextInput value={content.footer.tagline} placeholder="Local Delivery. Global Standards." onChange={(e) => updateDeep(["footer", "tagline"], e.target.value)} />
                            </Field>
                            <Field label="Ownership">
                                <TextInput value={content.footer.ownership} placeholder="100% Solomon Islands owned" onChange={(e) => updateDeep(["footer", "ownership"], e.target.value)} />
                            </Field>
                            <Field label="Business number">
                                <TextInput value={content.footer.businessNumber} placeholder="SBN…" onChange={(e) => updateDeep(["footer", "businessNumber"], e.target.value)} />
                            </Field>
                            <Field label="Operating bases">
                                <TextInput value={content.footer.operations} placeholder="Honiara & Gizo" onChange={(e) => updateDeep(["footer", "operations"], e.target.value)} />
                            </Field>
                        </div>
                    </SectionCard>

                    {(content.footer.social || []).length > 0 && (
                        <SectionCard icon={Share2} title="Social links">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {content.footer.social.map((social: any, i: number) => {
                                    const SocialIcon = social.platform === "Ship" ? Ship : social.platform === "Users" ? Users : Globe;
                                    return (
                                        <div key={i} className="p-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-grpsi-blue text-grpsi-gold flex items-center justify-center">
                                                    <SocialIcon className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-sm text-slate-900">{social.platform}</span>
                                            </div>
                                            <TextInput
                                                className="font-mono text-xs"
                                                placeholder="https://…"
                                                value={social.url}
                                                onChange={(e) => {
                                                    const next = [...content.footer.social];
                                                    next[i] = { ...next[i], url: e.target.value };
                                                    updateDeep(["footer", "social"], next);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </SectionCard>
                    )}
                </>
            )}

            {/* Floating save bar */}
            <div className="fixed bottom-4 inset-x-4 lg:left-auto lg:right-10 z-30 flex justify-center lg:justify-end pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 pl-5 pr-2 py-2 rounded-2xl bg-white/90 backdrop-blur-xl ring-1 ring-slate-200 shadow-2xl shadow-slate-900/10">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className={`h-2 w-2 rounded-full ${isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                        {isDirty ? "Unsaved changes" : "All changes saved"}
                    </span>
                    {isDirty && (
                        <button type="button" onClick={discardChanges} className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
                            Discard
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !isDirty}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-grpsi-blue text-white rounded-xl font-semibold text-sm hover:bg-grpsi-blue-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Publishing…" : "Publish"}
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    role={toast.type === "error" ? "alert" : "status"}
                    className={`fixed top-4 right-4 z-[60] max-w-sm flex items-start gap-3 pl-4 pr-2 py-3 rounded-2xl shadow-2xl ring-1 backdrop-blur-xl ${
                        toast.type === "success" ? "bg-emerald-50/95 ring-emerald-200 text-emerald-800" : "bg-red-50/95 ring-red-200 text-red-700"
                    }`}
                >
                    {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                    <p className="text-sm font-medium flex-1">{toast.message}</p>
                    <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="h-7 w-7 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
