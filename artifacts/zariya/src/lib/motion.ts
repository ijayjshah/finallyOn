import type { Variants } from "framer-motion";

/** Cubic-bezier ease used across marketing pages */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function fadeUpVariants(opts?: {
  y?: number;
  duration?: number;
  delayStep?: number;
}): Variants {
  const y = opts?.y ?? 28;
  const duration = opts?.duration ?? 0.5;
  const delayStep = opts?.delayStep ?? 0.07;

  return {
    hidden: { opacity: 0, y },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASE_OUT, delay: i * delayStep },
    }),
  };
}

export const fadeUp = fadeUpVariants();
export const fadeUpHome = fadeUpVariants({ y: 32, duration: 0.55, delayStep: 0.08 });
