import { useMemo, useState } from 'react';
import ContactRequest from './ContactRequest';

export type ListingRow = {
  id: string;
  status: 'perdu' | 'trouve';
  docType: string;
  docTypeLabel: string;
  zone: string;
  date: string;
  idMask: string;
  challengeHint: string;
  notesPublic: string;
  demo: boolean;
};

type Props = {
  listings: ListingRow[];
  mode: 'perdu' | 'trouve';
};

function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ListingCardStatic({ listing }: { listing: ListingRow }) {
  const isFound = listing.status === 'trouve';
  return (
    <article className="rounded-xl border border-border bg-surface p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-ink m-0">{listing.docTypeLabel}</h3>
          <p className="text-sm text-muted m-0 mt-0.5">{listing.zone}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isFound ? 'bg-green-50 text-success' : 'bg-amber-50 text-amber-900'
            }`}
          >
            {isFound ? 'Trouvé' : 'Perdu'}
          </span>
          {listing.demo && (
            <span className="inline-flex items-center rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-ink">
              DÉMO / fictif
            </span>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm m-0">
        <div>
          <dt className="text-muted text-xs">Date</dt>
          <dd className="m-0 font-medium">{formatDate(listing.date)}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs">Identifiant (masqué)</dt>
          <dd className="m-0 font-mono font-medium tracking-wide">{listing.idMask}</dd>
        </div>
      </dl>

      <p className="text-sm text-muted m-0">{listing.notesPublic}</p>

      <div className="rounded-lg border border-border bg-bg px-3 py-2 text-sm">
        <p className="m-0 text-xs text-muted uppercase tracking-wide">
          Indice de vérification (challenge)
        </p>
        <p className="m-0 mt-1 text-ink">{listing.challengeHint}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border mt-1">
        <ContactRequest
          listingId={listing.id}
          docTypeLabel={listing.docTypeLabel}
          zone={listing.zone}
          idMask={listing.idMask}
          status={listing.status}
        />
        <a
          href={`/contact?signaler=${listing.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm text-muted no-underline hover:bg-bg"
        >
          Signaler un abus
        </a>
      </div>
    </article>
  );
}

export default function ListingSearch({ listings, mode }: Props) {
  const [q, setQ] = useState('');
  const [docType, setDocType] = useState('all');
  const [zone, setZone] = useState('all');

  const docTypes = useMemo(
    () => Array.from(new Set(listings.map((l) => l.docTypeLabel))).sort(),
    [listings]
  );
  const zones = useMemo(
    () => Array.from(new Set(listings.map((l) => l.zone))).sort(),
    [listings]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter((l) => {
      if (docType !== 'all' && l.docTypeLabel !== docType) return false;
      if (zone !== 'all' && l.zone !== zone) return false;
      if (!needle) return true;
      const hay = [l.docTypeLabel, l.zone, l.idMask, l.notesPublic, l.challengeHint]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [listings, q, docType, zone]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1 space-y-1">
          <label htmlFor="q" className="text-xs font-medium text-muted">
            Recherche
          </label>
          <input
            id="q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type, zone, masque…"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-bg"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="filter-docType" className="text-xs font-medium text-muted">
            Type
          </label>
          <select
            id="filter-docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-bg"
          >
            <option value="all">Tous</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="filter-zone" className="text-xs font-medium text-muted">
            Zone
          </label>
          <select
            id="filter-zone"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-bg"
          >
            <option value="all">Toutes</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-muted m-0">
        {filtered.length} annonce{filtered.length > 1 ? 's' : ''} · données partielles uniquement
        ({mode === 'trouve' ? 'trouvés' : 'perdus'})
      </p>

      <ul className="space-y-4 list-none p-0 m-0">
        {filtered.map((listing) => (
          <li key={listing.id}>
            <ListingCardStatic listing={listing} />
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
            Aucun résultat. Essayez une autre zone ou un autre type.
          </li>
        )}
      </ul>
    </div>
  );
}
