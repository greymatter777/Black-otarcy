# Otarcy — Design System

Référence complète du style visuel. À lire avant de créer un nouveau composant ou une nouvelle page.

---

## Polices

```
'Bebas Neue' → titres, labels, scores, numéros
'Raleway'    → tout le reste (corps, boutons, labels secondaires)
```

Jamais d'autre police. Toujours déclarer `fontFamily` en inline style.

---

## Palette

```
#0a0a0a   fond principal (sections sombres, page login)
#0f0f0f   fond cartes / blocs
#161616   fond cartes intérieures / SWOT
#1a1a1a   séparateurs, grilles
#2a2a2a   bordures standard, tracks KPI
#3a3a3a   bordures boutons ghost, hover désactivé
#4a4a4a   texte très discret, labels inactifs
#7a7a7a   texte secondaire, subtitles
#a0a0a0   labels KPI
#d4d4d4   texte corps (recommandations, contenu)
#e8e8e8   texte hover
#f0f0f0   texte principal, titres

#a3e635   vert Otarcy — accent primaire, CTA, forces, succès
#60a5fa   bleu — opportunités, features, LinkedIn
#f97316   orange — menaces, warnings, Quick Wins
#ef4444   rouge — erreurs, faiblesses
```

---

## Typographie — Tailles

```
Bebas Neue
  clamp(5rem, 14vw, 11rem)   → H1 hero
  clamp(2.5rem, 5vw, 4.5rem) → H2 section
  1.3rem / 1.2rem / 1.1rem / 1rem → titres cartes
  3.5rem                     → stats (chiffres clés)
  0.85rem                    → numéros de feature (01, 02...)
  0.9rem                     → scores, numéros KPI

Raleway
  0.88rem   → paragraphe intro (lineHeight 1.9)
  0.82rem   → tagline hero (letterSpacing 0.22em)
  0.78rem   → corps recommandation / contenu card (lineHeight 1.6, fontWeight 300)
  0.76rem   → corps standard (lineHeight 1.7, fontWeight 300)
  0.75rem   → description plan
  0.73rem   → contenu LinkedIn template (lineHeight 1.8)
  0.72rem   → corps secondaire / messages erreur
  0.70rem   → labels navbar, KPI
  0.66rem   → boutons CTA (letterSpacing 0.22em)
  0.65rem   → labels section (.02 — Pourquoi, letterSpacing 0.3em)
  0.62rem   → petits liens, mentions légales
  0.60rem   → hashtags, footer, labels très discrets
  0.58rem   → micro-labels (RECOMMANDATIONS, SWOT...)
  0.55rem   → sous-score (/10)
```

---

## Espacement & Layout

```
padding section         → 100px 60px
maxWidth contenu        → 860px (centré, margin: 0 auto)
gap cartes              → 16px standard, 12px compact
marginBottom section    → 16px entre cartes, 32px entre blocs
padding carte standard  → 24px
padding carte large     → 28px / 32px
```

---

## Bordures & Fonds

```
Carte standard     → border: "1px solid #2a2a2a", background: "#0f0f0f"
Carte intérieure   → border: "1px solid #2a2a2a", background: "#161616"
Accentuée vert     → borderLeft: "2px solid #a3e635"
Accentuée bleue    → borderLeft: "2px solid #60a5fa"
CTA box            → border: "1px solid #a3e635", background: "#0a0a0a"
Locked/grisé       → border: "1px dashed #2a2a2a"
Séparateur         → borderTop: "1px solid #2a2a2a"
```

---

## Boutons

### CTA primaire (vert plein)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase",
  padding: "13px 32px",
  background: "#a3e635", color: "#0f0f0f",
  fontWeight: 600, transition: "opacity 0.2s",
  border: "none", cursor: "pointer",
}}
onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
```

### Bouton ghost (contour)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase",
  padding: "13px 32px",
  border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a",
  cursor: "pointer", transition: "border-color 0.3s, color 0.3s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
```

