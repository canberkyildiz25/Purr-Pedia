import type { Metadata } from 'next';
import { BreedTile } from '@/components/BreedTile';
import { BREEDS, toTile, type Breed } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'Cat breeds in order of appearance: the old natural breeds first, then every breed whose history names a starting date, decade by decade.',
  alternates: { canonical: '/timeline/' },
};

type Dated = Breed & { era: { kind: 'dated'; year: number; decade: number; label: string } };

export default function Timeline() {
  const old = BREEDS.filter((breed) => breed.era.kind === 'old');
  const dated = BREEDS.filter((breed): breed is Dated => breed.era.kind === 'dated').sort((a, b) => a.era.year - b.era.year || a.name.localeCompare(b.name));
  const undated = BREEDS.filter((breed) => breed.era.kind === 'undated');
  const decades = [...new Set(dated.map((breed) => breed.era.decade))];

  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>In order of appearance</h1>
        <p>
          Each breed is placed by the first date its own history gives for its beginning. A date of recognition by a registry is not a beginning and is not
          used. {undated.length} entries give no date at all and close the page.
        </p>
      </div>

      <section className="decade" aria-labelledby="old">
        <div>
          <h2 id="old">Old</h2>
          <p className="decade__note">{old.length} breeds their histories call ancient or natural, with no founding date.</p>
        </div>
        <div className="tiles" data-in>
          {old.map((breed) => (
            <BreedTile key={breed.id} breed={toTile(breed)} />
          ))}
        </div>
      </section>

      {decades.map((decade) => {
        const breeds = dated.filter((breed) => breed.era.decade === decade);
        return (
          <section key={decade} className="decade" aria-labelledby={`d${decade}`}>
            <div>
              <h2 id={`d${decade}`}>{decade}s</h2>
              <p className="decade__note nums">
                {breeds.length} {breeds.length === 1 ? 'breed' : 'breeds'}
              </p>
            </div>
            <div className="tiles" data-in>
              {breeds.map((breed) => (
                <BreedTile key={breed.id} breed={{ ...toTile(breed), place: `${breed.era.label}, ${toTile(breed).place}` }} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="decade" aria-labelledby="undated">
        <div>
          <h2 id="undated">No date</h2>
          <p className="decade__note">{undated.length} entries whose histories name no beginning.</p>
        </div>
        <div className="tiles" data-in>
          {undated.map((breed) => (
            <BreedTile key={breed.id} breed={toTile(breed)} />
          ))}
        </div>
      </section>
      <div className="page-foot" />
    </main>
  );
}
