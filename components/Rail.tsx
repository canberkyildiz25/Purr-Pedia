'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useStaged } from '@/lib/scroll';
import { useScene } from './Scene';

/** A row too wide for the screen, pulled sideways by scrolling down: the
    wheel goes down, the row goes left, and it ends exactly when its last item
    is flush with the edge.

    With no JavaScript, or with less motion asked for, it is an ordinary row
    that scrolls sideways under the finger or the arrow keys. */
export function Rail({ label, children }: { label: string; children: ReactNode }) {
  const scene = useScene();
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const staged = useStaged();

  useEffect(() => {
    const view = rail.current;
    const row = track.current;
    if (!view || !row || !staged) return;

    let room = 0;
    let at = 0;
    const place = () => {
      row.style.transform = `translate3d(${(-at * room).toFixed(1)}px, 0, 0)`;
    };
    const measure = () => {
      room = Math.max(0, row.scrollWidth - view.clientWidth);
      place();
    };
    // photographs and the typeface arrive after the first measure, and change the width
    const sizes = new ResizeObserver(measure);
    sizes.observe(row);
    sizes.observe(view);

    const stop = scene.watch((p) => {
      at = p;
      place();
    });

    // a link reached with the keyboard may be far off to the side: bring the page to where it shows
    const reveal = (event: FocusEvent) => {
      const item = event.target as HTMLElement;
      const act = view.closest<HTMLElement>('.scene');
      if (!act || !room || !row.contains(item)) return;
      const left = item.getBoundingClientRect().left - row.getBoundingClientRect().left;
      const wanted = Math.min(1, Math.max(0, (left - view.clientWidth * 0.3) / room));
      const top = act.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + wanted * (act.offsetHeight - innerHeight), behavior: 'instant' });
    };
    row.addEventListener('focusin', reveal);

    return () => {
      stop();
      sizes.disconnect();
      row.removeEventListener('focusin', reveal);
      row.style.transform = '';
    };
  }, [scene, staged]);

  return (
    <div ref={rail} className="rail" role="region" aria-label={label} tabIndex={0}>
      <div ref={track} className="rail__track">
        {children}
      </div>
    </div>
  );
}
