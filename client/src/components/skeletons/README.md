# UI Skeletons System

## Overview
This directory contains skeleton loading components that provide a better user experience during data loading states. Instead of showing generic spinners, these skeletons mimic the actual content structure, reducing perceived loading time and preventing layout shifts.

## Benefits
- **Improved UX**: Users see content-like structures immediately
- **Reduced Layout Shift**: Prevents content jumping when data loads
- **Consistent Loading States**: Uniform loading experience across the app
- **Better Performance Perception**: Makes the app feel faster

## Available Skeletons

### Core Components
- `PropertyCardSkeleton` - For property listings and cards
- `PropertyListSkeleton` - For multiple property cards with grid/list view support
- `PropertyDetailsSkeleton` - For detailed property pages
- `AgentCardSkeleton` - For agent profile cards
- `DeveloperCardSkeleton` - For developer profile cards
- `JobCardSkeleton` - For job/career listings
- `NotificationSkeleton` - For notification items
- `SearchBarSkeleton` - For search form components

### Base Component
- `Skeleton` - Base skeleton component with Tailwind CSS animations

## Usage Examples

### Basic Property List
```tsx
import { PropertyListSkeleton } from '@/components/skeletons';

function PropertiesPage() {
  const { data, isLoading } = useQuery(['properties'], fetchProperties);
  
  if (isLoading) {
    return <PropertyListSkeleton count={12} viewMode="grid" />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map(property => <PropertyCard key={property.id} property={property} />)}
    </div>
  );
}
```

### Property Details Page
```tsx
import { PropertyDetailsSkeleton } from '@/components/skeletons';

function PropertyDetailsPage() {
  const { data, isLoading } = useQuery(['property', id], () => fetchProperty(id));
  
  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }
  
  return <PropertyDetails property={data} />;
}
```

### Custom Skeleton Count
```tsx
import { AgentCardSkeleton } from '@/components/skeletons';

function AgentsPage() {
  const { data, isLoading } = useQuery(['agents'], fetchAgents);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return <AgentsList agents={data} />;
}
```

## Implementation Guidelines

### 1. Match Real Content Structure
Each skeleton should closely match the structure and dimensions of the actual content it represents.

### 2. Use Consistent Animation
All skeletons use the same `animate-pulse` animation for consistency.

### 3. Responsive Design
Skeletons should be responsive and work well on all screen sizes.

### 4. Proper Spacing
Maintain the same spacing and padding as the real components.

### 5. Loading States Integration
Always integrate with TanStack Query's `isLoading` state or similar loading indicators.

## Customization

### Creating New Skeletons
1. Create a new component in this directory
2. Use the base `Skeleton` component for individual elements
3. Match the structure of the real component
4. Add to the index.ts exports
5. Update this README

### Styling Guidelines
- Use `Skeleton` component for individual elements
- Apply appropriate `className` for sizing and spacing
- Use `space-y-*` and `space-x-*` for consistent spacing
- Match border radius and other visual properties

## Technical Details

### Dependencies
- `@/components/ui/skeleton` - Base skeleton component
- `clsx` and `tailwind-merge` - For className utilities
- Tailwind CSS - For styling and animations

### Animation
All skeletons use Tailwind's `animate-pulse` class which provides a smooth fade in/out effect.

### Performance
Skeletons are lightweight and don't impact performance. They're only rendered during loading states.

## Best Practices

1. **Always show skeletons during loading** - Never show blank screens
2. **Match the real content** - Skeletons should look similar to actual content
3. **Use appropriate counts** - Show realistic numbers of skeleton items
4. **Consider mobile views** - Ensure skeletons work well on small screens
5. **Test loading states** - Regularly test with slow network conditions

## Integration with TanStack Query

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
});

if (isLoading) return <SkeletonComponent />;
if (error) return <ErrorComponent />;
return <DataComponent data={data} />;
```

This pattern ensures consistent loading states across the application.