import 'server-only';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land from 'world-atlas/land-110m.json';

/* The world, drawn once at build time. Natural Earth's land outline in an
   Equal Earth projection, so no part of the map is flattered. Antarctica is
   cropped: no cat on the list comes from there. Nothing here reaches the
   browser except the finished path. */

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 470;

const topology = land as unknown as Topology<{ land: GeometryCollection }>;
const shape = feature(topology, topology.objects.land);

const projection = geoEqualEarth()
  .rotate([-11, 0])
  .fitExtent(
    [
      [8, 8],
      [MAP_WIDTH - 8, MAP_HEIGHT * 1.2],
    ],
    { type: 'Sphere' },
  )
  .clipExtent([
    [0, 0],
    [MAP_WIDTH, MAP_HEIGHT],
  ]);

const round = (path: string) => path.replace(/\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10));

export const LAND_PATH = round(geoPath(projection)(shape) ?? '');

export function project(lon: number, lat: number): [number, number] {
  const point = projection([lon, lat]) ?? [0, 0];
  return [Math.round(point[0] * 10) / 10, Math.round(point[1] * 10) / 10];
}
