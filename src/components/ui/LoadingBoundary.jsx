import { cn } from "@/lib/utils";

export function LoadingBoundary({ loading, children, className }) {
    if (!loading) return children;

    return (
        <div className={cn("relative overflow-hidden", className)}>
            <div className="animate-pulse space-y-4">
                {children}
            </div>

            {/* shimmer overlay */}
            <div className="pointer-events-none absolute inset-0
                bg-linear-to-r from-transparent via-white/50 to-transparent
                animate-[shimmer_1.5s_infinite]" />
        </div>
    );
}
