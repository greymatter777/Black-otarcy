import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../lib/useAuthFetch";

import { exportAuditPDF } from "../lib/exportPDF";

// ─── HOOK: Scroll Reveal ──────────────────────────────
function useReveal(deps: any[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── NAV ──────────────────────────────────────────────
const secteurLinks = [
  { label: "Coaching & Formation", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [secteurOpen, setSecteurOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le dropdown si clic en dehors
  useEffect(() => {
    if (!secteurOpen) return;
    const handler = () => setSecteurOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [secteurOpen]);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "28px 36px",
      background: scrolled ? "rgba(15,15,15,0.92)" : "rgba(15,15,15,0.6)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "background 0.4s",
    }}>
      <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>CY</span>
      </Link>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {[
          { label: "AIO", to: "/aio-report", highlight: true },
          { label: "À PROPOS", to: "#about" },
          { label: "NEWSLETTER", to: "#newsletter" },
          { label: "AUDIT", to: "#audit" },
          { label: "TARIFS", to: "/pricing" },
        ].map((item) => (
          item.to.startsWith("#") ? (
            <button key={item.label} type="button"
              onClick={() => document.getElementById(item.to.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
            >{item.label}</button>
          ) : (
            <Link key={item.label} to={item.to} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: item.highlight ? "#a3e635" : "#7a7a7a", fontWeight: 500, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = item.highlight ? "#a3e635" : "#7a7a7a")}
            >{item.label}</Link>
          )
        ))}

        {/* Dropdown Secteurs */}
        <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSecteurOpen((v) => !v)}
            style={{
              fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em",
              color: secteurOpen ? "#a3e635" : "#7a7a7a", fontWeight: 500,
              background: "transparent", border: "none", cursor: "pointer",
              transition: "color 0.3s", display: "flex", alignItems: "center", gap: "5px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = secteurOpen ? "#a3e635" : "#7a7a7a")}
          >
            SECTEURS
            <span style={{ fontSize: "0.5rem", transition: "transform 0.2s", display: "inline-block", transform: secteurOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>

          {secteurOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 14px)", right: 0,
              background: "#0f0f0f", border: "1px solid #2a2a2a",
              minWidth: "200px", zIndex: 200,
            }}>
              {secteurLinks.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setSecteurOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem",
                    letterSpacing: "0.12em", color: "#7a7a7a",
                    textDecoration: "none", padding: "10px 16px",
                    borderBottom: "1px solid #1a1a1a",
                    transition: "color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#a3e635";
                    (e.currentTarget as HTMLAnchorElement).style.background = "#161616";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#7a7a7a";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/dashboard" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.15em", color: "#7a7a7a", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
            >
              {user?.user_metadata?.full_name ?? user?.email}
            </Link>
            <button type="button" onClick={() => signOut().then(() => navigate("/login"))}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
            >Déconnexion</button>
          </div>
        ) : (
          <button type="button" onClick={() => navigate("/login")}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "7px 16px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer", transition: "border-color 0.3s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
          >Connexion</button>
        )}
      </div>
    </nav>
  );
};

// ─── SIDE ELEMENTS ────────────────────────────────────
const SideLeft = () => (
  <div className="side-elements" style={{ position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "18px", zIndex: 50 }}>
    <a href="https://www.linkedin.com/company/otarcy-france" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    </a>
    <a href="https://www.instagram.com/otarcy.ai?igsh=MTZiY2M4aGpoa3lncg==" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </a>
  </div>
);

const SideRight = () => (
  <div className="side-elements" style={{ position: "fixed", right: "18px", top: "50%", transform: "translateY(-50%) rotate(90deg)", zIndex: 50 }}>
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4a4a", fontWeight: 500, textTransform: "uppercase" }}>SCROLL</span>
  </div>
);

// ─── HERO ─────────────────────────────────────────────
const Hero: React.FC<{ isSignedIn: boolean; onSignIn: () => void }> = ({ isSignedIn, onSignIn }) => (
  <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#161616", position: "relative", padding: "0 60px" }}>
    <span style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4a4a4a" }}>.01</span>

    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
      AI Optimization
    </p>
    <h1 className="reveal otarcytitle" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 0.9, textTransform: "uppercase" }}>
      OTARCY
    </h1>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", letterSpacing: "0.22em", color: "#7a7a7a", marginTop: "28px", textTransform: "uppercase", fontWeight: 300, maxWidth: "520px" }}>
      Optimisez votre marque pour les IAs
    </p>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "12px", fontWeight: 300 }}>
      ChatGPT · Claude · Gemini · Perplexity
    </p>

    <div className="reveal" style={{ marginTop: "40px", display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
      <Link to="/aio-report"
        style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Lancer l'audit AIO →
      </Link>
      <button type="button"
        onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
        style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
      >
        Audit de marque
      </button>
    </div>

    {!isSignedIn && (
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "20px" }}>
        3 audits offerts — sans carte bancaire
      </p>
    )}
  </section>
);

