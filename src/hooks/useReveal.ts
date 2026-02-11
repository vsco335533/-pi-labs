import { useEffect, useRef } from 'react';

export function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        const els = ref.current.querySelectorAll(".rv");
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e, i) => {
                    if (e.isIntersecting) {
                        setTimeout(() => e.target.classList.add("vis"), i * 60);
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
        );
        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    });
    return ref;
}
