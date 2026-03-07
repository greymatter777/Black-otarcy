import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";


// ─── TYPES ────────────────────────────────────────────
interface AioAction {
  action: string;
  impact: string;
  delai: string;
}

interface AioData {
  aio_score: number;
  ai_perception: {
    notoriete_ia: number;
    sentiment: string;
    niveau_detail: string;
    citation_spontanee: boolean;
    resume: string;
  };
  visibilite: {
    sujets_associes: string[];
    concurrents_mieux_positionnes: string[];
    gaps_contenu: string[];
  };
  plan_optimisation: {
    actions_prioritaires: AioAction[];
    strategie_contenu: string[];
    strategie_citations: string[];
    strategie_marketing_ia?: string[];
    quick_wins?: string[];
  };
  plan: string;
}

// ─── SCORE CIRCLE ─────────────────────────────────────
const AioScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 70 ? "#a3e635" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 70 ? "Bonne visibilité IA" : score >= 40 ? "Visibilité moyenne" : "Faible visibilité IA";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "36px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }}>
      <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 * (1 - score / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#f0f0f0", lineHeight: 1 }}>{score}</span>
          <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", color: "#7a7a7a", letterSpacing: "0.1em" }}>/100</span>
        </div>
      </div>
      <div>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "8px" }}>
          Score AIO
        </p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color, marginBottom: "8px" }}>
          {label}
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#7a7a7a", textTransform: "uppercase" }}>
          Optimisation IA — llama-3.3-70b
        </p>
      </div>
    </div>
  );
};

// ─── IMPACT BADGE ─────────────────────────────────────
const ImpactBadge: React.FC<{ impact: string }> = ({ impact }) => {
  const colors: Record<string, string> = { "élevé": "#a3e635", "moyen": "#f97316", "faible": "#7a7a7a" };
  const color = colors[impact.toLowerCase()] ?? "#7a7a7a";
  return (
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color, border: `1px solid ${color}`, padding: "2px 8px", textTransform: "uppercase", flexShrink: 0 }}>
      {impact}
    </span>
  );
};

// ─── CARD SECTION ─────────────────────────────────────
const CardSection: React.FC<{ title: string; items: string[]; symbol: string; color: string }> = ({ title, items, symbol, color }) => (
  <div style={{ padding: "24px", border: "1px solid #2a2a2a", background: "#161616" }}>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>{title}</p>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
        <span style={{ color, fontSize: "0.7rem", flexShrink: 0, marginTop: "2px" }}>{symbol}</span>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
      </div>
    ))}
  </div>
);

