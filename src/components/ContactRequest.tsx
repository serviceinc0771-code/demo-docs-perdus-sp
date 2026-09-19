import { useMemo, useState } from 'react';

const DEMO_WA = '2250700000000'; // jamais affiché en clair avant acceptation

type Props = {
  listingId: string;
  docTypeLabel: string;
  zone: string;
  idMask: string;
  status: 'perdu' | 'trouve';
};

const CHECKS = [
  {
    id: 'no-pay',
    label: 'Je ne paierai rien avant une rencontre en lieu public (pas de MoMo, pas d’acompte).',
  },
  {
    id: 'verify',
    label: 'Je vérifierai le document en personne ; au besoin au commissariat ou à la mairie.',
  },
  {
    id: 'no-escrow',
    label: 'Je comprends que cette plateforme n’est pas un escrow et ne gère aucun paiement.',
  },
  {
    id: 'demo',
    label: 'Je sais que ceci est une démo : le lien WhatsApp mène à un numéro fictif.',
  },
] as const;

export default function ContactRequest({
  listingId,
  docTypeLabel,
  zone,
  idMask,
  status,
}: Props) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState(false);
  const [moneyModal, setMoneyModal] = useState(true);

  const allChecked = CHECKS.every((c) => checked[c.id]);

  const waUrl = useMemo(() => {
    const verb = status === 'trouve' ? 'trouvé' : 'perdu';
    const text = encodeURIComponent(
      `[DÉMO Documents perdus SP] Bonjour, je contacte au sujet de l’annonce ${listingId} (${docTypeLabel}, ${verb}, zone ${zone}, masque ${idMask}). Je n’offre aucun paiement.`
    );
    return `https://wa.me/${DEMO_WA}?text=${text}`;
  }, [listingId, docTypeLabel, zone, idMask, status]);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setRevealed(false);
  }

  function close() {
    setOpen(false);
    setChecked({});
    setRevealed(false);
    setMoneyModal(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-cta px-3 py-2 text-sm font-medium text-white hover:bg-cta-hover"
      >
        Demander contact
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 border-0 cursor-default"
            aria-label="Fermer"
            onClick={close}
          />
          <div className="relative z-10 w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-surface border border-border shadow-xl p-5 sm:p-6">
            {moneyModal ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-alert/30 bg-red-50 p-4">
                  <h2 id="contact-title" className="text-lg font-semibold text-alert m-0">
                    On ne demande jamais d’argent
                  </h2>
                  <p className="text-sm text-ink mt-2 mb-0">
                    Ni pour « débloquer » un contact, ni pour « garder » un document, ni via Mobile Money.
                    Quiconque demande un paiement est une arnaque — signalez-le.
                  </p>
                </div>
                <ul className="text-sm text-muted space-y-1 m-0 pl-5 list-disc">
                  <li>Pas de photo ou scan de pièce sur le site</li>
                  <li>Numéro WhatsApp jamais listé en public</li>
                  <li>Rencontre en lieu public uniquement</li>
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    className="rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-white hover:bg-cta-hover"
                    onClick={() => setMoneyModal(false)}
                  >
                    J’ai compris — continuer
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted hover:bg-bg"
                    onClick={close}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 id="contact-title" className="text-lg font-semibold text-ink m-0">
                    Demander le contact
                  </h2>
                  <p className="text-sm text-muted mt-1 mb-0">
                    {docTypeLabel} · {zone} · masque {idMask}
                  </p>
                </div>

                <fieldset className="space-y-3 border-0 p-0 m-0">
                  <legend className="text-sm font-medium text-ink mb-2">
                    Checklist anti-arnaque (obligatoire)
                  </legend>
                  {CHECKS.map((c) => (
                    <label
                      key={c.id}
                      className="flex gap-3 items-start text-sm text-ink cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 accent-[var(--color-cta)]"
                        checked={!!checked[c.id]}
                        onChange={() => toggle(c.id)}
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </fieldset>

                {!revealed ? (
                  <button
                    type="button"
                    disabled={!allChecked}
                    onClick={() => setRevealed(true)}
                    className="w-full rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Révéler le lien WhatsApp (démo)
                  </button>
                ) : (
                  <div className="rounded-xl border border-success/30 bg-green-50 p-4 space-y-3">
                    <p className="text-sm text-success font-medium m-0">
                      Lien prêt. Le numéro n’est pas affiché en clair sur les listes publiques.
                    </p>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
                    >
                      Ouvrir WhatsApp (numéro démo)
                    </a>
                    <p className="text-xs text-muted m-0">
                      Deep link prérempli · démo uniquement · aucun paiement possible via ce site.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                  <a
                    href={`/contact?signaler=${listingId}`}
                    className="text-sm text-alert underline-offset-2 hover:underline"
                  >
                    Signaler un abus
                  </a>
                  <button
                    type="button"
                    className="ml-auto text-sm text-muted underline-offset-2 hover:underline bg-transparent border-0 cursor-pointer"
                    onClick={close}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
