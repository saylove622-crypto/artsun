import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered reveal animation.
 * Returns [ref, isVisible] — attach ref to the element to observe.
 */
export function useScrollReveal(options = {}) {
    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(element);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isVisible];
}

/**
 * Generates MUI sx props for a fade-up reveal animation.
 */
export function revealSx(isVisible, delay = 0) {
    return {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s, transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    };
}
