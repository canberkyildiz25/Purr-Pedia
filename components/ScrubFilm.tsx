'use client';

import { useEffect, useRef } from 'react';
import { useStaged } from '@/lib/scroll';
import { useScene } from './Scene';

/** A short film the wheel plays: scroll forward and it runs, scroll back and
    it runs backwards.

    The film is fetched whole before it is shown, so that jumping to a frame
    never waits on the network. The wheel only sets where the film should be;
    a loop of its own walks the film there a fifth of the way per frame, which
    is what makes it glide instead of stutter. One seek at a time: a second one
    is not asked for until the first has landed.

    The still stays in place of the film when there is no JavaScript, when the
    scenes are not running, or if the film never arrives. */
export function ScrubFilm({ name, width, height, alt, through = 'life' }: { name: string; width: number; height: number; alt: string; through?: 'life' | 'held' }) {
  const video = useRef<HTMLVideoElement>(null);
  const scene = useScene();
  const staged = useStaged();

  useEffect(() => {
    const film = video.current;
    if (!film || !staged) return;

    let alive = true;
    let address = '';
    let wanted = 0;
    let loop = 0;
    // a phone gets the smaller copy
    const small = matchMedia('(pointer: coarse), (max-width: 48rem)').matches;

    const step = () => {
      loop = 0;
      if (!film.duration) return;
      const target = Math.min(wanted, 0.999) * film.duration;
      const gap = target - film.currentTime;
      if (Math.abs(gap) < 0.01) return;
      if (!film.seeking) film.currentTime += Math.abs(gap) < 0.04 ? gap : gap * 0.2;
      loop = requestAnimationFrame(step);
    };
    const shown = () => film.classList.add('is-ready');
    film.addEventListener('seeked', shown, { once: true });

    fetch(`/film/${name}${small ? '-m' : ''}.mp4`)
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => {
        if (!alive) return;
        address = URL.createObjectURL(blob);
        film.src = address;
        film.load();
        film.addEventListener('loadedmetadata', () => {
          if (!loop) loop = requestAnimationFrame(step);
        });
      })
      .catch(() => {
        /* the still is already there */
      });

    const stop = scene.watch((p, life) => {
      wanted = through === 'held' ? p : life;
      if (!loop) loop = requestAnimationFrame(step);
    });

    return () => {
      alive = false;
      stop();
      cancelAnimationFrame(loop);
      film.removeEventListener('seeked', shown);
      film.classList.remove('is-ready');
      if (address) {
        film.removeAttribute('src');
        film.load();
        URL.revokeObjectURL(address);
      }
    };
  }, [name, scene, through, staged]);

  return (
    <div className="scrub" style={{ aspectRatio: `${width} / ${height}` }}>
      {/* the last frame, for when nothing moves; the first, to hold the place until the film is in */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="scrub__end" src={`/film/${name}.jpg`} alt={alt} width={width} height={height} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="scrub__start" src={`/film/${name}-0.jpg`} alt="" width={width} height={height} aria-hidden="true" />
      <video ref={video} muted playsInline preload="none" width={width} height={height} tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
