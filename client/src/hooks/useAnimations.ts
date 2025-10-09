import { useReducedMotion } from 'framer-motion';

export function useAnimations() {
  const shouldReduceMotion = useReducedMotion();

  const getTransition = (type: 'spring' | 'tween' = 'spring') => {
    if (shouldReduceMotion) {
      return { duration: 0 };
    }

    return type === 'spring' 
      ? { type: 'spring', stiffness: 400, damping: 17 }
      : { type: 'tween', duration: 0.3 };
  };

  const getHoverAnimation = (scale = 1.02) => {
    if (shouldReduceMotion) {
      return {};
    }
    return { scale };
  };

  const getTapAnimation = (scale = 0.98) => {
    if (shouldReduceMotion) {
      return {};
    }
    return { scale };
  };

  return {
    shouldReduceMotion,
    getTransition,
    getHoverAnimation,
    getTapAnimation
  };
}