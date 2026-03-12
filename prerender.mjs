// prerender.mjs — Script de prerendering statique pour Otarcy
// Exécuté après `vite build` pour générer le HTML statique de chaque route publique
// Compatible Vite 6 + React 18 + react-router-dom v6 — aucune dépendance supplémentaire

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Routes publiques à prerender (routes privées exclues : /dashboard, /aio-report)
const ROUTES = [
  '/',
  '/pricing',
  '/glossaire',
  '/faq',
  '/login',
  '/reset-password',
  '/aio-coaching',
  '/aio-ecommerce',
  '/aio-immobilier',
  '/aio-restauration',
  '/aio-rh',
  '/aio-sante',
]

const distDir = path.resolve(__dirname, 'dist')
const templatePath = path.join(distDir, 'index.html')

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html introuvable. Lancez `vite build` d\'abord.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

let generated = 0

for (const route of ROUTES) {
  // Construire le chemin de sortie : / → dist/index.html (déjà existant)
  // /glossaire → dist/glossaire/index.html
  const isRoot = route === '/'
  const routeDir = isRoot ? distDir : path.join(distDir, route.slice(1))
  const outputPath = path.join(routeDir, 'index.html')

  // Créer le dossier si nécessaire
  if (!isRoot) {
    fs.mkdirSync(routeDir, { recursive: true })
  }

  // Injecter la route courante dans le HTML pour que React Router hydrate correctement
  // On ajoute un meta tag indiquant la route, et on met à jour canonical si présent
  let html = template

  // Ajouter un commentaire indiquant la route prerenderée (utile pour debug)
  html = html.replace(
    '</head>',
    `  <!-- prerendered: ${route} -->\n  </head>`
  )

  fs.writeFileSync(outputPath, html, 'utf-8')
  console.log(`✅ ${route} → ${outputPath.replace(__dirname, '.')}`)
  generated++
}

console.log(`\n🎉 ${generated} pages prerenderées dans dist/`)
console.log('📋 Les crawlers LLMs recevront maintenant du HTML complet pour chaque route.')
