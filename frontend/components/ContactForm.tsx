"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Send } from "lucide-react";
import { Button, cn, focusRing, surface } from "./ui";

const inputCls = cn(
    "w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400",
    "ring-1 ring-slate-200 transition-all hover:ring-slate-300",
    focusRing,
    "focus-visible:ring-grpsi-blue",
);

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
                {label}
            </label>
            {children}
        </div>
    );
}

// Some mail clients truncate very long mailto: URLs.
const MAX_BODY = 1800;

/**
 * Builds a pre-filled email and opens the visitor's mail app (mailto:).
 * No data is sent to our servers. Must be rendered inside <Suspense> (uses useSearchParams).
 */
export default function ContactForm({ to }: { to: string }) {
    const params = useSearchParams();
    const [subject, setSubject] = useState(params.get("subject") ?? "");
    const [opened, setOpened] = useState(false);

    if (!to) {
        return (
            <p className={cn(surface.tile, "p-5 text-slate-600")}>
                Our contact email is temporarily unavailable. Please call us or try again shortly.
            </p>
        );
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const message = String(data.get("message") ?? "").trim();

        // Sender details go first so they survive truncation; cut on code points so
        // emoji are never split (a lone surrogate makes encodeURIComponent throw).
        const header = `From: ${name} <${email}>\n\n`;
        const body = header + Array.from(message).slice(0, MAX_BODY - header.length).join("");
        const href = `mailto:${to}?subject=${encodeURIComponent(subject.trim() || "Website enquiry")}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        setOpened(true);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <Field id="cf-name" label="Your name">
                    <input id="cf-name" name="name" required autoComplete="name" className={inputCls} placeholder="Jane Doe" />
                </Field>
                <Field id="cf-email" label="Your email">
                    <input id="cf-email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="jane@company.com" />
                </Field>
            </div>
            <Field id="cf-subject" label="Subject">
                <input
                    id="cf-subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Fuel supply to Auki"
                />
            </Field>
            <Field id="cf-message" label="Message">
                <textarea id="cf-message" name="message" required rows={6} className={cn(inputCls, "resize-y")} placeholder="Tell us about your project, timeline and location." />
            </Field>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                <Button type="submit" size="lg">
                    <Send className="w-4 h-4" aria-hidden />
                    Open in email app
                </Button>
                <p className="text-sm text-slate-500">Opens your email app with your message ready to send.</p>
            </div>

            {opened && (
                <p role="status" className="flex items-start gap-2.5 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 px-4 py-3 text-sm text-emerald-800">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                    <span>
                        Your email app should now be open. If nothing happened, email us directly at{" "}
                        <a href={`mailto:${to}`} className="font-semibold underline">
                            {to}
                        </a>
                        .
                    </span>
                </p>
            )}
        </form>
    );
}
