'use client';

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** At most this many breeds stand side by side. */
export const COMPARE_LIMIT = 3;

interface State {
  /** Breed slugs the visitor kept. */
  saved: string[];
  /** Breed slugs waiting on the compare page, in the order they were added. */
  compare: string[];
  toggleSaved: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  /** Forget everything. */
  reset: () => void;
}

export const useCatalogue = create<State>()(
  persist(
    (set) => ({
      saved: [],
      compare: [],
      toggleSaved: (slug) => set((state) => ({ saved: state.saved.includes(slug) ? state.saved.filter((entry) => entry !== slug) : [...state.saved, slug] })),
      // a fourth choice pushes the oldest one out
      toggleCompare: (slug) =>
        set((state) => ({
          compare: state.compare.includes(slug) ? state.compare.filter((entry) => entry !== slug) : [...state.compare, slug].slice(-COMPARE_LIMIT),
        })),
      clearCompare: () => set({ compare: [] }),
      reset: () => set({ saved: [], compare: [] }),
    }),
    { name: 'catalogue', version: 1 },
  ),
);

const never = () => () => {};

/** False on the server and during hydration, true afterwards. */
export const useHydrated = () =>
  useSyncExternalStore(
    never,
    () => true,
    () => false,
  );
