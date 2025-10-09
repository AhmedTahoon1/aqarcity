import { Skeleton } from "@/components/ui/skeleton";

export default function DeveloperCardSkeleton() {
  return (
    <div className="card p-6">
      {/* Developer Logo and Info */}
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Developer Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center bg-gray-50 p-3 rounded-lg">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
        <div className="text-center bg-gray-50 p-3 rounded-lg">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-3 w-20 mx-auto" />
        </div>
      </div>

      {/* Developer Description */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* View Properties Button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}