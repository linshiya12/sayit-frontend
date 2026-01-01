import { Skeleton } from "./skeleton";

export default function UniversalShimmer({
  rows = 3,
  avatar = true,
  image = false,
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border rounded-lg"
        >
          {avatar && (
            <Skeleton className="h-12 w-12 rounded-full" />
          )}

          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />

            {image && (
              <Skeleton className="h-40 w-full rounded-md" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
