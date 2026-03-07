import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";

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
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const { openSignIn, signOut } = useClerk();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>AR</span>
      </Link>

      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        {[
          { label: "AIO", to: "/aio-report", highlight: true },
          { label: "AUDIT", to: "#audit" },
          { label: "TARIFS", to: "/pricing" },
        ].map((item) => (
          item.to.startsWith("#") ? (
            <button key={item.label} type="button"
              onClick={() => document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" })}
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

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/dashboard" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.15em", color: "#7a7a7a", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
            >
              {user.firstName ?? user.emailAddresses[0]?.emailAddress}
            </Link>
            <button type="button" onClick={() => signOut()}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
            >Déconnexion</button>
          </div>
        ) : (
          <button type="button" onClick={() => openSignIn()}
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
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    </a>
    <a href="https://www.instagram.com/otarcy.web?igsh=MTZiY2M4aGpoa3lncg==" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              </div>
            )}

            {/* 4. Recommandations */}
            <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Recommandations</p>
              {results.recommendations.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: "#f0f0f0", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
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

  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/user-status", {
        headers: {
          "x-clerk-user-id": user.id,
          "x-clerk-user-email": user.emailAddresses[0]?.emailAddress ?? "",
        },
      })
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
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user?.id ?? "",
          "x-clerk-user-email": user?.emailAddresses[0]?.emailAddress ?? "",
        },
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
      <Hero isSignedIn={!!isSignedIn} onSignIn={() => openSignIn()} />
      <WhyAio />
      <AuditSection
        setBrandName={setBrandName}
        handleAudit={handleAudit}
        loading={loading}
        isSignedIn={!!isSignedIn}
        onSignIn={() => openSignIn()}
        auditsLeft={auditsLeft}
        results={results}
        brand={brandName}
        plan={userPlan}
        error={error}
      />
    </div>
  );
};

export default Index;
