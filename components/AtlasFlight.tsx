'use client';

import Link from 'next/link';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { Photo } from '@/lib/catalogue';
import type { RegionKey } from '@/lib/regions';
import { arrive, between, mix, settle, useStaged } from '@/lib/scroll';
import { CatPhoto } from './CatPhoto';
import { useScene } from './Scene';

export interface FlightPlace {
  slug: string;
  name: string;
  region: RegionKey;
  /** Where the place sits, in the map's own units. */
  x: number;
  y: number;
  r: number;
  count: number;
  /** Which stop of the tour the place belongs to, and how far into it (0 to 1) its mark appears. */
  stop: number;
  turn: number;
  /** Photographs that fly to this place. */
  flyers: { slug: string; photo: Photo; turn: number; from: [number, number]; tilt: number }[];
}

export interface FlightStop {
  key: RegionKey;
  name: string;
  count: number;
  line: string;
  /** The corner-to-corner box around the region's places, in the map's own units. */
  box: [number, number, number, number];
}

/* How the held scroll is divided: the map alone, then one stretch per region,
   then the whole world again with everything in place. */
const OPEN = 0.08;
const CLOSE = 0.88;

/** The map, toured. As the wheel turns the view closes in on each region in
    turn, and photographs of that region's breeds fly in from outside the frame
    and land on the places the breeds are traced to, each one shrinking into
    the mark of its place. At the end the view pulls back to the whole world.

    The marks and the photographs are a show for the eye; they are hidden from
    assistive technology, and the same regions are ordinary links beside the
    map. With no JavaScript, or with less motion asked for, the map is simply
    there, finished. */