// ─── SECTION POURQUOI AIO ─────────────────────────────
const WhyAio = () => (
  <section style={{ padding: "100px 60px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px" }}>
        .02 — Pourquoi l'AIO ?
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }}>
        LE MOTEUR DE RECHERCHE<br />A CHANGÉ
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "64px" }}>
        Vos clients ne tapent plus leurs questions sur Google. Ils les posent à ChatGPT, Claude ou Perplexity. Si votre marque n'est pas visible dans ces réponses, vous n'existez pas pour eux.
      </p>

      {/* Chiffres clés */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1a1a1a", marginBottom: "64px" }}>
        {[
          { stat: "60%", desc: "des recherches en ligne passeront par des IAs d'ici 2026" },
          { stat: "3×", desc: "plus de conversions pour les marques bien référencées dans les IAs" },
          { stat: "92%", desc: "des marques n'ont aucune stratégie AIO aujourd'hui" },
        ].map((item, i) => (
          <div key={i} className="reveal" style={{ padding: "40px 28px", background: "#0a0a0a" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "12px" }}>{item.stat}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Ce qu'Otarcy fait */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {[
          { num: "01", title: "Score AIO", desc: "Mesurez votre visibilité dans les réponses des IAs sur 100 points.", color: "#a3e635" },
          { num: "02", title: "Rapport de visibilité", desc: "Gaps de contenu, concurrents mieux positionnés, sujets associés.", color: "#60a5fa" },
          { num: "03", title: "Plan d'optimisation", desc: "Actions prioritaires classées par impact pour dominer votre secteur dans les IAs.", color: "#f97316" },
        ].map((f) => (
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ marginTop: "48px", textAlign: "center" }}>
        <Link to="/aio-report"
          style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Analyser ma marque →
        </Link>
      </div>
    </div>
  </section>
);

// ─── SECTION À PROPOS ─────────────────────────────────
const AboutSection = () => (
  <section id="about" style={{ padding: "100px 60px", background: "#0f0f0f", borderTop: "1px solid #1a1a1a" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
        .03 — À propos
      </p>
      <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }}>
        QU'EST-CE QU'OTARCY ?
      </h2>
      <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "64px" }}>
        Otarcy est un outil SaaS français d'AI Optimization (AIO) conçu pour les PME, startups et indépendants qui veulent exister dans les réponses de ChatGPT, Claude, Gemini et Perplexity.
      </p>

      {/* Bloc Qui / Quoi / Pourquoi — format questions/réponses lisible par les IAs */}
      <div className="reveal" style={{ marginBottom: "48px", padding: "32px", border: "1px solid #2a2a2a", background: "#0a0a0a" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "28px" }}>
          Définition
        </p>
        {[
          {
            q: "Qu'est-ce que l'AIO (AI Optimization) ?",
            a: "L'AIO est la discipline qui consiste à rendre une marque, une entreprise ou un contenu visible dans les réponses générées par les intelligences artificielles conversationnelles comme ChatGPT, Claude, Gemini ou Perplexity. Contrairement au SEO traditionnel centré sur Google, l'AIO optimise la façon dont les IA perçoivent, comprennent et citent une marque.",
          },
          {
            q: "À qui s'adresse Otarcy ?",
            a: "Otarcy s'adresse aux fondateurs, responsables marketing et équipes de PME ou startups (5 à 50 employés) déjà présents en ligne mais invisibles auprès des IA. C'est la solution idéale pour ceux qui perdent des clients au profit de concurrents mieux positionnés sur les moteurs de recherche IA.",
          },
          {
            q: "Comment fonctionne Otarcy concrètement ?",
            a: "L'utilisateur saisit le nom de sa marque. Otarcy analyse sa visibilité IA en temps réel, génère un score AIO sur 10, identifie les gaps de contenu, produit une analyse SWOT automatisée, et propose un plan d'action priorisé avec des guides étape par étape pour chaque recommandation.",
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? "28px" : 0, paddingBottom: i < 2 ? "28px" : 0, borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#a3e635", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>Q</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#f0f0f0", lineHeight: 1.6, fontWeight: 600 }}>{item.q}</p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingLeft: "4px" }}>
              <span style={{ color: "#7a7a7a", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }}>A</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Valeurs / Positionnement */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        {[
          {
            num: "01",
            title: "Accessible",
            desc: "Pas besoin d'être expert en marketing IA. Otarcy traduit des concepts complexes en actions concrètes et immédiatement applicables.",
            color: "#a3e635",
          },
          {
            num: "02",
            title: "Actionnable",
            desc: "Chaque recommandation est accompagnée d'un guide d'action détaillé : étapes, durée estimée, impact attendu.",
            color: "#60a5fa",
          },
          {
            num: "03",
            title: "Conçu pour les PME",
            desc: "Un outil positionné entre le diagnostic gratuit et les solutions enterprise, pensé pour les équipes sans ressources dédiées à l'AIO.",
            color: "#f97316",
          },
        ].map((f) => (
          <div key={f.num} className="reveal" style={{ padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }}>{f.num}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }}>{f.title}</p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Contexte & Origine */}
      <div className="reveal" style={{ padding: "28px 32px", border: "1px solid #2a2a2a", background: "#0a0a0a", borderLeft: "2px solid #a3e635" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>
          Contexte & Origine
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
          Otarcy est né d'un constat simple : en 2024-2025, les moteurs de recherche IA ont capturé une part croissante des requêtes commerciales, mais aucune solution accessible n'existait pour aider les PME françaises à s'y positionner.
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300 }}>
          Développé et lancé en France, Otarcy est aujourd'hui la première solution française dédiée à l'AI Optimization pour les petites et moyennes entreprises — un segment laissé de côté par les solutions enterprise comme Semrush ou BrightEdge.
        </p>
      </div>

    </div>
  </section>
);

// ─── NEWSLETTER SECTION ───────────────────────────────
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Adresse email invalide.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
      setStatus("error");
    }
  };

  return (
    <section
      id="newsletter"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
        padding: "80px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Label section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", fontFamily: "'Raleway', sans-serif", fontWeight: 500 }}>
            .04 — Newsletter
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a3e635 0%, transparent 100%)" }} />
        </div>

        {/* Titre */}
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 10px 0" }}>
          LE BRIEF{" "}
          <em style={{ color: "#a3e635", fontStyle: "italic" }}>AIO</em>
        </h2>

        {/* Cadence */}
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", margin: "0 0 20px 0" }}>
          Chaque dimanche matin — 5 min de veille AIO
        </p>

        {/* Description */}
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, margin: "0 0 36px 0", maxWidth: "520px" }}>
          Les dernières évolutions de l'AI Optimization, les marques qui gagnent de la visibilité auprès de ChatGPT, Claude et Perplexity — et ce que ça change concrètement pour votre stratégie.
        </p>

        {/* Bullets */}
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "1 synthèse des actus AIO de la semaine",
            "1 marque analysée sous l'angle IA",
            "1 action concrète à implémenter",
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", fontWeight: 300 }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a3e635", flexShrink: 0 }} />
              {item}
            </li>
          ))}
        </ul>

        {/* Formulaire */}
        {status === "success" ? (
          <div style={{ border: "1px solid #a3e635", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#a3e635", fontSize: "18px" }}>✓</span>
            <div>
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "#a3e635", margin: 0, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.05em" }}>Inscription confirmée</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "#4a4a4a", margin: "4px 0 0 0", fontSize: "0.68rem", letterSpacing: "0.05em" }}>Prochain Brief AIO — dimanche matin dans votre boîte.</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", border: "1px solid #2a2a2a" }}>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  flex: 1, background: "#111", border: "none", outline: "none",
                  padding: "13px 16px", color: "#f0f0f0", fontSize: "0.76rem",
                  fontFamily: "'Raleway', sans-serif", caretColor: "#a3e635",
                }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "loading"}
                style={{
                  background: status === "loading" ? "#1a2a0a" : "#a3e635",
                  border: "none", padding: "13px 24px", color: "#0a0a0a",
                  fontSize: "0.66rem", fontWeight: 700, fontFamily: "'Raleway', sans-serif",
                  letterSpacing: "0.22em", cursor: status === "loading" ? "wait" : "pointer",
                  textTransform: "uppercase", transition: "opacity 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {status === "loading" ? "..." : "S'abonner →"}
              </button>
            </div>

            {status === "error" && (
              <p style={{ fontFamily: "'Raleway', sans-serif", color: "#ef4444", fontSize: "0.68rem", margin: "8px 0 0 0", letterSpacing: "0.05em" }}>{errorMsg}</p>
            )}

            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#a3e635", margin: "12px 0 0 0", letterSpacing: "0.1em" }}>
              Gratuit. Aucun spam. Désabonnement en 1 clic.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── TYPES ────────────────────────────────────────────
interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface KpiData {
  notoriete: number;
  coherence: number;
  digital: number;
  contenu: number;
}

interface AuditData {
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  swot?: SwotData | null;
  kpis?: KpiData | null;
  plan?: string;
}

// ─── SCORE RING ───────────────────────────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "#a3e635" : score >= 5 ? "#f0f0f0" : "#ef4444";
  return (
    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="5" />
        <circle cx="55" cy="55" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#f0f0f0", lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#7a7a7a" }}>/10</span>
      </div>
    </div>
  );
};

// ─── KPI BAR ──────────────────────────────────────────
const KpiBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", color: "#a0a0a0", letterSpacing: "0.1em" }}>{label}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#f0f0f0", letterSpacing: "0.1em" }}>{value}</span>
    </div>
    <div style={{ background: "#2a2a2a", height: "3px", borderRadius: "2px" }}>
      <div style={{ background: color, height: "3px", borderRadius: "2px", width: `${value}%`, transition: "width 1s cubic-bezier(.22,1,.36,1)" }} />
    </div>
  </div>
);

// ─── SWOT SECTION ─────────────────────────────────────
const SwotSection: React.FC<{ swot: SwotData }> = ({ swot }) => {
  const quadrants = [
    { key: "strengths", label: "Forces", items: swot.strengths, color: "#a3e635", symbol: "+" },
    { key: "weaknesses", label: "Faiblesses", items: swot.weaknesses, color: "#ef4444", symbol: "−" },
    { key: "opportunities", label: "Opportunités", items: swot.opportunities, color: "#60a5fa", symbol: "↑" },
    { key: "threats", label: "Menaces", items: swot.threats, color: "#f97316", symbol: "!" },
  ];
  return (
    <div style={{ marginBottom: "32px" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>Analyse SWOT</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {quadrants.map((q) => (
          <div key={q.key} style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: q.color, textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>
              {q.symbol} {q.label}
            </p>
            {q.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                <span style={{ color: q.color, fontSize: "0.65rem", flexShrink: 0, marginTop: "2px" }}>{q.symbol}</span>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── KPI SECTION ──────────────────────────────────────
const KpiSection: React.FC<{ kpis: KpiData }> = ({ kpis }) => (
  <div style={{ padding: "28px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }}>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }}>KPI de marque</p>
    <KpiBar label="Notoriété" value={kpis.notoriete} color="#a3e635" />
    <KpiBar label="Cohérence" value={kpis.coherence} color="#60a5fa" />
    <KpiBar label="Présence digitale" value={kpis.digital} color="#f97316" />
    <KpiBar label="Qualité de contenu" value={kpis.contenu} color="#e8e8e8" />
  </div>
);

// ─── AUDIT SECTION ────────────────────────────────────
interface GuideData {
  titre: string;
  etapes: { numero: number; action: string; detail: string }[];
  duree_estimee: string;
  impact: string;
}

const AuditSection: React.FC<{
  setBrandName: (v: string) => void;
  handleAudit: () => void;
  loading: boolean;
  isSignedIn: boolean;
  onSignIn: () => void;
  auditsLeft: number | null;
  results: AuditData | null;
  brand: string;
  plan: string;
  error: string | null;
}> = ({ setBrandName, handleAudit, loading, isSignedIn, onSignIn, auditsLeft, results, brand, plan, error }) => {
  const canExport = plan === "pro" || plan === "agency";
  const [guides, setGuides] = React.useState<Record<number, GuideData | null>>({});
  const [guidesLoading, setGuidesLoading] = React.useState<Record<number, boolean>>({});
  const [guidesOpen, setGuidesOpen] = React.useState<Record<number, boolean>>({});
  const [swotTemplates, setSwotTemplates] = React.useState<any | null>(null);
  const [swotTemplatesLoading, setSwotTemplatesLoading] = React.useState(false);
  const [swotTemplatesOpen, setSwotTemplatesOpen] = React.useState(false);
  const [copiedSwot, setCopiedSwot] = React.useState<number | null>(null);

  const fetchSwotTemplates = async () => {
    if (!results?.swot) return;
    if (swotTemplates) { setSwotTemplatesOpen(!swotTemplatesOpen); return; }
    setSwotTemplatesLoading(true);
    setSwotTemplatesOpen(true);
    try {
      const { authFetch } = await import("../lib/useAuthFetch");
      const res = await authFetch("/api/swot-templates", {
        method: "POST",
        body: JSON.stringify({
          brand,
          strengths: results.swot.strengths,
          opportunities: results.swot.opportunities,
        }),
      });
      const data = await res.json();
      setSwotTemplates(data);
    } catch {
      setSwotTemplates(null);
    } finally {
      setSwotTemplatesLoading(false);
    }
  };

  const copySwotPost = (post: any, index: number) => {
    const text = `${post.accroche}

${post.contenu}

${post.hashtags.map((h: string) => `#${h.replace("#","")}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopiedSwot(index);
    setTimeout(() => setCopiedSwot(null), 2000);
  };

  const fetchGuide = async (index: number, recommendation: string) => {
    if (guides[index]) {
      setGuidesOpen((prev) => ({ ...prev, [index]: !prev[index] }));
      return;
    }
    setGuidesLoading((prev) => ({ ...prev, [index]: true }));
    setGuidesOpen((prev) => ({ ...prev, [index]: true }));
    try {
      const { authFetch } = await import("../lib/useAuthFetch");
      const res = await authFetch("/api/guide", {
        method: "POST",
        body: JSON.stringify({ recommendation, brand }),
      });
      const data = await res.json();
      setGuides((prev) => ({ ...prev, [index]: data }));
    } catch {
      setGuides((prev) => ({ ...prev, [index]: null }));
    } finally {
      setGuidesLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <section id="audit" style={{ padding: "100px 60px", background: "#161616", borderTop: "1px solid #1a1a1a" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>
          .03 — Audit de marque
        </p>
        <h2 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "16px" }}>
          DIAGNOSTIC RAPIDE
        </h2>
        <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", lineHeight: 1.8, fontWeight: 300, maxWidth: "520px", marginBottom: "40px" }}>
          Score, forces, faiblesses et recommandations en quelques secondes. Le point de départ avant votre audit AIO.
        </p>

        {/* Champ de saisie */}
        {isSignedIn ? (
          <div>
            {auditsLeft !== null && (
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: auditsLeft === 0 ? "#ef4444" : "#4a4a4a", marginBottom: "16px", textTransform: "uppercase" }}>
                {auditsLeft === 0 ? "Limite atteinte" : `${auditsLeft} audit${auditsLeft > 1 ? "s" : ""} restant${auditsLeft > 1 ? "s" : ""}`}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", maxWidth: "520px" }}>
              <input type="text" placeholder="Entrez le nom de votre marque"
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                style={{ flex: 1, background: "transparent", border: "1px solid #4a4a4a", padding: "10px 14px", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", outline: "none" }}
              />
              <button onClick={handleAudit} disabled={loading || auditsLeft === 0}
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 18px", border: "none", background: (loading || auditsLeft === 0) ? "#555" : "#e8e8e8", color: "#0f0f0f", cursor: (loading || auditsLeft === 0) ? "not-allowed" : "pointer", opacity: (loading || auditsLeft === 0) ? 0.7 : 1, whiteSpace: "nowrap" }}
              >
                {loading ? "ANALYSE..." : "Analyser"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={onSignIn}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer" }}
            >
              Connexion pour accéder
            </button>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", marginTop: "12px", letterSpacing: "0.15em" }}>3 audits offerts</p>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", marginTop: "16px" }}>⚠ {error}</p>
        )}

        {/* Limite atteinte */}
        {auditsLeft === 0 && !loading && (
          <div style={{ marginTop: "24px", padding: "20px 24px", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }}>Passez au plan Pro pour des audits illimités</p>
            <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", background: "#e8e8e8", color: "#0f0f0f", textDecoration: "none", whiteSpace: "nowrap" }}>
              Passer au Pro →
            </Link>
          </div>
        )}

        {/* Résultats */}
        {results && (
          <div style={{ marginTop: "56px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", color: "#f0f0f0" }}>
                AUDIT — {brand.toUpperCase()}
              </h3>
              {canExport ? (
                <button onClick={() => exportAuditPDF({ ...results, brand })}
                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a3a3a")}
                >↓ Export PDF</button>
              ) : (
                <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", padding: "10px 20px", border: "1px solid #2a2a2a", color: "#4a4a4a", textDecoration: "none" }}>
                  🔒 PDF — Plan Pro
                </Link>
              )}
            </div>

            {/* 1. Score + Analyse */}
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", marginBottom: "16px", padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
              <ScoreRing score={results.score} />
              <div>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "10px" }}>Score de marque</p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.86rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }}>{results.analysis}</p>
              </div>
            </div>

            {/* 2. KPI */}
            {results.kpis ? (
              <div style={{ marginBottom: "16px" }}>
                <KpiSection kpis={results.kpis} />
              </div>
            ) : (
              <div style={{ padding: "24px", border: "1px dashed #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#4a4a4a", marginBottom: "4px" }}>KPI DE MARQUE + SWOT COMPLET</p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", fontWeight: 300 }}>Notoriété · Cohérence · Digital · Contenu — Plan Pro</p>
                </div>
                <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", color: "#7a7a7a", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
                >Passer au Pro →</Link>
              </div>
            )}

            {/* 3. SWOT */}
            {results.swot && (
              <div style={{ marginBottom: "16px" }}>
                <SwotSection swot={results.swot} />

                {/* Templates LinkedIn depuis SWOT */}
                <div style={{ marginTop: "12px", padding: "20px 24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: swotTemplatesOpen ? "20px" : "0" }}>
                    <div>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "2px" }}>TEMPLATES LINKEDIN</p>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", color: "#7a7a7a", fontWeight: 300 }}>3 posts basés sur tes forces & opportunités</p>
                    </div>
                    <button onClick={fetchSwotTemplates} disabled={swotTemplatesLoading}
                      style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid #60a5fa", background: swotTemplatesOpen ? "#60a5fa" : "transparent", color: swotTemplatesOpen ? "#0f0f0f" : "#60a5fa", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", opacity: swotTemplatesLoading ? 0.7 : 1 }}>
                      {swotTemplatesLoading ? "..." : swotTemplatesOpen ? "↑ Fermer" : "Générer →"}
                    </button>
                  </div>

                  {swotTemplatesOpen && (
                    <div>
                      {swotTemplatesLoading ? (
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em" }}>Génération des templates...</p>
                      ) : swotTemplates?.templates ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                          {swotTemplates.templates.map((t: any, i: number) => (
                            <div key={i} style={{ padding: "18px", border: "1px solid #2a2a2a", background: "#161616", borderLeft: "2px solid #60a5fa" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#60a5fa" }}>0{t.numero}</span>
                                  <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#7a7a7a", textTransform: "uppercase" }}>{t.format}</span>
                                </div>
                                <button onClick={() => copySwotPost(t, i)}
                                  style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", border: "1px solid #3a3a3a", background: copiedSwot === i ? "#60a5fa" : "transparent", color: copiedSwot === i ? "#0f0f0f" : "#7a7a7a", cursor: "pointer", transition: "all 0.2s" }}>
                                  {copiedSwot === i ? "Copié ✓" : "Copier"}
                                </button>
                              </div>
                              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "6px", lineHeight: 1.5 }}>{t.accroche}</p>
                              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.73rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "10px", whiteSpace: "pre-wrap" }}>{t.contenu}</p>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                {t.hashtags.map((h: string, j: number) => (
                                  <span key={j} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#60a5fa" }}>#{h.replace("#","")}</span>
                                ))}
                              </div>
                              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#4a4a4a", fontStyle: "italic", borderTop: "1px solid #2a2a2a", paddingTop: "8px" }}>💡 {t.conseil}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }}>Erreur lors de la génération. Réessayez.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Recommandations */}
            <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Recommandations</p>
              {results.recommendations.map((item, i) => (
                <div key={i} style={{ marginBottom: "16px" }}>
                  {/* Ligne recommandation */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", flex: 1 }}>
                      <span style={{ color: "#f0f0f0", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
                      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
                    </div>
                    {isSignedIn && (
                      <button
                        onClick={() => fetchGuide(i, item)}
                        style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid #3a3a3a", background: "transparent", color: guidesOpen[i] ? "#a3e635" : "#7a7a7a", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, marginLeft: "12px", transition: "color 0.2s, border-color 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a3e635"; e.currentTarget.style.color = "#a3e635"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = guidesOpen[i] ? "#a3e635" : "#3a3a3a"; e.currentTarget.style.color = guidesOpen[i] ? "#a3e635" : "#7a7a7a"; }}
                      >
                        {guidesLoading[i] ? "..." : guidesOpen[i] ? "↑ Fermer" : "→ Comment faire ?"}
                      </button>
                    )}
                  </div>

                  {/* Guide d'action */}
                  {guidesOpen[i] && (
                    <div style={{ marginTop: "12px", marginLeft: "18px", padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #a3e635" }}>
                      {guidesLoading[i] ? (
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em" }}>Génération du guide...</p>
                      ) : guides[i] ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }}>{guides[i]!.titre}</p>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a" }}>⏱ {guides[i]!.duree_estimee}</span>
                              <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: guides[i]!.impact === "élevé" ? "#a3e635" : guides[i]!.impact === "moyen" ? "#f97316" : "#7a7a7a", padding: "2px 8px", border: `1px solid ${guides[i]!.impact === "élevé" ? "#a3e635" : guides[i]!.impact === "moyen" ? "#f97316" : "#3a3a3a"}` }}>Impact {guides[i]!.impact}</span>
                            </div>
                          </div>
                          {guides[i]!.etapes.map((etape) => (
                            <div key={etape.numero} style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#a3e635", flexShrink: 0, minWidth: "18px" }}>{etape.numero}</span>
                              <div>
                                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "3px" }}>{etape.action}</p>
                                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.6, fontWeight: 300 }}>{etape.detail}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }}>Erreur lors de la génération. Réessayez.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA AIO */}
            <div style={{ marginTop: "32px", padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }}>
                  PRÊT POUR L'AUDIT AIO ?
                </p>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }}>
                  Découvrez comment ChatGPT, Claude et Gemini perçoivent réellement votre marque.
                </p>
              </div>
              <Link to="/aio-report"
                style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Lancer l'audit AIO →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "60px 60px 40px" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>

        {/* Colonne 1 — Identité */}
        <div>
          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#f0f0f0", display: "block", lineHeight: 0.9 }}>OT</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#7a7a7a", display: "block", lineHeight: 0.9 }}>CY</span>
          </div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", lineHeight: 1.8, fontWeight: 300, maxWidth: "200px" }}>
            La solution française d'AI Optimization pour les PME.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
            <a href="https://www.linkedin.com/company/otarcy-france" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                onMouseEnter={(e) => ((e.currentTarget as SVGElement).style.stroke = "#a3e635")}
                onMouseLeave={(e) => ((e.currentTarget as SVGElement).style.stroke = "#4a4a4a")}
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://www.instagram.com/otarcy.ai" target="_blank" rel="noopener noreferrer" style={{ display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                onMouseEnter={(e) => ((e.currentTarget as SVGElement).style.stroke = "#a3e635")}
                onMouseLeave={(e) => ((e.currentTarget as SVGElement).style.stroke = "#4a4a4a")}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Colonne 2 — Produit */}
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }}>
            Produit
          </p>
          {[
            { label: "Audit AIO", to: "#audit", scroll: true },
            { label: "Rapport AIO", to: "/aio-report", scroll: false },
            { label: "Tarifs", to: "/pricing", scroll: false },
            { label: "Dashboard", to: "/dashboard", scroll: false },
          ].map((item) => (
            item.scroll ? (
              <button key={item.label} type="button"
                onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

        {/* Colonne 3 — Ressources */}
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }}>
            Ressources
          </p>
          {[
            { label: "Glossaire AIO", to: "/glossaire", scroll: false },
            { label: "FAQ", to: "/faq", scroll: false },
            { label: "Newsletter", to: "#newsletter", scroll: true },
          ].map((item) => (
            item.scroll ? (
              <button key={item.label} type="button"
                onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</button>
            ) : (
              <Link key={item.label} to={item.to}
                style={{ display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a3e635")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
              >{item.label}</Link>
            )
          ))}
        </div>

      </div>

      {/* Bas de footer */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#2a2a2a", letterSpacing: "0.05em" }}>
          © 2025 Otarcy France — Bordeaux, Gironde
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#2a2a2a", letterSpacing: "0.05em" }}>
          La référence française de l'AI Optimization pour les PME
        </p>
      </div>
    </div>
  </footer>
);

// ─── ERROR BANNER ─────────────────────────────────────
const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: "20px 60px", background: "#1a0a0a", borderTop: "1px solid #3a1a1a" }}>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", letterSpacing: "0.1em" }}>⚠ {message}</p>
  </div>
);

// ─── PAGE ─────────────────────────────────────────────
const Index = () => {
  const [brandName, setBrandName] = useState<string>("");
  const [results, setResults] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditsLeft, setAuditsLeft] = useState<number | null>(null);
  const [userPlan, setUserPlan] = useState<string>("free");

  const { user } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;

  useEffect(() => {
    if (isSignedIn && user) {
      authFetch("/api/user-status")
        .then((r) => r.json())
        .then((d) => { setAuditsLeft(d.auditsLeft ?? 3); setUserPlan(d.plan ?? "free"); })
        .catch(() => setAuditsLeft(3));
    } else {
      setAuditsLeft(null);
    }
  }, [isSignedIn, user]);

  const handleAudit = async () => {
    if (!brandName.trim() || !isSignedIn) return;
    if (auditsLeft === 0) return;

    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await authFetch("/api/audit", {
        method: "POST",
        body: JSON.stringify({ brand: brandName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'audit.");

      setResults(data as AuditData);
      if (auditsLeft !== null) setAuditsLeft((prev) => prev !== null ? Math.max(0, prev - 1) : null);

      setTimeout(() => {
        document.getElementById("audit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err: any) {
      setError(err.message ?? "Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  useReveal([results]);

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      <SideLeft />
      <SideRight />
      <Hero isSignedIn={!!isSignedIn} onSignIn={() => navigate("/login")} />
      <WhyAio />
      <AboutSection />
      <NewsletterSection />
      <AuditSection
        setBrandName={setBrandName}
        handleAudit={handleAudit}
        loading={loading}
        isSignedIn={!!isSignedIn}
        onSignIn={() => navigate("/login")}
        auditsLeft={auditsLeft}
        results={results}
        brand={brandName}
        plan={userPlan}
        error={error}
      />
      <Footer />
    </div>
  );
};

export default Index;
