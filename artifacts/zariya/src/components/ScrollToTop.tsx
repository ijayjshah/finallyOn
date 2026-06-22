import { useEffect } from "react";
import { useLocation } from "wouter";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export default function ScrollToTop() {
  const [location] = useLocation();
  const pathname = location.split("?")[0];

  useEffect(() => {
    scrollToTop();
    // Mobile browsers may restore scroll after paint — run again on next frame.
    const frame = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
