"use client";

/** Editors for the company-profile content (lists of facts, people, cards, photos, etc.). */
import { createElement } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import type { EquipmentGroup, Fact, IconCard, Person, PhotoItem } from "@/lib/types";
import { ICON_CHOICES } from "@/lib/company";
import { resolveIcon } from "@/components/icons";
import { Field, IconButton, ImageUploader, TextArea, TextInput, inputCls } from "./fields";

/* ---------- Generic list ---------- */

const move = <T,>(items: T[], from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
};

/** Ordered list of item cards with move up/down, remove, and add. */
export function ListEditor<T>({
    items,
    onChange,
    newItem,
    itemLabel,
    addLabel,
    renderItem,
    columns = 1,
}: {
    items: T[];
    onChange: (items: T[]) => void;
    newItem: () => T;
    itemLabel: (item: T, index: number) => string;
    addLabel: string;
    renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
    columns?: 1 | 2 | 3;
}) {
    const update = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
    const grid = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-2 xl:grid-cols-3" }[columns];

    return (
        <div className="space-y-3">
            {items.length > 0 && (
                <ul className={`grid gap-3 ${grid}`}>
                    {items.map((item, i) => (
                        <li key={i} className="rounded-2xl bg-slate-50 ring-1 ring-slate-200/70 p-4 space-y-3">
                            <div className="flex items-center gap-1">
                                <span className="h-6 min-w-6 px-1.5 rounded-lg bg-white ring-1 ring-slate-200 text-[11px] font-bold text-slate-500 flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <p className="ml-1 flex-1 min-w-0 truncate text-sm font-semibold text-slate-700">{itemLabel(item, i)}</p>
                                {i > 0 && (
                                    <IconButton label="Move up" onClick={() => onChange(move(items, i, i - 1))}>
                                        <ArrowUp className="w-4 h-4" />
                                    </IconButton>
                                )}
                                {i < items.length - 1 && (
                                    <IconButton label="Move down" onClick={() => onChange(move(items, i, i + 1))}>
                                        <ArrowDown className="w-4 h-4" />
                                    </IconButton>
                                )}
                                <IconButton danger label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                                    <Trash2 className="w-4 h-4" />
                                </IconButton>
                            </div>
                            {renderItem(item, (patch) => update(i, patch), i)}
                        </li>
                    ))}
                </ul>
            )}
            <button
                type="button"
                onClick={() => onChange([...items, newItem()])}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-grpsi-blue hover:bg-grpsi-blue/5 transition-all"
            >
                <Plus className="w-4 h-4" />
                {addLabel}
            </button>
        </div>
    );
}

/* ---------- Simple string list ---------- */

export function StringListEditor({
    items,
    onChange,
    placeholder,
    addLabel = "Add item",
}: {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    addLabel?: string;
}) {
    return (
        <div className="space-y-2">
            {items.map((value, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-grpsi-gold shrink-0" />
                    <TextInput className="py-2.5" placeholder={placeholder} value={value} onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))} />
                    {i > 0 && (
                        <IconButton label="Move up" onClick={() => onChange(move(items, i, i - 1))}>
                            <ArrowUp className="w-4 h-4" />
                        </IconButton>
                    )}
                    <IconButton danger label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                        <X className="w-4 h-4" />
                    </IconButton>
                </div>
            ))}
            <button
                type="button"
                onClick={() => onChange([...items, ""])}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-grpsi-blue hover:bg-grpsi-blue/5 transition-all"
            >
                <Plus className="w-3.5 h-3.5" />
                {addLabel}
            </button>
        </div>
    );
}

/* ---------- Photos ---------- */

export function PhotoEditor({
    label,
    photo,
    onChange,
    onError,
}: {
    label: string;
    photo: PhotoItem;
    onChange: (photo: PhotoItem) => void;
    onError: (msg: string) => void;
}) {
    return (
        <div className="space-y-3">
            <ImageUploader label={label} currentUrl={photo.src} onUpload={(src) => onChange({ ...photo, src })} onError={onError} />
            <div className="flex items-end gap-2">
                <Field label="Caption" hint="Shown on the photo and read by screen readers." className="flex-1">
                    <TextInput value={photo.alt} placeholder="e.g. Gizo fuel storage infrastructure" onChange={(e) => onChange({ ...photo, alt: e.target.value })} />
                </Field>
                {photo.src && (
                    <button
                        type="button"
                        onClick={() => onChange({ src: "", alt: "" })}
                        className="mb-6 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        Remove photo
                    </button>
                )}
            </div>
        </div>
    );
}

