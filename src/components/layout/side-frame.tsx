const BORDER_SIDE_URL =
    "https://res.cloudinary.com/dlxpcyiin/image/upload/v1770840857/acceeec5cca8bcd386d1ccf3692c9947-removebg-preview_ja16p2.webp";

interface SideFrameProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wraps a section with decorative Bengali cultural side borders.
 * Each section gets its own pair of absolute-positioned border images,
 * matching the pattern used in the About (Techtix/Exotica/Quizine) sections.
 */
export function SideFrame({ children, className = "" }: SideFrameProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Left decorative border */}
            <img
                src={BORDER_SIDE_URL}
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block"
            />
            {/* Right decorative border (mirrored) */}
            <img
                src={BORDER_SIDE_URL}
                alt=""
                aria-hidden="true"
                className="absolute top-0 right-0 bottom-0 h-full w-auto max-w-[60px] md:max-w-[80px] object-cover pointer-events-none z-[5] opacity-60 hidden lg:block scale-x-[-1]"
            />
            {children}
        </div>
    );
}
