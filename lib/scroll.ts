/* One scroll listener and one animation frame for everything on the page
   that moves with the wheel. A scene asks to be called back; the callback
   runs at most once per frame, and only after the page has actually moved. */

import { useSyncExternalStore } from 'react';
import { ROOM } from './room';

type Listener = () => void;

const listeners = new Set<Listener>();
let queued = false;
let bound = false;

function flush() {
  queued = false;
  listeners.forEach((listener) => listener());
}

function request() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(flush);
}

export function onFrame(listener: Listener): () => void {
  listeners.add(listener);
  if (!bound) {
    bound = true;
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request, { passive: true });
  }
  request();
  return () => {
    listeners.delete(listener);
  };
}

/** True unless the visitor has asked for less motion. */
export const motionAllowed = () => typeof matchMedia === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Whether the scenes run ----------
   The script in the layout decides before the first paint and marks the page
   `staged`. From then on this keeps the mark true as the window changes, and
   tells the scenes, which start or stand down with it. */

const stagedWatchers = new Set<Listener>();
let stagedBound = false;
let deciding = 0;

function hasRoom() {
  if (!motionAllowed()) return false;
  const probe = document.createElement('i');
  probe.style.cssText = 'position:fixed;height:100svh;visibility:hidden';
  document.body.appendChild(probe);
  const height = probe.offsetHeight || innerHeight;
  probe.remove();
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return height >= (innerWidth >= ROOM.split * rem ? ROOM.wide : ROOM.narrow) * rem;
}

function decide() {
  const root = document.documentElement;
  const next = hasRoom();
  if (next === root.classList.contains('staged')) return;
  root.classList.toggle('staged', next);
  stagedWatchers.forEach((watcher) => watcher());
}

function watchStaged(watcher: Listener) {
  stagedWatchers.add(watcher);
  if (!stagedBound) {
    stagedBound = true;
    addEventListener(
      'resize',
      () => {
        cancelAnimationFrame(deciding);
        deciding = requestAnimationFrame(decide);
      },
      { passive: true },
    );
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', decide);
  }
  return () => {
    stagedWatchers.delete(watcher);
  };
}

const isStaged = () => document.documentElement.classList.contains('staged');

/** True while the scenes run: motion is welcome and the window can hold them. */
export function useStaged() {
  return useSyncExternalStore(watchStaged, isStaged, () => false);
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** How far value has got from start to end, held at 0 before and 1 after. */
export const between = (value: number, start: number, end: number) => clamp01((value - start) / (end - start));

/** Slow at both ends: for a camera that leaves one place and settles on another. */
export const settle = (t: number) => t * t * (3 - 2 * t);

/** Fast first, slow last: for something arriving. */
export const arrive = (t: number) => 1 - (1 - t) ** 3;

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;
