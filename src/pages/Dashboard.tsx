import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import { exportAuditPDF } from "../lib/exportPDF";

// ─── TYPES ────────────────────────────────────────────
interface AuditRecord {
  id: string;
  brand: string;
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at: string;
}

// ─── SCORE RING ───────────────────────────────────────
const ScoreRing: React.FC<{ score: number; size?: number }> = ({ score, size = 70 }) => {
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "#a3e635" : score >= 5 ? "#f0f0f0" : "#ef4444";
  const center = size / 2;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#2a2a2a" strokeWidth="3" />
        <circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: `${size * 0.28}px`, color: "#f0f0f0", lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: `${size * 0.12}px`, color: "#7a7a7a" }}>/10</span>
      </div>
    </div>
  );
};

// ─── AUDIT CARD ───────────────────────────────────────
const AuditCard: React.FC<{ audit: AuditRecord; onClick: () => void }> = ({ audit, onClick }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div
      onClick={onClick}
      style={{
        padding: "24px 28px",
        border: "1px solid #2a2a2a",
        background: "#161616",
        cursor: "pointer",
        transition: "border-color 0.25s, background 0.25s",
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#4a4a4a";
        (e.currentTarget as HTMLDivElement).style.background = "#1c1c1c";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
        (e.currentTarget as HTMLDivElement).style.background = "#161616";
      }}
    >
      <ScoreRing score={audit.score} size={64} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "4px" }}>
          {audit.brand.toUpperCase()}
        </h3>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em", marginBottom: "8px" }}>
          {date}
        </p>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {audit.analysis}
        </p>
      </div>
      <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#4a4a4a", flexShrink: 0 }}>
        →
      </span>
    </div>
  );
};

// ─── AUDIT DETAIL ─────────────────────────────────────
const AuditDetail: React.FC<{ audit: AuditRecord; onClose: () => void }> = ({ audit, onClose }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#161616", border: "1px solid #2a2a2a",
          maxWidth: "760px", width: "100%", maxHeight: "85vh",
          overflowY: "auto", padding: "40px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "6px" }}>
              {date}
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.08em", color: "#f0f0f0" }}>
              {audit.brand.toUpperCase()}
            </h2>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={() => exportAuditPDF({ ...audit })}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "8px 16px",
                border: "1px solid #3a3a3a",
                background: "transparent",
                color: "#e8e8e8",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3a3a3a")}
            >
              ↓ PDF
            </button>
            <button
              onClick={onClose}
              style={{ background: "transparent", border: "none", color: "#7a7a7a", cursor: "pointer", fontSize: "1.2rem", padding: "4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Score + Analyse */}
        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "32px", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
          <ScoreRing score={audit.score} size={90} />
          <div>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "10px" }}>
              Analyse
            </p>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.84rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }}>
              {audit.analysis}
            </p>
          </div>
        </div>

        {/* 3 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Forces</p>
            {(audit.strengths ?? []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: "#a3e635", fontSize: "0.7rem", flexShrink: 0 }}>+</span>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{s}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Faiblesses</p>
            {(audit.weaknesses ?? []).map((w, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: "#ef4444", fontSize: "0.7rem", flexShrink: 0 }}>−</span>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{w}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#0f0f0f" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }}>Recommandations</p>
            {(audit.recommendations ?? []).map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: "#f0f0f0", fontSize: "0.6rem", flexShrink: 0 }}>→</span>
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE DASHBOARD ───────────────────────────────────
const Dashboard: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AuditRecord | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [auditsLeft, setAuditsLeft] = useState<number>(0);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
      return;
    }

    // Charge l'historique
    fetch("/api/history", {
      headers: { "x-clerk-user-id": user?.id ?? "" },
    })
      .then((r) => r.json())
      .then((d) => setAudits(d.audits ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Charge le statut utilisateur
    fetch("/api/user-status", {
      headers: {
        "x-clerk-user-id": user?.id ?? "",
        "x-clerk-user-email": user?.emailAddresses[0]?.emailAddress ?? "",
      },
    })
      .then((r) => r.json())
      .then((d) => {
        setPlan(d.plan ?? "free");
        setAuditsLeft(d.auditsLeft ?? 0);
      })
      .catch(console.error);
  }, [isSignedIn, user, navigate]);

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "28px 36px",
        background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>AR</span>
        </Link>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
          >
            AUDIT
          </Link>
          <Link to="/pricing" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
          >
            TARIFS
          </Link>
          <button
            onClick={() => signOut(() => navigate("/"))}
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "120px 40px 80px" }}>

        {/* Header */}
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }}>
          .04 — Dashboard
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "8px" }}>
          MES AUDITS
        </h1>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", marginBottom: "48px", letterSpacing: "0.1em" }}>
          {user?.firstName ?? user?.emailAddresses[0]?.emailAddress} — Plan <span style={{ color: "#f0f0f0", textTransform: "capitalize" }}>{plan}</span>
          {plan === "free" && (
            <span> · {auditsLeft} audit{auditsLeft > 1 ? "s" : ""} restant{auditsLeft > 1 ? "s" : ""} · <Link to="/pricing" style={{ color: "#a3e635", textDecoration: "none" }}>Passer au Pro</Link></span>
          )}
        </p>

        {/* Stats rapides */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
          {[
            { label: "Audits total", value: audits.length },
            { label: "Score moyen", value: audits.length > 0 ? (audits.reduce((acc, a) => acc + a.score, 0) / audits.length).toFixed(1) : "—" },
            { label: "Dernière marque", value: audits[0]?.brand.toUpperCase() ?? "—" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }}>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f0f0f0", letterSpacing: "0.06em" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Liste audits */}
        {loading ? (
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", letterSpacing: "0.15em" }}>Chargement...</p>
        ) : audits.length === 0 ? (
          <div style={{ padding: "48px", border: "1px solid #2a2a2a", textAlign: "center" }}>
            <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#7a7a7a", marginBottom: "16px" }}>Aucun audit pour le moment</p>
            <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#e8e8e8", textDecoration: "none", padding: "10px 20px", border: "1px solid #3a3a3a" }}>
              Lancer mon premier audit →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {audits.map((audit) => (
              <AuditCard key={audit.id} audit={audit} onClick={() => setSelected(audit)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selected && <AuditDetail audit={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Dashboard;
