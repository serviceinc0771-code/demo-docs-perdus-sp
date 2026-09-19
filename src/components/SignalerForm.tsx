import { useEffect, useState, type FormEvent } from 'react';

const DOC_TYPES = [
  { value: 'CNI', label: 'Carte nationale d’identité' },
  { value: 'permis', label: 'Permis de conduire' },
  { value: 'passeport', label: 'Passeport' },
  { value: 'acte_naissance', label: 'Acte de naissance' },
  { value: 'carte_sante', label: 'Carte d’assurance / santé' },
  { value: 'autre', label: 'Autre (préciser)' },
];

const ZONES = [
  'Centre-ville / Marché',
  'Port / Zone portuaire',
  'Bardot',
  'Seweke',
  'Quartier Balmer',
  'Cité / Zone résidentielle',
  'Gare routière',
  'Plage / Front de mer',
  'Mairie / Centre administratif',
  'Hôpital / Zone sanitaire',
  'Lycée / Zone scolaire',
  'Autre zone San-Pédro',
];

export default function SignalerForm() {
  const [status, setStatus] = useState<'perdu' | 'trouve'>('perdu');
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('statut');
    if (s === 'trouve' || s === 'perdu') setStatus(s);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accept) return;
    const fd = new FormData(e.currentTarget);
    const maskRaw = String(fd.get('idLast4') || '').trim().toUpperCase();
    const idMask = maskRaw ? `…${maskRaw.slice(-4)}` : '…----';
    setSummary({
      status: status === 'perdu' ? 'Perdu' : 'Trouvé',
      docType: String(fd.get('docType')),
      zone: String(fd.get('zone')),
      date: String(fd.get('date')),
      idMask,
      challenge: String(fd.get('challenge') || ''),
      notes: String(fd.get('notes') || ''),
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-green-50 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-success m-0">Signalement enregistré (simulation)</h2>
        <p className="text-sm text-ink m-0">
          Merci. Sur un vrai service, ceci serait stocké de façon sécurisée et publié
          <strong> sans</strong> numéro complet, sans photo et sans contact en clair.
        </p>
        <dl className="grid gap-2 text-sm bg-surface rounded-lg border border-border p-4 m-0">
          <div className="flex justify-between gap-4"><dt className="text-muted">Statut</dt><dd className="m-0 font-medium">{summary.status}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Type</dt><dd className="m-0 font-medium">{summary.docType}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Zone</dt><dd className="m-0 font-medium">{summary.zone}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd className="m-0 font-medium">{summary.date}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Masque public</dt><dd className="m-0 font-mono font-medium">{summary.idMask}</dd></div>
          {summary.challenge && (
            <div className="flex justify-between gap-4"><dt className="text-muted">Indice challenge</dt><dd className="m-0 font-medium text-right">{summary.challenge}</dd></div>
          )}
        </dl>
        <div className="rounded-lg border border-alert/20 bg-red-50 p-3 text-sm text-ink">
          <strong className="text-alert">Rappel :</strong> personne ne doit vous demander d’argent.
          Ce site ne propose aucun paiement, MoMo ni escrow.
        </div>
        <p className="text-sm text-muted m-0">
          Prochaines étapes (réelles, hors démo) : modération → publication partielle → mise en relation
          via lien WhatsApp après checklist anti-arnaque.
        </p>
        <button
          type="button"
          className="rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-white hover:bg-cta-hover"
          onClick={() => {
            setSubmitted(false);
            setAccept(false);
          }}
        >
          Faire un autre signalement
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="rounded-xl border border-alert/25 bg-red-50 p-4 text-sm">
        <p className="m-0 font-semibold text-alert">Ne saisissez jamais le numéro complet</p>
        <p className="m-0 mt-1 text-ink">
          Ni photo, ni scan, ni contact WhatsApp en clair. Seulement type, zone large, date,
          et au plus 4 caractères masqués.
        </p>
      </div>

      <fieldset className="space-y-2 border-0 p-0 m-0">
        <legend className="text-sm font-medium mb-2">Vous…</legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['perdu', 'J’ai perdu un document'],
              ['trouve', 'J’ai trouvé un document'],
            ] as const
          ).map(([v, label]) => (
            <label
              key={v}
              className={`flex-1 min-w-[140px] cursor-pointer rounded-lg border px-3 py-2.5 text-sm text-center ${
                status === v ? 'border-cta bg-sand font-medium' : 'border-border bg-surface'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={v}
                className="sr-only"
                checked={status === v}
                onChange={() => setStatus(v)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor="docType" className="text-sm font-medium">
          Type de document
        </label>
        <select
          id="docType"
          name="docType"
          required
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        >
          {DOC_TYPES.map((d) => (
            <option key={d.value} value={d.label}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="zone" className="text-sm font-medium">
          Zone large (San-Pédro)
        </label>
        <select
          id="zone"
          name="zone"
          required
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        >
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-sm font-medium">
            Date approximative
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            max={today}
            defaultValue={today}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="idLast4" className="text-sm font-medium">
            4 derniers caractères (optionnel)
          </label>
          <input
            id="idLast4"
            name="idLast4"
            type="text"
            maxLength={4}
            pattern="[A-Za-z0-9]{0,4}"
            placeholder="ex. 4821"
            autoComplete="off"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm font-mono"
          />
          <p className="text-xs text-muted m-0">Affiché comme …XXXX — jamais le n° complet.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="challenge" className="text-sm font-medium">
          Indice secret (challenge)
        </label>
        <input
          id="challenge"
          name="challenge"
          type="text"
          maxLength={120}
          placeholder="ex. couleur du portefeuille, ville d’émission…"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
        />
        <p className="text-xs text-muted m-0">
          Aide à vérifier le bon titulaire sans révéler d’identité complète.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Précisions publiques (sans données sensibles)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={280}
          placeholder="Lieu approximatif, circonstances… Pas de n°, pas de nom complet, pas de téléphone."
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm resize-y"
        />
      </div>

      <label className="flex gap-3 items-start text-sm cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 accent-[var(--color-cta)]"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          required
        />
        <span>
          Je confirme : aucun paiement demandé/offert, pas de photo de pièce, et je comprends que
          ce formulaire est une <strong>simulation de démo</strong>.
        </span>
      </label>

      <button
        type="submit"
        disabled={!accept}
        className="w-full sm:w-auto rounded-lg bg-cta px-5 py-2.5 text-sm font-medium text-white hover:bg-cta-hover disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Envoyer le signalement (démo)
      </button>
    </form>
  );
}
