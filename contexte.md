# Otarcy — Contexte Projet

## Identité
- **Produit** : AIO Brand Audit SaaS — "Optimisez votre marque pour les IAs"
- **Site** : https://blackotarcyweb.vercel.app
- **Repo GitHub** : https://github.com/greymatter777/Black-Otarcy
- **Stack** : React 18 + TypeScript, Vite, Vercel, @supabase/supabase-js (auth + db), stripe, resend, jspdf, Groq (llama-3.3-70b-versatile)

---

## Architecture

```
src/
  main.tsx
  App.tsx                 — / /pricing /glossaire /faq publiques — /dashboard /aio-report protégés
  pages/
    Index.tsx             — Hero + WhyAio + AboutSection + NewsletterSection + AuditSection (publique)
    Pricing.tsx           — 3 plans (publique)
    Dashboard.tsx         — Historique audits (protégé)
    AioReport.tsx         — Rapport AIO + Plan LinkedIn (protégé)
    Glossaire.tsx         — /glossaire — Glossaire AIO (30 termes, publique)
    Faq.tsx               — /faq — FAQ AIO (16 questions, publique)
    Login.tsx             — /login fond #0a0a0a full black + bouton ← Retour
    ResetPassword.tsx     — /reset-password
  lib/
    auth.tsx              — AuthProvider + useAuth() → { user, session, loading, signOut }
    useAuthFetch.ts       — authFetch() envoie Authorization: Bearer <JWT Supabase>
    supabase.ts           — client Supabase
    exportPDF.ts          — export PDF

api/
  audit.ts                — POST /api/audit
  aio-report.ts           — POST /api/aio-report
  user-status.ts          — GET /api/user-status
  history.ts              — GET /api/history
  create-checkout.ts      — POST /api/create-checkout
  guide.ts                — POST /api/guide
  linkedin-plan.ts        — POST /api/linkedin-plan
  swot-templates.ts       — POST /api/swot-templates
  newsletter.ts           — POST /api/newsletter (inscription Le Brief AIO)
  digest.ts               — POST /api/digest (veille AIO automatisée — déclenché par GitHub Actions)
  webhook.ts              — Stripe webhook

.github/
  workflows/
    digest.yml            — Cron GitHub Actions samedi 19h00 UTC (= 20h00 Paris)

supabase/
  schema.sql
  migration-swot-kpi.sql
  migration-aio.sql
  migration-rls-fix.sql

public/
  favicon.png             — Logo Otarcy (remplace favicon Vite)

contexte.md               — Ce fichier
otarcy-design-system.md   — Design system complet
otarcy-aio-foundation.docx — Stratégie contenu AIO Foundation (12 semaines)
```

---

## Plans & Pricing

| Plan | Nom | Prix | Audits | Différenciateur |
|------|-----|------|--------|----------------|
| free | Découverte | 0€ | 3 total | Audit basique + guides d'action |
| pro | AIO Essentiel | 19€/mois | Illimité | Score AIO + SWOT + KPI + PDF + LinkedIn |
| agency | AIO Expert | 99€/mois | Illimité | Stratégie marketing IA + Quick Wins |

---

## Fonctionnalités — État complet

### ✅ En production
- Auth Supabase (email + Google + GitHub + Magic link + reset password)
- Page principale publique + flow connexion propre
- Audit IA Groq (score + analyse + recommandations)
- **Mini guides d'action** après chaque recommandation (tous les plans)
- SWOT automatisé (Pro/Agence)
- **Templates posts LinkedIn** depuis le SWOT (Pro/Agence)
- KPI de marque (Pro/Agence)
- Rapport AIO complet (/aio-report)
- **Plan de contenu LinkedIn** après rapport AIO (Pro/Agence)
- Dashboard + historique
- Export PDF
- Stripe checkout + webhook
- Collecte emails Resend
- Sécurité MVP (rate limit + sanitize + CORS + RLS + JWT Supabase)
- **Section À propos** AIO-friendly (Q&A structuré, valeurs, contexte & origine)
- **Favicon** remplacé par le logo Otarcy
- **Logo navbar** : OT/CY (was OT/AR)
- **Icônes sociales** : LinkedIn + Instagram en `#a3e635`, visibles en sidebar gauche
- **Instagram** : nouveau handle `@otarcy.ai` → https://www.instagram.com/otarcy.ai (était @otarcy.web)
- **Newsletter "Le Brief AIO"** — formulaire sur le site + endpoint Resend + email de confirmation
- **Veille AIO automatisée** — GitHub Actions cron + scraping RSS + résumé Groq + envoi Resend
- **Page /glossaire** — 24 termes AIO, recherche + filtre par lettre, Schema.org DefinedTermSet
- **Page /faq** — 16 questions en 4 catégories, accordion, Schema.org FAQPage
- **Footer** — 3 colonnes (identité, produit, ressources), liens Glossaire + FAQ + Newsletter

