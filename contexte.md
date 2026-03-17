# Otarcy — Contexte Projet

## Identité
- **Produit** : AIO Brand Audit SaaS — "Optimisez votre marque pour les IAs"
- **Site** : https://otarcy.app
- **Repo GitHub** : https://github.com/greymatter777/Black-Otarcy
- **Stack** : React 18 + TypeScript, Vite, Vercel, @supabase/supabase-js (auth + db), stripe, resend, jspdf, Groq (llama-3.3-70b-versatile)
- **Domaine** : `otarcy.app` — acheté le 13/03/2026 sur Namecheap (~13$/an, renouvellement annuel)
- **Prerendering** : `prerender.mjs` custom — 13 routes HTML statiques générées au build, crawlables sans JavaScript

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
    Glossaire.tsx         — /glossaire — Glossaire AIO (24 termes, publique)
    Faq.tsx               — /faq — FAQ AIO (16 questions, publique)
    Blog.tsx              — /blog — Liste articles blog (publique)
    BlogPost.tsx          — /blog/:slug — Article individuel (publique)
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
  migration-blog.sql        — table blog_posts + RLS + premier article

public/
  favicon.png             — Logo Otarcy (remplace favicon Vite)

contexte.md               — Ce fichier
otarcy-design-system.md   — Design system complet
otarcy-aio-foundation.docx — Stratégie contenu AIO Foundation (12 semaines)
prerender.mjs             — Script prerendering statique (exécuté après vite build)
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
- **Prerendering statique** — 13 routes HTML statiques crawlables par les LLMs (`prerender.mjs` exécuté après `vite build`)
- **Blog `/blog`** — liste articles + pages individuelles `/blog/:slug`, Supabase, Schema.org Article, 100% public
- **Premier article** — "AIO vs SEO : les différences clés" (1500+ mots, structuré AIO, en prod)
- **Lien BLOG** dans la navbar (entre TARIFS et SECTEURS)

### ✅ Pages pilier sectorielles (session 11/03/2026)
- `/aio-coaching`     → `src/pages/AioCoaching.tsx` — Schema.org Person + FAQPage
- `/aio-ecommerce`    → `src/pages/AioEcommerce.tsx` — Schema.org Product + Review + FAQPage
- `/aio-immobilier`   → `src/pages/AioImmobilier.tsx` — Schema.org RealEstateAgent + FAQPage
- `/aio-restauration` → `src/pages/AioRestauration.tsx` — Schema.org Restaurant + Menu + FAQPage
- `/aio-rh`           → `src/pages/AioRh.tsx` — Schema.org ProfessionalService + FAQPage
- `/aio-sante`        → `src/pages/AioSante.tsx` — Schema.org MedicalBusiness + FAQPage

### ✅ Priorité 3 — Présence externe (session 14/03/2026)
- **Google Business Profile** — créé, CID : `9805525438360950467`
- **Wikidata** — élément créé, QID : `Q138666178` (déclarations complètes : P31, P495, P571, P159, P856, P4264, P2003)
- **Schema.org `sameAs`** — mis à jour : GBP + Wikidata + Instagram `@otarcy.app` (était `@otarcy.web`)
- **Improvmx** — 5 alias `@otarcy.app` configurés : `cedric@`, `contact@`, `hello@`, `support@`, `newsletter@`
- **Capterra** — profil soumis via Gartner Digital Markets, **refusé** (17/03/2026) — motif : catégorie "AIO" non reconnue par Gartner. Re-soumission prévue sous catégorie existante (Brand Management / Marketing Analytics) après traction initiale.
- **Stratégie mentions presse** — rédigée, emails prêts depuis `cedric@otarcy.app`

### ⬜ À implémenter
- Graphique évolution des scores
- **Webhook Stripe en mode live** (priorité absolue avant lancement public)
- Image de couverture LinkedIn
- Resend : vérifier domaine `otarcy.app` → changer `from` → `newsletter@otarcy.app` dans `newsletter.ts` et `digest.ts`
- Blog : 3 articles supplémentaires (objectif 4 articles Priorité 2 AIO Foundation)
- Glossaire : +6 termes (24 → 30)
- FAQ : +4 questions (16 → 20)
- **Product Hunt** — lancer Otarcy (après Stripe live)
- **AlternativeTo** — ajouter comme alternative à Semrush/Ahrefs (après Stripe live)
- **G2** — créer profil produit (après Stripe live)
- **Envoi pitchs presse** — Maddyness, Frenchweb, Siècle Digital (après Stripe live + 3 posts LinkedIn)

---

## Modifications UI (session 17/03/2026)

