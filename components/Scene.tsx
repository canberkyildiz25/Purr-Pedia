'use client';

import { createContext, useContext, useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { clamp01, onFrame, useStaged } from '@/lib/scroll';

/** What a scene tells the things inside it, once per frame.
    p runs 0 to 1 while the scene is held in place. life runs 0 to 1 over the
    whole time any of it is on screen, the slide in and the slide out included. */
type Watcher = (p: number, life: number) => void;

const SceneContext = createContext<{ watch: (watcher: Watcher) => () => void } | null>(null);

export function useScene() {
  const scene = useContext(SceneContext);
  if (!scene) throw new Error('useScene must be used inside a Scene');
  return scene;
}

/** A stretch of the page that holds still while the wheel turns. The scene is
    span screens tall and its stage sticks for that long; where the visitor has
    got to is published as --p, for CSS, and handed to anything that asked.

    Without JavaScript, when less motion is asked for, or in a window too short
    to hold a scene, none of this runs: the stage is an ordinary block and shows
    its finished state. */
export function Scene({
  span,
  className,
  id,
  labelledBy,
  fromTop = false,
  children,
}: {
  span: number;
  className?: string;
  id?: string;
  labelledBy?: string;
  /** For the scene that opens the page: there is no slide in to wait for. */
  fromTop?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const watchers = useRef(new Set<Watcher>());
  const staged = useStaged();

  const scene = useMemo(
    () => ({
      watch(watcher: Watcher) {
        watchers.current.add(watcher);
        return () => {
          watchers.current.delete(watcher);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || !staged) return;
    // A link inside something that is not on screen yet can still be reached
    // with the keyboard. Take the page to the point where it shows.
    const reveal = (event: FocusEvent) => {
      const cue = (event.target as HTMLElement).closest<HTMLElement>('.cue');
      if (!cue || !element.contains(cue) || parseFloat(getComputedStyle(cue).opacity) > 0.9) return;
      const from = parseFloat(cue.style.getPropertyValue('--in') || '0');
      const to = parseFloat(cue.style.getPropertyValue('--out') || '1');
      const wanted = Math.min(1, (Math.max(from, 0) + Math.min(to, 1)) / 2);
      scrollTo({ top: element.getBoundingClientRect().top + scrollY + wanted * (element.offsetHeight - innerHeight), behavior: 'instant' });
    };
    element.addEventListener('focusin', reveal);

    let last = -1;
    const stop = onFrame(() => {
      const rect = element.getBoundingClientRect();
      const screen = innerHeight;
      // nothing to do while the scene is more than a screen away
      if (rect.bottom < -screen || rect.top > screen * 2) return;
      const p = clamp01(-rect.top / Math.max(rect.height - screen, 1));
      const life = fromTop ? clamp01(-rect.top / rect.height) : clamp01((screen - rect.top) / (rect.height + screen));
      if (Math.abs(life - last) < 0.0002) return;
      last = life;
      element.style.setProperty('--p', p.toFixed(4));
      watchers.current.forEach((watcher) => watcher(p, life));
    });
    return () => {
      stop();
      element.removeEventListener('focusin', reveal);
      element.style.removeProperty('--p');
    };
  }, [fromTop, staged]);

  return (
    <section ref={ref} id={id} className={className ? `scene ${className}` : 'scene'} style={{ '--span': span } as CSSProperties} aria-labelledby={labelledBy}>
      <div className="scene__stage">
        <SceneContext.Provider value={scene}>{children}</SceneContext.Provider>
      </div>
    </section>
  );
}