export function AtlasFlight({
  width,
  height,
  places,
  stops,
  regions,
  land,
}: {
  width: number;
  height: number;
  places: FlightPlace[];
  stops: FlightStop[];
  regions: { key: RegionKey; name: string; count: number }[];
  land: ReactNode;
}) {
  const scene = useScene();
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const staged = useStaged();

  useEffect(() => {
    const seen = frame.current;
    const map = layer.current;
    if (!seen || !map || !staged) return;

    const flyers = [...map.querySelectorAll<HTMLElement>('[data-flyer]')].map((element) => ({
      element,
      stop: Number(element.dataset.stop),
      turn: Number(element.dataset.turn),
      dx: Number(element.dataset.dx),
      dy: Number(element.dataset.dy),
      tilt: Number(element.dataset.tilt),
    }));
    const marks = [...map.querySelectorAll<SVGElement>('[data-mark]')].map((element) => ({ element, stop: Number(element.dataset.stop), turn: Number(element.dataset.turn) }));
    const each = (CLOSE - OPEN) / stops.length;

    const stop = scene.watch((p) => {
      const seenWidth = seen.clientWidth;
      const seenHeight = seen.clientHeight;
      const unit = seenWidth / width;
      const world = { x: width / 2, y: height / 2, zoom: 1 };
      const shot = (stop: FlightStop) => {
        const [left, top, right, bottom] = stop.box;
        const fit = Math.min(seenWidth / ((right - left) * unit), seenHeight / ((bottom - top) * unit));
        return { x: (left + right) / 2, y: (top + bottom) / 2, zoom: Math.min(3.6, Math.max(1.25, fit * 0.8)) };
      };

      // where the view is: leaving one stop, settling on the next
      let from = world;
      let to = world;
      let t = 0;
      if (p >= OPEN && p < CLOSE) {
        const at = Math.min(stops.length - 1, Math.floor((p - OPEN) / each));
        from = at === 0 ? world : shot(stops[at - 1]);
        to = shot(stops[at]);
        t = settle(between((p - OPEN) / each - at, 0, 0.36));
      } else if (p >= CLOSE) {
        from = shot(stops[stops.length - 1]);
        t = settle(between(p, CLOSE, CLOSE + 0.08));
      }
      const zoom = mix(from.zoom, to.zoom, t);
      const x = seenWidth / 2 - mix(from.x, to.x, t) * unit * zoom;
      const y = seenHeight / 2 - mix(from.y, to.y, t) * unit * zoom;
      map.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${zoom.toFixed(4)})`;

      // a photograph starts well outside the frame and lands on its place
      const reach = Math.max(seenWidth, seenHeight) * 0.75;
      for (const flyer of flyers) {
        const start = OPEN + (flyer.stop + 0.2 + flyer.turn * 0.3) * each;
        const raw = between(p, start, start + each * 0.42);
        const e = arrive(raw);
        const away = (1 - e) * reach;
        flyer.element.style.opacity = String(Math.min(between(raw, 0, 0.1), 1 - between(raw, 0.86, 1)));
        flyer.element.style.transform = `translate(-50%, -50%) translate3d(${((flyer.dx * away) / zoom).toFixed(1)}px, ${((flyer.dy * away) / zoom).toFixed(1)}px, 0) rotate(${(flyer.tilt * (1 - e)).toFixed(2)}deg) scale(${(mix(1, 0.22, e) / zoom).toFixed(4)})`;
      }
      // its mark is set down as the photograph lands; marks keep their size on screen however close the view is
      for (const mark of marks) {
        const start = OPEN + (mark.stop + 0.2 + mark.turn * 0.3 + 0.34) * each;
        const e = arrive(between(p, start, start + each * 0.1));
        mark.element.style.opacity = String(e);
        mark.element.style.transform = `scale(${(mix(0.5, 1, e) / zoom).toFixed(4)})`;
      }
    });
    // standing down: everything goes back to where the still page has it
    return () => {
      stop();
      map.style.transform = '';
      for (const { element } of [...flyers, ...marks]) {
        element.style.opacity = '';
        element.style.transform = '';
      }
    };
  }, [scene, stops, width, height, staged]);

  /* when a stop's words are on screen: from just after the view starts towards it until just after it leaves */
  const during = (index: number) => {
    const each = (CLOSE - OPEN) / stops.length;
    return { '--in': (OPEN + index * each + each * 0.08).toFixed(3), '--out': (OPEN + (index + 1) * each + each * 0.04).toFixed(3) } as CSSProperties;
  };

  return (
    <div className="flight">
      <div className="flight__say">
        <h2 id="atlas-title">{places.length} places on one map</h2>
        <p className="flight__lede cue" style={{ '--out': OPEN + 0.02 } as CSSProperties}>
          A mark for every country or island a breed is traced to. The bigger the mark, the more breeds began there.
        </p>
        <ol className="flight__stops">
          {stops.map((stop, index) => (
            <li key={stop.key} className="cue" style={during(index)} data-region={stop.key}>
              <h3>
                <Link href={`/regions/${stop.key}/`}>{stop.name}</Link>
              </h3>
              <p className="flight__count">
                {stop.count} {stop.count === 1 ? 'breed' : 'breeds'}
              </p>
              <p>{stop.line}</p>
            </li>
          ))}
        </ol>
        <div className="flight__end cue" style={{ '--in': CLOSE + 0.04 } as CSSProperties}>
          <ul className="legend">
            {regions.map((region) => (
              <li key={region.key}>
                <Link href={`/regions/${region.key}/`} data-region={region.key}>
                  <span className="swatch" aria-hidden="true" />
                  <span>{region.name}</span>
                  <span>{region.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flight__frame" ref={frame} aria-hidden="true">
        <div className="flight__map" ref={layer} style={{ aspectRatio: `${width} / ${height}` }}>
          <svg className="map" viewBox={`0 0 ${width} ${height}`}>
            {land}
            {places.map((place) => (
              <circle key={place.slug} className="map__mark" data-mark data-region={place.region} data-stop={place.stop} data-turn={place.turn} cx={place.x} cy={place.y} r={place.r} />
            ))}
          </svg>
          {places.flatMap((place) =>
            place.flyers.map((flyer) => (
              <span
                key={flyer.slug}
                className="flyer"
                data-flyer
                data-region={place.region}
                data-stop={place.stop}
                data-turn={flyer.turn}
                data-dx={flyer.from[0]}
                data-dy={flyer.from[1]}
                data-tilt={flyer.tilt}
                style={{ left: `${(place.x / width) * 100}%`, top: `${(place.y / height) * 100}%` }}
              >
                <CatPhoto photo={flyer.photo} alt="" sizes="96px" />
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
