import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import CtaBand from "@/components/CtaBand";
import ProjectsFilter from "@/components/ProjectsFilter";
import { Container, PageHeader, cn, surface } from "@/components/ui";

export const metadata: Metadata = {
    title: "Projects",
    description: "Engineering, logistics and fuel projects delivered by GRP & Associates across the Solomon Islands.",
};

export default async function ProjectsPage() {
    const { projects, home } = await getContent();

    return (
        <>
            <PageHeader
                eyebrow="Project showcase"
                title="Work that connects the islands"
                description="Infrastructure, logistics and fuel projects delivered in some of the most remote environments in the Pacific."
            />

            <Container>
                {projects.length > 0 ? (
                    <ProjectsFilter projects={projects} />
                ) : (
                    <p className={cn(surface.card, "p-10 text-center text-slate-600")}>Our project portfolio is being updated. Please check back soon.</p>
                )}
            </Container>

            <CtaBand cta={home.cta} />
        </>
    );
}
