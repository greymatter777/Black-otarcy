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

// ─── GÉNÉRATION DU SITEMAP XML ────────────────────────────────────────────────
const BASE_URL = 'https://otarcy.app'

// Priorités et fréquences par route
const ROUTE_META = {
  '/':               { priority: '1.0', changefreq: 'weekly'  },
  '/pricing':        { priority: '0.9', changefreq: 'monthly' },
  '/blog':           { priority: '0.8', changefreq: 'weekly'  },
  '/glossaire':      { priority: '0.7', changefreq: 'monthly' },
  '/faq':            { priority: '0.7', changefreq: 'monthly' },
  '/aio-coaching':   { priority: '0.8', changefreq: 'monthly' },
  '/aio-ecommerce':  { priority: '0.8', changefreq: 'monthly' },
  '/aio-immobilier': { priority: '0.8', changefreq: 'monthly' },
  '/aio-restauration':{ priority: '0.8', changefreq: 'monthly' },
  '/aio-rh':         { priority: '0.8', changefreq: 'monthly' },
  '/aio-sante':      { priority: '0.8', changefreq: 'monthly' },
}

// Routes exclues du sitemap (pas de valeur SEO)
const EXCLUDED = new Set(['/login', '/reset-password'])

const today = new Date().toISOString().split('T')[0]

const sitemapRoutes = allRoutes.filter(r => !EXCLUDED.has(r))

const urlEntries = sitemapRoutes.map(route => {
  const meta = ROUTE_META[route] ?? { priority: '0.6', changefreq: 'monthly' }
  return `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`
}).join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

const sitemapPath = path.join(distDir, 'sitemap.xml')
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8')
console.log(`\n🗺️  sitemap.xml généré → ${sitemapRoutes.length} URLs`)
console.log(`📍 ${BASE_URL}/sitemap.xml`)
