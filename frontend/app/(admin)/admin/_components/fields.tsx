"use client";

/** Shared form building blocks for the admin content editor. */
import { useState } from "react";
import { Image as ImageIcon, Loader2, Plus, Upload } from "lucide-react";

export const inputCls =
    "w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all hover:border-slate-300 focus:border-grpsi-blue focus:ring-4 focus:ring-grpsi-blue/10";

export function Field({ label, hint, icon: Icon, className = "", children }: { label: string; hint?: string; icon?: any; className?: string; children: React.ReactNode }) {
    return (
        <label className={`block space-y-2 ${className}`}>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
                {label}
            </span>
            {children}
            {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
        </label>
    );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input type="text" {...props} value={props.value ?? ""} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea rows={3} {...props} value={props.value ?? ""} className={`${inputCls} resize-y leading-relaxed ${props.className ?? ""}`} />;
}

export function SectionCard({ icon: Icon, title, description, action, children }: { icon: any; title: string; description?: string; action?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="bg-white/80 backdrop-blur rounded-[28px] ring-1 ring-slate-200/70 shadow-premium p-6 sm:p-8">
            <header className="flex items-start gap-4 mb-6">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-grpsi-blue/5 text-grpsi-blue flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
                </div>
                {action}
            </header>
            <div className="space-y-5">{children}</div>
        </section>
    );
}

export function IconButton({ onClick, label, danger, children }: { onClick: () => void; label: string; danger?: boolean; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            aria-label={label}
            className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                danger ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-slate-400 hover:text-grpsi-blue hover:bg-slate-100"
            }`}
        >
            {children}
        </button>
    );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 py-5 rounded-[24px] border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-grpsi-blue hover:text-grpsi-blue hover:bg-white/60 transition-all"
        >
            <Plus className="w-4 h-4" />
            {children}
        </button>
    );
}

export function ImageUploader({ label, currentUrl, onUpload, onError }: { label: string; currentUrl: string; onUpload: (url: string) => void; onError: (msg: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        setUploading(true);
        try {
            const token = localStorage.getItem("gprsi_admin_token");
            const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": file.type || "application/octet-stream" },
                body: file,
            });
            if (response.ok) {
                const blob = await response.json();
                onUpload(blob.url);
            } else if (response.status === 401) {
                onError("Your session has expired. Log out and log in again to upload images.");
            } else {
                const err = await response.json().catch(() => ({}));
                onError(`Upload failed: ${err.error || "Server error"}`);
            }
        } catch {
            onError("Connection error during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                {label}
            </span>
            <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl bg-slate-50 ring-1 ring-slate-200/70">
                <div className="relative w-full sm:w-40 aspect-video sm:aspect-auto sm:h-24 rounded-xl overflow-hidden bg-white ring-1 ring-slate-200 flex items-center justify-center shrink-0">
                    {currentUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-grpsi-blue" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                    <label
                        className={`inline-flex w-fit items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            uploading ? "bg-slate-100 text-slate-400 pointer-events-none" : "bg-white ring-1 ring-slate-200 text-slate-700 hover:ring-grpsi-blue hover:text-grpsi-blue"
                        }`}
                    >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading…" : currentUrl ? "Replace image" : "Upload image"}
                        <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" disabled={uploading} />
                    </label>
                    {currentUrl && <p className="text-[11px] font-mono text-slate-400 truncate" title={currentUrl}>{currentUrl}</p>}
                </div>
            </div>
        </div>
    );
}
