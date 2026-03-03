import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────
// ⚡ SETUP REQUIRED — Add this to your App.css or index.css :
//
// @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@300;400;500;600&display=swap');
//
// .reveal {
//   opacity: 0;
//   transform: translateY(30px);
//   transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
// }
// .reveal.visible {
//   opacity: 1;
//   transform: translateY(0);
// }
// ─────────────────────────────────────────────────────

// ─── HOOK: Scroll Reveal ──────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── NAV ──────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Logo — stacked OT / AR */}
      <Link
        to="/"
        style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.15rem",
            letterSpacing: "0.15em",
            color: "#f0f0f0",
          }}
        >
          OT
        </span>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.15rem",
            letterSpacing: "0.15em",
            color: "#7a7a7a",
          }}
        >
          AR
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {[
          { label: "SERVICES", to: "/#services" },
          { label: "CONTACT", to: "/#contact" },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.to}
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: "#7a7a7a",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// ─── SIDE ELEMENTS ────────────────────────────────────
const SideLeft = () => (
  <div
    style={{
      position: "fixed",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      zIndex: 50,
    }}
  >
    {/* Facebook */}
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    </a>
    {/* Twitter */}
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    </a>
    {/* Instagram */}
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
  <div
    style={{
      position: "fixed",
      right: "18px",
      top: "50%",
      transform: "translateY(-50%) rotate(90deg)",
      zIndex: 50,
    }}
  >
    <span
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.6rem",
        letterSpacing: "0.35em",
        color: "#4a4a4a",
        fontWeight: 500,
        textTransform: "uppercase",
      }}
    >
      SCROLL
    </span>
  </div>
);

// ─── SECTION 01 — HERO ────────────────────────────────
const Hero: React.FC<any> = ({ setBrandName, handleAudit, loading }) => (
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
    <span
      style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        color: "#4a4a4a",
      }}
    >
      .01
    </span>

    <p
      className="reveal"
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.7rem",
        letterSpacing: "0.3em",
        color: "#7a7a7a",
        textTransform: "uppercase",
        marginBottom: "24px",
        fontWeight: 500,
      }}
    >
      AIO Brand Audit
    </p>

    <h1
      className="reveal"
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(5rem, 14vw, 11rem)",
        letterSpacing: "0.04em",
        color: "#f0f0f0",
        lineHeight: 0.9,
        textTransform: "uppercase",
      }}
    >
      OTARCY
    </h1>

    <p
      className="reveal"
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.78rem",
        letterSpacing: "0.25em",
        color: "#7a7a7a",
        marginTop: "28px",
        textTransform: "uppercase",
        fontWeight: 300,
      }}
    >
      Contrôlez ce que l'IA dit de votre marque
    </p>

    {/* Champ de saisie de la marque */}
    <div
      className="reveal"
      style={{
        marginTop: "32px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "520px",
        width: "100%",
      }}
    >
      <input
        type="text"
        placeholder="Entrez le nom de votre marque"
        onChange={(e) => setBrandName(e.target.value)}
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
        disabled={loading}
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.66rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          padding: "10px 18px",
          borderRadius: "2px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "#555" : "#e8e8e8",
          color: "#0f0f0f",
          transition: "background 0.25s, transform 0.2s, opacity 0.2s",
          opacity: loading ? 0.7 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {loading ? "ANALYSE EN COURS..." : "Lancer le diagnostic"}
      </button>
    </div>
  </section>
);

// ─── AUDIT RESULTS ────────────────────────────────────
const AuditResults: React.FC<{ results: any }> = ({ results }) => {
  const gptText =
    results?.openai?.summary ??
    results?.openai?.raw ??
    "Aucun résultat disponible.";
  const claudeText =
    results?.anthropic?.summary ??
    results?.anthropic?.raw ??
    "Aucun résultat disponible.";

  const extractScore = (text: string | null | undefined) => {
    if (!text) return null;
    const match = text.match(/(\d{1,2})\s*\/\s*10/);
    if (!match) return null;
    return `${match[1]}/10`;
  };

  const gptScore =
    results?.openai?.score != null
      ? `${results.openai.score}/10`
      : extractScore(gptText) ?? "—/10";
  const claudeScore =
    results?.anthropic?.score != null
      ? `${results.anthropic.score}/10`
      : extractScore(claudeText) ?? "—/10";

  return (
    <section
      id="results"
      className="reveal py-20 animate-in fade-in slide-in-from-bottom-4"
      style={{ padding: "40px 60px", background: "#0f0f0f" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="mb-8"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            letterSpacing: "0.08em",
            color: "#f0f0f0",
          }}
        >
          Résultats de l'audit IA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GPT-4 Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.6rem",
                  letterSpacing: "0.08em",
                  color: "#f0f0f0",
                }}
              >
                GPT-4
              </h3>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.6rem",
                  letterSpacing: "0.06em",
                  color: "#e8e8e8",
                }}
              >
                {gptScore}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.85rem",
                color: "#d4d4d4",
                lineHeight: 1.8,
              }}
            >
              {gptText}
            </p>
          </div>

          {/* Claude 3.5 Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <h3
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.6rem",
                  letterSpacing: "0.08em",
                  color: "#f0f0f0",
                }}
              >
                Claude 3.5
              </h3>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.6rem",
                  letterSpacing: "0.06em",
                  color: "#e8e8e8",
                }}
              >
                {claudeScore}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.85rem",
                color: "#d4d4d4",
                lineHeight: 1.8,
              }}
            >
              {claudeText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── PAGE EXPORT ──────────────────────────────────────
const Index = () => {
  const [brandName, setBrandName] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAudit = async () => {
    if (!brandName) return;
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: brandName }),
      });

      if (!res.ok) {
        console.error("Erreur HTTP API audit:", res.status, await res.text());
        throw new Error("Réponse non valide de l'API d'audit.");
      }

      const data = await res.json();
      setResults(data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (error) {
      console.error("Erreur lors de l'audit de marque:", error);
    } finally {
      setLoading(false);
    }
  };

  useReveal();

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      <SideLeft />
      <SideRight />
      <Hero setBrandName={setBrandName} handleAudit={handleAudit} loading={loading} />
      <div id="results">
        {results && <AuditResults results={results} />}
      </div>
    </div>
  );
};

export default Index;
