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
  main.tsx                — Sans Clerk, StrictMode + App
  App.tsx                 — Routes : / et /pricing publiques, /dashboard et /aio-report protégés
  pages/
    Index.tsx             — Page principale : Hero + WhyAio + AuditSection (publique)
    Pricing.tsx           — 3 plans : Découverte / AIO Essentiel / AIO Expert (publique)
    Dashboard.tsx         — Historique audits (protégé)
    AioReport.tsx         — Rapport AIO complet (protégé)
    Login.tsx             — Page /login : fond #0a0a0a full black, carte centrée
                            email + Google + GitHub + Magic link + mot de passe oublié
                            bouton ← Retour vers /
    ResetPassword.tsx     — Page /reset-password : formulaire nouveau mot de passe
  lib/
    auth.tsx              — AuthProvider + useAuth() → { user, session, loading, signOut }
    useAuthFetch.ts       — authFetch() envoie Authorization: Bearer <JWT Supabase>
    supabase.ts           — client Supabase (inchangé)
    exportPDF.ts          — export PDF (inchangé)

api/
  audit.ts                — POST /api/audit
  aio-report.ts           — POST /api/aio-report
  user-status.ts          — GET /api/user-status
  history.ts              — GET /api/history
  create-checkout.ts      — POST /api/create-checkout
  webhook.ts              — Stripe webhook (inchangé)
  ❌ clerk-webhook.ts     — SUPPRIMÉ

supabase/
  schema.sql
  migration-swot-kpi.sql
  migration-aio.sql
  migration-rls-fix.sql   — RLS corrigé ✅
```

---

## Plans & Pricing

| Plan | Nom | Prix | Audits | Différenciateur |
|------|-----|------|--------|----------------|
| free | Découverte | 0€ | 3 total | Audit basique |
| pro | AIO Essentiel | 19€/mois | Illimité | Score AIO + SWOT + KPI + PDF |
| agency | AIO Expert | 99€/mois | Illimité | Stratégie marketing IA + Quick Wins |

---

## Auth — Supabase Auth (migré le 09/03/2026)

### Providers actifs
- ✅ Email + mot de passe
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Magic link
- ✅ Reset password (`/reset-password`)

### Configuration Supabase
- **Site URL** : `https://blackotarcyweb.vercel.app`
- **Redirect URLs** :
  - `https://blackotarcyweb.vercel.app/**`
  - `http://localhost:5173/**`

### Pattern auth frontend
```typescript
import { useAuth } from "../lib/auth";
import { authFetch } from "../lib/useAuthFetch";

const { user, signOut } = useAuth();
// authFetch gère Authorization: Bearer automatiquement
const res = await authFetch("/api/audit", { method: "POST", body: JSON.stringify({ brand }) });
```

### Pattern auth backend (tous les endpoints API)
```typescript
// Inliné dans chaque fichier API (pas d'imports externes — contrainte Vercel)
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
  → Navbar : bouton "Connexion" → /login
  → Clic "Analyser" sans être connecté → /login
  → Une fois connecté : audit disponible, navbar affiche nom + déconnexion

/login (publique)
  → Fond #0a0a0a full black, carte centrée
  → Bouton ← Retour vers /
  → Après connexion → redirect vers /

/dashboard, /aio-report (protégés)
  → Redirect /login si non connecté
```

---

## Décisions techniques importantes

### Pourquoi Supabase Auth à la place de Clerk ?
- Clerk domaine custom = 25$/mois obligatoire
- Supabase Auth : 50 000 MAU gratuit, tous providers inclus, déjà dans le projet
- Migration faite avant le lancement = 0 utilisateur à migrer

### Pourquoi helpers inlinés dans chaque API ?
- Vercel ne copie que `/api/*.ts` dans `/var/task/api/`
- Les imports vers `../lib/` échouent au runtime
- **Solution** : `verifySupabaseAuth`, `checkRateLimit`, `sanitizeBrand` dupliqués dans chaque fichier

### Build Vercel
```json
"build": "node --experimental-vm-modules node_modules/vite/bin/vite.js build"
```

---

## Variables d'environnement (Vercel)

```
GROQ_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY      ← service_role JWT (commence par eyJ)
STRIPE_SECRET_KEY
STRIPE_PRO_PRICE_ID
STRIPE_AGENCY_PRICE_ID
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_AUDIENCE_ID
```

⚠️ Variables Clerk supprimées — ne plus les utiliser

---

## Fonctionnalités — État

### ✅ En production
- Auth Supabase (email + Google + GitHub + Magic link + reset password)
- Page principale publique + flow connexion propre
- Audit IA Groq (score + analyse + recommandations)
- SWOT automatisé (Pro/Agence)
- KPI de marque (Pro/Agence)
- Rapport AIO complet (/aio-report)
- Dashboard + historique
- Export PDF
- Stripe checkout + webhook
- Collecte emails Resend
- Sécurité MVP (rate limit + sanitize + CORS + RLS + JWT Supabase)

### ⬜ À implémenter (prochaines sessions)
- Mini guides d'action après chaque recommandation
- Plan de contenu LinkedIn généré par Groq
- Templates actionnables depuis le SWOT
- Graphique évolution des scores

---

## Stratégie & Positionnement

### Client idéal
- Fondateur / responsable marketing d'une PME ou startup (5-50 employés)
- Déjà présent en ligne mais invisible auprès des IAs
- Perd des clients au profit de concurrents mieux positionnés sur ChatGPT/Perplexity

### Concurrence
- **Monde** : Semrush (enterprise), Gauge, Peec AI — outils techniques, chers, en anglais
- **France** : quasi vide — créneau ouvert
- **Bordeaux** : inexistant

### Roadmap produit
1. Mini guides d'action après chaque recommandation
2. Plan de contenu LinkedIn généré par Groq
3. Templates actionnables depuis le SWOT
4. Graphique évolution des scores

### Budget lancement
| Poste | Coût |
|-------|------|
| Domaine (otarcy.fr ou .com) | ~12€/an |
| Tout le reste | 0€ |
| **Total** | **~1€/mois** |

---

## Leçons apprises

1. **Ne jamais pousser node_modules depuis Windows** — permissions binaires cassées sur Linux
2. **Vercel ignore les imports relatifs hors `/api/`** — helpers inlinés dans chaque fichier
3. **Le cache Vercel est très persistant** — supprimer/recréer le projet si bloqué
4. **Toujours vérifier les logs Function** (pas Build Logs) pour les erreurs runtime
5. **`SUPABASE_SERVICE_KEY`** = service_role (eyJ...), pas la clé anon
6. **Clerk domaine custom = 25$/mois** — Supabase Auth est la meilleure alternative
7. **Migrer l'auth avant le lancement** — jamais en production avec des utilisateurs actifs
8. **Supabase Redirect URLs** — toujours configurer `https://domaine/**` et `http://localhost:5173/**`
9. **`window.location.origin`** dans redirectTo gère automatiquement local vs production