export function PhotoListEditor({
    photos,
    onChange,
    onError,
    hint,
}: {
    photos: PhotoItem[];
    onChange: (photos: PhotoItem[]) => void;
    onError: (msg: string) => void;
    hint?: string;
}) {
    return (
        <div className="space-y-2">
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
            <ListEditor
                items={photos}
                onChange={onChange}
                newItem={() => ({ src: "", alt: "" })}
                itemLabel={(p) => p.alt || "Untitled photo"}
                addLabel="Add photo"
                columns={2}
                renderItem={(p, update) => <PhotoEditor label="Image" photo={p} onChange={(next) => update(next)} onError={onError} />}
            />
        </div>
    );
}

/* ---------- Typed lists ---------- */

export function FactsEditor({ facts, onChange }: { facts: Fact[]; onChange: (facts: Fact[]) => void }) {
    return (
        <ListEditor
            items={facts}
            onChange={onChange}
            newItem={() => ({ label: "", value: "" })}
            itemLabel={(f) => f.label || "New fact"}
            addLabel="Add fact"
            columns={2}
            renderItem={(f, update) => (
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Label">
                        <TextInput value={f.label} placeholder="Established" onChange={(e) => update({ label: e.target.value })} />
                    </Field>
                    <Field label="Value">
                        <TextInput value={f.value} placeholder="1987" onChange={(e) => update({ value: e.target.value })} />
                    </Field>
                </div>
            )}
        />
    );
}

export function PeopleEditor({ people, onChange }: { people: Person[]; onChange: (people: Person[]) => void }) {
    return (
        <ListEditor
            items={people}
            onChange={onChange}
            newItem={() => ({ name: "", role: "", focus: "" })}
            itemLabel={(p) => p.name || "New person"}
            addLabel="Add person"
            columns={2}
            renderItem={(p, update) => (
                <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Name">
                            <TextInput value={p.name} onChange={(e) => update({ name: e.target.value })} />
                        </Field>
                        <Field label="Role">
                            <TextInput value={p.role} onChange={(e) => update({ role: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Core contribution">
                        <TextArea rows={2} value={p.focus} onChange={(e) => update({ focus: e.target.value })} />
                    </Field>
                </div>
            )}
        />
    );
}

function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
    const options = ICON_CHOICES.includes(value) || !value ? ICON_CHOICES : [value, ...ICON_CHOICES];
    return (
        <div className="flex items-center gap-2">
            <span className="h-11 w-11 shrink-0 rounded-xl bg-grpsi-blue text-grpsi-gold flex items-center justify-center">
                {createElement(resolveIcon(value), { className: "w-5 h-5" })}
            </span>
            <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map((name) => (
                    <option key={name} value={name}>
                        {name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function IconCardsEditor({ cards, onChange, addLabel }: { cards: IconCard[]; onChange: (cards: IconCard[]) => void; addLabel: string }) {
    return (
        <ListEditor
            items={cards}
            onChange={onChange}
            newItem={() => ({ title: "", icon: ICON_CHOICES[0], description: "" })}
            itemLabel={(c) => c.title || "New card"}
            addLabel={addLabel}
            columns={2}
            renderItem={(c, update) => (
                <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Title">
                            <TextInput value={c.title} onChange={(e) => update({ title: e.target.value })} />
                        </Field>
                        <Field label="Icon">
                            <IconPicker value={c.icon} onChange={(icon) => update({ icon })} />
                        </Field>
                    </div>
                    <Field label="Description">
                        <TextArea rows={3} value={c.description} onChange={(e) => update({ description: e.target.value })} />
                    </Field>
                </div>
            )}
        />
    );
}

export function EquipmentGroupsEditor({ groups, onChange }: { groups: EquipmentGroup[]; onChange: (groups: EquipmentGroup[]) => void }) {
    return (
        <ListEditor
            items={groups}
            onChange={onChange}
            newItem={() => ({ title: "", items: [] })}
            itemLabel={(g) => g.title || "New group"}
            addLabel="Add equipment group"
            columns={3}
            renderItem={(g, update) => (
                <div className="space-y-3">
                    <Field label="Group title">
                        <TextInput value={g.title} onChange={(e) => update({ title: e.target.value })} />
                    </Field>
                    <StringListEditor items={g.items} onChange={(items) => update({ items })} placeholder="e.g. Bulldozers and graders" addLabel="Add equipment" />
                </div>
            )}
        />
    );
}
