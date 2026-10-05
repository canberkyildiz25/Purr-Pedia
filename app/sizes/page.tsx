import type { Metadata } from 'next';
import { Scale, type ScaleRow } from '@/components/Scale';
import { BREEDS, heaviest, kg, type Breed } from '@/lib/catalogue';
import { REGIONS } from '@/lib/regions';

export const metadata: Metadata = {
  title: 'Sizes',
  description: 'Every breed in the atlas on one scale: weight, height at the shoulder and life span, largest first, each bar in the colour of the region the breed comes from.',
  alternates: { canonical: '/sizes/' },
};

export default function Sizes() {
  const rows: ScaleRow[] = BREEDS.map((breed) => ({ slug: breed.slug, name: breed.name, region: breed.region, weight: breed.weight, height: breed.height, life: breed.life }));
  const weighed = BREEDS.filter((breed): breed is Breed & { weight: [number, number] } => Boolean(breed.weight));
  const top = heaviest();
  const lightest = [...weighed].sort((a, b) => a.weight[1] - b.weight[1] || a.weight[0] - b.weight[0])[0];

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Sizes.</h1>
        <p>
          {`From the ${lightest.name}, which the source puts at ${kg(lightest.weight)}, up to ${top.kg} kg, where the ${top.names} all top out. Every bar is on the same scale and in its region’s colour.`}
        </p>
      </div>

      <ul className="key" aria-label="What the colours mean">
        {REGIONS.map((region) => (
          <li key={region.key}>
            <span data-region={region.key}>
              <span className="swatch" aria-hidden="true" />
              <span>{region.name}</span>
            </span>
          </li>
        ))}
      </ul>

      <Scale rows={rows} />

      <p className="credit">
        The ranges are the source&rsquo;s figures for a grown cat of the breed. They are not measurements of any one animal. The scale starts at
        zero, and a bar runs from the low end of the range to the high end.
      </p>
      <div className="page-foot" />
    </main>
  );
}
