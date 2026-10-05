import type { Metadata } from 'next';
import { SavedView } from '@/components/Lists';
import { BREEDS, toTile } from '@/lib/catalogue';

export const metadata: Metadata = {
  title: 'Saved',
  description: 'The cat breeds you saved while browsing the atlas. They are kept in this browser and nowhere else.',
  robots: { index: false, follow: true },
};

export default function Saved() {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Saved</h1>
        <p>Kept in this browser and nowhere else. There is no account, so another device will not show them.</p>
      </div>
      <SavedView items={BREEDS.map(toTile)} />
      <div className="page-foot" />
    </main>
  );
}
