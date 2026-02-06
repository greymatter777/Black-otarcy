# OTARCY Agency - Landing Page

Site web vitrine pour Otarcy Agency — agence de création de landing pages professionnelles pour PME.

## 🚀 Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

### 3. Builder pour la production
```bash
npm run build
```

## 📦 Structure du projet

```
otarcy-agency/
├── src/
│   ├── pages/
│   │   └── Index.tsx      # Page principale (Hero + Services + Contact)
│   ├── App.tsx            # Router principal
│   ├── main.tsx           # Point d'entrée React
│   └── index.css          # Styles globaux + animations
├── public/                # Assets statiques
├── index.html             # Template HTML
├── package.json           # Dépendances
├── vite.config.ts         # Config Vite
└── tsconfig.json          # Config TypeScript
```

## 🎨 Stack technique

- **React 18** avec TypeScript
- **Vite** comme bundler
- **React Router** pour la navigation
- **Google Fonts** (Bebas Neue + Raleway)

## 🔧 Personnalisation

### Modifier les couleurs
Les couleurs sont définies dans `src/index.css` avec des variables CSS :
```css
:root {
  --bg-deep: #0f0f0f;
  --text-primary: #f0f0f0;
  --accent: #e8e8e8;
  /* ... */
}
```

### Modifier les contenus
Tous les textes se trouvent dans `src/pages/Index.tsx`. Cherche les sections :
- `<Hero />` — Titre principal
- `<Services />` — Services et tarifs
- `<Contact />` — Formulaire de contact

## 📤 Déploiement sur Vercel

1. Push ton code sur GitHub
2. Va sur [vercel.com](https://vercel.com)
3. Connecte ton repo
4. Vercel détecte automatiquement Vite → déploiement instantané ✅

## 💡 Notes

- Le formulaire de contact affiche une confirmation côté client. Pour le rendre fonctionnel, connecte-le à un backend (Formspree, EmailJS, API custom, etc.)
- Les animations de scroll utilisent `IntersectionObserver` — compatibilité > 95% des navigateurs modernes

---

Créé avec ❤️ pour Otarcy Agency
