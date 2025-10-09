import { Skeleton } from "@/components/ui/skeleton";

export default function SearchBarSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Dropdown Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Property Type Dropdown Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Price Range Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Search Button Skeleton */}
        <div className="flex items-end">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}