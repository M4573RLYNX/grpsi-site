import { ArrowLeft, Compass } from "lucide-react";
import { Button, Container, IconBadge, cn, surface } from "@/components/ui";

export default function NotFound() {
    return (
        <Container className="pt-36 pb-20">
            <div className={cn(surface.card, "mx-auto max-w-lg p-10 text-center")}>
                <IconBadge icon={Compass} tone="solid" className="mx-auto" />
                <h1 className="mt-6 text-3xl font-black tracking-tight text-grpsi-blue">Page not found</h1>
                <p className="mt-2 text-slate-600">The page you&apos;re looking for has moved or no longer exists.</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button href="/">
                        <ArrowLeft className="w-4 h-4" aria-hidden />
                        Back home
                    </Button>
                    <Button href="/projects" variant="secondary">
                        View projects
                    </Button>
                </div>
            </div>
        </Container>
    );
}
