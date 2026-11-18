"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  FileText, Briefcase, Settings, LogOut, Loader2, Globe, Ship, House,
  PanelLeftClose, PanelLeftOpen, Menu, X, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { name: "Landing Page", tab: "home", icon: House },
  { name: "About Page", tab: "about", icon: FileText },
  { name: "Services", tab: "services", icon: Ship },
  { name: "Projects", tab: "projects", icon: Briefcase },
  { name: "Global Settings", tab: "footer", icon: Settings },
];

const COLLAPSE_KEY = "gprsi_admin_sidebar_collapsed";

// Separate component: useSearchParams must sit inside a Suspense boundary (Next 16).
function SidebarNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate: () => void }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "about";

  return (
    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
      {!collapsed && (
        <p className="px-4 pt-2 pb-3 text-[10px] uppercase tracking-[0.25em] font-bold text-white/30">Content</p>
      )}
      {NAV_ITEMS.map((item) => {
        const active = activeTab === item.tab;
        return (
          <Link
            key={item.tab}
            href={`/admin?tab=${item.tab}`}
            onClick={onNavigate}
            title={collapsed ? item.name : undefined}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              collapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3"
            } ${
              active
                ? "bg-white text-grpsi-blue shadow-lg shadow-black/20"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {active && !collapsed && (
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-grpsi-gold" />
            )}
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("gprsi_admin_token");
    if (!token && !pathname.includes("/login")) {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [router, pathname]);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1"); } catch {}
      return !c;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("gprsi_admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 animate-spin text-white opacity-20" />
      </div>
    );
  }

  // Login page renders without the sidebar
  if (pathname.includes("/admin/login")) return <>{children}</>;

  // On mobile the drawer is always shown expanded
  const isCollapsed = collapsed && !mobileOpen;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 font-sans">
      {/* Mobile: floating menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-40 h-12 w-12 rounded-2xl bg-grpsi-blue text-white shadow-xl shadow-grpsi-blue/30 flex items-center justify-center"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile: backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Floating sidebar */}
      <aside
        className={`fixed z-50 top-4 bottom-4 left-4 flex flex-col rounded-[28px] bg-grpsi-blue/95 backdrop-blur-xl text-white ring-1 ring-white/10 shadow-2xl shadow-grpsi-blue/30 transition-all duration-300 ${
          isCollapsed ? "w-[84px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)] lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 p-5 ${isCollapsed ? "justify-center" : ""}`}>
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="GPRSI" width={36} height={36} className="object-contain" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="font-black tracking-tight text-lg leading-tight">Command</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold">GPRSI Admin</p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden ml-auto h-9 w-9 rounded-xl hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-5 mb-4 h-px bg-white/10" />

        <Suspense fallback={<div className="flex-1" />}>
          <SidebarNav collapsed={isCollapsed} onNavigate={() => setMobileOpen(false)} />
        </Suspense>

        {/* Footer actions */}
        <div className="p-3 space-y-1">
          <div className="mx-2 mb-2 h-px bg-white/10" />
          <Link
            href="/"
            target="_blank"
            title={isCollapsed ? "View website" : undefined}
            className={`flex items-center gap-3 rounded-2xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all ${
              isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3"
            }`}
          >
            <Globe className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="flex-1">View website</span>}
            {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 opacity-50" />}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Log out" : undefined}
            className={`w-full flex items-center gap-3 rounded-2xl text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/15 transition-all ${
              isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3"
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && "Log out"}
          </button>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden lg:flex w-full items-center gap-3 rounded-2xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/10 transition-all ${
              isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3"
            }`}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            {!isCollapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`min-h-screen px-4 pt-20 pb-10 sm:px-8 lg:pt-10 lg:pr-10 transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[132px]" : "lg:pl-[308px]"
        }`}
      >
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
