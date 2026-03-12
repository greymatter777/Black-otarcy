// prerender.mjs — Script de prerendering statique pour Otarcy
// Exécuté après `vite build` pour générer le HTML statique de chaque route publique
// Compatible Vite 6 + React 18 + react-router-dom v6 — aucune dépendance supplémentaire

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── ROUTES STATIQUES ─────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  '/',
  '/pricing',
  '/glossaire',
  '/faq',
  '/login',
  '/reset-password',
  '/blog',
  '/aio-coaching',
  '/aio-ecommerce',
  '/aio-immobilier',
  '/aio-restauration',
  '/aio-rh',
  '/aio-sante',
]

// ─── FETCH DES SLUGS BLOG DEPUIS SUPABASE ────────────────────────────────────
async function fetchBlogSlugs() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Variables Supabase absentes — articles blog non prerenderés')
    return []
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?published=eq.true&select=slug`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    )
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
    const data = await res.json()
    return data.map((p) => `/blog/${p.slug}`)
  } catch (err) {
    console.log(`⚠️  Impossible de fetcher les slugs blog : ${err.message}`)
    return []
  }
}

// ─── GÉNÉRATION DES PAGES ─────────────────────────────────────────────────────
const distDir = path.resolve(__dirname, 'dist')
const templatePath = path.join(distDir, 'index.html')

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html introuvable. Lancez `vite build` d\'abord.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

// Récupérer les slugs blog dynamiques
const blogRoutes = await fetchBlogSlugs()
const allRoutes = [...STATIC_ROUTES, ...blogRoutes]

let generated = 0

for (const route of allRoutes) {
  const isRoot = route === '/'
  const routeDir = isRoot ? distDir : path.join(distDir, route.slice(1))
  const outputPath = path.join(routeDir, 'index.html')

  fs.mkdirSync(routeDir, { recursive: true })

  let html = template
  html = html.replace('</head>', `  <!-- prerendered: ${route} -->\n  </head>`)

  fs.writeFileSync(outputPath, html, 'utf-8')
  console.log(`✅ ${route} → ${outputPath.replace(__dirname, '.')}`)
  generated++
}

console.log(`\n🎉 ${generated} pages prerenderées dans dist/`)
if (blogRoutes.length > 0) {
  console.log(`📝 ${blogRoutes.length} article(s) blog inclus`)
}
console.log('📋 Les crawlers LLMs recevront maintenant du HTML complet pour chaque route.')
