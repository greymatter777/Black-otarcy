# Otarcy — Contexte Projet

## Identité
- **Produit** : AIO Brand Audit SaaS — "Optimisez votre marque pour les IAs"
- **Site** : https://blackotarcyweb.vercel.app
- **Repo GitHub** : https://github.com/greymatter777/Black-Otarcy
- **Stack** : React 18 + TypeScript, Vite, Vercel, @clerk/react, @supabase/supabase-js, stripe, resend, svix, jspdf, Groq (llama-3.3-70b-versatile)

---

## Architecture

```
src/
  main.tsx
  App.tsx               — Routes: /, /pricing, /dashboard, /aio-report
  pages/
    Index.tsx           — Page principale AIO : Hero + WhyAio + AuditSection
    Pricing.tsx         — 3 plans : Découverte / AIO Essentiel / AIO Expert
    Dashboard.tsx       — Historique audits
    AioReport.tsx       — Page dédiée /aio-report

api/
  audit.ts              — POST /api/audit
  aio-report.ts         — POST /api/aio-report
  user-status.ts        — GET /api/user-status
  history.ts            — GET /api/history
  create-checkout.ts    — POST /api/create-checkout
  webhook.ts            — Stripe webhook (signature vérifiée)
  clerk-webhook.ts      — Clerk webhook (svix vérifié)

supabase/
  schema.sql
  migration-swot-kpi.sql
  migration-aio.sql
  migration-rls-fix.sql  — RLS corrigé (session du 07/03/2026)
```

---

## Plans & Pricing

| Plan | Nom | Prix | Audits | Différenciateur |
|------|-----|------|--------|----------------|
| free | Découverte | 0€ | 3 total | Audit basique |
| pro | AIO Essentiel | 19€/mois | Illimité | Score AIO + SWOT + KPI + PDF |
| agency | AIO Expert | 99€/mois | Illimité | Stratégie marketing IA + Quick Wins |

---

## Sécurité — État au 07/03/2026

### ✅ Implémenté
1. **Validation user ID Clerk** — format `user_xxx` vérifié dans chaque endpoint
2. **Rate limiting** — 10 req/min sur `/api/audit`, 5 sur `/api/aio-report`, 5 sur `/api/create-checkout`
3. **Sanitisation inputs** — anti-injection prompt + strip HTML + limite 100 chars
4. **CORS restreint** — `Access-Control-Allow-Origin: https://blackotarcyweb.vercel.app`
5. **RLS Supabase fixé** — policies `using (false)` pour bloquer accès anon
6. **.gitignore renforcé** — `.env` et `.env.local` protégés

### ❌ Non implémenté (prévu)
- **JWT Clerk vérifié côté serveur** — nécessite `@clerk/backend`, problème de compatibilité Vercel plan gratuit. À implémenter quand passage en production avec plan payant.

### Architecture auth actuelle
```
Frontend → envoie header "x-clerk-user-id: user_xxx"
Backend  → vérifie format user_xxx + existence en base Supabase
```
⚠️ Ce n'est pas une vérification JWT cryptographique — acceptable pour MVP.

---

## Décisions techniques importantes

### Pourquoi pas @clerk/backend ?
- Conflits de versions avec `@clerk/shared` sur Vercel
- Nécessite Node.js récent avec bonnes permissions
- Plan : implémenter en production avec domaine custom

### Pourquoi helpers inlinés dans chaque API ?
- Vercel ignore les fichiers `_prefixed` (ex: `_auth.ts`)
- Vercel ne copie que les fichiers `/api/*.ts` dans `/var/task/api/`
- Les imports vers `../lib/` ou `./auth` échouent au runtime
- **Solution** : dupliquer `verifyClerkAuth`, `checkRateLimit`, `sanitizeBrand` dans chaque fichier API

### Build Vercel
```json
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build"
```
- `vite build` direct échoue (permissions binaire Windows → Linux)
- `npx vite build` échoue aussi
- Appel via `node` fonctionne

### Versions Clerk
```json
"@clerk/react": "6.0.1",
"@clerk/shared": "4.0.0"
```
- Versions antérieures : conflits entre `@clerk/react` et `@clerk/shared`
- Override nécessaire dans package.json

### Google OAuth désactivé
- Clerk en mode dev utilise "Créances partagées" Google → erreur 400
- Solution : email uniquement jusqu'au passage en production

---

## Variables d'environnement (toutes sur Vercel)

```
GROQ_API_KEY
VITE_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY      ← clé service_role Supabase (commence par eyJ)
STRIPE_SECRET_KEY
STRIPE_PRO_PRICE_ID
STRIPE_AGENCY_PRICE_ID
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_AUDIENCE_ID
```

⚠️ `SUPABASE_SERVICE_KEY` = clé **service_role** (eyJ...), pas la clé anon

---

## Fonctionnalités — État

### ✅ En production
- Auth Clerk (email uniquement)
- Audit IA Groq (score + analyse + recommandations)
- SWOT automatisé (Pro/Agence)
- KPI de marque (Pro/Agence)
- Rapport AIO complet (/aio-report)
- Dashboard + historique
- Export PDF
- Stripe checkout + webhook
- Collecte emails Resend
- Banner upgrade Pro
- Sécurité MVP (rate limit + sanitize + CORS + RLS)

### ⬜ À implémenter
- Graphique évolution des scores
- Stratégie marketing générée (Agence) — dans aio-report
- JWT Clerk côté serveur (production)
- Passer à Claude Code pour éviter désynchronisation fichiers

---

## Leçons apprises (session du 07/03/2026)

1. **Ne jamais pousser node_modules depuis Windows** — les permissions binaires ne survivent pas sur Linux Vercel
2. **Vercel ignore les fichiers `_prefixed`** dans `/api/` — utiliser helpers inlinés
3. **Vercel ne résout pas les imports relatifs** hors du dossier `/api/` au runtime
4. **Le cache Vercel est très persistant** — seule la suppression/recréation du projet le réinitialise vraiment
5. **Toujours vérifier les logs Function** (pas Build Logs) pour les erreurs runtime
6. **`SUPABASE_SERVICE_KEY`** = service_role (eyJ...), pas sb_secret

---

## Prochaines sessions

### Priorité 1 — Features
- Graphique évolution des scores (recharts ou chart.js)
- Stratégie marketing IA dans AioReport (plan Agence)

### Priorité 2 — Infrastructure  
- Migrer vers Claude Code
- JWT Clerk en production
- Domaine custom (nécessite plan Vercel Pro ou Clerk Pro)
