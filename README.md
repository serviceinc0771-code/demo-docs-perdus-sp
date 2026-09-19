# Documents perdus San-Pédro (démo)

Site statique **Astro + Tailwind + React** pour signaler ou retrouver un document perdu à **San-Pédro** (Côte d’Ivoire). Interface en français. **Données fictives** — site de démonstration.

## Concept

- **J’ai perdu** / **J’ai trouvé** : deux parcours clairs depuis l’accueil.
- Listes filtrables (`/perdus`, `/trouves`) à partir de `src/data/listings.json`.
- Signalement client-only (`/signaler`) : succès simulé + rappel de ce qui serait publié.
- Mise en relation **médiée** : le contact WhatsApp n’est révélé qu’après une checklist anti-arnaque.

## Règles anti-arnaque (obligatoires)

### Afficher (public)

- Type de document
- Zone large (quartier / secteur)
- Date
- Statut (perdu / trouvé)
- Masque **≤ 4 caractères** (ex. `…4821`)
- Indice secret **challenge** (vérification sans tout révéler)

### Cacher (jamais en public)

- Numéro complet (CNI, passeport, etc.)
- Photo / scan de la pièce
- Identité complète
- Contacts / numéro WhatsApp **en clair** sur les listes

### Contact

1. Modal **« On ne demande jamais d’argent »**
2. Checkboxes : pas de paiement avant rencontre publique ; vérification en personne (commissariat / mairie si besoin) ; la plateforme n’est **pas** un escrow
3. Puis seulement : **deep link** WhatsApp prérempli vers un **numéro démo** (jamais listé en public)
4. Bouton **Signaler un abus** sur chaque annonce

### Interdits (no-go)

- Module de paiement / Mobile Money / escrow
- Photo de pièce d’identité
- Affichage du numéro WhatsApp en clair dans le HTML public des listes
- Demande ou offre d’argent pour « débloquer » un document

## Design (DA)

| Token    | Valeur    | Usage        |
|----------|-----------|--------------|
| Fond     | `#F5F5F4` | page         |
| Surface  | `#FFFFFF` | cartes       |
| Texte    | `#1C1917` | principal    |
| Secondaire | `#57534E` | muted      |
| CTA      | `#1E3A5F` | actions      |
| Succès   | `#166534` | confirmations|
| Alerte   | `#B91C1C` | anti-arnaque |
| Bordure  | `#E7E5E4` | séparateurs  |

Mood : service utile, sobre, digne de confiance — pas un SaaS violet générique.

## Pages

| Route                 | Rôle                                      |
|-----------------------|-------------------------------------------|
| `/`                   | Accueil, CTAs perdu / trouvé              |
| `/perdus`             | Recherche / liste des pertes              |
| `/trouves`            | Recherche / liste des trouvailles         |
| `/signaler`           | Formulaire client-only                    |
| `/comment-ca-marche`  | Flux sécurité                             |
| `/contact`            | Contact + signalement d’abus (démo)       |

## Développement

```bash
cd demo-docs-perdus-sp
npm install
npm run dev
npm run build
```

Build attendu : `dist/` statique. Ne pas déployer ni pousser depuis cet agent (parent s’en charge).

## Données

Fichier : `src/data/listings.json` (12 exemples fictifs San-Pédro : CNI, permis, carte santé, acte de naissance, passeport). Chaque entrée est marquée `demo: true` / DÉMO.

## Licence / statut

Démonstration éducative. Aucune donnée personnelle réelle.
