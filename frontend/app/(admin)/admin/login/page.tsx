"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiUrl } from "@/lib/api-url";
import { KeyRound, Loader2, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(apiUrl("/auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("gprsi_admin_token", data.token);
                router.push("/admin");
            } else {
                setError(data.error || "Login failed.");
            }
        } catch {
            setError("Server unreachable. Check the backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/60 flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Ambient shapes */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full bg-grpsi-blue/10 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-grpsi-gold/15 blur-[120px]" />
            </div>

            <Link
                href="/"
                className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-grpsi-blue hover:bg-white/70 transition-all"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to website
            </Link>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-[32px] ring-1 ring-slate-200/70 shadow-2xl shadow-grpsi-blue/10 p-8 sm:p-10">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="h-16 w-16 rounded-[22px] bg-white ring-1 ring-slate-200 shadow-premium flex items-center justify-center mb-5">
                            <Image src="/logo.png" alt="GPRSI" width={48} height={48} className="object-contain" priority />
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-grpsi-blue/50 mb-1">GPRSI Admin</p>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome back</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to manage website content.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <label className="block space-y-2">
                            <span className="text-xs font-semibold text-slate-600">Admin password</span>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoFocus
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all hover:border-slate-300 focus:border-grpsi-blue focus:ring-4 focus:ring-grpsi-blue/10"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </label>

                        {error && (
                            <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-sm font-medium text-red-700">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-grpsi-blue text-white font-semibold text-sm shadow-lg shadow-grpsi-blue/25 hover:bg-grpsi-blue-light active:scale-[0.99] transition-all disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <p className="text-center text-xs text-slate-400 mt-6">Authorised personnel only.</p>
            </div>
        </div>
    );
}
