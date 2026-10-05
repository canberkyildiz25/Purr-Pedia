'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { arrive, motionAllowed } from '@/lib/scroll';

/** Lets things arrive as they come into view. Anything marked data-in gets
    the class is-in the first time it is on screen, and keeps it: content that
    hides again on the way back up is a fault, not an effect. One observer for
    the whole page, looked for again after every change of page. */
export function Arrivals() {
  const path = usePathname();
  useEffect(() => {
    if (!motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    const waiting = document.querySelectorAll<HTMLElement>('[data-in]:not(.is-in)');
    if (!waiting.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      // a little inside the window, so it happens where the eye already is
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    waiting.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [path]);
  return null;
}

/** A number that counts up to its value, once, when half of it is on screen.
    The page is sent with the real value in place, so it reads the same with no
    JavaScript and with less motion. */
export function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(to);

  useEffect(() => {
    const element = ref.current;
    if (!element || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const began = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - began) / 1400, 1);
          setShown(Math.round(to * arrive(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref} className="count-up">
      {shown}
    </span>
  );
}
