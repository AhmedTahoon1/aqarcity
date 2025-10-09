import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative">
        <Skeleton className="h-48 w-full" />
        
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Favorite Button Skeleton */}
        <div className="absolute top-3 right-3">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        
        {/* Image Dots Skeleton */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-2 w-2 rounded-full" />
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Location Skeleton */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Price and Type Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>

        {/* Property Details Skeleton */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}