### ✅ Pages pilier sectorielles (session 11/03/2026)
- `/aio-coaching`     → `src/pages/AioCoaching.tsx`
- `/aio-ecommerce`    → `src/pages/AioEcommerce.tsx`
- `/aio-immobilier`   → `src/pages/AioImmobilier.tsx`
- `/aio-restauration` → `src/pages/AioRestauration.tsx`

### ⬜ À implémenter
- `/aio-rh`     → page pilier Conseil RH / Recrutement
- `/aio-sante`  → page pilier Santé & Bien-être
- Graphique évolution des scores
- Webhook Stripe en mode live (à configurer avant lancement public)
- Image de couverture LinkedIn
- Domaine `otarcy.fr` — à acheter (~12€/an) pour débloquer l'envoi Resend sans restriction
- Schema.org Organization (JSON-LD) dans index.html
- Dropdown "Secteurs" dans la navbar (quand les 6 pages pilier seront complètes)

---

## Modifications UI (session 10/03/2026)

### Navbar
- Lien **À PROPOS** ajouté (scroll vers `#about`) entre AIO et AUDIT
- Logo **OT/CY** (était OT/AR)
- Handler scroll navbar générique — `item.to.replace("#", "")` au lieu de hardcodé `"audit"`

### SideLeft — Icônes sociales
- Icône Facebook remplacée par **LinkedIn** → `https://www.linkedin.com/company/otarcy-france`
- Les deux icônes (LinkedIn + Instagram) passent en `stroke: "#a3e635"` (vert fixe)

### Section AboutSection — `#about`
- Positionnée entre `WhyAio` et `AuditSection`
- Label : `.03 — À propos`
- Contenu AIO-friendly : bloc Q&A (3 questions/réponses), 3 cartes de valeurs, bloc contexte & origine
- Termes optimisés pour indexation IA : AIO, AI Optimization, ChatGPT, Claude, Gemini, Perplexity, PME françaises, solution française

---

## Nouvelles features (session 10/03/2026)

### 1. Mini guides d'action — `api/guide.ts`
- Endpoint : `POST /api/guide`
- Payload : `{ recommendation, brand }`
- Retourne : `{ titre, etapes[{numero, action, detail}], duree_estimee, impact }`
- UI : bouton "→ Comment faire ?" sur chaque recommandation dans `Index.tsx`
- Guide mis en cache — pas de double appel API
- Disponible : tous les plans

### 2. Plan de contenu LinkedIn — `api/linkedin-plan.ts`
- Endpoint : `POST /api/linkedin-plan`
- Payload : `{ brand, aio_score, gaps_contenu, sujets_associes, actions_prioritaires }`
- Retourne : `{ posts[{numero, theme, type, accroche, contenu, hashtags, objectif_aio}] }`
- UI : bouton "Générer →" en bas du rapport AIO dans `AioReport.tsx`
- Bouton "Copier" sur chaque post
- Disponible : Pro + Agence

### 3. Templates LinkedIn depuis SWOT — `api/swot-templates.ts`
- Endpoint : `POST /api/swot-templates`
- Payload : `{ brand, strengths, opportunities }`
- Retourne : `{ templates[{numero, angle, format, accroche, contenu, hashtags, conseil}] }`
- UI : bouton "Générer →" sous le SWOT dans `Index.tsx`
- Bouton "Copier" sur chaque template
- Disponible : Pro + Agence (visible uniquement si SWOT présent)

---

## Nouvelles features (session 11/03/2026)