### Bouton action compact (ex: "→ Comment faire ?")
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "4px 10px",
  border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a",
  cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
}}
onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a3e635"; e.currentTarget.style.color = "#a3e635"; }}
onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
```

### Bouton toggle ouvert/fermé (vert)
```tsx
// Quand ouvert : background vert, texte noir
// Quand fermé  : border vert, texte vert
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
  padding: "10px 20px",
  border: "1px solid #a3e635",
  background: isOpen ? "#a3e635" : "transparent",
  color: isOpen ? "#0f0f0f" : "#a3e635",
  cursor: "pointer", transition: "all 0.2s",
}}
```

### Bouton "Copier" (devient vert au clic)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase",
  padding: "3px 8px",
  border: "1px solid #3a3a3a",
  background: copied ? "#a3e635" : "transparent",
  color: copied ? "#0f0f0f" : "#7a7a7a",
  cursor: "pointer", transition: "all 0.2s",
}}
```

### Bouton déconnexion (rouge au hover)
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
  color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer",
  transition: "color 0.3s",
}}
onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
```

---

## Labels & micro-textes

### Label de section (ex: "Recommandations", "Analyse SWOT")
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.3em",
  color: "#7a7a7a", textTransform: "uppercase",
  marginBottom: "14px",
}}
```

### Label accentué vert (ex: ".02 — Pourquoi l'AIO ?")
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.65rem", letterSpacing: "0.3em",
  color: "#a3e635", textTransform: "uppercase",
  marginBottom: "16px", fontWeight: 500,
}}
```

### Numéro de feature (Bebas Neue)
```tsx
style={{
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "0.85rem", letterSpacing: "0.15em",
  color: "#a3e635", // ou #60a5fa, #f97316 selon contexte
  marginBottom: "10px",
}}
```

### Badge / tag
```tsx
style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.58rem", letterSpacing: "0.1em",
  color: "#7a7a7a", padding: "2px 8px",
  border: "1px solid #2a2a2a",
}}
```

---

## Composants récurrents

### Ligne avec symbole (recommandation, liste SWOT...)
```tsx
<div style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
  <span style={{ color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>
    {item}
  </p>
</div>
```

### Carte de section standard
```tsx
<div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>
    TITRE SECTION
  </p>
  {/* contenu */}
</div>
```

### Carte accentuée (guide d'action, template)
```tsx
<div style={{
  marginTop: "12px", padding: "20px",
  background: "#161616",
  border: "1px solid #2a2a2a",
  borderLeft: "2px solid #a3e635", // ou #60a5fa
}}>
  {/* contenu */}
</div>
```

### Header de carte avec action à droite
```tsx
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }}>
    TITRE
  </p>
  <div style={{ display: "flex", gap: "8px" }}>
    {/* badges ou boutons */}
  </div>
</div>
```

### Hashtags
```tsx
<div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
  {hashtags.map((h, i) => (
    <span key={i} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#60a5fa", letterSpacing: "0.05em" }}>
      #{h.replace("#", "")}
    </span>
  ))}
</div>
```

### Footer note / conseil
```tsx
<p style={{
  fontFamily: "'Raleway', sans-serif",
  fontSize: "0.62rem", color: "#4a4a4a",
  fontStyle: "italic",
  borderTop: "1px solid #2a2a2a", paddingTop: "8px",
}}>
  💡 {conseil}
</p>
```

---

## Reveal (animation scroll)

Ajouter `className="reveal"` sur les éléments à animer.
Le hook `useReveal(deps)` active l'IntersectionObserver.

```tsx
// Dans le composant parent
useReveal([results]); // re-trigger quand les résultats changent

// Sur l'élément
<div className="reveal" style={{ ... }}>
```

CSS requis dans `index.css` :
```css
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
```

---

## Règles à respecter

1. **Jamais de className Tailwind** — tout en inline style
2. **Jamais de border-radius** sauf `borderRadius: "2px"` sur les barres KPI
3. **Jamais de box-shadow** — la profondeur vient des couleurs de fond
4. **Espaces aérés** — lineHeight 1.6 minimum sur le corps de texte
5. **Transitions courtes** — 0.2s à 0.4s max
6. **textTransform uppercase** sur tous les labels et boutons
7. **fontWeight 300** sur le corps de texte Raleway, **600** sur les CTA
