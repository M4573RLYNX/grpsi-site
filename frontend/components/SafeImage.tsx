import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "./ui";

const OPTIMIZABLE_HOST = /\.public\.blob\.vercel-storage\.com$/;

function canOptimize(src: string) {
    if (src.startsWith("/")) return true;
    try {
        return OPTIMIZABLE_HOST.test(new URL(src).hostname);
    } catch {
        return false;
    }
}

/**
 * Fills its (relatively positioned) parent with an image.
 * Uses next/image for local and Vercel Blob images; falls back to a plain <img>
 * for any other host so an admin-pasted URL can never crash a page.
 */
export default function SafeImage({
    src,
    alt,
    sizes,
    priority,
    className,
}: {
    src?: string;
    alt: string;
    sizes: string;
    priority?: boolean;
    className?: string;
}) {
    const classes = cn("object-cover", className);

    if (!src) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <ImageIcon className="w-8 h-8 text-slate-300" aria-hidden />
            </div>
        );
    }
    if (canOptimize(src)) {
        return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={classes} />;
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={cn("absolute inset-0 h-full w-full", classes)} />
    );
}