### Navbar — Responsive Mobile
- Ajout state `mobileOpen` (boolean) dans `Navbar`
- Breakpoint mobile : `768px` via balise `<style>` injectée — `.nav-desktop` masqué, `.nav-hamburger` affiché
- Bouton **hamburger ☰** — 3 barres animées (croix ✕ à l'ouverture), couleur `#a3e635` quand actif
- Overlay plein écran `#0a0a0a` au clic — tous les liens + secteurs dépliés + auth
- Scroll de la page bloqué (`overflow: hidden`) pendant que le menu est ouvert
- Fermeture automatique au clic sur n'importe quel lien
- Desktop : comportement inchangé

---

### Navbar — Dropdown Secteurs
- Nouveau state `secteurOpen` (boolean) dans `Navbar`
- Tableau `secteurLinks` déclaré hors du composant — 6 entrées vers les pages pilier
- Bouton **SECTEURS ▼** positionné après TARIFS, avant Connexion
- Flèche `▼` animée (rotation 180° à l'ouverture)
- Couleur verte `#a3e635` quand le dropdown est ouvert
- Dropdown : fond `#0f0f0f`, border `#2a2a2a`, hover vert + fond `#161616`
- Fermeture automatique au clic en dehors (listener `document click`)
- Fermeture au clic sur un lien (`onClick={() => setSecteurOpen(false)}`)

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
- **Site URL** : `https://otarcy.app`
- **Redirect URLs** : `https://otarcy.app/**` + `http://localhost:5173/**`

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
  → Navbar : AIO | À PROPOS | NEWSLETTER | AUDIT | TARIFS | BLOG | SECTEURS ▼ | Connexion
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
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build && node prerender.mjs"
```

### Stripe webhook — À régler avant lancement live
- Mode test (bleu) : webhook OTARCY configuré mais signing secret à vérifier
- Mode live (orange) : webhook à créer avec `checkout.session.completed` + `customer.subscription.deleted`
- Mise à jour manuelle plan possible via SQL : `UPDATE users SET plan = 'pro', audits_limit = -1 WHERE email = '...'`

### Resend — Limitation domaine
- Sans domaine vérifié, `onboarding@resend.dev` ne peut envoyer qu'à l'email du compte Resend (`ryansessou@gmail.com`)
- `otarcy.fr` déjà pris — viser `otarcy.ai` ou `otarcy.com`
- Dès achat du domaine : vérifier dans Resend → changer `from` dans `newsletter.ts` et `digest.ts` pour `newsletter@otarcy.ai`

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
| Domaine `otarcy.ai` (2 ans min) | ~60-80€ |
| Domaine `otarcy.com` (optionnel) | ~10-15€/an |
| Tout le reste | 0€ |
| **Total** | **~3-5€/mois** |

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
21. **React SPA sans SSR** : Vite + React par défaut génère `<div id="root"></div>` — les crawlers LLMs (Perplexity, OpenAI, Anthropic) n'exécutent pas JavaScript → contenu invisible sans prerendering
22. **Prerendering custom** : `prerender.mjs` à la racine, exécuté après `vite build` — crée `dist/[route]/index.html` pour chaque route publique — compatible Vercel, zéro dépendance externe
23. **vite-react-ssg incompatible** : nécessite réécriture des routes en format objet `RouteRecord[]` — incompatible avec `react-router-dom` JSX sans migration lourde
24. **supabase.ts au build SSG** : le `throw new Error` sur variables manquantes bloque tout SSG/SSR — remplacer par des valeurs placeholder pour le build
25. **`otarcy.fr` déjà pris** : appartient à une communauté nomade digitale — `otarcy.com` premium (+1000€) — `otarcy.ai` minimum 2 ans (~35-45€/an)
26. **`otarcy.app` retenu** : Google Registry, ~13$/an, signal SaaS immédiat, aucun spéculateur — meilleur rapport qualité/prix
27. **Blog avec Supabase** : stocker les articles en DB plutôt qu'en fichiers `.ts` — éditable sans redeploy, scalable à 24+ articles
28. **`useReveal` et données async** : passer la dépendance de chargement au hook `useReveal(loading)` — sinon les éléments `.reveal` restent invisibles (chargés après le premier rendu)
29. **`dist/` dans le repo** : toujours exclure via `.gitignore` — Vercel génère son propre build, inutile de versionner les assets compilés
30. **Navbar inlinée dans `Index.tsx`** : pas de composant séparé — modifier directement le tableau des liens dans `Index.tsx`
31. **Migration domaine** : `sed -i 's|ancien-domaine|nouveau-domaine|g'` sur tous les fichiers — vérifier index.html, prerender.mjs, tous les .tsx avec Schema.org + Supabase Auth Redirect URLs + Vercel Domains
32. **Google Business Profile** : CID récupérable dans les paramètres avancés de la fiche — format numérique long — à ajouter dans `sameAs` Schema.org sous la forme `https://www.google.com/maps?cid=XXXX`
33. **Wikidata** : créer le compte avec email perso, faire une contribution mineure avant de créer un élément (anti-spam) — QID format `Q` + chiffres — à ajouter dans `sameAs` Schema.org
34. **Éléments protégés Wikidata** : France (Q142), Bordeaux (Q13280) non modifiables pour les nouveaux comptes — utiliser des éléments moins consultés (communes, entreprises locales)
35. **Improvmx** : plan gratuit = 25 alias sur son propre domaine, redirection vers Gmail — idéal pour avoir des adresses `@otarcy.app` sans coût — nécessite MX records + TXT SPF dans Namecheap
36. **MX records Namecheap** : activer via "Paramètres du courrier" → "MX personnalisé" — les éléments très populaires (France, grandes villes) sont en lecture seule pour les nouveaux comptes Wikidata
37. **Capterra/Gartner** : soumission via https://digitalmarkets.gartner.com/get-listed/start — scrape automatique du site si Schema.org + prerendering bien configurés — nécessite email pro `@domaine`
38. **Instagram handle** : mis à jour → `@otarcy.app` (https://www.instagram.com/otarcy.app) — mettre à jour dans SideLeft, Footer, Schema.org `sameAs`
39. **Navbar responsive mobile** : breakpoint `768px` via `<style>` injectée dans le composant — `.nav-desktop` / `.nav-hamburger` — overlay plein écran avec menu hamburger animé — bloquer `document.body.style.overflow` pendant l'ouverture

---

## Nouvelles features (session 12/03/2026)

### 10. Prerendering statique — `prerender.mjs`
- Script Node.js custom à la racine du projet
- Exécuté automatiquement après `vite build` via `&&` dans le script npm
- Génère `dist/[route]/index.html` pour chaque route publique (13 routes)
- Routes prerenderées : `/`, `/pricing`, `/glossaire`, `/faq`, `/login`, `/reset-password`, `/blog`, `/aio-coaching`, `/aio-ecommerce`, `/aio-immobilier`, `/aio-restauration`, `/aio-rh`, `/aio-sante`
- Routes exclues (privées) : `/dashboard`, `/aio-report`
- Fetch dynamique des slugs blog depuis Supabase au build (si variables dispo)
- Résultat : crawlers LLMs reçoivent du HTML complet avec contenu + Schema.org sans exécuter JavaScript
- Compatible Vercel, zéro dépendance externe, zéro modification des composants React existants
- Vérification : `view-source:https://otarcy.app/glossaire` → 132 lignes de HTML complet ✅

### 11. Blog — `src/pages/Blog.tsx` + `src/pages/BlogPost.tsx`
- Routes : `/blog` (liste) + `/blog/:slug` (article individuel) — 100% publiques
- Contenu stocké dans Supabase table `blog_posts` — éditable sans redeploy
- Schema.org `Blog` sur `/blog` + Schema.org `Article` sur chaque article
- Rendu Markdown léger custom (H2, H3, listes, gras) — zéro dépendance externe
- `useReveal` avec dépendance sur les données chargées — évite le rectangle noir au chargement
- CTA "Auditer ma marque" en bas de chaque page
- Lien **BLOG** ajouté dans la navbar (entre TARIFS et SECTEURS)
- `dist/` retiré du repo GitHub — `.gitignore` créé

### 12. Premier article blog — "AIO vs SEO : les différences clés"
- Slug : `aio-vs-seo-differences`
- 1500+ mots, structuré en H2/H3, format AIO-friendly
- 5 différences fondamentales, conseils actionnables pour PME françaises
- CTA Otarcy intégré en conclusion
- Inséré via `migration-blog.sql` dans Supabase

---

## Pages pilier sectorielles (session 11/03/2026)

### Structure commune à chaque page
- Label sectoriel + H1 Bebas Neue avec span vert
- 3 stats clés (grid 3 colonnes)
- `.01` — Le problème : 3 cards accentuées (orange / bleu / rouge)
- `.02` — Audit exemple anonymisé : Avant/Après côte à côte
- `.03` — 5 Quick Wins avec badges durée + impact
- `.04` — FAQ accordion avec Schema.org FAQPage (JSON-LD)
- CTA final border vert + liens vers les 5 autres secteurs
- Hook `useReveal()` pour animations scroll

### Pages produites

| Route | Fichier | Schema.org spécifique | Statut |
|-------|---------|----------------------|--------|
| `/aio-coaching` | `AioCoaching.tsx` | Person, FAQPage | ✅ En prod |
| `/aio-ecommerce` | `AioEcommerce.tsx` | Product, Review, FAQPage | ✅ En prod |
| `/aio-immobilier` | `AioImmobilier.tsx` | RealEstateAgent, LocalBusiness, FAQPage | ✅ En prod |
| `/aio-restauration` | `AioRestauration.tsx` | Restaurant, Menu, FAQPage | ✅ En prod |
| `/aio-rh` | `AioRh.tsx` | ProfessionalService, FAQPage | ✅ En prod |
| `/aio-sante` | `AioSante.tsx` | MedicalBusiness, FAQPage | ✅ En prod |
