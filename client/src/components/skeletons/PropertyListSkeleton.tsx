import PropertyCardSkeleton from "./PropertyCardSkeleton";

interface PropertyListSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export default function PropertyListSkeleton({ count = 12, viewMode = 'grid' }: PropertyListSkeletonProps) {
  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {[...Array(count)].map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}