### 4. Newsletter "Le Brief AIO" — `api/newsletter.ts`
- Endpoint : `POST /api/newsletter`
- Payload : `{ email }`
- Ajoute le contact dans l'audience Resend dédiée + envoie email de confirmation
- UI : composant `NewsletterSection` inliné dans `Index.tsx` (label `.04 — Newsletter`)
- Positionné entre `<AboutSection />` et `<AuditSection />`
- Lien **NEWSLETTER** ajouté dans la navbar (scroll vers `#newsletter`)
- Disponible : tous les visiteurs (pas d'auth requise)
- Env var : `RESEND_NEWSLETTER_AUDIENCE_ID`

### 5. Veille AIO automatisée — `api/digest.ts` + `.github/workflows/digest.yml`
- Endpoint : `POST /api/digest` (protégé par `DIGEST_SECRET`)
- Scrape 6 sources RSS (Search Engine Journal, The Rundown AI, Ben's Bites, AI Snack, Marketing AI Institute, Maginative)
- Filtre les articles pertinents AIO/AI
- Génère via Groq : résumé analytique + newsletter éditorialisée (titre, actus, action de la semaine)
- Envoie **2 emails via Resend** :
  - Email éditeur (digest brut) → `DIGEST_RECIPIENT_EMAIL`
  - Newsletter éditorialisée → tous les abonnés de l'audience newsletter
- Déclenchement : GitHub Actions cron `0 19 * * 6` (samedi 19h UTC = 20h Paris)
- Déclenchement manuel possible via GitHub Actions → Run workflow
- Env vars : `DIGEST_SECRET`, `DIGEST_RECIPIENT_EMAIL`, `RESEND_NEWSLETTER_AUDIENCE_ID`

---


## Nouvelles features (session 11/03/2026 — suite)

### 6. Page Glossaire — `src/pages/Glossaire.tsx`
- Route : `/glossaire` (publique)
- 24 termes AIO répartis en 8 lettres (A, C, E, G, L, P, R, S, V)
- Barre de recherche + filtre par lettre
- Schema.org `DefinedTermSet` + `DefinedTerm` pour chaque terme — crawlable par les LLMs
- Lien vers `/faq` dans la navbar de la page
- CTA audit en bas de page

### 7. Page FAQ — `src/pages/Faq.tsx`
- Route : `/faq` (publique)
- 16 questions réparties en 4 catégories : Comprendre l'AIO / Otarcy & fonctionnement / Stratégie / Abonnement & données
- Accordion interactif (ouverture/fermeture par clic)
- Schema.org `FAQPage` + `Question` + `Answer` — format directement consommé par les LLMs pour les réponses directes
- Liens croisés vers `/glossaire` et `/pricing`
- CTA audit en bas de page

### 8. Footer — composant `Footer` inliné dans `Index.tsx`
- 3 colonnes : Identité (logo + description + réseaux) / Produit (Audit, Rapport, Tarifs, Dashboard) / Ressources (Glossaire, FAQ, Newsletter)
- Icônes LinkedIn + Instagram passent en `#a3e635` au hover
- Ligne basse : copyright + tagline de positionnement AIO
- Point d'entrée principal vers `/glossaire` et `/faq` pour les utilisateurs

### 9. index.html — Schema.org + meta tags
- `<title>` et `<meta description>` réécrits pour l'AIO
- Open Graph ajouté
- Schema.org `@graph` avec 3 entités liées : `Organization`, `SoftwareApplication`, `WebSite`
- Fonts Google (Bebas Neue + Raleway) chargées dans le HTML

## Présence & Communauté

### Page LinkedIn
- **Nom** : Otarcy France
- **URL** : https://www.linkedin.com/company/otarcy-france
- **Tagline** : "La solution française d'AI Optimization pour les PME"
- **Secteur** : Technologie, information et Internet
- **Siège** : Bordeaux, Gironde
- **Fondée en** : 2025
- **Structure juridique** : OÜ (e-Residency Estonie) → déclarée "Société privée" sur LinkedIn

### Stratégie de contenu LinkedIn
- **Rythme** : quotidien
- **Profil éditeur** : page entreprise Otarcy France uniquement
- **Formats** : posts texte, carrousels, reels courts, newsletter hebdo
- **5 piliers** : Éducation AIO / Audits publics de marques / Data exclusive / Prises de position / Build in public
- **Newsletter** : "Le Brief AIO" — dimanche matin, objectif 500 abonnés à 6 mois
- **Document stratégique** : `otarcy-aio-foundation.docx` — plan 12 semaines complet

---

## Auth — Supabase Auth

### Providers actifs
- ✅ Email + mot de passe
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Magic link
- ✅ Reset password

### Configuration Supabase
- **Site URL** : `https://blackotarcyweb.vercel.app`
- **Redirect URLs** : `https://blackotarcyweb.vercel.app/**` + `http://localhost:5173/**`

### Pattern auth frontend
```typescript
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";
const { user, signOut } = useAuth();
const res = await authFetch("/api/audit", { method: "POST", body: JSON.stringify({ brand }) });
```

### Pattern auth backend (inliné dans chaque fichier API)
```typescript
async function verifySupabaseAuth(req): Promise<{ userId: string; email: string } | null> {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { userId: user.id, email: user.email } : null;
}
```

---

## Flow UX

```
/ (publique)
  → Navbar : AIO | À PROPOS | NEWSLETTER | AUDIT | TARIFS | Connexion
  → Clic "Analyser" sans être connecté → /login
  → Connecté : audit → guides d'action → SWOT + templates LinkedIn
  → SideLeft : icônes LinkedIn + Instagram (#a3e635)
  → Sections : Hero → WhyAio → About → Newsletter → Audit

/aio-report (protégé)
  → Rapport AIO complet → plan de contenu LinkedIn en bas

/login
  → Fond #0a0a0a full black, carte centrée, bouton ← Retour
```

---

## Décisions techniques importantes

### Helpers inlinés dans chaque API
- Vercel ne résout pas les imports relatifs hors `/api/` au runtime
- `verifySupabaseAuth`, `checkRateLimit`, `sanitizeBrand` dupliqués dans chaque fichier

### Build Vercel
```json
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build"
```

### Stripe webhook — À régler avant lancement live
- Mode test (bleu) : webhook OTARCY configuré mais signing secret à vérifier
- Mode live (orange) : webhook à créer avec `checkout.session.completed` + `customer.subscription.deleted`
- Mise à jour manuelle plan possible via SQL : `UPDATE users SET plan = 'pro', audits_limit = -1 WHERE email = '...'`

### Resend — Limitation domaine
- Sans domaine vérifié, `onboarding@resend.dev` ne peut envoyer qu'à l'email du compte Resend (`ryansessou@gmail.com`)
- Dès achat de `otarcy.fr` : vérifier le domaine dans Resend → changer `from` dans `newsletter.ts` et `digest.ts` pour `newsletter@otarcy.fr`

### GitHub Actions — Digest cron
- Fichier : `.github/workflows/digest.yml`
- Cron : `0 19 * * 6` (samedi 19h UTC)
- Secrets GitHub requis : `VERCEL_APP_URL` + `DIGEST_SECRET`
- Test manuel : GitHub → Actions → Weekly AIO Digest → Run workflow

---

## Variables d'environnement (Vercel)

```
GROQ_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY              ← service_role JWT (commence par eyJ)
STRIPE_SECRET_KEY
STRIPE_PRO_PRICE_ID
STRIPE_AGENCY_PRICE_ID
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_AUDIENCE_ID                ← audience leads (existante)
RESEND_NEWSLETTER_AUDIENCE_ID     ← audience "Le Brief AIO" (nouvelle)
DIGEST_SECRET                     ← token partagé avec GitHub Actions
DIGEST_RECIPIENT_EMAIL            ← ryansessou@gmail.com (= email compte Resend)
```

---

## Stratégie & Positionnement

### Client idéal
- Fondateur / responsable marketing PME ou startup (5-50 employés)
- Déjà présent en ligne mais invisible auprès des IAs
- Perd des clients au profit de concurrents mieux positionnés sur ChatGPT/Perplexity

### Positionnement
- Semrush = Ferrari (enterprise, cher, complexe)
- Otarcy = outil qui transforme le diagnostic en action pour les PME
- Seule solution française accessible dédiée à l'AIO pour PME
- Inexistant à Bordeaux — fenêtre d'avance à exploiter

### Vision long terme
- Marché AIO France en phase de sensibilisation en 2025-2026
- Rentabilité réaliste à partir de 12 mois — période actuelle = investissement en audience et contenu
- Flywheel : Contenu → Audience → Utilisateurs → Données → Contenu encore meilleur → Autorité de domaine
- Otarcy doit devenir **la référence française de l'AIO** avant l'arrivée de concurrents mieux financés

### Budget lancement
| Poste | Coût |
|-------|------|
| Domaine (otarcy.fr ou .com) | ~12€/an |
| Tout le reste | 0€ |
| **Total** | **~1€/mois** |

---

## Leçons apprises

1. **Ne jamais pousher node_modules depuis Windows** — permissions binaires cassées sur Linux
2. **Vercel ignore les imports relatifs hors `/api/`** — helpers inlinés dans chaque fichier
3. **Le cache Vercel est très persistant** — supprimer/recréer le projet si bloqué
4. **Toujours vérifier les logs Function** (pas Build Logs) pour les erreurs runtime
5. **`SUPABASE_SERVICE_KEY`** = service_role (eyJ...), pas la clé anon
6. **Clerk domaine custom = 25$/mois** — Supabase Auth est la meilleure alternative
7. **Supabase Redirect URLs** — toujours configurer `https://domaine/**` et `http://localhost:5173/**`
8. **Stripe mode test vs live** — webhooks et secrets séparés, ne pas mélanger
9. **Mise à jour plan manuelle** : `UPDATE users SET plan = 'pro', audits_limit = -1 WHERE email = '...'`
10. **Favicon** : placer dans `public/` et vérifier la balise `<link rel="icon">` dans `index.html`
11. **LinkedIn page entreprise** : OÜ estonienne → déclarer "Société privée" — slug URL à configurer dès création
12. **Contenu AIO-friendly** : structurer en Q&A explicites, entités nommées, termes techniques non traduits (AIO, AI Optimization)
13. **Resend sans domaine** : `onboarding@resend.dev` uniquement vers l'email du compte — acheter `otarcy.fr` pour débloquer
14. **GitHub Actions cron** : secrets dans Settings → Secrets and variables → Actions — `VERCEL_APP_URL` + `DIGEST_SECRET`
15. **Resend rate limit** : 2 req/sec — ajouter `setTimeout(1000)` entre envois successifs
16. **`DIGEST_RECIPIENT_EMAIL`** doit être identique à l'email du compte Resend en mode test
17. **Instagram handle** : `@otarcy.ai` (https://www.instagram.com/otarcy.ai) — mettre à jour partout : SideLeft, Footer, Schema.org `sameAs`
18. **Pages pilier sectorielles** : routes statiques React dans `src/pages/` — même pattern que `/glossaire` et `/faq` — Schema.org FAQPage + WebPage + hook `useReveal` — pas d'auth requise
19. **URL pilier** : préfixe `/aio-[secteur]` — plus AIO-friendly que `/secteurs/[secteur]` car le mot-clé "AIO" est dans l'URL
20. **Audit exemple anonymisé** : chaque page pilier contient un cas Avant/Après fictif mais réaliste pour crédibiliser le produit auprès des visiteurs et des IAs

---

## Pages pilier sectorielles (session 11/03/2026)

### Structure commune à chaque page
- Label sectoriel + H1 Bebas Neue avec span vert
- 3 stats clés (grid 3 colonnes)
- `.01` — Le problème : 3 cards accentuées (orange / bleu / rouge)
- `.02` — Audit exemple anonymisé : Avant/Après côte à côte
- `.03` — 5 Quick Wins avec badges durée + impact
- `.04` — FAQ accordion avec Schema.org FAQPage (JSON-LD)
- CTA final border vert + liens vers les autres secteurs
- Hook `useReveal()` pour animations scroll

### Pages produites
| Route | Fichier | Schema.org spécifique | Statut |
|-------|---------|----------------------|--------|
| `/aio-coaching` | `AioCoaching.tsx` | Person, FAQPage | ✅ En prod |
| `/aio-ecommerce` | `AioEcommerce.tsx` | Product, Review, FAQPage | ✅ En prod |
| `/aio-immobilier` | `AioImmobilier.tsx` | RealEstateAgent, LocalBusiness, FAQPage | ✅ En prod |
| `/aio-restauration` | `AioRestauration.tsx` | Restaurant, Menu, FAQPage | ✅ En prod |
| `/aio-rh` | `AioRh.tsx` | — | ⬜ À faire |
| `/aio-sante` | `AioSante.tsx` | — | ⬜ À faire |
