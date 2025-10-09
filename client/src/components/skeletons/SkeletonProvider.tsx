import React, { createContext, useContext, useState } from 'react';

interface SkeletonContextType {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  skeletonTheme: 'light' | 'dark';
  setSkeletonTheme: (theme: 'light' | 'dark') => void;
}

const SkeletonContext = createContext<SkeletonContextType | undefined>(undefined);

export function SkeletonProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalLoading, setGlobalLoading] = useState(false);
  const [skeletonTheme, setSkeletonTheme] = useState<'light' | 'dark'>('light');

  return (
    <SkeletonContext.Provider value={{
      isGlobalLoading,
      setGlobalLoading,
      skeletonTheme,
      setSkeletonTheme
    }}>
      {children}
    </SkeletonContext.Provider>
  );
}

export function useSkeleton() {
  const context = useContext(SkeletonContext);
  if (context === undefined) {
    throw new Error('useSkeleton must be used within a SkeletonProvider');
  }
  return context;
}

// Enhanced Skeleton component with theme support
export function EnhancedSkeleton({ 
  className = '', 
  variant = 'default',
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  variant?: 'default' | 'circular' | 'rectangular' | 'text' 
}) {
  const { skeletonTheme } = useSkeleton();
  
  const baseClasses = "animate-pulse";
  const themeClasses = skeletonTheme === 'dark' 
    ? "bg-gray-700" 
    : "bg-gray-200";
    
  const variantClasses = {
    default: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-none", 
    text: "rounded-sm h-4"
  };

  return (
    <div
      className={`${baseClasses} ${themeClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}