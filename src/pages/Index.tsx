import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";

// ─── HOOK: Scroll Reveal ──────────────────────────────
function useReveal(deps: any[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
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
  const { openSignIn, openUserProfile, signOut } = useClerk();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 36px",
        background: scrolled ? "rgba(15,15,15,0.85)" : "rgba(15,15,15,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.4s",
      }}
    >
      <Link
        to="/"
        style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}
      >
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>AR</span>
      </Link>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => handleNavClick("results")}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "#7a7a7a",
            fontWeight: 500,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
        >
          AUDIT
        </button>

        {!user && (
          <button
            type="button"
            onClick={() => openSignIn()}
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "7px 16px",
              border: "1px solid #3a3a3a",
              background: "transparent",
              color: "#e8e8e8",
              cursor: "pointer",
              transition: "border-color 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8e8e8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a3a"; }}
          >
            Connexion
          </button>
        )}

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              type="button"
              onClick={() => openUserProfile()}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.66rem",
                letterSpacing: "0.15em",
                color: "#7a7a7a",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
            >
              {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "Mon compte"}
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#4a4a4a",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4a4a4a")}
            >
              Déconnexion
            </button>
          </div>
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
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
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
    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4a4a", fontWeight: 500, textTransform: "uppercase" }}>
      SCROLL
    </span>
  </div>
);

// ─── HERO ─────────────────────────────────────────────
const Hero: React.FC<{
  setBrandName: (v: string) => void;
  handleAudit: () => void;
  loading: boolean;
  isSignedIn: boolean;
  onSignIn: () => void;
  auditsLeft: number | null;
}> = ({ setBrandName, handleAudit, loading, isSignedIn, onSignIn, auditsLeft }) => (
  <section
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "#161616",
      position: "relative",
      padding: "0 60px",
    }}
  >
    <span style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4a4a4a" }}>
      .01
    </span>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }}>
      AIO Brand Audit
    </p>
    <h1 className="reveal otarcytitle" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 0.9, textTransform: "uppercase" }}>
      OTARCY
    </h1>
    <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.25em", color: "#7a7a7a", marginTop: "28px", textTransform: "uppercase", fontWeight: 300 }}>
      Contrôlez ce que l'IA dit de votre marque
    </p>

    {isSignedIn && auditsLeft !== null && (
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: auditsLeft === 0 ? "#ef4444" : "#7a7a7a", marginTop: "16px", textTransform: "uppercase" }}>
        {auditsLeft === 0 ? "Limite atteinte — passez au plan Pro" : `${auditsLeft} audit${auditsLeft > 1 ? "s" : ""} restant${auditsLeft > 1 ? "s" : ""}`}
      </p>
    )}

    <div className="reveal" style={{ marginTop: "24px", display: "flex", gap: "12px", alignItems: "center", justifyContent: "center", maxWidth: "520px", width: "100%" }}>
      {isSignedIn ? (
        <>
          <input
            type="text"
            placeholder="Entrez le nom de votre marque"
            onChange={(e) => setBrandName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAudit()}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #4a4a4a",
              padding: "10px 14px",
              color: "#f0f0f0",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              outline: "none",
            }}
          />
          <button
            onClick={handleAudit}
            disabled={loading || auditsLeft === 0}
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "10px 18px",
              borderRadius: "2px",
              border: "none",
              cursor: (loading || auditsLeft === 0) ? "not-allowed" : "pointer",
              background: (loading || auditsLeft === 0) ? "#555" : "#e8e8e8",
              color: "#0f0f0f",
              transition: "background 0.25s, opacity 0.2s",
              opacity: (loading || auditsLeft === 0) ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "ANALYSE EN COURS..." : "Lancer le diagnostic"}
          </button>
        </>
      ) : (
        <button
          onClick={onSignIn}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.66rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "12px 32px",
            borderRadius: "2px",
            border: "none",
            cursor: "pointer",
            background: "#e8e8e8",
            color: "#0f0f0f",
            transition: "background 0.25s",
          }}
        >
          Créer un compte gratuit
        </button>
      )}
    </div>

    {!isSignedIn && (
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "14px" }}>
        3 audits offerts — sans carte bancaire
      </p>
    )}
  </section>
);

// ─── TYPES ────────────────────────────────────────────
interface AuditData {
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
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
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#f0f0f0", lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#7a7a7a" }}>/10</span>
      </div>
    </div>
  );
};

// ─── AUDIT RESULTS ────────────────────────────────────
const AuditResults: React.FC<{ results: AuditData; brand: string }> = ({ results, brand }) => (
  <section id="results" style={{ padding: "80px 60px", background: "#0f0f0f" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }}>
        .02 — Résultats
      </p>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "48px" }}>
        AUDIT — {brand.toUpperCase()}
      </h2>
      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", marginBottom: "48px", padding: "36px", border: "1px solid #2a2a2a", background: "#161616" }}>
        <ScoreRing score={results.score} />
        <div>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "10px" }}>
            Score de marque — llama-3.3-70b
          </p>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }}>
            {results.analysis}
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
        <div style={{ padding: "28px", border: "1px solid #2a2a2a", background: "#161616" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>Forces</p>
          {results.strengths.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>+</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{s}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "28px", border: "1px solid #2a2a2a", background: "#161616" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>Faiblesses</p>
          {results.weaknesses.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }}>−</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{w}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "28px", border: "1px solid #2a2a2a", background: "#161616" }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }}>Recommandations</p>
          {results.recommendations.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
              <span style={{ color: "#f0f0f0", fontSize: "0.6rem", marginTop: "3px", flexShrink: 0 }}>→</span>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── ERROR BANNER ─────────────────────────────────────
const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ padding: "20px 60px", background: "#1a0a0a", borderTop: "1px solid #3a1a1a" }}>
    <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", letterSpacing: "0.1em" }}>
      ⚠ {message}
    </p>
  </div>
);

// ─── PAGE ─────────────────────────────────────────────
const Index = () => {
  const [brandName, setBrandName] = useState<string>("");
  const [results, setResults] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditsLeft, setAuditsLeft] = useState<number | null>(null);

  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/user-status")
        .then((r) => r.json())
        .then((d) => setAuditsLeft(d.auditsLeft ?? 3))
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: brandName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de l'audit.");
      }

      setResults(data as AuditData);
      if (auditsLeft !== null) setAuditsLeft((prev) => (prev !== null ? Math.max(0, prev - 1) : null));

      setTimeout(() => {
        const el = document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <Hero
        setBrandName={setBrandName}
        handleAudit={handleAudit}
        loading={loading}
        isSignedIn={!!isSignedIn}
        onSignIn={() => openSignIn()}
        auditsLeft={auditsLeft}
      />
      {error && <ErrorBanner message={error} />}
      {results && <AuditResults results={results} brand={brandName} />}
    </div>
  );
};

export default Index;
