import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisInstance = useRef<Lenis | null>(null); // Use useRef to persist the Lenis instance, with type annotation

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1, // Controls how smooth the scrolling is. Smaller values = more smooth.
      duration: 1.5, // Adjusts the overall speed of the scroll animation.
      // 'smoothTouch' is no longer a direct option. Lenis handles touch smoothly by default.
      // If you want to disable smooth scroll on touch, you might need a more complex solution
      // or check for touch events and prevent Lenis from acting.
      // 'smooth: true' is also the default behavior, so it can be omitted.
      // If you needed to disable smooth scrolling, you'd set smooth: false.

      // Common Lenis options you might want to use:
      // orientation: 'vertical', // 'vertical' (default) or 'horizontal'
      // gestureOrientation: 'vertical', // 'vertical' (default) or 'horizontal'
      // wheelMultiplier: 1, // How much the mouse wheel affects scroll speed (default is 1)
      // touchMultiplier: 2, // How much touch gestures affect scroll speed (default is 2)
      // easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)), // Custom easing function
    });

    lenisInstance.current = lenis; // Store the instance in ref

    // Optional: expose for debugging/programmatic control
    // @ts-expect-error attach for debugging only
    window.__lenis = lenis;

    // Listen for custom events to control scrolling from anywhere
    const handleScrollTop = () => {
      try {
        lenis.scrollTo(0, { duration: 1.2 });
      } catch (_) {
        // Fallback if anything goes wrong
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Using a custom event name to avoid collisions
    window.addEventListener(
      'lenis:scrollTop',
      handleScrollTop as unknown as EventListener
    );

    // This is the animation loop for Lenis
    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time); // Tell Lenis to update its scroll position based on the current time
      requestAnimationFrame(raf); // Request the next animation frame
    }

    requestAnimationFrame(raf); // Start the animation loop

    // Cleanup function: destroy Lenis instance when component unmounts
    return () => {
      window.removeEventListener(
        'lenis:scrollTop',
        handleScrollTop as unknown as EventListener
      );
      lenis.destroy();
      lenisInstance.current = null;
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScrolling;
