import SafeImage from "./SafeImage";
import { cn, surface } from "./ui";

/** Captioned photo in a rounded frame. The caption is the image's alt text. */
export default function Photo({
    src,
    alt,
    sizes,
    className,
    caption = true,
}: {
    src: string;
    alt: string;
    sizes: string;
    className?: string;
    caption?: boolean;
}) {
    return (
        <figure className={cn(surface.media, "shadow-premium bg-slate-100", className)}>
            <SafeImage src={src} alt={alt} sizes={sizes} />
            {caption && alt.trim() && (
                <figcaption className="absolute inset-x-3 bottom-3 w-fit max-w-[calc(100%-1.5rem)] rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-premium">
                    {alt}
                </figcaption>
            )}
        </figure>
    );
}
