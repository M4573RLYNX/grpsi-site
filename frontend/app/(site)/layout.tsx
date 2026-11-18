import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

// Re-check content at least every 5 minutes, even if a render fell back to defaults.
// The admin also triggers on-demand revalidation on publish (app/api/revalidate).
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
    const { footer } = await getContent();

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 text-slate-900">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-grpsi-blue focus:shadow-float"
            >
                Skip to content
            </a>
            <Navbar />
            <main id="main" className="flex-1">
                {children}
            </main>
            <Footer footer={footer} />
        </div>
    );
}