// ─── PAGE AIO REPORT ──────────────────────────────────
const AioReport: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AioData | null>(null);

  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    if (!isSignedIn) { openSignIn(); return; }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/aio-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-user-id": user?.id ?? "",
          "x-clerk-user-email": user?.emailAddresses[0]?.emailAddress ?? "",
        },
        body: JSON.stringify({ brand: brandName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la génération.");
      setReport(data as AioData);

      setTimeout(() => {
        document.getElementById("aio-results")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err: any) {
      setError(err.message ?? "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = (s: string) =>
    s === "positif" ? "#a3e635" : s === "négatif" ? "#ef4444" : "#f0f0f0";

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 36px", background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>AR</span>
        </Link>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {(["AUDIT", "TARIFS", "MES AUDITS"] as const).map((label) => {
            const to = label === "AUDIT" ? "/" : label === "TARIFS" ? "/pricing" : "/dashboard";
            return (
              <Link key={label} to={to} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
              >{label}</Link>
            );
          })}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#161616", padding: "0 60px" }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "24px" }}>
          AI Optimization
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 9rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 0.9, textTransform: "uppercase", marginBottom: "16px" }}>
          AIO AUDIT
        </h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", color: "#7a7a7a", marginBottom: "12px", fontWeight: 300 }}>
          Analysez comment les IAs perçoivent votre marque
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#4a4a4a", marginBottom: "32px", fontWeight: 300 }}>
          ChatGPT · Claude · Gemini · Perplexity
        </p>

        {isSignedIn ? (
          <div style={{ display: "flex", gap: "12px", maxWidth: "520px", width: "100%" }}>
            <input
              type="text"
              placeholder="Entrez le nom de votre marque"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              style={{ flex: 1, background: "transparent", border: "1px solid #4a4a4a", padding: "10px 14px", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", outline: "none" }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 18px", border: "none", background: loading ? "#555" : "#e8e8e8", color: "#0f0f0f", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}
            >
              {loading ? "ANALYSE EN COURS..." : "Générer le rapport"}
            </button>
          </div>
        ) : (
          <button onClick={() => openSignIn()} style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 32px", border: "none", background: "#e8e8e8", color: "#0f0f0f", cursor: "pointer" }}>
            Connexion pour accéder
          </button>
        )}

        {error && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", marginTop: "16px" }}>⚠ {error}</p>
        )}

        {!isSignedIn && (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", marginTop: "14px", letterSpacing: "0.15em" }}>
            Disponible — Plans Pro et Agence
          </p>
        )}
      </section>

      {/* Résultats */}
      {report && (
        <section id="aio-results" style={{ padding: "80px 60px", background: "#0f0f0f" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>

            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }}>
              .02 — Rapport AIO
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "48px" }}>
              {brandName.toUpperCase()} — VISIBILITÉ IA
            </h2>

            {/* Score AIO */}
            <AioScoreCircle score={report.aio_score} />

            {/* Perception IA */}
            <div style={{ padding: "28px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }}>Perception par les IAs</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: "Notoriété IA", value: `${report.ai_perception.notoriete_ia}/100` },
                  { label: "Sentiment", value: report.ai_perception.sentiment, color: sentimentColor(report.ai_perception.sentiment) },
                  { label: "Niveau de détail", value: report.ai_perception.niveau_detail },
                  { label: "Citation spontanée", value: report.ai_perception.citation_spontanee ? "Oui ✓" : "Non ✗", color: report.ai_perception.citation_spontanee ? "#a3e635" : "#ef4444" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "16px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "6px" }}>{item.label}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: item.color ?? "#f0f0f0", letterSpacing: "0.06em", textTransform: "capitalize" }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }}>
                {report.ai_perception.resume}
              </p>
            </div>

            {/* Visibilité */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <CardSection title="Sujets associés" items={report.visibilite.sujets_associes} symbol="→" color="#60a5fa" />
              <CardSection title="Concurrents mieux positionnés" items={report.visibilite.concurrents_mieux_positionnes} symbol="↑" color="#f97316" />
              <CardSection title="Gaps de contenu" items={report.visibilite.gaps_contenu} symbol="!" color="#ef4444" />
            </div>

            {/* Actions prioritaires */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>
                Actions prioritaires
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {report.plan_optimisation.actions_prioritaires.map((action, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#2a2a2a", flexShrink: 0, width: "24px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300, flex: 1 }}>{action.action}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 }}>
                      <ImpactBadge impact={action.impact} />
                      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "#4a4a4a", textTransform: "uppercase" }}>{action.delai}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégie contenu + citations */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
              <CardSection title="Stratégie de contenu" items={report.plan_optimisation.strategie_contenu} symbol="→" color="#a3e635" />
              <CardSection title="Stratégie de citations" items={report.plan_optimisation.strategie_citations} symbol="→" color="#60a5fa" />
            </div>

            {/* Agence uniquement */}
            {report.plan === "agency" && report.plan_optimisation.strategie_marketing_ia && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                <CardSection title="Stratégie marketing IA" items={report.plan_optimisation.strategie_marketing_ia} symbol="↑" color="#f97316" />
                {report.plan_optimisation.quick_wins && (
                  <CardSection title="Quick Wins" items={report.plan_optimisation.quick_wins} symbol="⚡" color="#a3e635" />
                )}
              </div>
            )}

            {/* CTA upgrade si Pro */}
            {report.plan === "pro" && (
              <div style={{ padding: "24px 28px", border: "1px dashed #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#4a4a4a", marginBottom: "4px" }}>STRATÉGIE MARKETING IA + QUICK WINS</p>
                  <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", fontWeight: 300 }}>Disponible avec le plan Agence</p>
                </div>
                <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", color: "#7a7a7a", textDecoration: "none", whiteSpace: "nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.color = "#e8e8e8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; e.currentTarget.style.color = "#7a7a7a"; }}
                >
                  Passer Agence →
                </Link>
              </div>
            )}

          </div>
        </section>
      )}
    </div>
  );
};

export default AioReport;
