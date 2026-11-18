"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button, Container, IconBadge, cn, surface } from "@/components/ui";

export default function SiteError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
    return (
        <Container className="pt-36 pb-20">
            <div className={cn(surface.card, "mx-auto max-w-lg p-10 text-center")}>
                <IconBadge icon={TriangleAlert} tone="solid" className="mx-auto" />
                <h1 className="mt-6 text-3xl font-black tracking-tight text-grpsi-blue">Something went wrong</h1>
                <p className="mt-2 text-slate-600">We couldn&apos;t load this page. Please try again.</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => unstable_retry()}>
                        <RefreshCw className="w-4 h-4" aria-hidden />
                        Try again
                    </Button>
                    <Button href="/" variant="secondary">
                        Back home
                    </Button>
                </div>
            </div>
        </Container>
    );
}
