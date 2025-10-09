import { useState, useEffect } from 'react';

interface UseSkeletonLoaderOptions {
  minLoadingTime?: number; // Minimum time to show skeleton (in ms)
  delayTime?: number; // Delay before showing skeleton (in ms)
}

export function useSkeletonLoader(
  isLoading: boolean, 
  options: UseSkeletonLoaderOptions = {}
) {
  const { minLoadingTime = 500, delayTime = 200 } = options;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minTimeTimer: NodeJS.Timeout;

    if (isLoading) {
      // Delay showing skeleton to avoid flash for quick loads
      delayTimer = setTimeout(() => {
        setShowSkeleton(true);
        setLoadingStartTime(Date.now());
      }, delayTime);
    } else {
      // Clear delay timer if loading finishes before delay
      clearTimeout(delayTimer);
      
      if (loadingStartTime) {
        const elapsedTime = Date.now() - loadingStartTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        // Ensure skeleton shows for minimum time
        minTimeTimer = setTimeout(() => {
          setShowSkeleton(false);
          setLoadingStartTime(null);
        }, remainingTime);
      } else {
        setShowSkeleton(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minTimeTimer);
    };
  }, [isLoading, delayTime, minLoadingTime, loadingStartTime]);

  return showSkeleton;
}

// Hook for managing multiple loading states
export function useMultipleSkeletonLoader(loadingStates: Record<string, boolean>) {
  const [skeletonStates, setSkeletonStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newStates: Record<string, boolean> = {};
    
    Object.entries(loadingStates).forEach(([key, isLoading]) => {
      // Use individual skeleton loader for each state
      newStates[key] = isLoading;
    });

    setSkeletonStates(newStates);
  }, [loadingStates]);

  return skeletonStates;
}

// Hook for progressive loading (show different skeletons based on loading stage)
export function useProgressiveSkeletonLoader(stages: {
  stage: string;
  isLoading: boolean;
  priority: number;
}[]) {
  const [currentStage, setCurrentStage] = useState<string | null>(null);

  useEffect(() => {
    // Find the highest priority loading stage
    const loadingStages = stages
      .filter(stage => stage.isLoading)
      .sort((a, b) => b.priority - a.priority);

    if (loadingStages.length > 0) {
      setCurrentStage(loadingStages[0].stage);
    } else {
      setCurrentStage(null);
    }
  }, [stages]);

  return {
    currentStage,
    isLoading: currentStage !== null,
    getSkeletonForStage: (stage: string) => currentStage === stage
  };
}