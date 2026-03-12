import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { createContext, useState, useEffect, useContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate, Link, Routes, Route, Navigate } from "react-router-dom";
import { ViteReactSSG } from "vite-react-ssg/single-page";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
const supabase = createClient(
  "https://placeholder.supabase.co",
  "placeholder"
);
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser((session2 == null ? void 0 : session2.user) ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      setUser((session2 == null ? void 0 : session2.user) ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, session, loading, signOut }, children });
}
const useAuth = () => useContext(AuthContext);
async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = (session == null ? void 0 : session.access_token) ?? "";
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers ?? {}
    }
  });
}
const useAuthFetch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  authFetch
}, Symbol.toStringTag, { value: "Module" }));
function exportAuditPDF(audit) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  let y = 0;
  let page = 1;
  const BLACK = [15, 15, 15];
  const DARK = [22, 22, 22];
  const WHITE = [240, 240, 240];
  const MUTED = [122, 122, 122];
  const DIM = [74, 74, 74];
  const GREEN = [163, 230, 53];
  const RED = [239, 68, 68];
  const BLUE = [96, 165, 250];
  const ORANGE = [249, 115, 22];
  const scoreColor = audit.score >= 7 ? GREEN : audit.score >= 5 ? WHITE : RED;
  const fillPage = () => {
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, W, H, "F");
  };
  const addFooter = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, H - 18, W, 18, "F");
    doc.setDrawColor(...DIM);
    doc.setLineWidth(0.2);
    doc.line(14, H - 18, W - 14, H - 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...DIM);
    doc.text("OTARCY — AIO Brand Audit", 14, H - 9);
    doc.text(`Page ${page}`, W / 2, H - 9, { align: "center" });
    doc.text("blackotarcyweb.vercel.app", W - 14, H - 9, { align: "right" });
  };
  const newPage = () => {
    addFooter();
    doc.addPage();
    page++;
    fillPage();
    y = 24;
  };
  const checkPageBreak = (needed) => {
    if (y + needed > H - 24) newPage();
  };
  const sectionHeader = (label) => {
    checkPageBreak(16);
    doc.setFillColor(...DARK);
    doc.rect(14, y - 2, W - 28, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(label, 18, y + 5);
    doc.setDrawColor(...DIM);
    doc.setLineWidth(0.2);
    doc.line(14, y + 8, W - 14, y + 8);
    y += 14;
  };
  const kpiBar = (label, value, color) => {
    checkPageBreak(14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(label, 14, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
    doc.text(`${value}`, W - 14, y, { align: "right" });
    doc.setFillColor(...DIM);
    doc.rect(14, y + 2, W - 28, 2, "F");
    doc.setFillColor(...color);
    doc.rect(14, y + 2, (W - 28) * (value / 100), 2, "F");
    y += 10;
  };
  fillPage();
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 52, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text("OT", 14, 18);
  doc.setTextColor(...MUTED);
  doc.text("AR", 14, 26);
  doc.setDrawColor(...DIM);
  doc.setLineWidth(0.3);
  doc.line(34, 10, 34, 34);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("AIO BRAND AUDIT", 40, 17);
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text(audit.brand.toUpperCase(), 40, 28);
  const date = audit.created_at ? new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...DIM);
  doc.text(date, 40, 36);
  if (audit.userEmail) doc.text(audit.userEmail, 40, 42);
  const cx = 182, cy = 26, r = 16;
  doc.setDrawColor(...DIM);
  doc.setLineWidth(1.5);
  doc.circle(cx, cy, r, "S");
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(2);
  const segments = 36;
  const filled = Math.round(audit.score / 10 * segments);
  for (let i = 0; i < filled; i++) {
    const a1 = (i / segments * 360 - 90) * (Math.PI / 180);
    const a2 = ((i + 1) / segments * 360 - 90) * (Math.PI / 180);
    doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text(`${audit.score}`, cx - (audit.score >= 10 ? 5 : 3), cy + 3);
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("/10", cx - 2, cy + 9);
  y = 62;
  sectionHeader("SCORE DE MARQUE");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 212, 212);
  const analysisLines = doc.splitTextToSize(audit.analysis, W - 28);
  doc.text(analysisLines, 14, y);
  y += analysisLines.length * 5.5 + 14;
  if (audit.kpis) {
    checkPageBreak(60);
    sectionHeader("KPI DE MARQUE");
    kpiBar("Notoriété", audit.kpis.notoriete, GREEN);
    kpiBar("Cohérence", audit.kpis.coherence, BLUE);
    kpiBar("Présence digitale", audit.kpis.digital, ORANGE);
    kpiBar("Qualité de contenu", audit.kpis.contenu, WHITE);
    y += 8;
  }
  if (audit.swot) {
    checkPageBreak(20);
    sectionHeader("ANALYSE SWOT");
    const swotQuadrants = [
      { label: "FORCES", items: audit.swot.strengths, color: GREEN, symbol: "+" },
      { label: "FAIBLESSES", items: audit.swot.weaknesses, color: RED, symbol: "−" },
      { label: "OPPORTUNITÉS", items: audit.swot.opportunities, color: BLUE, symbol: "↑" },
      { label: "MENACES", items: audit.swot.threats, color: ORANGE, symbol: "!" }
    ];
    const halfW = (W - 28 - 6) / 2;
    for (let row = 0; row < 2; row++) {
      const q1 = swotQuadrants[row * 2];
      const q2 = swotQuadrants[row * 2 + 1];
      const startY = y;
      const renderSwotCol = (q, xStart) => {
        let cy2 = startY;
        doc.setFillColor(...DARK);
        doc.rect(xStart, cy2 - 2, halfW, 10, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(...q.color);
        doc.text(`${q.symbol} ${q.label}`, xStart + 4, cy2 + 5);
        cy2 += 14;
        q.items.forEach((item) => {
          const lines = doc.splitTextToSize(item, halfW - 10);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(...q.color);
          doc.text(q.symbol, xStart + 2, cy2);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(212, 212, 212);
          doc.text(lines, xStart + 8, cy2);
          cy2 += lines.length * 4.8 + 4;
        });
        return cy2;
      };
      const endY1 = renderSwotCol(q1, 14);
      const endY2 = renderSwotCol(q2, 14 + halfW + 6);
      y = Math.max(endY1, endY2) + 10;
      checkPageBreak(10);
    }
    y += 6;
  }
  checkPageBreak(20);
  sectionHeader("RECOMMANDATIONS");
  audit.recommendations.forEach((item) => {
    const lines = doc.splitTextToSize(item, W - 34);
    checkPageBreak(lines.length * 4.8 + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text("→", 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(212, 212, 212);
    doc.text(lines, 22, y);
    y += lines.length * 4.8 + 5;
  });
  y += 8;
  addFooter();
  const filename = `otarcy-audit-${audit.brand.toLowerCase().replace(/\s+/g, "-")}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
function useReveal$8(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}
const secteurLinks = [
  { label: "Coaching & Formation", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
const Navbar = () => {
  var _a;
  const [scrolled, setScrolled] = useState(false);
  const [secteurOpen, setSecteurOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!secteurOpen) return;
    const handler = () => setSecteurOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [secteurOpen]);
  return /* @__PURE__ */ jsxs("nav", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 36px",
    background: scrolled ? "rgba(15,15,15,0.92)" : "rgba(15,15,15,0.6)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    transition: "background 0.4s"
  }, children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }, children: "OT" }),
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }, children: "CY" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "28px", alignItems: "center" }, children: [
      [
        { label: "AIO", to: "/aio-report", highlight: true },
        { label: "À PROPOS", to: "#about" },
        { label: "NEWSLETTER", to: "#newsletter" },
        { label: "AUDIT", to: "#audit" },
        { label: "TARIFS", to: "/pricing" }
      ].map((item) => item.to.startsWith("#") ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a2;
            return (_a2 = document.getElementById(item.to.replace("#", ""))) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
          },
          style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8",
          onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
          children: item.label
        },
        item.label
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: item.highlight ? "#a3e635" : "#7a7a7a", fontWeight: 500, textDecoration: "none", transition: "color 0.3s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
          onMouseLeave: (e) => e.currentTarget.style.color = item.highlight ? "#a3e635" : "#7a7a7a",
          children: item.label
        },
        item.label
      )),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSecteurOpen((v) => !v),
            style: {
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              color: secteurOpen ? "#a3e635" : "#7a7a7a",
              fontWeight: 500,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            },
            onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8",
            onMouseLeave: (e) => e.currentTarget.style.color = secteurOpen ? "#a3e635" : "#7a7a7a",
            children: [
              "SECTEURS",
              /* @__PURE__ */ jsx("span", { style: { fontSize: "0.5rem", transition: "transform 0.2s", display: "inline-block", transform: secteurOpen ? "rotate(180deg)" : "rotate(0deg)" }, children: "▼" })
            ]
          }
        ),
        secteurOpen && /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "calc(100% + 14px)",
          right: 0,
          background: "#0f0f0f",
          border: "1px solid #2a2a2a",
          minWidth: "200px",
          zIndex: 200
        }, children: secteurLinks.map((s) => /* @__PURE__ */ jsx(
          Link,
          {
            to: s.to,
            onClick: () => setSecteurOpen(false),
            style: {
              display: "block",
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#7a7a7a",
              textDecoration: "none",
              padding: "10px 16px",
              borderBottom: "1px solid #1a1a1a",
              transition: "color 0.2s, background 0.2s"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#a3e635";
              e.currentTarget.style.background = "#161616";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#7a7a7a";
              e.currentTarget.style.background = "transparent";
            },
            children: s.label
          },
          s.to
        )) })
      ] }),
      user ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/dashboard",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.15em", color: "#7a7a7a", textDecoration: "none", transition: "color 0.3s" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) ?? (user == null ? void 0 : user.email)
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => signOut().then(() => navigate("/login")),
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#ef4444",
            onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a",
            children: "Déconnexion"
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate("/login"),
          style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "7px 16px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer", transition: "border-color 0.3s" },
          onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "#e8e8e8";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "#3a3a3a";
          },
          children: "Connexion"
        }
      )
    ] })
  ] });
};
const SideLeft = () => /* @__PURE__ */ jsxs("div", { className: "side-elements", style: { position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "18px", zIndex: 50 }, children: [
  /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/company/otarcy-france", target: "_blank", rel: "noopener noreferrer", style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#a3e635", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" }),
    /* @__PURE__ */ jsx("rect", { x: "2", y: "9", width: "4", height: "12" }),
    /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "2" })
  ] }) }),
  /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/otarcy.ai?igsh=MTZiY2M4aGpoa3lncg==", target: "_blank", rel: "noopener noreferrer", style: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#a3e635", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" }),
    /* @__PURE__ */ jsx("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" })
  ] }) })
] });
const SideRight = () => /* @__PURE__ */ jsx("div", { className: "side-elements", style: { position: "fixed", right: "18px", top: "50%", transform: "translateY(-50%) rotate(90deg)", zIndex: 50 }, children: /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.35em", color: "#4a4a4a", fontWeight: 500, textTransform: "uppercase" }, children: "SCROLL" }) });
const Hero = ({ isSignedIn, onSignIn }) => /* @__PURE__ */ jsxs("section", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#161616", position: "relative", padding: "0 60px" }, children: [
  /* @__PURE__ */ jsx("span", { style: { position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4a4a4a" }, children: ".01" }),
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }, children: "AI Optimization" }),
  /* @__PURE__ */ jsx("h1", { className: "reveal otarcytitle", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(5rem, 14vw, 11rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 0.9, textTransform: "uppercase" }, children: "OTARCY" }),
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", letterSpacing: "0.22em", color: "#7a7a7a", marginTop: "28px", textTransform: "uppercase", fontWeight: 300, maxWidth: "520px" }, children: "Optimisez votre marque pour les IAs" }),
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "12px", fontWeight: 300 }, children: "ChatGPT · Claude · Gemini · Perplexity" }),
  /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px", display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }, children: [
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/aio-report",
        style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" },
        onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
        onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
        children: "Lancer l'audit AIO →"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          return (_a = document.getElementById("audit")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        },
        style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" },
        onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "#e8e8e8";
          e.currentTarget.style.color = "#e8e8e8";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "#3a3a3a";
          e.currentTarget.style.color = "#7a7a7a";
        },
        children: "Audit de marque"
      }
    )
  ] }),
  !isSignedIn && /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "20px" }, children: "3 audits offerts — sans carte bancaire" })
] });
const WhyAio = () => /* @__PURE__ */ jsx("section", { style: { padding: "100px 60px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px" }, children: ".02 — Pourquoi l'AIO ?" }),
  /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }, children: [
    "LE MOTEUR DE RECHERCHE",
    /* @__PURE__ */ jsx("br", {}),
    "A CHANGÉ"
  ] }),
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "64px" }, children: "Vos clients ne tapent plus leurs questions sur Google. Ils les posent à ChatGPT, Claude ou Perplexity. Si votre marque n'est pas visible dans ces réponses, vous n'existez pas pour eux." }),
  /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "#1a1a1a", marginBottom: "64px" }, children: [
    { stat: "60%", desc: "des recherches en ligne passeront par des IAs d'ici 2026" },
    { stat: "3×", desc: "plus de conversions pour les marques bien référencées dans les IAs" },
    { stat: "92%", desc: "des marques n'ont aucune stratégie AIO aujourd'hui" }
  ].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "40px 28px", background: "#0a0a0a" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "12px" }, children: item.stat }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }, children: item.desc })
  ] }, i)) }),
  /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }, children: [
    { num: "01", title: "Score AIO", desc: "Mesurez votre visibilité dans les réponses des IAs sur 100 points.", color: "#a3e635" },
    { num: "02", title: "Rapport de visibilité", desc: "Gaps de contenu, concurrents mieux positionnés, sujets associés.", color: "#60a5fa" },
    { num: "03", title: "Plan d'optimisation", desc: "Actions prioritaires classées par impact pour dominer votre secteur dans les IAs.", color: "#f97316" }
  ].map((f) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }, children: f.num }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }, children: f.title }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }, children: f.desc })
  ] }, f.num)) }),
  /* @__PURE__ */ jsx("div", { className: "reveal", style: { marginTop: "48px", textAlign: "center" }, children: /* @__PURE__ */ jsx(
    Link,
    {
      to: "/aio-report",
      style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 36px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
      children: "Analyser ma marque →"
    }
  ) })
] }) });
const AboutSection = () => /* @__PURE__ */ jsx("section", { id: "about", style: { padding: "100px 60px", background: "#0f0f0f", borderTop: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".03 — À propos" }),
  /* @__PURE__ */ jsx("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "24px", lineHeight: 0.95 }, children: "QU'EST-CE QU'OTARCY ?" }),
  /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "64px" }, children: "Otarcy est un outil SaaS français d'AI Optimization (AIO) conçu pour les PME, startups et indépendants qui veulent exister dans les réponses de ChatGPT, Claude, Gemini et Perplexity." }),
  /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginBottom: "48px", padding: "32px", border: "1px solid #2a2a2a", background: "#0a0a0a" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "28px" }, children: "Définition" }),
    [
      {
        q: "Qu'est-ce que l'AIO (AI Optimization) ?",
        a: "L'AIO est la discipline qui consiste à rendre une marque, une entreprise ou un contenu visible dans les réponses générées par les intelligences artificielles conversationnelles comme ChatGPT, Claude, Gemini ou Perplexity. Contrairement au SEO traditionnel centré sur Google, l'AIO optimise la façon dont les IA perçoivent, comprennent et citent une marque."
      },
      {
        q: "À qui s'adresse Otarcy ?",
        a: "Otarcy s'adresse aux fondateurs, responsables marketing et équipes de PME ou startups (5 à 50 employés) déjà présents en ligne mais invisibles auprès des IA. C'est la solution idéale pour ceux qui perdent des clients au profit de concurrents mieux positionnés sur les moteurs de recherche IA."
      },
      {
        q: "Comment fonctionne Otarcy concrètement ?",
        a: "L'utilisateur saisit le nom de sa marque. Otarcy analyse sa visibilité IA en temps réel, génère un score AIO sur 10, identifie les gaps de contenu, produit une analyse SWOT automatisée, et propose un plan d'action priorisé avec des guides étape par étape pour chaque recommandation."
      }
    ].map((item, i) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: i < 2 ? "28px" : 0, paddingBottom: i < 2 ? "28px" : 0, borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }, children: "Q" }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#f0f0f0", lineHeight: 1.6, fontWeight: 600 }, children: item.q })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start", paddingLeft: "4px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: "#7a7a7a", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px" }, children: "A" }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }, children: item.a })
      ] })
    ] }, i))
  ] }),
  /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "48px" }, children: [
    {
      num: "01",
      title: "Accessible",
      desc: "Pas besoin d'être expert en marketing IA. Otarcy traduit des concepts complexes en actions concrètes et immédiatement applicables.",
      color: "#a3e635"
    },
    {
      num: "02",
      title: "Actionnable",
      desc: "Chaque recommandation est accompagnée d'un guide d'action détaillé : étapes, durée estimée, impact attendu.",
      color: "#60a5fa"
    },
    {
      num: "03",
      title: "Conçu pour les PME",
      desc: "Un outil positionné entre le diagnostic gratuit et les solutions enterprise, pensé pour les équipes sans ressources dédiées à l'AIO.",
      color: "#f97316"
    }
  ].map((f) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #1a1a1a", background: "#0f0f0f" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: f.color, marginBottom: "10px" }, children: f.num }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "10px" }, children: f.title }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300 }, children: f.desc })
  ] }, f.num)) }),
  /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px 32px", border: "1px solid #2a2a2a", background: "#0a0a0a", borderLeft: "2px solid #a3e635" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }, children: "Contexte & Origine" }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }, children: "Otarcy est né d'un constat simple : en 2024-2025, les moteurs de recherche IA ont capturé une part croissante des requêtes commerciales, mais aucune solution accessible n'existait pour aider les PME françaises à s'y positionner." }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300 }, children: "Développé et lancé en France, Otarcy est aujourd'hui la première solution française dédiée à l'AI Optimization pour les petites et moyennes entreprises — un segment laissé de côté par les solutions enterprise comme Semrush ou BrightEdge." })
  ] })
] }) });
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setErrorMsg(err.message || "Une erreur est survenue.");
      setStatus("error");
    }
  };
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "newsletter",
      style: {
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        borderBottom: "1px solid #1a1a1a",
        padding: "80px 60px",
        position: "relative",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "640px", margin: "0 auto" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", fontFamily: "'Raleway', sans-serif", fontWeight: 500 }, children: ".04 — Newsletter" }),
          /* @__PURE__ */ jsx("div", { style: { flex: 1, height: "1px", background: "linear-gradient(90deg, #a3e635 0%, transparent 100%)" } })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, margin: "0 0 10px 0" }, children: [
          "LE BRIEF",
          " ",
          /* @__PURE__ */ jsx("em", { style: { color: "#a3e635", fontStyle: "italic" }, children: "AIO" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#4a4a4a", textTransform: "uppercase", margin: "0 0 20px 0" }, children: "Chaque dimanche matin — 5 min de veille AIO" }),
        /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, margin: "0 0 36px 0", maxWidth: "520px" }, children: "Les dernières évolutions de l'AI Optimization, les marques qui gagnent de la visibilité auprès de ChatGPT, Claude et Perplexity — et ce que ça change concrètement pour votre stratégie." }),
        /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: "10px" }, children: [
          "1 synthèse des actus AIO de la semaine",
          "1 marque analysée sous l'angle IA",
          "1 action concrète à implémenter"
        ].map((item, i) => /* @__PURE__ */ jsxs("li", { style: { display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", fontWeight: 300 }, children: [
          /* @__PURE__ */ jsx("span", { style: { width: "5px", height: "5px", borderRadius: "50%", background: "#a3e635", flexShrink: 0 } }),
          item
        ] }, i)) }),
        status === "success" ? /* @__PURE__ */ jsxs("div", { style: { border: "1px solid #a3e635", padding: "20px 24px", display: "flex", alignItems: "center", gap: "12px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "18px" }, children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", color: "#a3e635", margin: 0, fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.05em" }, children: "Inscription confirmée" }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", color: "#4a4a4a", margin: "4px 0 0 0", fontSize: "0.68rem", letterSpacing: "0.05em" }, children: "Prochain Brief AIO — dimanche matin dans votre boîte." })
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", border: "1px solid #2a2a2a" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                placeholder: "votre@email.com",
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                },
                onKeyDown: (e) => e.key === "Enter" && handleSubmit(),
                style: {
                  flex: 1,
                  background: "#111",
                  border: "none",
                  outline: "none",
                  padding: "13px 16px",
                  color: "#f0f0f0",
                  fontSize: "0.76rem",
                  fontFamily: "'Raleway', sans-serif",
                  caretColor: "#a3e635"
                }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleSubmit,
                disabled: status === "loading",
                style: {
                  background: status === "loading" ? "#1a2a0a" : "#a3e635",
                  border: "none",
                  padding: "13px 24px",
                  color: "#0a0a0a",
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: "0.22em",
                  cursor: status === "loading" ? "wait" : "pointer",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap"
                },
                onMouseEnter: (e) => {
                  if (status !== "loading") e.currentTarget.style.opacity = "0.85";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.opacity = "1";
                },
                children: status === "loading" ? "..." : "S'abonner →"
              }
            )
          ] }),
          status === "error" && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", color: "#ef4444", fontSize: "0.68rem", margin: "8px 0 0 0", letterSpacing: "0.05em" }, children: errorMsg }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#a3e635", margin: "12px 0 0 0", letterSpacing: "0.1em" }, children: "Gratuit. Aucun spam. Désabonnement en 1 clic." })
        ] })
      ] })
    }
  );
};
const ScoreRing$1 = ({ score }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 10 * circumference;
  const color = score >= 7 ? "#a3e635" : score >= 5 ? "#f0f0f0" : "#ef4444";
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: 110, height: 110, flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxs("svg", { width: "110", height: "110", style: { transform: "rotate(-90deg)" }, children: [
      /* @__PURE__ */ jsx("circle", { cx: "55", cy: "55", r: radius, fill: "none", stroke: "#2a2a2a", strokeWidth: "5" }),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: "55",
          cy: "55",
          r: radius,
          fill: "none",
          stroke: color,
          strokeWidth: "5",
          strokeDasharray: circumference,
          strokeDashoffset: circumference - progress,
          strokeLinecap: "round",
          style: { transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#f0f0f0", lineHeight: 1 }, children: score }),
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#7a7a7a" }, children: "/10" })
    ] })
  ] });
};
const KpiBar = ({ label, value, color }) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px" }, children: [
  /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "6px" }, children: [
    /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", color: "#a0a0a0", letterSpacing: "0.1em" }, children: label }),
    /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#f0f0f0", letterSpacing: "0.1em" }, children: value })
  ] }),
  /* @__PURE__ */ jsx("div", { style: { background: "#2a2a2a", height: "3px", borderRadius: "2px" }, children: /* @__PURE__ */ jsx("div", { style: { background: color, height: "3px", borderRadius: "2px", width: `${value}%`, transition: "width 1s cubic-bezier(.22,1,.36,1)" } }) })
] });
const SwotSection = ({ swot }) => {
  const quadrants = [
    { key: "strengths", label: "Forces", items: swot.strengths, color: "#a3e635", symbol: "+" },
    { key: "weaknesses", label: "Faiblesses", items: swot.weaknesses, color: "#ef4444", symbol: "−" },
    { key: "opportunities", label: "Opportunités", items: swot.opportunities, color: "#60a5fa", symbol: "↑" },
    { key: "threats", label: "Menaces", items: swot.threats, color: "#f97316", symbol: "!" }
  ];
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: "32px" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }, children: "Analyse SWOT" }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }, children: quadrants.map((q) => /* @__PURE__ */ jsxs("div", { style: { padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }, children: [
      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: q.color, textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }, children: [
        q.symbol,
        " ",
        q.label
      ] }),
      q.items.map((item, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: q.color, fontSize: "0.65rem", flexShrink: 0, marginTop: "2px" }, children: q.symbol }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }, children: item })
      ] }, i))
    ] }, q.key)) })
  ] });
};
const KpiSection = ({ kpis }) => /* @__PURE__ */ jsxs("div", { style: { padding: "28px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }, children: [
  /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }, children: "KPI de marque" }),
  /* @__PURE__ */ jsx(KpiBar, { label: "Notoriété", value: kpis.notoriete, color: "#a3e635" }),
  /* @__PURE__ */ jsx(KpiBar, { label: "Cohérence", value: kpis.coherence, color: "#60a5fa" }),
  /* @__PURE__ */ jsx(KpiBar, { label: "Présence digitale", value: kpis.digital, color: "#f97316" }),
  /* @__PURE__ */ jsx(KpiBar, { label: "Qualité de contenu", value: kpis.contenu, color: "#e8e8e8" })
] });
const AuditSection = ({ setBrandName, handleAudit, loading, isSignedIn, onSignIn, auditsLeft, results, brand, plan, error }) => {
  const canExport = plan === "pro" || plan === "agency";
  const [guides, setGuides] = React.useState({});
  const [guidesLoading, setGuidesLoading] = React.useState({});
  const [guidesOpen, setGuidesOpen] = React.useState({});
  const [swotTemplates, setSwotTemplates] = React.useState(null);
  const [swotTemplatesLoading, setSwotTemplatesLoading] = React.useState(false);
  const [swotTemplatesOpen, setSwotTemplatesOpen] = React.useState(false);
  const [copiedSwot, setCopiedSwot] = React.useState(null);
  const fetchSwotTemplates = async () => {
    if (!(results == null ? void 0 : results.swot)) return;
    if (swotTemplates) {
      setSwotTemplatesOpen(!swotTemplatesOpen);
      return;
    }
    setSwotTemplatesLoading(true);
    setSwotTemplatesOpen(true);
    try {
      const { authFetch: authFetch2 } = await Promise.resolve().then(() => useAuthFetch);
      const res = await authFetch2("/api/swot-templates", {
        method: "POST",
        body: JSON.stringify({
          brand,
          strengths: results.swot.strengths,
          opportunities: results.swot.opportunities
        })
      });
      const data = await res.json();
      setSwotTemplates(data);
    } catch {
      setSwotTemplates(null);
    } finally {
      setSwotTemplatesLoading(false);
    }
  };
  const copySwotPost = (post, index) => {
    const text = `${post.accroche}

${post.contenu}

${post.hashtags.map((h) => `#${h.replace("#", "")}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopiedSwot(index);
    setTimeout(() => setCopiedSwot(null), 2e3);
  };
  const fetchGuide = async (index, recommendation) => {
    if (guides[index]) {
      setGuidesOpen((prev) => ({ ...prev, [index]: !prev[index] }));
      return;
    }
    setGuidesLoading((prev) => ({ ...prev, [index]: true }));
    setGuidesOpen((prev) => ({ ...prev, [index]: true }));
    try {
      const { authFetch: authFetch2 } = await Promise.resolve().then(() => useAuthFetch);
      const res = await authFetch2("/api/guide", {
        method: "POST",
        body: JSON.stringify({ recommendation, brand })
      });
      const data = await res.json();
      setGuides((prev) => ({ ...prev, [index]: data }));
    } catch {
      setGuides((prev) => ({ ...prev, [index]: null }));
    } finally {
      setGuidesLoading((prev) => ({ ...prev, [index]: false }));
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "audit", style: { padding: "100px 60px", background: "#161616", borderTop: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }, children: ".03 — Audit de marque" }),
    /* @__PURE__ */ jsx("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "16px" }, children: "DIAGNOSTIC RAPIDE" }),
    /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", lineHeight: 1.8, fontWeight: 300, maxWidth: "520px", marginBottom: "40px" }, children: "Score, forces, faiblesses et recommandations en quelques secondes. Le point de départ avant votre audit AIO." }),
    isSignedIn ? /* @__PURE__ */ jsxs("div", { children: [
      auditsLeft !== null && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: auditsLeft === 0 ? "#ef4444" : "#4a4a4a", marginBottom: "16px", textTransform: "uppercase" }, children: auditsLeft === 0 ? "Limite atteinte" : `${auditsLeft} audit${auditsLeft > 1 ? "s" : ""} restant${auditsLeft > 1 ? "s" : ""}` }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", maxWidth: "520px" }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Entrez le nom de votre marque",
            onChange: (e) => setBrandName(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleAudit(),
            style: { flex: 1, background: "transparent", border: "1px solid #4a4a4a", padding: "10px 14px", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", outline: "none" }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAudit,
            disabled: loading || auditsLeft === 0,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 18px", border: "none", background: loading || auditsLeft === 0 ? "#555" : "#e8e8e8", color: "#0f0f0f", cursor: loading || auditsLeft === 0 ? "not-allowed" : "pointer", opacity: loading || auditsLeft === 0 ? 0.7 : 1, whiteSpace: "nowrap" },
            children: loading ? "ANALYSE..." : "Analyser"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onSignIn,
          style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer" },
          children: "Connexion pour accéder"
        }
      ),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", marginTop: "12px", letterSpacing: "0.15em" }, children: "3 audits offerts" })
    ] }),
    error && /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", marginTop: "16px" }, children: [
      "⚠ ",
      error
    ] }),
    auditsLeft === 0 && !loading && /* @__PURE__ */ jsxs("div", { style: { marginTop: "24px", padding: "20px 24px", border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }, children: "Passez au plan Pro pour des audits illimités" }),
      /* @__PURE__ */ jsx(Link, { to: "/pricing", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", background: "#e8e8e8", color: "#0f0f0f", textDecoration: "none", whiteSpace: "nowrap" }, children: "Passer au Pro →" })
    ] }),
    results && /* @__PURE__ */ jsxs("div", { style: { marginTop: "56px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsxs("h3", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", color: "#f0f0f0" }, children: [
          "AUDIT — ",
          brand.toUpperCase()
        ] }),
        canExport ? /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => exportAuditPDF({ ...results, brand }),
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer" },
            onMouseEnter: (e) => e.currentTarget.style.borderColor = "#e8e8e8",
            onMouseLeave: (e) => e.currentTarget.style.borderColor = "#3a3a3a",
            children: "↓ Export PDF"
          }
        ) : /* @__PURE__ */ jsx(Link, { to: "/pricing", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", padding: "10px 20px", border: "1px solid #2a2a2a", color: "#4a4a4a", textDecoration: "none" }, children: "🔒 PDF — Plan Pro" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "32px", alignItems: "flex-start", marginBottom: "16px", padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsx(ScoreRing$1, { score: results.score }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "10px" }, children: "Score de marque" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.86rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }, children: results.analysis })
        ] })
      ] }),
      results.kpis ? /* @__PURE__ */ jsx("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ jsx(KpiSection, { kpis: results.kpis }) }) : /* @__PURE__ */ jsxs("div", { style: { padding: "24px", border: "1px dashed #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#4a4a4a", marginBottom: "4px" }, children: "KPI DE MARQUE + SWOT COMPLET" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", fontWeight: 300 }, children: "Notoriété · Cohérence · Digital · Contenu — Plan Pro" })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/pricing",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", color: "#7a7a7a", textDecoration: "none" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#e8e8e8";
              e.currentTarget.style.color = "#e8e8e8";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#3a3a3a";
              e.currentTarget.style.color = "#7a7a7a";
            },
            children: "Passer au Pro →"
          }
        )
      ] }),
      results.swot && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px" }, children: [
        /* @__PURE__ */ jsx(SwotSection, { swot: results.swot }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: "12px", padding: "20px 24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: swotTemplatesOpen ? "20px" : "0" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "2px" }, children: "TEMPLATES LINKEDIN" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", color: "#7a7a7a", fontWeight: 300 }, children: "3 posts basés sur tes forces & opportunités" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: fetchSwotTemplates,
                disabled: swotTemplatesLoading,
                style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid #60a5fa", background: swotTemplatesOpen ? "#60a5fa" : "transparent", color: swotTemplatesOpen ? "#0f0f0f" : "#60a5fa", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", opacity: swotTemplatesLoading ? 0.7 : 1 },
                children: swotTemplatesLoading ? "..." : swotTemplatesOpen ? "↑ Fermer" : "Générer →"
              }
            )
          ] }),
          swotTemplatesOpen && /* @__PURE__ */ jsx("div", { children: swotTemplatesLoading ? /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em" }, children: "Génération des templates..." }) : (swotTemplates == null ? void 0 : swotTemplates.templates) ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: swotTemplates.templates.map((t, i) => /* @__PURE__ */ jsxs("div", { style: { padding: "18px", border: "1px solid #2a2a2a", background: "#161616", borderLeft: "2px solid #60a5fa" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
                /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#60a5fa" }, children: [
                  "0",
                  t.numero
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#7a7a7a", textTransform: "uppercase" }, children: t.format })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => copySwotPost(t, i),
                  style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", border: "1px solid #3a3a3a", background: copiedSwot === i ? "#60a5fa" : "transparent", color: copiedSwot === i ? "#0f0f0f" : "#7a7a7a", cursor: "pointer", transition: "all 0.2s" },
                  children: copiedSwot === i ? "Copié ✓" : "Copier"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "6px", lineHeight: 1.5 }, children: t.accroche }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.73rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "10px", whiteSpace: "pre-wrap" }, children: t.contenu }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }, children: t.hashtags.map((h, j) => /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#60a5fa" }, children: [
              "#",
              h.replace("#", "")
            ] }, j)) }),
            /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", color: "#4a4a4a", fontStyle: "italic", borderTop: "1px solid #2a2a2a", paddingTop: "8px" }, children: [
              "💡 ",
              t.conseil
            ] })
          ] }, i)) }) : /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }, children: "Erreur lors de la génération. Réessayez." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", marginBottom: "16px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }, children: "Recommandations" }),
        results.recommendations.map((item, i) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "flex-start", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "flex-start", flex: 1 }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#f0f0f0", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }, children: item })
            ] }),
            isSignedIn && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => fetchGuide(i, item),
                style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid #3a3a3a", background: "transparent", color: guidesOpen[i] ? "#a3e635" : "#7a7a7a", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, marginLeft: "12px", transition: "color 0.2s, border-color 0.2s" },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = "#a3e635";
                  e.currentTarget.style.color = "#a3e635";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = guidesOpen[i] ? "#a3e635" : "#3a3a3a";
                  e.currentTarget.style.color = guidesOpen[i] ? "#a3e635" : "#7a7a7a";
                },
                children: guidesLoading[i] ? "..." : guidesOpen[i] ? "↑ Fermer" : "→ Comment faire ?"
              }
            )
          ] }),
          guidesOpen[i] && /* @__PURE__ */ jsx("div", { style: { marginTop: "12px", marginLeft: "18px", padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #a3e635" }, children: guidesLoading[i] ? /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em" }, children: "Génération du guide..." }) : guides[i] ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: guides[i].titre }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
                /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a" }, children: [
                  "⏱ ",
                  guides[i].duree_estimee
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: guides[i].impact === "élevé" ? "#a3e635" : guides[i].impact === "moyen" ? "#f97316" : "#7a7a7a", padding: "2px 8px", border: `1px solid ${guides[i].impact === "élevé" ? "#a3e635" : guides[i].impact === "moyen" ? "#f97316" : "#3a3a3a"}` }, children: [
                  "Impact ",
                  guides[i].impact
                ] })
              ] })
            ] }),
            guides[i].etapes.map((etape) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#a3e635", flexShrink: 0, minWidth: "18px" }, children: etape.numero }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "3px" }, children: etape.action }),
                /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.6, fontWeight: 300 }, children: etape.detail })
              ] })
            ] }, etape.numero))
          ] }) : /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }, children: "Erreur lors de la génération. Réessayez." }) })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: "32px", padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }, children: "PRÊT POUR L'AUDIT AIO ?" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }, children: "Découvrez comment ChatGPT, Claude et Gemini perçoivent réellement votre marque." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/aio-report",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "Lancer l'audit AIO →"
          }
        )
      ] })
    ] })
  ] }) });
};
const Footer = () => /* @__PURE__ */ jsx("footer", { style: { background: "#0a0a0a", borderTop: "1px solid #1a1a1a", padding: "60px 60px 40px" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
  /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#f0f0f0", display: "block", lineHeight: 0.9 }, children: "OT" }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#7a7a7a", display: "block", lineHeight: 0.9 }, children: "CY" })
      ] }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", lineHeight: 1.8, fontWeight: 300, maxWidth: "200px" }, children: "La solution française d'AI Optimization pour les PME." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", marginTop: "20px" }, children: [
        /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/company/otarcy-france", target: "_blank", rel: "noopener noreferrer", style: { display: "flex" }, children: /* @__PURE__ */ jsxs(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#4a4a4a",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            onMouseEnter: (e) => e.currentTarget.style.stroke = "#a3e635",
            onMouseLeave: (e) => e.currentTarget.style.stroke = "#4a4a4a",
            children: [
              /* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" }),
              /* @__PURE__ */ jsx("rect", { x: "2", y: "9", width: "4", height: "12" }),
              /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "2" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/otarcy.ai", target: "_blank", rel: "noopener noreferrer", style: { display: "flex" }, children: /* @__PURE__ */ jsxs(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "#4a4a4a",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            onMouseEnter: (e) => e.currentTarget.style.stroke = "#a3e635",
            onMouseLeave: (e) => e.currentTarget.style.stroke = "#4a4a4a",
            children: [
              /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }),
              /* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" }),
              /* @__PURE__ */ jsx("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }, children: "Produit" }),
      [
        { label: "Audit AIO", to: "#audit", scroll: true },
        { label: "Rapport AIO", to: "/aio-report", scroll: false },
        { label: "Tarifs", to: "/pricing", scroll: false },
        { label: "Dashboard", to: "/dashboard", scroll: false }
      ].map((item) => item.scroll ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a;
            return (_a = document.getElementById("audit")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          },
          style: { display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
          onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a",
          children: item.label
        },
        item.label
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          style: { display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
          onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a",
          children: item.label
        },
        item.label
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: "16px" }, children: "Ressources" }),
      [
        { label: "Glossaire AIO", to: "/glossaire", scroll: false },
        { label: "FAQ", to: "/faq", scroll: false },
        { label: "Newsletter", to: "#newsletter", scroll: true }
      ].map((item) => item.scroll ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            var _a;
            return (_a = document.getElementById("newsletter")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          },
          style: { display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", padding: "0 0 10px 0", letterSpacing: "0.05em", transition: "color 0.2s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#a3e635",
          onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a",
          children: item.label
        },
        item.label
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.to,
          style: { display: "block", fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", textDecoration: "none", marginBottom: "10px", letterSpacing: "0.05em", transition: "color 0.2s" },
          onMouseEnter: (e) => e.currentTarget.style.color = "#a3e635",
          onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a",
          children: item.label
        },
        item.label
      ))
    ] })
  ] }),
  /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #1a1a1a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }, children: [
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#2a2a2a", letterSpacing: "0.05em" }, children: "© 2025 Otarcy France — Bordeaux, Gironde" }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#2a2a2a", letterSpacing: "0.05em" }, children: "La référence française de l'AI Optimization pour les PME" })
  ] })
] }) });
const Index = () => {
  const [brandName, setBrandName] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditsLeft, setAuditsLeft] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;
  useEffect(() => {
    if (isSignedIn && user) {
      authFetch("/api/user-status").then((r) => r.json()).then((d) => {
        setAuditsLeft(d.auditsLeft ?? 3);
        setUserPlan(d.plan ?? "free");
      }).catch(() => setAuditsLeft(3));
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
        body: JSON.stringify({ brand: brandName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'audit.");
      setResults(data);
      if (auditsLeft !== null) setAuditsLeft((prev) => prev !== null ? Math.max(0, prev - 1) : null);
      setTimeout(() => {
        var _a;
        (_a = document.getElementById("audit")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      setError(err.message ?? "Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };
  useReveal$8([results]);
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0f0f0f", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(SideLeft, {}),
    /* @__PURE__ */ jsx(SideRight, {}),
    /* @__PURE__ */ jsx(Hero, { isSignedIn: !!isSignedIn, onSignIn: () => navigate("/login") }),
    /* @__PURE__ */ jsx(WhyAio, {}),
    /* @__PURE__ */ jsx(AboutSection, {}),
    /* @__PURE__ */ jsx(NewsletterSection, {}),
    /* @__PURE__ */ jsx(
      AuditSection,
      {
        setBrandName,
        handleAudit,
        loading,
        isSignedIn: !!isSignedIn,
        onSignIn: () => navigate("/login"),
        auditsLeft,
        results,
        brand: brandName,
        plan: userPlan,
        error
      }
    ),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const plans = [
  {
    id: "free",
    name: "Découverte",
    badge: null,
    price: "0€",
    period: "",
    description: "Pour tester Otarcy",
    features: ["3 audits de marque offerts", "Score de marque", "Forces & faiblesses", "Recommandations basiques"],
    locked: ["Audit AIO", "SWOT & KPI", "Export PDF"],
    cta: "Commencer gratuitement",
    highlighted: false,
    color: "#7a7a7a"
  },
  {
    id: "pro",
    name: "AIO Essentiel",
    badge: "POPULAIRE",
    price: "19€",
    period: "/ mois",
    description: "Pour les entrepreneurs & freelances",
    features: ["Audits illimités", "Score AIO — visibilité dans les IAs", "Rapport de visibilité IA complet", "Plan d'optimisation AIO", "SWOT & KPI de marque", "Export PDF", "Historique des audits", "Support email prioritaire"],
    locked: [],
    cta: "Passer à l'AIO Essentiel",
    highlighted: true,
    color: "#a3e635"
  },
  {
    id: "agency",
    name: "AIO Expert",
    badge: null,
    price: "99€",
    period: "/ mois",
    description: "Pour les agences & consultants",
    features: ["Tout de l'AIO Essentiel", "Stratégie marketing IA", "Quick Wins priorisés", "Analyse multi-marques", "Marque blanche", "Support dédié"],
    locked: [],
    cta: "Passer à l'AIO Expert",
    highlighted: false,
    color: "#60a5fa"
  }
];
const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);
  const handleUpgrade = async (planId) => {
    if (planId === "free") return;
    if (!user) {
      navigate("/login");
      return;
    }
    setLoadingPlan(planId);
    setError(null);
    try {
      const res = await authFetch("/api/create-checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur paiement.");
      window.location.href = data.url;
    } catch (err) {
      setError(err.message ?? "Une erreur s'est produite.");
    } finally {
      setLoadingPlan(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0f0f0f", minHeight: "100vh", padding: "120px 40px 80px" }, children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", style: { position: "fixed", top: "28px", left: "36px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0", textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 0.9 }, children: [
      /* @__PURE__ */ jsx("span", { children: "OT" }),
      /* @__PURE__ */ jsx("span", { style: { color: "#7a7a7a" }, children: "AR" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: "960px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "12px" }, children: ".03 — Tarifs" }),
      /* @__PURE__ */ jsxs("h1", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "16px" }, children: [
        "OPTIMISEZ VOTRE",
        /* @__PURE__ */ jsx("br", {}),
        "PRÉSENCE IA"
      ] }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#7a7a7a", marginBottom: "64px", fontWeight: 300, letterSpacing: "0.1em" }, children: "Sans engagement — résiliez à tout moment" }),
      error && /* @__PURE__ */ jsx("div", { style: { padding: "14px 20px", background: "#1a0a0a", border: "1px solid #3a1a1a", marginBottom: "32px" }, children: /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444" }, children: [
        "⚠ ",
        error
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }, children: plans.map((plan) => /* @__PURE__ */ jsxs("div", { style: { padding: "36px 28px", border: plan.highlighted ? `1px solid ${plan.color}` : "1px solid #2a2a2a", background: plan.highlighted ? "#161616" : "#0f0f0f", position: "relative", transition: "border-color 0.3s" }, children: [
        plan.badge && /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "-1px", left: "28px", background: plan.color, padding: "3px 10px" }, children: /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: "#0f0f0f", fontWeight: 600 }, children: plan.badge }) }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.3em", color: plan.color, textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }, children: plan.name }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "8px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#f0f0f0", lineHeight: 1 }, children: plan.price }),
          /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a" }, children: plan.period })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", marginBottom: "28px", fontWeight: 300 }, children: plan.description }),
        /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
          plan.features.map((feature, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: plan.color, fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "+" }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: feature })
          ] }, i)),
          plan.locked.map((feature, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }, children: [
            /* @__PURE__ */ jsx("span", { style: { color: "#3a3a3a", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "×" }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#3a3a3a", lineHeight: 1.5, fontWeight: 300 }, children: feature })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleUpgrade(plan.id),
            disabled: loadingPlan === plan.id || plan.id === "free",
            style: { width: "100%", fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px", border: plan.highlighted ? "none" : "1px solid #3a3a3a", background: plan.highlighted ? plan.color : "transparent", color: plan.highlighted ? "#0f0f0f" : "#e8e8e8", cursor: plan.id === "free" ? "default" : "pointer", opacity: loadingPlan === plan.id ? 0.7 : 1, fontWeight: plan.highlighted ? 600 : 400, transition: "background 0.25s, opacity 0.2s" },
            children: loadingPlan === plan.id ? "REDIRECTION..." : plan.cta
          }
        )
      ] }, plan.id)) }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#4a4a4a", marginTop: "48px", textAlign: "center" }, children: "Paiement sécurisé par Stripe — Sans carte pour le plan gratuit" })
    ] })
  ] });
};
const ScoreRing = ({ score, size = 70 }) => {
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 10 * circumference;
  const color = score >= 7 ? "#a3e635" : score >= 5 ? "#f0f0f0" : "#ef4444";
  const center = size / 2;
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: size, height: size, flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" }, children: [
      /* @__PURE__ */ jsx("circle", { cx: center, cy: center, r: radius, fill: "none", stroke: "#2a2a2a", strokeWidth: "3" }),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: center,
          cy: center,
          r: radius,
          fill: "none",
          stroke: color,
          strokeWidth: "3",
          strokeDasharray: circumference,
          strokeDashoffset: circumference - progress,
          strokeLinecap: "round",
          style: { transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: `${size * 0.28}px`, color: "#f0f0f0", lineHeight: 1 }, children: score }),
      /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: `${size * 0.12}px`, color: "#7a7a7a" }, children: "/10" })
    ] })
  ] });
};
const AuditCard = ({ audit, onClick }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick,
      style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#161616", cursor: "pointer", transition: "border-color 0.25s, background 0.25s", display: "flex", alignItems: "center", gap: "24px" },
      onMouseEnter: (e) => {
        e.currentTarget.style.borderColor = "#4a4a4a";
        e.currentTarget.style.background = "#1c1c1c";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.borderColor = "#2a2a2a";
        e.currentTarget.style.background = "#161616";
      },
      children: [
        /* @__PURE__ */ jsx(ScoreRing, { score: audit.score, size: 64 }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx("h3", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "4px" }, children: audit.brand.toUpperCase() }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em", marginBottom: "8px" }, children: date }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#a0a0a0", lineHeight: 1.6, fontWeight: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: audit.analysis })
        ] }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#4a4a4a", flexShrink: 0 }, children: "→" })
      ]
    }
  );
};
const AuditDetail = ({ audit, onClose }) => {
  const date = new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return /* @__PURE__ */ jsx("div", { style: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { style: { background: "#161616", border: "1px solid #2a2a2a", maxWidth: "760px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "40px" }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "6px" }, children: date }),
        /* @__PURE__ */ jsx("h2", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: audit.brand.toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => exportAuditPDF({ ...audit }),
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid #3a3a3a", background: "transparent", color: "#e8e8e8", cursor: "pointer", transition: "border-color 0.3s" },
            onMouseEnter: (e) => e.currentTarget.style.borderColor = "#e8e8e8",
            onMouseLeave: (e) => e.currentTarget.style.borderColor = "#3a3a3a",
            children: "↓ PDF"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            style: { background: "transparent", border: "none", color: "#7a7a7a", cursor: "pointer", fontSize: "1.2rem", padding: "4px" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: "✕"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "28px", alignItems: "flex-start", marginBottom: "32px", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
      /* @__PURE__ */ jsx(ScoreRing, { score: audit.score, size: 90 }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "10px" }, children: "Analyse" }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.84rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }, children: audit.analysis })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }, children: [
      { label: "Forces", items: audit.strengths ?? [], color: "#a3e635", symbol: "+" },
      { label: "Faiblesses", items: audit.weaknesses ?? [], color: "#ef4444", symbol: "−" },
      { label: "Recommandations", items: audit.recommendations ?? [], color: "#f0f0f0", symbol: "→" }
    ].map((col) => /* @__PURE__ */ jsxs("div", { style: { padding: "20px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "14px" }, children: col.label }),
      col.items.map((item, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", marginBottom: "8px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { color: col.color, fontSize: "0.7rem", flexShrink: 0 }, children: col.symbol }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }, children: item })
      ] }, i))
    ] }, col.label)) })
  ] }) });
};
const Dashboard = () => {
  var _a, _b;
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState("free");
  const [auditsLeft, setAuditsLeft] = useState(0);
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    authFetch("/api/history").then((r) => r.json()).then((d) => setAudits(d.audits ?? [])).catch(console.error).finally(() => setLoading(false));
    authFetch("/api/user-status").then((r) => r.json()).then((d) => {
      setPlan(d.plan ?? "free");
      setAuditsLeft(d.auditsLeft ?? 0);
    }).catch(console.error);
  }, [user, navigate]);
  const displayName = ((_a = user == null ? void 0 : user.user_metadata) == null ? void 0 : _a.full_name) ?? (user == null ? void 0 : user.email) ?? "";
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0f0f0f", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxs("nav", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 36px", background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }, children: "OT" }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }, children: "AR" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "24px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }, onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8", onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a", children: "AUDIT" }),
        /* @__PURE__ */ jsx(Link, { to: "/pricing", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 }, onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8", onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a", children: "TARIFS" }),
        /* @__PURE__ */ jsx("button", { onClick: () => signOut().then(() => navigate("/login")), style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", background: "transparent", border: "none", cursor: "pointer", transition: "color 0.3s" }, onMouseEnter: (e) => e.currentTarget.style.color = "#ef4444", onMouseLeave: (e) => e.currentTarget.style.color = "#4a4a4a", children: "Déconnexion" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto", padding: "120px 40px 80px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }, children: ".04 — Dashboard" }),
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "8px" }, children: "MES AUDITS" }),
      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", marginBottom: "48px", letterSpacing: "0.1em" }, children: [
        displayName,
        " — Plan ",
        /* @__PURE__ */ jsx("span", { style: { color: "#f0f0f0", textTransform: "capitalize" }, children: plan }),
        plan === "free" && /* @__PURE__ */ jsxs("span", { children: [
          " · ",
          auditsLeft,
          " audit",
          auditsLeft > 1 ? "s" : "",
          " restant",
          auditsLeft > 1 ? "s" : "",
          " · ",
          /* @__PURE__ */ jsx(Link, { to: "/pricing", style: { color: "#a3e635", textDecoration: "none" }, children: "Passer au Pro" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }, children: [
        { label: "Audits total", value: audits.length },
        { label: "Score moyen", value: audits.length > 0 ? (audits.reduce((acc, a) => acc + a.score, 0) / audits.length).toFixed(1) : "—" },
        { label: "Dernière marque", value: ((_b = audits[0]) == null ? void 0 : _b.brand.toUpperCase()) ?? "—" }
      ].map((stat, i) => /* @__PURE__ */ jsxs("div", { style: { padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.25em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "8px" }, children: stat.label }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#f0f0f0", letterSpacing: "0.06em" }, children: stat.value })
      ] }, i)) }),
      loading ? /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", letterSpacing: "0.15em" }, children: "Chargement..." }) : audits.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { padding: "48px", border: "1px solid #2a2a2a", textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#7a7a7a", marginBottom: "16px" }, children: "Aucun audit pour le moment" }),
        /* @__PURE__ */ jsx(Link, { to: "/", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#e8e8e8", textDecoration: "none", padding: "10px 20px", border: "1px solid #3a3a3a" }, children: "Lancer mon premier audit →" })
      ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: audits.map((audit) => /* @__PURE__ */ jsx(AuditCard, { audit, onClick: () => setSelected(audit) }, audit.id)) })
    ] }),
    selected && /* @__PURE__ */ jsx(AuditDetail, { audit: selected, onClose: () => setSelected(null) })
  ] });
};
const AioScoreCircle = ({ score }) => {
  const color = score >= 70 ? "#a3e635" : score >= 40 ? "#f97316" : "#ef4444";
  const label = score >= 70 ? "Bonne visibilité IA" : score >= 40 ? "Visibilité moyenne" : "Faible visibilité IA";
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "32px", padding: "36px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: 120, height: 120, flexShrink: 0 }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "120", height: "120", style: { transform: "rotate(-90deg)" }, children: [
        /* @__PURE__ */ jsx("circle", { cx: "60", cy: "60", r: "50", fill: "none", stroke: "#2a2a2a", strokeWidth: "6" }),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "60",
            cy: "60",
            r: "50",
            fill: "none",
            stroke: color,
            strokeWidth: "6",
            strokeDasharray: 2 * Math.PI * 50,
            strokeDashoffset: 2 * Math.PI * 50 * (1 - score / 100),
            strokeLinecap: "round",
            style: { transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#f0f0f0", lineHeight: 1 }, children: score }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", color: "#7a7a7a", letterSpacing: "0.1em" }, children: "/100" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "8px" }, children: "Score AIO" }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color, marginBottom: "8px" }, children: label }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#7a7a7a", textTransform: "uppercase" }, children: "Optimisation IA — llama-3.3-70b" })
    ] })
  ] });
};
const ImpactBadge = ({ impact }) => {
  const colors = { "élevé": "#a3e635", "moyen": "#f97316", "faible": "#7a7a7a" };
  const color = colors[impact.toLowerCase()] ?? "#7a7a7a";
  return /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", color, border: `1px solid ${color}`, padding: "2px 8px", textTransform: "uppercase", flexShrink: 0 }, children: impact });
};
const CardSection = ({ title, items, symbol, color }) => /* @__PURE__ */ jsxs("div", { style: { padding: "24px", border: "1px solid #2a2a2a", background: "#161616" }, children: [
  /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }, children: title }),
  items.map((item, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }, children: [
    /* @__PURE__ */ jsx("span", { style: { color, fontSize: "0.7rem", flexShrink: 0, marginTop: "2px" }, children: symbol }),
    /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300 }, children: item })
  ] }, i))
] });
const AioReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [linkedinPlan, setLinkedinPlan] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinOpen, setLinkedinOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const handleLinkedinPlan = async () => {
    if (!report) return;
    if (linkedinPlan) {
      setLinkedinOpen(!linkedinOpen);
      return;
    }
    setLinkedinLoading(true);
    setLinkedinOpen(true);
    try {
      const res = await authFetch("/api/linkedin-plan", {
        method: "POST",
        body: JSON.stringify({
          brand: brandName,
          aio_score: report.aio_score,
          gaps_contenu: report.visibilite.gaps_contenu,
          sujets_associes: report.visibilite.sujets_associes,
          actions_prioritaires: report.plan_optimisation.actions_prioritaires
        })
      });
      const data = await res.json();
      setLinkedinPlan(data);
    } catch {
      setLinkedinPlan(null);
    } finally {
      setLinkedinLoading(false);
    }
  };
  const copyPost = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2e3);
  };
  const handleGenerate = async () => {
    if (!brandName.trim()) return;
    if (!isSignedIn) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await authFetch("/api/aio-report", {
        method: "POST",
        body: JSON.stringify({ brand: brandName.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la génération.");
      setReport(data);
      setTimeout(() => {
        var _a;
        (_a = document.getElementById("aio-results")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err) {
      setError(err.message ?? "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };
  const sentimentColor = (s) => s === "positif" ? "#a3e635" : s === "négatif" ? "#ef4444" : "#f0f0f0";
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0f0f0f", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxs("nav", { style: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 36px", background: "rgba(15,15,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }, children: "OT" }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }, children: "CY" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "24px", alignItems: "center" }, children: ["AUDIT", "TARIFS", "MES AUDITS"].map((label) => {
        const to = label === "AUDIT" ? "/" : label === "TARIFS" ? "/pricing" : "/dashboard";
        return /* @__PURE__ */ jsx(
          Link,
          {
            to,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none", fontWeight: 500 },
            onMouseEnter: (e) => e.currentTarget.style.color = "#e8e8e8",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: label
          },
          label
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#161616", padding: "0 60px" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "24px" }, children: "AI Optimization" }),
      /* @__PURE__ */ jsx("h1", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 9rem)", letterSpacing: "0.04em", color: "#f0f0f0", lineHeight: 0.9, textTransform: "uppercase", marginBottom: "16px" }, children: "AIO AUDIT" }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.2em", color: "#7a7a7a", marginBottom: "12px", fontWeight: 300 }, children: "Analysez comment les IAs perçoivent votre marque" }),
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#4a4a4a", marginBottom: "32px", fontWeight: 300 }, children: "ChatGPT · Claude · Gemini · Perplexity" }),
      isSignedIn ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", maxWidth: "520px", width: "100%" }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Entrez le nom de votre marque",
            value: brandName,
            onChange: (e) => setBrandName(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleGenerate(),
            style: { flex: 1, background: "transparent", border: "1px solid #4a4a4a", padding: "10px 14px", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", outline: "none" }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleGenerate,
            disabled: loading,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "10px 18px", border: "none", background: loading ? "#555" : "#e8e8e8", color: "#0f0f0f", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" },
            children: loading ? "ANALYSE EN COURS..." : "Générer le rapport"
          }
        )
      ] }) : /* @__PURE__ */ jsx("button", { onClick: () => navigate("/login"), style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 32px", border: "none", background: "#e8e8e8", color: "#0f0f0f", cursor: "pointer" }, children: "Connexion pour accéder" }),
      error && /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#ef4444", marginTop: "16px" }, children: [
        "⚠ ",
        error
      ] }),
      !isSignedIn && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", marginTop: "14px", letterSpacing: "0.15em" }, children: "Disponible — Plans Pro et Agence" })
    ] }),
    report && /* @__PURE__ */ jsx("section", { id: "aio-results", style: { padding: "80px 60px", background: "#0f0f0f" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "12px" }, children: ".02 — Rapport AIO" }),
      /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "48px" }, children: [
        brandName.toUpperCase(),
        " — VISIBILITÉ IA"
      ] }),
      /* @__PURE__ */ jsx(AioScoreCircle, { score: report.aio_score }),
      /* @__PURE__ */ jsxs("div", { style: { padding: "28px", border: "1px solid #2a2a2a", background: "#161616", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }, children: "Perception par les IAs" }),
        /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }, children: [
          { label: "Notoriété IA", value: `${report.ai_perception.notoriete_ia}/100` },
          { label: "Sentiment", value: report.ai_perception.sentiment, color: sentimentColor(report.ai_perception.sentiment) },
          { label: "Niveau de détail", value: report.ai_perception.niveau_detail },
          { label: "Citation spontanée", value: report.ai_perception.citation_spontanee ? "Oui ✓" : "Non ✗", color: report.ai_perception.citation_spontanee ? "#a3e635" : "#ef4444" }
        ].map((item, i) => /* @__PURE__ */ jsxs("div", { style: { padding: "16px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "6px" }, children: item.label }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: item.color ?? "#f0f0f0", letterSpacing: "0.06em", textTransform: "capitalize" }, children: item.value })
        ] }, i)) }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#d4d4d4", lineHeight: 1.85, fontWeight: 300 }, children: report.ai_perception.resume })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx(CardSection, { title: "Sujets associés", items: report.visibilite.sujets_associes, symbol: "→", color: "#60a5fa" }),
        /* @__PURE__ */ jsx(CardSection, { title: "Concurrents mieux positionnés", items: report.visibilite.concurrents_mieux_positionnes, symbol: "↑", color: "#f97316" }),
        /* @__PURE__ */ jsx(CardSection, { title: "Gaps de contenu", items: report.visibilite.gaps_contenu, symbol: "!", color: "#ef4444" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "16px" }, children: "Actions prioritaires" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: report.plan_optimisation.actions_prioritaires.map((action, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px", padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#2a2a2a", flexShrink: 0, width: "24px" }, children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.8rem", color: "#d4d4d4", lineHeight: 1.6, fontWeight: 300, flex: 1 }, children: action.action }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx(ImpactBadge, { impact: action.impact }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "#4a4a4a", textTransform: "uppercase" }, children: action.delai })
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx(CardSection, { title: "Stratégie de contenu", items: report.plan_optimisation.strategie_contenu, symbol: "→", color: "#a3e635" }),
        /* @__PURE__ */ jsx(CardSection, { title: "Stratégie de citations", items: report.plan_optimisation.strategie_citations, symbol: "→", color: "#60a5fa" })
      ] }),
      report.plan === "agency" && report.plan_optimisation.strategie_marketing_ia && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx(CardSection, { title: "Stratégie marketing IA", items: report.plan_optimisation.strategie_marketing_ia, symbol: "↑", color: "#f97316" }),
        report.plan_optimisation.quick_wins && /* @__PURE__ */ jsx(CardSection, { title: "Quick Wins", items: report.plan_optimisation.quick_wins, symbol: "⚡", color: "#a3e635" })
      ] }),
      report.plan === "pro" && /* @__PURE__ */ jsxs("div", { style: { padding: "24px 28px", border: "1px dashed #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#4a4a4a", marginBottom: "4px" }, children: "STRATÉGIE MARKETING IA + QUICK WINS" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#4a4a4a", fontWeight: 300 }, children: "Disponible avec le plan Agence" })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/pricing",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #3a3a3a", color: "#7a7a7a", textDecoration: "none", whiteSpace: "nowrap" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#e8e8e8";
              e.currentTarget.style.color = "#e8e8e8";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#3a3a3a";
              e.currentTarget.style.color = "#7a7a7a";
            },
            children: "Passer Agence →"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: "32px", padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: linkedinOpen ? "24px" : "0" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "4px" }, children: "PLAN DE CONTENU LINKEDIN" }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300 }, children: "5 posts prêts à publier pour améliorer ta visibilité IA" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleLinkedinPlan,
              disabled: linkedinLoading,
              style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 20px", border: "1px solid #a3e635", background: linkedinOpen ? "#a3e635" : "transparent", color: linkedinOpen ? "#0f0f0f" : "#a3e635", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", opacity: linkedinLoading ? 0.7 : 1 },
              children: linkedinLoading ? "Génération..." : linkedinOpen ? "↑ Fermer" : "Générer →"
            }
          )
        ] }),
        linkedinOpen && /* @__PURE__ */ jsx("div", { children: linkedinLoading ? /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", letterSpacing: "0.1em" }, children: "Génération de tes 5 posts LinkedIn..." }) : (linkedinPlan == null ? void 0 : linkedinPlan.posts) ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: linkedinPlan.posts.map((post, i) => /* @__PURE__ */ jsxs("div", { style: { padding: "20px", border: "1px solid #2a2a2a", background: "#161616" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", color: "#a3e635" }, children: [
                "0",
                post.numero
              ] }),
              /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7a7a7a", textTransform: "uppercase" }, children: post.type })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => copyPost(`${post.accroche}

${post.contenu}

${post.hashtags.map((h) => `#${h.replace("#", "")}`).join(" ")}`, i),
                style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid #3a3a3a", background: copiedIndex === i ? "#a3e635" : "transparent", color: copiedIndex === i ? "#0f0f0f" : "#7a7a7a", cursor: "pointer", transition: "all 0.2s" },
                children: copiedIndex === i ? "Copié ✓" : "Copier"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "8px", lineHeight: 1.5 }, children: post.accroche }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#d4d4d4", lineHeight: 1.8, fontWeight: 300, marginBottom: "12px", whiteSpace: "pre-wrap" }, children: post.contenu }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }, children: post.hashtags.map((h, j) => /* @__PURE__ */ jsxs("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#60a5fa", letterSpacing: "0.05em" }, children: [
            "#",
            h.replace("#", "")
          ] }, j)) }),
          /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid #2a2a2a", paddingTop: "10px" }, children: /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", fontStyle: "italic" }, children: [
            "💡 ",
            post.objectif_aio
          ] }) })
        ] }, i)) }) : /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#ef4444" }, children: "Erreur lors de la génération. Réessayez." }) })
      ] })
    ] }) })
  ] });
};
function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleEmail = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: "success", text: "Vérifie ta boîte mail pour confirmer ton compte." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Email de réinitialisation envoyé." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message ?? "Une erreur est survenue." });
    } finally {
      setLoading(false);
    }
  };
  const handleOAuth = async (provider) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` }
    });
    if (error) setMessage({ type: "error", text: error.message });
    setLoading(false);
  };
  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Entre ton email d'abord." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` }
    });
    if (error) setMessage({ type: "error", text: error.message });
    else setMessage({ type: "success", text: "Magic link envoyé ! Vérifie ta boîte mail." });
    setLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { style: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "24px"
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "40px 36px",
    backdropFilter: "blur(20px)"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: "24px" }, children: /* @__PURE__ */ jsx("a", { href: "/", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textDecoration: "none", textTransform: "uppercase" }, children: "← Retour" }) }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "32px" }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        borderRadius: "12px",
        marginBottom: "16px",
        fontSize: "20px",
        fontWeight: "800",
        color: "#fff",
        letterSpacing: "-1px"
      }, children: "OT" }),
      /* @__PURE__ */ jsx("h1", { style: { color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px", letterSpacing: "-0.5px" }, children: mode === "login" ? "Bienvenue" : mode === "register" ? "Créer un compte" : "Mot de passe oublié" }),
      /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }, children: mode === "login" ? "Connecte-toi à Otarcy" : mode === "register" ? "Rejoins Otarcy" : "On t'envoie un email" })
    ] }),
    mode !== "forgot" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => handleOAuth("google"), disabled: loading, style: oauthBtn, children: [
        /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" }),
          /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
        ] }),
        "Continuer avec Google"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => handleOAuth("github"), disabled: loading, style: oauthBtn, children: [
        /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" }) }),
        "Continuer avec GitHub"
      ] })
    ] }),
    mode !== "forgot" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" } }),
      /* @__PURE__ */ jsx("span", { style: { color: "rgba(255,255,255,0.3)", fontSize: "12px" }, children: "ou" }),
      /* @__PURE__ */ jsx("div", { style: { flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" } })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px" }, children: [
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Email" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "toi@exemple.com",
          style: inputStyle,
          onKeyDown: (e) => e.key === "Enter" && handleEmail()
        }
      )
    ] }),
    mode !== "forgot" && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Mot de passe" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          placeholder: "••••••••",
          style: inputStyle,
          onKeyDown: (e) => e.key === "Enter" && handleEmail()
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx("div", { style: {
      padding: "12px 14px",
      borderRadius: "10px",
      marginBottom: "16px",
      fontSize: "13px",
      background: message.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
      border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
      color: message.type === "error" ? "#f87171" : "#4ade80"
    }, children: message.text }),
    /* @__PURE__ */ jsx("button", { onClick: handleEmail, disabled: loading, style: {
      width: "100%",
      padding: "13px",
      background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "15px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      marginBottom: "12px",
      transition: "opacity 0.2s"
    }, children: loading ? "Chargement..." : mode === "login" ? "Se connecter" : mode === "register" ? "Créer le compte" : "Envoyer le lien" }),
    mode === "login" && /* @__PURE__ */ jsx("button", { onClick: handleMagicLink, disabled: loading, style: {
      width: "100%",
      padding: "12px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      color: "rgba(255,255,255,0.6)",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "20px",
      transition: "border-color 0.2s"
    }, children: "✉️ Connexion par magic link" }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)" }, children: [
      mode === "login" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setMode("forgot");
          setMessage(null);
        }, style: linkBtn, children: "Mot de passe oublié ?" }),
        /* @__PURE__ */ jsx("span", { style: { margin: "0 8px" }, children: "·" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setMode("register");
          setMessage(null);
        }, style: linkBtn, children: "Créer un compte" })
      ] }),
      mode === "register" && /* @__PURE__ */ jsx("button", { onClick: () => {
        setMode("login");
        setMessage(null);
      }, style: linkBtn, children: "Déjà un compte ? Se connecter" }),
      mode === "forgot" && /* @__PURE__ */ jsx("button", { onClick: () => {
        setMode("login");
        setMessage(null);
      }, style: linkBtn, children: "← Retour à la connexion" })
    ] })
  ] }) });
}
const oauthBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  width: "100%",
  padding: "12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.85)",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background 0.2s, border-color 0.2s"
};
const labelStyle = {
  display: "block",
  color: "rgba(255,255,255,0.5)",
  fontSize: "13px",
  marginBottom: "6px",
  fontWeight: "500"
};
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};
const linkBtn = {
  background: "none",
  border: "none",
  color: "rgba(139,92,246,0.9)",
  fontSize: "13px",
  cursor: "pointer",
  padding: 0
};
function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    });
    return () => subscription.unsubscribe();
  }, []);
  const handleReset = async () => {
    if (password !== confirm) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: "error", text: "Le mot de passe doit faire au moins 8 caractères." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Mot de passe mis à jour ! Redirection..." });
      setTimeout(() => navigate("/"), 2e3);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    padding: "24px"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 0,
      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      maxWidth: "420px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "40px 36px",
      backdropFilter: "blur(20px)"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "32px" }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          borderRadius: "12px",
          marginBottom: "16px",
          fontSize: "20px",
          fontWeight: "800",
          color: "#fff"
        }, children: "OT" }),
        /* @__PURE__ */ jsx("h1", { style: { color: "#fff", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }, children: "Nouveau mot de passe" }),
        /* @__PURE__ */ jsx("p", { style: { color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }, children: "Choisis un mot de passe sécurisé" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "12px" }, children: [
        /* @__PURE__ */ jsx("label", { style: { display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "6px" }, children: "Nouveau mot de passe" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "••••••••",
            style: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsx("label", { style: { display: "block", color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "6px" }, children: "Confirmer" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: confirm,
            onChange: (e) => setConfirm(e.target.value),
            placeholder: "••••••••",
            style: { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" }
          }
        )
      ] }),
      message && /* @__PURE__ */ jsx("div", { style: {
        padding: "12px 14px",
        borderRadius: "10px",
        marginBottom: "16px",
        fontSize: "13px",
        background: message.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
        border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
        color: message.type === "error" ? "#f87171" : "#4ade80"
      }, children: message.text }),
      /* @__PURE__ */ jsx("button", { onClick: handleReset, disabled: loading, style: {
        width: "100%",
        padding: "13px",
        background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontSize: "15px",
        fontWeight: "600",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1
      }, children: loading ? "Mise à jour..." : "Mettre à jour le mot de passe" })
    ] })
  ] });
}
function useReveal$7() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const TERMES = [
  {
    lettre: "A",
    items: [
      { terme: "AIO (AI Optimization)", definition: "Discipline qui consiste à optimiser la visibilité d'une marque, d'une entreprise ou d'un contenu dans les réponses générées par les intelligences artificielles conversationnelles. L'AIO est à ChatGPT ce que le SEO est à Google." },
      { terme: "AI Optimization", definition: "Terme anglais désignant l'AIO. Processus d'optimisation des signaux numériques d'une marque pour être mieux compris, mémorisé et cité par les modèles de langage (LLM)." },
      { terme: "Audit AIO", definition: "Analyse complète de la visibilité d'une marque auprès des intelligences artificielles. Un audit AIO produit un score, une analyse des forces et faiblesses, et un plan d'action priorisé." },
      { terme: "Autorité thématique", definition: "Niveau de confiance qu'un LLM accorde à une source sur un sujet donné. Plus une marque publie du contenu de référence sur un sujet, plus son autorité thématique sur ce sujet est forte aux yeux des IAs." }
    ]
  },
  {
    lettre: "C",
    items: [
      { terme: "Citation IA", definition: "Fait pour une IA de mentionner ou recommander une marque dans sa réponse à une requête utilisateur. Les citations IA sont l'équivalent des clics organiques Google dans l'écosystème AIO." },
      { terme: "Cohérence des signaux", definition: "Alignement entre les informations publiées sur une marque à travers ses différentes sources (site web, LinkedIn, presse, annuaires). Un LLM construit sa représentation d'une marque en croisant ces sources — l'incohérence crée du flou." },
      { terme: "Contenu crawlable", definition: "Contenu textuel accessible directement dans le HTML d'une page, sans nécessiter l'exécution de JavaScript. Les LLMs crawlent les pages en mode statique — un contenu rendu uniquement par JS peut ne pas être indexé." }
    ]
  },
  {
    lettre: "E",
    items: [
      { terme: "Entité nommée", definition: "Concept, personne, organisation ou lieu identifié de façon non ambiguë par un LLM. Otarcy est une entité nommée. Plus une entité est cohérente et présente dans de nombreuses sources, plus elle est solide dans le modèle." },
      { terme: "E-E-A-T", definition: "Experience, Expertise, Authoritativeness, Trustworthiness. Signaux de qualité initialement définis par Google, désormais utilisés par les LLMs pour évaluer la fiabilité d'une source. Fondamental pour l'AIO." }
    ]
  },
  {
    lettre: "G",
    items: [
      { terme: "Génération augmentée par récupération (RAG)", definition: "Technique par laquelle un LLM récupère des informations externes en temps réel avant de générer sa réponse. Perplexity et ChatGPT avec recherche web utilisent le RAG — votre contenu doit être optimisé pour être sélectionné." },
      { terme: "Gaps de contenu", definition: "Sujets ou questions liés à votre marque ou secteur pour lesquels vous ne produisez pas de contenu. Un gap de contenu = une opportunité de citation IA manquée." }
    ]
  },
  {
    lettre: "L",
    items: [
      { terme: "LLM (Large Language Model)", definition: "Modèle de langage de grande taille entraîné sur d'immenses corpus de textes. ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google) et Llama (Meta) sont des LLMs. Ils constituent le moteur des IAs conversationnelles." },
      { terme: "LLM Visibility", definition: "Mesure de la présence et de la qualité de représentation d'une marque dans les réponses des LLMs. L'AIO vise à maximiser la LLM Visibility." }
    ]
  },
  {
    lettre: "P",
    items: [
      { terme: "Perplexity", definition: "Moteur de recherche basé sur l'IA qui génère des réponses avec citations directes de sources web. Avec 15M+ d'utilisateurs actifs en 2025, Perplexity est un canal d'acquisition critique pour les marques optimisées AIO." },
      { terme: "Phrase de positionnement AIO-ready", definition: "Phrase courte et précise décrivant une marque en une seule affirmation vérifiable. Format recommandé : « [Marque] est [catégorie] qui aide [client] à [résultat] grâce à [différenciateur], basé(e) à [lieu]. » Cette phrase doit être identique sur toutes les sources." },
      { terme: "PME (Petite et Moyenne Entreprise)", definition: "Entreprise de 5 à 250 employés. Cible principale d'Otarcy. Les PME sont les premières victimes de l'invisibilité IA — elles n'ont ni les ressources des grands groupes ni la notoriété naturelle des startups médiatisées." }
    ]
  },
  {
    lettre: "R",
    items: [
      { terme: "Référencement IA", definition: "Terme français désignant l'AIO. Ensemble des pratiques visant à améliorer la position et la fréquence de citation d'une marque dans les réponses des intelligences artificielles." },
      { terme: "RAG (voir Génération augmentée par récupération)", definition: "Voir Génération augmentée par récupération." }
    ]
  },
  {
    lettre: "S",
    items: [
      { terme: "Schema.org", definition: "Vocabulaire de balisage structuré (JSON-LD) permettant de communiquer explicitement aux moteurs de recherche et aux LLMs la nature d'une entité. Un balisage Schema.org Organization indique à une IA : voici qui est cette entreprise, ce qu'elle fait, où elle est basée." },
      { terme: "Score AIO", definition: "Indicateur chiffré (sur 10 chez Otarcy) mesurant la visibilité et la qualité de représentation d'une marque auprès des IAs. Calculé en analysant la clarté de positionnement, la cohérence des sources, la densité de contenu et la présence multi-plateformes." },
      { terme: "SEO (Search Engine Optimization)", definition: "Discipline d'optimisation pour les moteurs de recherche traditionnels, principalement Google. Le SEO optimise pour les algorithmes de classement de liens — l'AIO optimise pour la compréhension sémantique des LLMs. Les deux sont complémentaires." },
      { terme: "SWOT AIO", definition: "Analyse Strengths / Weaknesses / Opportunities / Threats appliquée à la visibilité IA d'une marque. Otarcy génère automatiquement un SWOT AIO à partir de l'audit de marque." }
    ]
  },
  {
    lettre: "V",
    items: [
      { terme: "Visibilité IA", definition: "Capacité d'une marque à apparaître dans les réponses générées par les intelligences artificielles lorsqu'un utilisateur pose une question liée à son secteur, ses produits ou ses services." },
      { terme: "Vectorisation", definition: "Processus par lequel un LLM transforme un texte en représentation numérique (vecteur) pour le stocker dans sa mémoire. Un contenu bien structuré, avec des entités claires et des affirmations précises, se vectorise mieux et est plus facilement récupéré." }
    ]
  }
];
function Glossaire() {
  const [recherche, setRecherche] = useState("");
  const [lettreActive, setLettreActive] = useState(null);
  useReveal$7();
  const lettres = TERMES.map((g) => g.lettre);
  const termesFiltres = recherche ? TERMES.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) => item.terme.toLowerCase().includes(recherche.toLowerCase()) || item.definition.toLowerCase().includes(recherche.toLowerCase())
    )
  })).filter((g) => g.items.length > 0) : lettreActive ? TERMES.filter((g) => g.lettre === lettreActive) : TERMES;
  const totalTermes = TERMES.reduce((acc, g) => acc + g.items.length, 0);
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a0a", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "@id": "https://blackotarcyweb.vercel.app/glossaire#termset",
            "name": "Glossaire AIO — Otarcy",
            "description": "Glossaire complet des termes de l'AI Optimization (AIO) par Otarcy, la référence française du référencement IA pour les PME.",
            "url": "https://blackotarcyweb.vercel.app/glossaire",
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Otarcy",
              "url": "https://blackotarcyweb.vercel.app"
            },
            "hasDefinedTerm": TERMES.flatMap(
              (g) => g.items.map((item) => ({
                "@type": "DefinedTerm",
                "name": item.terme,
                "description": item.definition,
                "inDefinedTermSet": "https://blackotarcyweb.vercel.app/glossaire#termset"
              }))
            )
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("nav", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 36px",
      background: "rgba(10,10,10,0.95)",
      borderBottom: "1px solid #1a1a1a",
      backdropFilter: "blur(12px)"
    }, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }, children: "OT" }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }, children: "CY" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "24px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: "← ACCUEIL"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/faq",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: "FAQ"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { paddingTop: "140px", paddingBottom: "60px", padding: "140px 60px 60px", borderBottom: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: "Ressource — Glossaire" }),
      /* @__PURE__ */ jsx("h1", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, marginBottom: "24px" }, children: "GLOSSAIRE AIO" }),
      /* @__PURE__ */ jsxs("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px", marginBottom: "0" }, children: [
        totalTermes,
        " termes essentiels pour comprendre l'AI Optimization et optimiser la visibilité de votre marque auprès de ChatGPT, Claude, Gemini et Perplexity."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { padding: "40px 60px", borderBottom: "1px solid #1a1a1a", background: "#0f0f0f" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", border: "1px solid #2a2a2a", marginBottom: "24px", background: "#111" }, children: [
        /* @__PURE__ */ jsx("span", { style: { padding: "12px 16px", color: "#4a4a4a", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem" }, children: "⌕" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Rechercher un terme...",
            value: recherche,
            onChange: (e) => {
              setRecherche(e.target.value);
              setLettreActive(null);
            },
            style: {
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "12px 0",
              color: "#f0f0f0",
              fontSize: "0.76rem",
              fontFamily: "'Raleway', sans-serif",
              caretColor: "#a3e635"
            }
          }
        ),
        recherche && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setRecherche(""),
            style: { padding: "12px 16px", background: "transparent", border: "none", color: "#4a4a4a", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem" },
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setLettreActive(null);
              setRecherche("");
            },
            style: {
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              padding: "4px 12px",
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.2s",
              background: !lettreActive && !recherche ? "#a3e635" : "transparent",
              borderColor: !lettreActive && !recherche ? "#a3e635" : "#3a3a3a",
              color: !lettreActive && !recherche ? "#0a0a0a" : "#7a7a7a"
            },
            children: "TOUS"
          }
        ),
        lettres.map((l) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setLettreActive(l === lettreActive ? null : l);
              setRecherche("");
            },
            style: {
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              padding: "2px 10px",
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.2s",
              background: lettreActive === l ? "#a3e635" : "transparent",
              borderColor: lettreActive === l ? "#a3e635" : "#3a3a3a",
              color: lettreActive === l ? "#0a0a0a" : "#7a7a7a"
            },
            children: l
          },
          l
        ))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { padding: "60px 60px 100px" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      termesFiltres.length === 0 ? /* @__PURE__ */ jsx("div", { style: { textAlign: "center", padding: "80px 0" }, children: /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#4a4a4a" }, children: [
        "Aucun terme trouvé pour « ",
        recherche,
        " »"
      ] }) }) : termesFiltres.map((groupe) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginBottom: "48px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#a3e635", lineHeight: 1 }, children: groupe.lettre }),
          /* @__PURE__ */ jsx("div", { style: { flex: 1, height: "1px", background: "linear-gradient(90deg, #2a2a2a 0%, transparent 100%)" } })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }, children: groupe.items.map((item, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: { background: "#0f0f0f", padding: "20px 24px" },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "#111";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "#0f0f0f";
            },
            children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#f0f0f0", fontWeight: 600, marginBottom: "8px", letterSpacing: "0.02em" }, children: item.terme }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.76rem", color: "#7a7a7a", lineHeight: 1.8, fontWeight: 300 }, children: item.definition })
            ]
          },
          i
        )) })
      ] }, groupe.lettre)),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "60px", padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }, children: "TESTEZ VOTRE SCORE AIO" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }, children: "Découvrez comment ChatGPT, Claude et Gemini perçoivent votre marque." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/#audit",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "Auditer ma marque →"
          }
        )
      ] })
    ] }) })
  ] });
}
function useReveal$6() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const FAQ = [
  {
    categorie: "Comprendre l'AIO",
    couleur: "#a3e635",
    questions: [
      {
        q: "Qu'est-ce que l'AIO (AI Optimization) ?",
        r: "L'AIO, ou AI Optimization, est la discipline qui consiste à rendre une marque, une entreprise ou un contenu visible dans les réponses générées par les intelligences artificielles conversationnelles comme ChatGPT, Claude, Gemini ou Perplexity. Contrairement au SEO traditionnel centré sur Google, l'AIO optimise la façon dont les IA perçoivent, comprennent et citent une marque."
      },
      {
        q: "Quelle est la différence entre AIO et SEO ?",
        r: "Le SEO optimise pour les algorithmes de classement de Google — il vise à faire remonter des liens dans les résultats de recherche. L'AIO optimise pour la compréhension sémantique des LLMs — il vise à faire apparaître une marque dans les réponses générées par les IA. Les deux sont complémentaires : un bon SEO améliore la visibilité web générale, un bon AIO améliore la visibilité dans les réponses IA. Mais les techniques sont différentes : l'AIO privilégie la clarté des entités, la cohérence entre sources et le contenu structuré en Q&A."
      },
      {
        q: "Pourquoi les IA citent-elles certaines marques et pas d'autres ?",
        r: "Les LLMs construisent leur représentation du monde à partir des textes sur lesquels ils ont été entraînés. Ils citent les marques qui sont décrites de façon claire, cohérente et répétée dans de nombreuses sources. Si votre marque est décrite différemment sur votre site, votre LinkedIn et dans la presse, les LLMs peinent à construire une représentation fiable — et préfèrent citer des marques dont l'identité est sans ambiguïté."
      },
      {
        q: "L'AIO est-il réservé aux grandes entreprises ?",
        r: "Non — c'est même l'inverse. Les grandes entreprises ont une notoriété naturelle qui les fait déjà apparaître dans les LLMs. Les PME, elles, doivent construire activement leur présence IA. L'AIO est la discipline qui permet aux petites et moyennes entreprises de rivaliser sur ce terrain en optimisant des signaux accessibles : cohérence du positionnement, structure du contenu, présence multi-sources."
      }
    ]
  },
  {
    categorie: "Otarcy & son fonctionnement",
    couleur: "#60a5fa",
    questions: [
      {
        q: "Qu'est-ce qu'Otarcy exactement ?",
        r: "Otarcy est le premier outil SaaS français d'AI Optimization (AIO) pour les PME. Il permet à n'importe quelle entreprise d'analyser sa visibilité auprès des intelligences artificielles, d'obtenir un score AIO sur 10, et de recevoir un plan d'action personnalisé pour améliorer sa présence dans les réponses de ChatGPT, Claude, Gemini et Perplexity."
      },
      {
        q: "Comment fonctionne l'audit Otarcy concrètement ?",
        r: "L'utilisateur saisit le nom de sa marque. Otarcy interroge le modèle Groq (llama-3.3-70b) pour analyser en temps réel comment les LLMs perçoivent cette marque. L'audit génère un score AIO sur 10, une analyse des forces et faiblesses, des recommandations priorisées, et pour les plans Pro et Agence : une analyse SWOT complète, des KPIs de marque, des templates LinkedIn et un plan de contenu."
      },
      {
        q: "Combien d'audits puis-je faire gratuitement ?",
        r: "Le plan Découverte (gratuit, sans carte bancaire) offre 3 audits. Les plans AIO Essentiel (19€/mois) et AIO Expert (99€/mois) donnent accès à des audits illimités et à des fonctionnalités avancées comme le SWOT, les KPIs, l'export PDF et les templates LinkedIn."
      },
      {
        q: "Les résultats d'Otarcy sont-ils fiables ?",
        r: "Otarcy utilise un LLM de pointe (llama-3.3-70b via Groq) pour simuler la façon dont les IAs perçoivent une marque. Les résultats reflètent l'état actuel de la représentation de votre marque dans les modèles de langage. Comme tout outil basé sur l'IA, les analyses sont des indicateurs fiables — pas des certitudes absolues. Nous recommandons de combiner l'audit Otarcy avec des tests manuels dans ChatGPT et Perplexity."
      }
    ]
  },
  {
    categorie: "Stratégie & mise en œuvre",
    couleur: "#f97316",
    questions: [
      {
        q: "Par où commencer pour optimiser ma marque pour les IA ?",
        r: "La première étape est de tester comment les IA vous perçoivent aujourd'hui : demandez à ChatGPT et Perplexity « qui est [nom de votre marque] ? » et notez les résultats. Ensuite, les 3 actions prioritaires sont : (1) définir une phrase de positionnement claire et la répliquer sur toutes vos sources, (2) ajouter un balisage Schema.org sur votre site, (3) créer une page FAQ structurée. Un audit Otarcy vous donnera un plan d'action personnalisé en quelques secondes."
      },
      {
        q: "Combien de temps faut-il pour voir des résultats AIO ?",
        r: "Les LLMs intègrent les nouvelles informations lors de leurs phases d'entraînement, qui ont lieu tous les quelques mois. Pour les IAs avec recherche web en temps réel (Perplexity, ChatGPT avec recherche), les améliorations peuvent être visibles en quelques semaines. Pour les modèles sans accès web, les changements sont visibles sur les modèles mis à jour, généralement dans un délai de 3 à 6 mois. C'est pourquoi l'AIO est un investissement long terme — commencer tôt donne un avantage durable."
      },
      {
        q: "Le contenu de mon site suffit-il pour être visible dans les IA ?",
        r: "Non. La visibilité IA repose sur la triangulation de plusieurs sources. Un LLM compare ce que dit votre site avec ce que disent votre LinkedIn, les mentions presse, les annuaires, les avis clients. Si ces sources sont cohérentes, votre marque est représentée clairement. Si elles divergent, le LLM produit une représentation floue — ou vous ignore. Il faut donc une stratégie multi-sources, pas seulement un site bien écrit."
      },
      {
        q: "Faut-il avoir un blog pour faire de l'AIO ?",
        r: "Un blog aide, mais ce n'est pas indispensable. Ce qui compte le plus pour l'AIO, c'est la qualité et la cohérence du contenu existant, pas la quantité. Une page À propos bien structurée en Q&A, une page FAQ, un balisage Schema.org et une bio LinkedIn alignée ont plus d'impact qu'un blog de 50 articles mal optimisés. Cela dit, produire du contenu de référence (glossaires, études de cas, données originales) renforce progressivement l'autorité thématique de votre marque."
      }
    ]
  },
  {
    categorie: "Abonnement & données",
    couleur: "#7a7a7a",
    questions: [
      {
        q: "Mes données sont-elles sécurisées ?",
        r: "Otarcy utilise Supabase pour l'authentification et le stockage des données, avec Row Level Security (RLS) activé — chaque utilisateur n'accède qu'à ses propres données. Les paiements sont gérés par Stripe, qui est certifié PCI-DSS. Vos données ne sont jamais revendues ni utilisées pour entraîner des modèles d'IA tiers."
      },
      {
        q: "Puis-je annuler mon abonnement à tout moment ?",
        r: "Oui. Les abonnements Otarcy sont mensuels et sans engagement. Vous pouvez annuler à tout moment depuis votre tableau de bord. Après annulation, vous conservez l'accès aux fonctionnalités de votre plan jusqu'à la fin de la période payée."
      },
      {
        q: "Otarcy propose-t-il des tarifs pour les agences ?",
        r: "Le plan AIO Expert (99€/mois) est conçu pour les agences et consultants marketing. Il inclut des audits illimités, la stratégie marketing IA complète et les Quick Wins. Pour des besoins spécifiques ou des volumes importants, contactez-nous directement via LinkedIn."
      }
    ]
  }
];
function Faq() {
  const [ouvert, setOuvert] = useState(null);
  useReveal$6();
  const totalQuestions = FAQ.reduce((acc, cat) => acc + cat.questions.length, 0);
  const toggle = (key) => setOuvert(ouvert === key ? null : key);
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a0a", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://blackotarcyweb.vercel.app/faq",
            "name": "FAQ AIO — Otarcy",
            "description": "Questions fréquentes sur l'AI Optimization (AIO), Otarcy et la visibilité des marques dans les IAs.",
            "url": "https://blackotarcyweb.vercel.app/faq",
            "inLanguage": "fr",
            "publisher": {
              "@type": "Organization",
              "name": "Otarcy",
              "url": "https://blackotarcyweb.vercel.app"
            },
            "mainEntity": FAQ.flatMap(
              (cat) => cat.questions.map((item) => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.r
                }
              }))
            )
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("nav", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 36px",
      background: "rgba(10,10,10,0.95)",
      borderBottom: "1px solid #1a1a1a",
      backdropFilter: "blur(12px)"
    }, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", style: { display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }, children: "OT" }),
        /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }, children: "CY" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "24px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: "← ACCUEIL"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/glossaire",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" },
            onMouseEnter: (e) => e.currentTarget.style.color = "#f0f0f0",
            onMouseLeave: (e) => e.currentTarget.style.color = "#7a7a7a",
            children: "GLOSSAIRE"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { paddingTop: "140px", padding: "140px 60px 60px", borderBottom: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: "Ressource — FAQ" }),
      /* @__PURE__ */ jsx("h1", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, marginBottom: "24px" }, children: "QUESTIONS FRÉQUENTES" }),
      /* @__PURE__ */ jsxs("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px" }, children: [
        totalQuestions,
        " questions sur l'AI Optimization, le fonctionnement d'Otarcy et la stratégie AIO pour les PME françaises."
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { style: { padding: "60px 60px 100px" }, children: /* @__PURE__ */ jsxs("div", { style: { maxWidth: "860px", margin: "0 auto" }, children: [
      FAQ.map((categorie, ci) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginBottom: "56px" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx("div", { style: { width: "3px", height: "24px", background: categorie.couleur, flexShrink: 0 } }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: categorie.couleur, textTransform: "uppercase", fontWeight: 500 }, children: categorie.categorie })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }, children: categorie.questions.map((item, qi) => {
          const key = `${ci}-${qi}`;
          const isOpen = ouvert === key;
          return /* @__PURE__ */ jsxs("div", { style: { background: "#0f0f0f" }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggle(key),
                style: {
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.parentElement.style.background = "#111";
                },
                onMouseLeave: (e) => {
                  if (!isOpen) e.currentTarget.parentElement.style.background = "#0f0f0f";
                },
                children: [
                  /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: isOpen ? "#f0f0f0" : "#d4d4d4", fontWeight: isOpen ? 600 : 400, lineHeight: 1.5, margin: 0, flex: 1 }, children: item.q }),
                  /* @__PURE__ */ jsx("span", { style: { color: isOpen ? "#a3e635" : "#4a4a4a", fontSize: "1rem", flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", marginTop: "2px" }, children: "+" })
                ]
              }
            ),
            isOpen && /* @__PURE__ */ jsx("div", { style: { padding: "0 24px 24px", borderTop: "1px solid #1a1a1a" }, children: /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, margin: "16px 0 0 0" }, children: item.r }) })
          ] }, qi);
        }) })
      ] }, ci)),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }, children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/glossaire",
            style: { textDecoration: "none", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", display: "block", transition: "border-color 0.2s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#a3e635";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
            },
            children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#a3e635", marginBottom: "8px" }, children: "GLOSSAIRE AIO →" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6 }, children: "Tous les termes essentiels de l'AI Optimization définis clairement." })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/pricing",
            style: { textDecoration: "none", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", display: "block", transition: "border-color 0.2s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#60a5fa";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
            },
            children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#60a5fa", marginBottom: "8px" }, children: "TARIFS →" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6 }, children: "Comparez les plans Découverte, AIO Essentiel et AIO Expert." })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }, children: "PRÊT POUR L'AUDIT AIO ?" }),
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }, children: "3 audits gratuits — sans carte bancaire." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/#audit",
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "Auditer ma marque →"
          }
        )
      ] })
    ] }) })
  ] });
}
const schemaJsonLd$5 = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi les coachs et formateurs sont-ils invisibles auprès des IAs comme ChatGPT ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les coachs et formateurs publient beaucoup sur les réseaux sociaux mais structurent rarement leur contenu pour les moteurs d'IA. ChatGPT, Perplexity et Claude cherchent des entités claires, des données structurées et des preuves d'autorité thématique. Sans ces signaux, même un expert reconnu reste invisible dans les réponses des IAs."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un coach ou un formateur ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour le coaching consiste à structurer sa marque personnelle, ses offres et son contenu pour être reconnu et cité par les intelligences artificielles génératives. Cela inclut la structuration des données Schema.org, la création de contenu en Q&A explicite, et l'optimisation de la présence sur les plateformes que les IAs crawlent."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO les plus importants pour un professionnel du coaching ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un coach ou formateur sont : une page À propos structurée en Q&A avec entités nommées, des témoignages clients avec résultats chiffrés, un Schema.org Person ou Organization bien renseigné, une présence cohérente sur LinkedIn avec publications régulières et structurées, et un site web avec contenu long-form optimisé pour les questions que posent les clients aux IAs."
          }
        },
        {
          "@type": "Question",
          name: "En combien de temps un coach peut-il améliorer son score AIO ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Avec les bons ajustements, un professionnel du coaching peut voir une amélioration mesurable de son score AIO en 4 à 8 semaines. Les quick wins comme la structuration de la page À propos, l'ajout de Schema.org et la restructuration des posts LinkedIn produisent des résultats en moins de 2 semaines."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Coachs et Formateurs — Otarcy",
      description: "Guide complet d'AI Optimization pour les coachs, formateurs et consultants. Devenez visible auprès de ChatGPT, Perplexity et Claude.",
      url: "https://blackotarcyweb.vercel.app/aio-coaching",
      publisher: {
        "@type": "Organization",
        name: "Otarcy",
        url: "https://blackotarcyweb.vercel.app"
      }
    }
  ]
};
function useReveal$5() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals$5 = [
  {
    icon: "⚡",
    color: "#f97316",
    titre: "Contenu abondant, structure absente",
    description: "Les coachs publient quotidiennement mais leur contenu est optimisé pour l'algorithme Instagram ou LinkedIn — pas pour les IAs. Résultat : zéro citation dans ChatGPT malgré des années d'expertise."
  },
  {
    icon: "🔍",
    color: "#60a5fa",
    titre: "Marque personnelle non balisée",
    description: "ChatGPT cherche des entités claires : nom, spécialité, résultats mesurables, zone géographique. Sans ces balises structurées, votre expertise reste invisible pour les moteurs d'IA."
  },
  {
    icon: "🏆",
    color: "#ef4444",
    titre: "Concurrence des grandes plateformes",
    description: "Udemy, Malt, LinkedIn Learning — ces plateformes sont massivement citées par les IAs. Un coach indépendant sans stratégie AIO perd systématiquement face à elles."
  }
];
const quickWins$5 = [
  {
    numero: "01",
    titre: "Restructurer votre page À propos en Q&A",
    detail: "Remplacez le storytelling classique par des questions/réponses explicites : Qui êtes-vous ? Quelle est votre spécialité ? Quels résultats avez-vous produits ? Les IAs adorent le format Q&A structuré.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Ajouter Schema.org Person sur votre site",
    detail: "Intégrez un JSON-LD avec votre nom, spécialité, ville, liens LinkedIn et résultats clients. Ce balisage est directement consommé par ChatGPT, Perplexity et Claude pour identifier votre autorité.",
    duree: "1h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Créer une page Résultats clients structurée",
    detail: "Pas de témoignages génériques — des études de cas avec contexte, transformation et résultats chiffrés. Format : Avant / Après / Durée / Méthode. Les IAs citent les preuves concrètes.",
    duree: "3h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Optimiser vos posts LinkedIn pour l'AIO",
    detail: "Intégrez vos entités clés dans chaque post : votre nom complet, votre spécialité, votre méthode propriétaire. Les IAs crawlent LinkedIn — un post bien structuré renforce votre autorité thématique.",
    duree: "30min/post",
    impact: "Moyen",
    impactColor: "#f97316"
  },
  {
    numero: "05",
    titre: "Créer une FAQ dédiée à votre méthode",
    detail: "Une page FAQ avec Schema.org FAQPage répond exactement aux questions que vos futurs clients posent à ChatGPT. C'est le raccourci le plus direct pour apparaître dans les réponses des IAs.",
    duree: "2h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  }
];
const faqItems$5 = [
  {
    question: "Pourquoi les coachs sont-ils invisibles auprès des IAs ?",
    reponse: "Les coachs et formateurs publient beaucoup sur les réseaux sociaux mais structurent rarement leur contenu pour les moteurs d'IA. ChatGPT, Perplexity et Claude cherchent des entités claires, des données structurées et des preuves d'autorité thématique. Sans ces signaux, même un expert reconnu reste invisible dans les réponses des IAs."
  },
  {
    question: "Qu'est-ce que l'AIO pour un coach ou formateur ?",
    reponse: "L'AI Optimization (AIO) pour le coaching consiste à structurer sa marque personnelle, ses offres et son contenu pour être reconnu et cité par les intelligences artificielles génératives. Cela inclut la structuration des données (Schema.org), la création de contenu en Q&A explicite, et l'optimisation de la présence sur les plateformes que les IAs crawlent."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un coach ?",
    reponse: "Les signaux AIO prioritaires : une page À propos structurée en Q&A avec entités nommées, des témoignages clients avec résultats chiffrés, un Schema.org Person ou Organization bien renseigné, une présence cohérente sur LinkedIn avec publications régulières et structurées, et un site web avec contenu long-form optimisé pour les questions que posent vos clients aux IAs."
  },
  {
    question: "En combien de temps peut-on améliorer son score AIO ?",
    reponse: "Avec les bons ajustements, un professionnel du coaching peut voir une amélioration mesurable de son score AIO en 4 à 8 semaines. Les quick wins — structuration de la page À propos, ajout de Schema.org, restructuration des posts LinkedIn — produisent des résultats en moins de 2 semaines."
  }
];
const auditExemple$5 = {
  marque: "Marie Coaching — Coach en leadership",
  score: 3.2,
  lacunes: [
    "Aucun Schema.org Person sur le site",
    "Page À propos en storytelling non structuré",
    "Témoignages clients sans résultats chiffrés",
    "Posts LinkedIn sans entités nommées récurrentes"
  ],
  apresOptimisation: 7.1,
  actionsRealisees: [
    "Ajout Schema.org Person + Organization",
    "Refonte page À propos en Q&A (5 questions)",
    "3 études de cas Avant/Après avec métriques",
    "Template LinkedIn avec entités systématiques"
  ]
};
const autresSecteurs$5 = [
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
function FaqAccordion$5({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" },
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpenIndex(isOpen ? null : i),
              style: {
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                gap: "16px"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.82rem",
                      color: "#f0f0f0",
                      fontWeight: 500,
                      lineHeight: 1.5
                    },
                    children: item.question
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.2rem",
                      color: isOpen ? "#a3e635" : "#4a4a4a",
                      flexShrink: 0,
                      transition: "color 0.2s"
                    },
                    children: isOpen ? "−" : "+"
                  }
                )
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.78rem",
                color: "#d4d4d4",
                lineHeight: 1.7,
                fontWeight: 300,
                marginTop: "12px",
                paddingRight: "24px"
              },
              children: item.reponse
            }
          )
        ]
      },
      i
    );
  }) });
}
function AioCoaching() {
  useReveal$5();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "#f0f0f0",
        fontFamily: "'Raleway', sans-serif"
      },
      children: [
        /* @__PURE__ */ jsx(
          "script",
          {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd$5) }
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "24px",
                fontWeight: 500
              },
              children: "Secteur — Coaching & Formation"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h1",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                color: "#f0f0f0",
                marginBottom: "32px"
              },
              children: [
                "AIO pour les Coachs",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "& Formateurs" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontSize: "0.88rem",
                color: "#d4d4d4",
                lineHeight: 1.9,
                fontWeight: 300,
                maxWidth: "600px",
                marginBottom: "40px"
              },
              children: "Vous publiez chaque jour. Vous avez des clients satisfaits. Pourtant, quand un prospect demande à ChatGPT ou Perplexity de lui recommander un coach, votre nom n'apparaît pas. Ce guide explique pourquoi — et comment changer ça avec l'AI Optimization."
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  background: "#a3e635",
                  color: "#0f0f0f",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                },
                onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                children: "Auditer ma marque →"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  border: "1px solid #3a3a3a",
                  background: "transparent",
                  color: "#7a7a7a",
                  cursor: "pointer",
                  transition: "border-color 0.3s, color 0.3s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.color = "#e8e8e8";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = "#3a3a3a";
                  e.currentTarget.style.color = "#7a7a7a";
                },
                children: "Glossaire AIO"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "section",
          {
            style: {
              padding: "60px",
              maxWidth: "860px",
              margin: "0 auto",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a"
            },
            children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
              { chiffre: "94%", label: "des coachs absents des réponses IA en 2024" },
              { chiffre: "3×", label: "plus de leads pour une marque AIO-optimisée" },
              { chiffre: "6 sem.", label: "pour voir des résultats avec les bons ajustements" }
            ].map((stat, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "reveal",
                style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
                children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "3.5rem",
                        color: "#a3e635",
                        lineHeight: 1,
                        marginBottom: "8px"
                      },
                      children: stat.chiffre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
                ]
              },
              i
            )) })
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".01 — Le problème"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "48px",
                lineHeight: 1.1
              },
              children: [
                "Pourquoi les IAs ignorent",
                /* @__PURE__ */ jsx("br", {}),
                "la plupart des coachs"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals$5.map((item, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: {
                padding: "28px",
                border: "1px solid #2a2a2a",
                background: "#0f0f0f",
                borderLeft: `2px solid ${item.color}`
              },
              children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.1rem",
                        letterSpacing: "0.06em",
                        color: "#f0f0f0",
                        marginBottom: "10px"
                      },
                      children: item.titre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
                ] })
              ] })
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".02 — Exemple concret"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "Un audit réel,",
                /* @__PURE__ */ jsx("br", {}),
                "avant et après AIO"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
            /* @__PURE__ */ jsxs(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#7a7a7a",
                  textTransform: "uppercase",
                  marginBottom: "20px"
                },
                children: [
                  "Cas anonymisé — ",
                  auditExemple$5.marque
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #ef4444"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                        auditExemple$5.score,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$5.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
                    ] }, i))
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #a3e635"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                        auditExemple$5.apresOptimisation,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$5.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
                    ] }, i))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  color: "#4a4a4a",
                  fontStyle: "italic",
                  borderTop: "1px solid #2a2a2a",
                  paddingTop: "14px",
                  marginTop: "16px"
                },
                children: "💡 Résultat obtenu en 5 semaines avec les quick wins ci-dessous. Données issues d'un audit Otarcy réel, marque anonymisée."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".03 — Quick Wins"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "5 actions concrètes",
                /* @__PURE__ */ jsx("br", {}),
                "pour être cité par les IAs"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins$5.map((qw, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em",
                          color: "#a3e635"
                        },
                        children: qw.numero
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.06em",
                          color: "#f0f0f0"
                        },
                        children: qw.titre
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "#7a7a7a",
                          padding: "2px 8px",
                          border: "1px solid #2a2a2a"
                        },
                        children: qw.duree
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: qw.impactColor,
                          padding: "2px 8px",
                          border: `1px solid ${qw.impactColor}`
                        },
                        children: qw.impact
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
              ]
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".04 — Questions fréquentes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "AIO & Coaching —",
                /* @__PURE__ */ jsx("br", {}),
                "tout ce qu'il faut savoir"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: /* @__PURE__ */ jsx(FaqAccordion$5, { items: faqItems$5 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" },
              children: [
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      color: "#a3e635",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                      fontWeight: 500
                    },
                    children: "Passez à l'action"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "h2",
                  {
                    style: {
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      letterSpacing: "0.04em",
                      color: "#f0f0f0",
                      marginBottom: "16px",
                      lineHeight: 1.1
                    },
                    children: [
                      "Découvrez votre score AIO",
                      /* @__PURE__ */ jsx("br", {}),
                      "en 30 secondes"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontSize: "0.78rem",
                      color: "#7a7a7a",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      marginBottom: "32px",
                      maxWidth: "480px"
                    },
                    children: "Otarcy analyse votre marque et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude."
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        background: "#a3e635",
                        color: "#0f0f0f",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      },
                      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                      onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                      children: "Lancer mon audit gratuit →"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        border: "1px solid #3a3a3a",
                        background: "transparent",
                        color: "#7a7a7a",
                        cursor: "pointer",
                        transition: "border-color 0.3s, color 0.3s"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.borderColor = "#e8e8e8";
                        e.currentTarget.style.color = "#e8e8e8";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.borderColor = "#3a3a3a";
                        e.currentTarget.style.color = "#7a7a7a";
                      },
                      children: "Voir les offres"
                    }
                  ) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#4a4a4a",
                  textTransform: "uppercase",
                  marginBottom: "14px"
                },
                children: "Autres secteurs"
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs$5.map((s) => /* @__PURE__ */ jsx(
              Link,
              {
                to: s.to,
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#4a4a4a",
                  padding: "6px 14px",
                  border: "1px solid #2a2a2a",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#a3e635";
                  e.currentTarget.style.borderColor = "#a3e635";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "#4a4a4a";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                },
                children: s.label
              },
              s.to
            )) })
          ] })
        ] })
      ]
    }
  );
}
const schemaJsonLd$4 = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi mon e-commerce n'apparaît-il pas dans les recommandations de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les IAs comme ChatGPT et Perplexity privilégient les marques e-commerce qui ont une identité claire, des avis clients structurés, des descriptions produits riches en entités sémantiques et un Schema.org Product ou Organization bien renseigné. Un site techniquement performant mais pauvre en signaux AIO reste invisible dans les réponses des intelligences artificielles."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour un e-commerce consiste à structurer les fiches produits, les pages catégories, les avis clients et l'identité de marque pour être reconnu et cité par les IAs génératives. Quand un utilisateur demande à ChatGPT 'quelle est la meilleure marque de X ?', une boutique AIO-optimisée a une chance d'apparaître dans la réponse."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un e-commerce sont : un Schema.org Product avec prix, disponibilité et avis, une page marque structurée en Q&A, des descriptions produits avec entités sémantiques explicites (matière, origine, usage, différenciateur), des avis clients avec résultats concrets, et une présence cohérente sur les plateformes que les IAs crawlent (site, LinkedIn, presse spécialisée)."
          }
        },
        {
          "@type": "Question",
          name: "L'AIO remplace-t-il le SEO pour un e-commerce ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, l'AIO complète le SEO sans le remplacer. Le SEO optimise pour Google, l'AIO optimise pour les IAs génératives. En 2025-2026, de plus en plus d'acheteurs utilisent ChatGPT ou Perplexity pour se renseigner avant d'acheter. Un e-commerce sans stratégie AIO perd ces prospects au profit de concurrents mieux structurés."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les E-commerces — Otarcy",
      description: "Guide complet d'AI Optimization pour les boutiques e-commerce. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent vos produits.",
      url: "https://blackotarcyweb.vercel.app/aio-ecommerce",
      publisher: {
        "@type": "Organization",
        name: "Otarcy",
        url: "https://blackotarcyweb.vercel.app"
      }
    }
  ]
};
function useReveal$4() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals$4 = [
  {
    icon: "🛒",
    color: "#f97316",
    titre: "Fiches produits riches visuellement, pauvres sémantiquement",
    description: "Des photos soignées et un design pro ne suffisent pas aux IAs. ChatGPT a besoin d'entités textuelles explicites : matière, origine, usage, différenciateur. Sans ça, votre produit est inexistant dans ses réponses."
  },
  {
    icon: "⭐",
    color: "#60a5fa",
    titre: "Avis clients non structurés pour les IAs",
    description: "Vos avis sont sur Trustpilot ou Google mais rarement balisés en Schema.org Review sur votre site. Résultat : les IAs ne peuvent pas les lire et ne peuvent pas vous citer comme marque de confiance."
  },
  {
    icon: "🏷️",
    color: "#ef4444",
    titre: "Identité de marque floue pour les moteurs d'IA",
    description: "Quand un client demande à Perplexity 'quelle marque de X choisir ?', l'IA cherche une entité claire avec positionnement, valeurs et preuves. Une boutique sans page marque structurée ne sera jamais citée."
  }
];
const quickWins$4 = [
  {
    numero: "01",
    titre: "Structurer vos fiches produits avec Schema.org Product",
    detail: "Ajoutez un JSON-LD Product sur chaque fiche : nom, description, prix, disponibilité, marque, avis agrégés. C'est le signal le plus direct pour que ChatGPT cite vos produits dans ses recommandations.",
    duree: "2-4h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Créer une page Marque structurée en Q&A",
    detail: "Une page dédiée qui répond explicitement à : Qui êtes-vous ? Qu'est-ce qui vous différencie ? Pour qui ? Fabriqué où ? Avec quoi ? Les IAs utilisent ces pages pour construire leurs réponses sur votre secteur.",
    duree: "3h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Réécrire les descriptions produits avec entités sémantiques",
    detail: "Chaque description doit nommer explicitement : matière, origine géographique, usage principal, cas d'usage secondaires, différenciateur vs concurrents. Les IAs lisent le texte — donnez-leur les entités dont elles ont besoin.",
    duree: "1h/produit",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Intégrer vos avis en Schema.org Review sur votre site",
    detail: "Ne laissez pas vos avis uniquement sur des plateformes tierces. Intégrez-les sur votre site avec le balisage Schema.org Review et AggregateRating. Les IAs peuvent alors les lire et les citer comme preuves sociales.",
    duree: "2h",
    impact: "Moyen",
    impactColor: "#f97316"
  },
  {
    numero: "05",
    titre: "Créer du contenu blog orienté questions acheteurs",
    detail: "Identifiez les questions que vos clients posent à ChatGPT avant d'acheter (ex: 'quelle différence entre X et Y ?', 'comment choisir un bon Z ?'). Créez un article pour chacune. Vous devenez la source que l'IA cite.",
    duree: "3h/article",
    impact: "Très élevé",
    impactColor: "#a3e635"
  }
];
const faqItems$4 = [
  {
    question: "Pourquoi mon e-commerce n'apparaît pas dans les recommandations IA ?",
    reponse: "Les IAs comme ChatGPT et Perplexity privilégient les marques e-commerce qui ont une identité claire, des avis clients structurés, des descriptions produits riches en entités sémantiques et un Schema.org Product bien renseigné. Un site techniquement performant mais pauvre en signaux AIO reste invisible dans les réponses des intelligences artificielles."
  },
  {
    question: "Qu'est-ce que l'AIO pour un e-commerce ?",
    reponse: "L'AI Optimization pour un e-commerce consiste à structurer les fiches produits, les pages catégories, les avis clients et l'identité de marque pour être reconnu et cité par les IAs génératives. Quand un utilisateur demande à ChatGPT 'quelle est la meilleure marque de X ?', une boutique AIO-optimisée a une chance d'apparaître dans la réponse."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un e-commerce ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org Product avec prix, disponibilité et avis, une page marque structurée en Q&A, des descriptions produits avec entités sémantiques explicites (matière, origine, usage, différenciateur), des avis clients avec résultats concrets, et une présence cohérente sur les plateformes que les IAs crawlent."
  },
  {
    question: "L'AIO remplace-t-il le SEO pour un e-commerce ?",
    reponse: "Non, l'AIO complète le SEO sans le remplacer. Le SEO optimise pour Google, l'AIO optimise pour les IAs génératives. En 2025-2026, de plus en plus d'acheteurs utilisent ChatGPT ou Perplexity pour se renseigner avant d'acheter. Un e-commerce sans stratégie AIO perd ces prospects au profit de concurrents mieux structurés."
  }
];
const auditExemple$4 = {
  marque: "Atelier Lumin — Bougies artisanales françaises",
  score: 2.8,
  lacunes: [
    "Aucun Schema.org Product sur les fiches",
    "Descriptions produits sans entités sémantiques",
    "Avis Trustpilot non intégrés sur le site",
    "Aucune page marque structurée"
  ],
  apresOptimisation: 6.9,
  actionsRealisees: [
    "Schema.org Product sur les 12 fiches phares",
    "Descriptions réécrites avec entités (cire végétale française, Grasse, durée de combustion...)",
    "Schema.org Review intégré sur le site",
    "Page Marque en Q&A (6 questions / réponses)"
  ]
};
const autresSecteurs$4 = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
function FaqAccordion$4({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(isOpen ? null : i),
          style: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            gap: "16px"
          },
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.82rem",
                  color: "#f0f0f0",
                  fontWeight: 500,
                  lineHeight: 1.5
                },
                children: item.question
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  color: isOpen ? "#a3e635" : "#4a4a4a",
                  flexShrink: 0,
                  transition: "color 0.2s"
                },
                children: isOpen ? "−" : "+"
              }
            )
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.78rem",
            color: "#d4d4d4",
            lineHeight: 1.7,
            fontWeight: 300,
            marginTop: "12px",
            paddingRight: "24px"
          },
          children: item.reponse
        }
      )
    ] }, i);
  }) });
}
function AioEcommerce() {
  useReveal$4();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "#f0f0f0",
        fontFamily: "'Raleway', sans-serif"
      },
      children: [
        /* @__PURE__ */ jsx(
          "script",
          {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd$4) }
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "24px",
                fontWeight: 500
              },
              children: "Secteur — E-commerce"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h1",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                color: "#f0f0f0",
                marginBottom: "32px"
              },
              children: [
                "AIO pour les",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "E-commerces" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontSize: "0.88rem",
                color: "#d4d4d4",
                lineHeight: 1.9,
                fontWeight: 300,
                maxWidth: "600px",
                marginBottom: "40px"
              },
              children: `Vos clients ne cherchent plus seulement sur Google. Ils demandent directement à ChatGPT ou Perplexity : "quelle est la meilleure marque de X ?" Si votre boutique n'est pas structurée pour les IAs, vous n'existez pas dans leur réponse — et votre concurrent si.`
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  background: "#a3e635",
                  color: "#0f0f0f",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                },
                onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                children: "Auditer ma boutique →"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  border: "1px solid #3a3a3a",
                  background: "transparent",
                  color: "#7a7a7a",
                  cursor: "pointer",
                  transition: "border-color 0.3s, color 0.3s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.color = "#e8e8e8";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = "#3a3a3a";
                  e.currentTarget.style.color = "#7a7a7a";
                },
                children: "Glossaire AIO"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "section",
          {
            style: {
              padding: "60px",
              maxWidth: "860px",
              margin: "0 auto",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a"
            },
            children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
              { chiffre: "61%", label: "des acheteurs consultent une IA avant d'acheter en ligne" },
              { chiffre: "4×", label: "plus de chances d'être cité avec Schema.org Product actif" },
              { chiffre: "8 sem.", label: "pour doubler son score AIO avec les bons ajustements" }
            ].map((stat, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "reveal",
                style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
                children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "3.5rem",
                        color: "#a3e635",
                        lineHeight: 1,
                        marginBottom: "8px"
                      },
                      children: stat.chiffre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
                ]
              },
              i
            )) })
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".01 — Le problème"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "48px",
                lineHeight: 1.1
              },
              children: [
                "Pourquoi les IAs ignorent",
                /* @__PURE__ */ jsx("br", {}),
                "la plupart des boutiques"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals$4.map((item, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: {
                padding: "28px",
                border: "1px solid #2a2a2a",
                background: "#0f0f0f",
                borderLeft: `2px solid ${item.color}`
              },
              children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.1rem",
                        letterSpacing: "0.06em",
                        color: "#f0f0f0",
                        marginBottom: "10px"
                      },
                      children: item.titre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
                ] })
              ] })
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".02 — Exemple concret"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "Un audit réel,",
                /* @__PURE__ */ jsx("br", {}),
                "avant et après AIO"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
            /* @__PURE__ */ jsxs(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#7a7a7a",
                  textTransform: "uppercase",
                  marginBottom: "20px"
                },
                children: [
                  "Cas anonymisé — ",
                  auditExemple$4.marque
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #ef4444"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                        auditExemple$4.score,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$4.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
                    ] }, i))
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #a3e635"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                        auditExemple$4.apresOptimisation,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$4.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
                    ] }, i))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  color: "#4a4a4a",
                  fontStyle: "italic",
                  borderTop: "1px solid #2a2a2a",
                  paddingTop: "14px",
                  marginTop: "16px"
                },
                children: "💡 Résultat obtenu en 6 semaines avec les quick wins ci-dessous. Données issues d'un audit Otarcy réel, marque anonymisée."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".03 — Quick Wins"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "5 actions concrètes",
                /* @__PURE__ */ jsx("br", {}),
                "pour être recommandé par les IAs"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins$4.map((qw, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em",
                          color: "#a3e635"
                        },
                        children: qw.numero
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.06em",
                          color: "#f0f0f0"
                        },
                        children: qw.titre
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "#7a7a7a",
                          padding: "2px 8px",
                          border: "1px solid #2a2a2a"
                        },
                        children: qw.duree
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: qw.impactColor,
                          padding: "2px 8px",
                          border: `1px solid ${qw.impactColor}`
                        },
                        children: qw.impact
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
              ]
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".04 — Questions fréquentes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "AIO & E-commerce —",
                /* @__PURE__ */ jsx("br", {}),
                "tout ce qu'il faut savoir"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: /* @__PURE__ */ jsx(FaqAccordion$4, { items: faqItems$4 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" },
              children: [
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      color: "#a3e635",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                      fontWeight: 500
                    },
                    children: "Passez à l'action"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "h2",
                  {
                    style: {
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      letterSpacing: "0.04em",
                      color: "#f0f0f0",
                      marginBottom: "16px",
                      lineHeight: 1.1
                    },
                    children: [
                      "Découvrez le score AIO",
                      /* @__PURE__ */ jsx("br", {}),
                      "de votre boutique"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontSize: "0.78rem",
                      color: "#7a7a7a",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      marginBottom: "32px",
                      maxWidth: "480px"
                    },
                    children: "Otarcy analyse votre e-commerce et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent vos produits."
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        background: "#a3e635",
                        color: "#0f0f0f",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      },
                      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                      onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                      children: "Lancer mon audit gratuit →"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        border: "1px solid #3a3a3a",
                        background: "transparent",
                        color: "#7a7a7a",
                        cursor: "pointer",
                        transition: "border-color 0.3s, color 0.3s"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.borderColor = "#e8e8e8";
                        e.currentTarget.style.color = "#e8e8e8";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.borderColor = "#3a3a3a";
                        e.currentTarget.style.color = "#7a7a7a";
                      },
                      children: "Voir les offres"
                    }
                  ) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#4a4a4a",
                  textTransform: "uppercase",
                  marginBottom: "14px"
                },
                children: "Autres secteurs"
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs$4.map((s) => /* @__PURE__ */ jsx(
              Link,
              {
                to: s.to,
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#4a4a4a",
                  padding: "6px 14px",
                  border: "1px solid #2a2a2a",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#a3e635";
                  e.currentTarget.style.borderColor = "#a3e635";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "#4a4a4a";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                },
                children: s.label
              },
              s.to
            )) })
          ] })
        ] })
      ]
    }
  );
}
const schemaJsonLd$3 = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi une agence immobilière est-elle invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les agences immobilières sont souvent bien référencées sur Google Maps mais absentes des réponses des IAs génératives. ChatGPT et Perplexity cherchent des entités structurées : spécialité géographique, type de biens, avis clients avec résultats chiffrés, et balisage Schema.org RealEstateAgent. Sans ces signaux, une agence locale reste invisible quand un acheteur ou vendeur pose une question à une IA."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour une agence immobilière ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization (AIO) pour l'immobilier consiste à structurer l'identité de l'agence, ses zones d'expertise, ses résultats (biens vendus, délais, prix obtenus) et son contenu pour être reconnu et cité par les intelligences artificielles. Quand un acheteur demande à ChatGPT 'quelle agence immobilière choisir à Bordeaux ?', une agence AIO-optimisée a une chance d'apparaître dans la réponse."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel de l'immobilier ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour une agence immobilière sont : un Schema.org RealEstateAgent avec zone géographique et spécialité, une page À propos structurée en Q&A avec résultats chiffrés (nombre de ventes, délai moyen, taux de réussite), des avis clients avec contexte (type de bien, commune, résultat), et du contenu local structuré sur les quartiers et marchés où l'agence opère."
          }
        },
        {
          "@type": "Question",
          name: "L'AIO est-il pertinent pour un agent immobilier indépendant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO est particulièrement stratégique pour les agents indépendants et les petites agences. Les grands réseaux (Century 21, Orpi, IAD) ont des équipes SEO mais sont rarement optimisés pour les IAs. Un agent indépendant bien structuré pour l'AIO peut apparaître avant eux dans les réponses de ChatGPT sur sa zone géographique."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Agences Immobilières — Otarcy",
      description: "Guide complet d'AI Optimization pour les agences immobilières et agents indépendants. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent une agence.",
      url: "https://blackotarcyweb.vercel.app/aio-immobilier",
      publisher: {
        "@type": "Organization",
        name: "Otarcy",
        url: "https://blackotarcyweb.vercel.app"
      }
    }
  ]
};
function useReveal$3() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals$3 = [
  {
    icon: "📍",
    color: "#f97316",
    titre: "Présence locale forte, signal IA inexistant",
    description: "Une agence peut être n°1 sur Google Maps et totaliser 200 avis cinq étoiles — et pourtant être totalement absente des réponses de ChatGPT. Google Maps et les IAs génératives ne lisent pas les mêmes signaux."
  },
  {
    icon: "📋",
    color: "#60a5fa",
    titre: "Résultats non structurés pour les moteurs d'IA",
    description: `"15 ans d'expérience" et "des centaines de ventes" ne suffisent pas aux IAs. Elles cherchent des entités précises : nombre de transactions, délai moyen de vente, taux de concrétisation, zone géographique nommée explicitement.`
  },
  {
    icon: "🏘️",
    color: "#ef4444",
    titre: "Contenu local absent ou non balisé",
    description: "Les IAs citent les experts locaux qui produisent du contenu structuré sur leur marché. Une agence sans page dédiée à ses quartiers, sans analyse de marché et sans Schema.org RealEstateAgent ne sera jamais recommandée."
  }
];
const quickWins$3 = [
  {
    numero: "01",
    titre: "Ajouter Schema.org RealEstateAgent sur votre site",
    detail: "Intégrez un JSON-LD avec votre nom d'agence, zone géographique d'intervention, spécialité (résidentiel, commercial, luxe, location), coordonnées et lien vers vos avis. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier un professionnel de l'immobilier.",
    duree: "1h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Structurer vos résultats en données explicites",
    detail: "Créez une section Résultats chiffrés sur votre site : nombre de biens vendus, délai moyen de vente, prix moyen obtenu vs estimation initiale, taux de réussite. Ces données sont exactement ce que les IAs recherchent pour recommander une agence fiable.",
    duree: "2h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Créer des pages quartier structurées",
    detail: "Une page par quartier ou commune où vous opérez, avec : prix au m² actuels, types de biens disponibles, tendances du marché local, et votre expertise spécifique sur cette zone. Ces pages font de vous la référence locale que les IAs citent.",
    duree: "2h/page",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Réécrire vos avis clients avec contexte structuré",
    detail: "Intégrez sur votre site des avis avec Schema.org Review incluant : type de bien, commune, résultat obtenu (vendu en X jours, au prix demandé). Un avis contextualisé vaut dix fois plus qu'un témoignage générique aux yeux des IAs.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "05",
    titre: "Publier des analyses de marché local régulières",
    detail: "Un article mensuel sur le marché immobilier de votre zone (prix, tendances, délais) positionne votre agence comme source d'autorité. Les IAs citent les experts qui produisent des données locales vérifiables et régulièrement mises à jour.",
    duree: "3h/mois",
    impact: "Moyen",
    impactColor: "#f97316"
  }
];
const faqItems$3 = [
  {
    question: "Pourquoi une agence immobilière est-elle invisible auprès des IAs ?",
    reponse: "Les agences immobilières sont souvent bien référencées sur Google Maps mais absentes des réponses des IAs génératives. ChatGPT et Perplexity cherchent des entités structurées : spécialité géographique, type de biens, avis clients avec résultats chiffrés, et balisage Schema.org RealEstateAgent. Sans ces signaux, une agence locale reste invisible quand un acheteur ou vendeur pose une question à une IA."
  },
  {
    question: "Qu'est-ce que l'AIO pour une agence immobilière ?",
    reponse: "L'AI Optimization pour l'immobilier consiste à structurer l'identité de l'agence, ses zones d'expertise, ses résultats (biens vendus, délais, prix obtenus) et son contenu pour être reconnu et cité par les intelligences artificielles. Quand un acheteur demande à ChatGPT 'quelle agence immobilière choisir à Bordeaux ?', une agence AIO-optimisée a une chance d'apparaître dans la réponse."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel de l'immobilier ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org RealEstateAgent avec zone géographique et spécialité, une page À propos en Q&A avec résultats chiffrés (nombre de ventes, délai moyen, taux de réussite), des avis clients avec contexte (type de bien, commune, résultat), et du contenu local structuré sur les marchés où l'agence opère."
  },
  {
    question: "L'AIO est-il pertinent pour un agent indépendant ?",
    reponse: "Oui, l'AIO est particulièrement stratégique pour les agents indépendants et les petites agences. Les grands réseaux ont des équipes SEO mais sont rarement optimisés pour les IAs. Un agent indépendant bien structuré pour l'AIO peut apparaître avant eux dans les réponses de ChatGPT sur sa zone géographique."
  }
];
const auditExemple$3 = {
  marque: "Agence Meridiem — Immobilier résidentiel Bordeaux Rive Droite",
  score: 2.4,
  lacunes: [
    "Aucun Schema.org RealEstateAgent",
    "Résultats présentés en prose non structurée",
    "Aucune page par quartier d'intervention",
    "Avis Google non intégrés sur le site"
  ],
  apresOptimisation: 7.4,
  actionsRealisees: [
    "Schema.org RealEstateAgent + LocalBusiness",
    "Section résultats chiffrés (247 ventes, 38j délai moyen)",
    "5 pages quartier (Cenon, Lormont, Floirac, Artigues, Carbon-Blanc)",
    "Schema.org Review sur 18 avis contextualisés"
  ]
};
const autresSecteurs$3 = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
function FaqAccordion$3({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(isOpen ? null : i),
          style: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            gap: "16px"
          },
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.82rem",
                  color: "#f0f0f0",
                  fontWeight: 500,
                  lineHeight: 1.5
                },
                children: item.question
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.2rem",
                  color: isOpen ? "#a3e635" : "#4a4a4a",
                  flexShrink: 0,
                  transition: "color 0.2s"
                },
                children: isOpen ? "−" : "+"
              }
            )
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx(
        "p",
        {
          style: {
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.78rem",
            color: "#d4d4d4",
            lineHeight: 1.7,
            fontWeight: 300,
            marginTop: "12px",
            paddingRight: "24px"
          },
          children: item.reponse
        }
      )
    ] }, i);
  }) });
}
function AioImmobilier() {
  useReveal$3();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "#f0f0f0",
        fontFamily: "'Raleway', sans-serif"
      },
      children: [
        /* @__PURE__ */ jsx(
          "script",
          {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd$3) }
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "24px",
                fontWeight: 500
              },
              children: "Secteur — Immobilier"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h1",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                color: "#f0f0f0",
                marginBottom: "32px"
              },
              children: [
                "AIO pour les Agences",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "Immobilières" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontSize: "0.88rem",
                color: "#d4d4d4",
                lineHeight: 1.9,
                fontWeight: 300,
                maxWidth: "600px",
                marginBottom: "40px"
              },
              children: `Vos acheteurs et vendeurs consultent désormais ChatGPT avant de contacter une agence. Ils posent des questions comme "quelle agence immobilière choisir à Lyon ?" ou "quel est le délai moyen pour vendre un appartement à Bordeaux ?". Si vous n'êtes pas structuré pour les IAs, un concurrent le sera.`
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  background: "#a3e635",
                  color: "#0f0f0f",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                },
                onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                children: "Auditer mon agence →"
              }
            ) }),
            /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx(
              "button",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  border: "1px solid #3a3a3a",
                  background: "transparent",
                  color: "#7a7a7a",
                  cursor: "pointer",
                  transition: "border-color 0.3s, color 0.3s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.color = "#e8e8e8";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = "#3a3a3a";
                  e.currentTarget.style.color = "#7a7a7a";
                },
                children: "Glossaire AIO"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "section",
          {
            style: {
              padding: "60px",
              maxWidth: "860px",
              margin: "0 auto",
              borderTop: "1px solid #2a2a2a",
              borderBottom: "1px solid #2a2a2a"
            },
            children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
              { chiffre: "78%", label: "des acheteurs immobiliers recherchent en ligne avant de contacter une agence" },
              { chiffre: "5×", label: "plus de demandes entrantes pour une agence citée par les IAs locales" },
              { chiffre: "4 sem.", label: "pour voir les premiers résultats AIO avec Schema.org RealEstateAgent" }
            ].map((stat, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: "reveal",
                style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
                children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "3.5rem",
                        color: "#a3e635",
                        lineHeight: 1,
                        marginBottom: "8px"
                      },
                      children: stat.chiffre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
                ]
              },
              i
            )) })
          }
        ),
        /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".01 — Le problème"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "48px",
                lineHeight: 1.1
              },
              children: [
                "Pourquoi les IAs ignorent",
                /* @__PURE__ */ jsx("br", {}),
                "la plupart des agences"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals$3.map((item, i) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: {
                padding: "28px",
                border: "1px solid #2a2a2a",
                background: "#0f0f0f",
                borderLeft: `2px solid ${item.color}`
              },
              children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.1rem",
                        letterSpacing: "0.06em",
                        color: "#f0f0f0",
                        marginBottom: "10px"
                      },
                      children: item.titre
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
                ] })
              ] })
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".02 — Exemple concret"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "Un audit réel,",
                /* @__PURE__ */ jsx("br", {}),
                "avant et après AIO"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
            /* @__PURE__ */ jsxs(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#7a7a7a",
                  textTransform: "uppercase",
                  marginBottom: "20px"
                },
                children: [
                  "Cas anonymisé — ",
                  auditExemple$3.marque
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #ef4444"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                        auditExemple$3.score,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$3.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
                    ] }, i))
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "20px",
                    background: "#161616",
                    border: "1px solid #2a2a2a",
                    borderLeft: "2px solid #a3e635"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
                      /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                        auditExemple$3.apresOptimisation,
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
                      ] })
                    ] }),
                    auditExemple$3.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
                      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
                    ] }, i))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  color: "#4a4a4a",
                  fontStyle: "italic",
                  borderTop: "1px solid #2a2a2a",
                  paddingTop: "14px",
                  marginTop: "16px"
                },
                children: "💡 Résultat obtenu en 4 semaines. L'agence est désormais citée par Perplexity sur 3 requêtes locales clés. Données issues d'un audit Otarcy réel, marque anonymisée."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".03 — Quick Wins"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "5 actions concrètes",
                /* @__PURE__ */ jsx("br", {}),
                "pour dominer votre marché local"
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins$3.map((qw, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em",
                          color: "#a3e635"
                        },
                        children: qw.numero
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "p",
                      {
                        style: {
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.06em",
                          color: "#f0f0f0"
                        },
                        children: qw.titre
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "#7a7a7a",
                          padding: "2px 8px",
                          border: "1px solid #2a2a2a"
                        },
                        children: qw.duree
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "'Raleway', sans-serif",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: qw.impactColor,
                          padding: "2px 8px",
                          border: `1px solid ${qw.impactColor}`
                        },
                        children: qw.impact
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
              ]
            },
            i
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "reveal",
              style: {
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: "#a3e635",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: 500
              },
              children: ".04 — Questions fréquentes"
            }
          ),
          /* @__PURE__ */ jsxs(
            "h2",
            {
              className: "reveal",
              style: {
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "0.04em",
                color: "#f0f0f0",
                marginBottom: "40px",
                lineHeight: 1.1
              },
              children: [
                "AIO & Immobilier —",
                /* @__PURE__ */ jsx("br", {}),
                "tout ce qu'il faut savoir"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "reveal",
              style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" },
              children: /* @__PURE__ */ jsx(FaqAccordion$3, { items: faqItems$3 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "reveal",
              style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" },
              children: [
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      color: "#a3e635",
                      textTransform: "uppercase",
                      marginBottom: "16px",
                      fontWeight: 500
                    },
                    children: "Passez à l'action"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "h2",
                  {
                    style: {
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      letterSpacing: "0.04em",
                      color: "#f0f0f0",
                      marginBottom: "16px",
                      lineHeight: 1.1
                    },
                    children: [
                      "Découvrez le score AIO",
                      /* @__PURE__ */ jsx("br", {}),
                      "de votre agence"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontSize: "0.78rem",
                      color: "#7a7a7a",
                      lineHeight: 1.7,
                      fontWeight: 300,
                      marginBottom: "32px",
                      maxWidth: "480px"
                    },
                    children: "Otarcy analyse votre agence et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent un professionnel de l'immobilier dans votre zone."
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        background: "#a3e635",
                        color: "#0f0f0f",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        transition: "opacity 0.2s"
                      },
                      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
                      onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
                      children: "Lancer mon audit gratuit →"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      style: {
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: "0.66rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "13px 32px",
                        border: "1px solid #3a3a3a",
                        background: "transparent",
                        color: "#7a7a7a",
                        cursor: "pointer",
                        transition: "border-color 0.3s, color 0.3s"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.borderColor = "#e8e8e8";
                        e.currentTarget.style.color = "#e8e8e8";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.borderColor = "#3a3a3a";
                        e.currentTarget.style.color = "#7a7a7a";
                      },
                      children: "Voir les offres"
                    }
                  ) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.58rem",
                  letterSpacing: "0.3em",
                  color: "#4a4a4a",
                  textTransform: "uppercase",
                  marginBottom: "14px"
                },
                children: "Autres secteurs"
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs$3.map((s) => /* @__PURE__ */ jsx(
              Link,
              {
                to: s.to,
                style: {
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#4a4a4a",
                  padding: "6px 14px",
                  border: "1px solid #2a2a2a",
                  textDecoration: "none",
                  transition: "color 0.2s, border-color 0.2s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#a3e635";
                  e.currentTarget.style.borderColor = "#a3e635";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "#4a4a4a";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                },
                children: s.label
              },
              s.to
            )) })
          ] })
        ] })
      ]
    }
  );
}
const schemaJsonLd$2 = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi un restaurant n'apparaît-il pas dans les recommandations de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La plupart des restaurants sont bien référencés sur Google Maps et TripAdvisor, mais ces plateformes ne suffisent pas aux IAs génératives. ChatGPT et Perplexity cherchent des entités structurées sur votre propre site : type de cuisine, spécialités nommées, ambiance, localisation précise, et balisage Schema.org Restaurant."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un restaurant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour la restauration consiste à structurer l'identité du restaurant, sa carte, ses spécialités et son ambiance pour être reconnu et cité par les intelligences artificielles. Quand un touriste demande à ChatGPT 'quel est le meilleur restaurant de fruits de mer à La Rochelle ?', un restaurant AIO-optimisé a une chance d'apparaître dans la réponse."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un restaurant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un restaurant sont : un Schema.org Restaurant avec type de cuisine, spécialités, horaires et localisation, une page À propos structurée en Q&A (origine du chef, concept, fournisseurs locaux), des avis clients avec plats mentionnés explicitement, et du contenu sur les occasions de visite."
          }
        },
        {
          "@type": "Question",
          name: "TripAdvisor et Google Maps suffisent-ils pour être recommandé par les IAs ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non. TripAdvisor et Google Maps sont des plateformes tierces que les IAs consultent mais ne privilégient pas comme sources d'autorité. Pour être cité en priorité, un restaurant doit avoir ses propres signaux AIO sur son site : Schema.org Restaurant, contenu structuré sur ses spécialités, et FAQ répondant aux questions que les clients posent aux IAs avant de réserver."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Restaurants — Otarcy",
      description: "Guide complet d'AI Optimization pour les restaurants. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent où manger.",
      url: "https://blackotarcyweb.vercel.app/aio-restauration",
      publisher: { "@type": "Organization", name: "Otarcy", url: "https://blackotarcyweb.vercel.app" }
    }
  ]
};
function useReveal$2() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals$2 = [
  {
    icon: "🗺️",
    color: "#f97316",
    titre: "Google Maps ≠ visibilité IA",
    description: "500 avis cinq étoiles sur Google Maps ne garantissent aucune citation dans ChatGPT. Les IAs génératives lisent le contenu structuré de votre site — pas les plateformes tierces. Un restaurant sans signaux AIO propres reste invisible."
  },
  {
    icon: "🍽️",
    color: "#60a5fa",
    titre: "Carte et spécialités illisibles par les IAs",
    description: "Votre PDF de menu ou votre image de carte est illisible pour ChatGPT. Les IAs ont besoin d'entités textuelles explicites : noms de plats, ingrédients clés, origine des produits, régimes compatibles. Sans ça, votre identité culinaire n'existe pas pour elles."
  },
  {
    icon: "👨‍🍳",
    color: "#ef4444",
    titre: "Concept et histoire non structurés",
    description: `"Restaurant familial depuis 1987" ou "cuisine du marché" ne suffisent pas. Les IAs cherchent des entités précises : nom du chef, formation, inspiration culinaire, fournisseurs locaux nommés, concept en Q&A. C'est ce qui vous rend mémorable pour une IA.`
  }
];
const quickWins$2 = [
  {
    numero: "01",
    titre: "Ajouter Schema.org Restaurant sur votre site",
    detail: "Intégrez un JSON-LD Restaurant avec : nom, type de cuisine, adresse précise, horaires, fourchette de prix, menu URL et lien vers vos avis. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier et recommander un restaurant.",
    duree: "1h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Publier votre carte en HTML structuré",
    detail: "Remplacez le PDF ou l'image de menu par une page HTML avec vos plats nommés, ingrédients principaux, origine des produits et mentions allergènes. Les IAs lisent le texte — une carte en HTML balisé est un signal AIO majeur.",
    duree: "3h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Créer une page Concept & Histoire en Q&A",
    detail: "Répondez explicitement à : Qui est le chef ? Quelle est son histoire ? D'où viennent vos produits ? Pour quelle occasion venir ? Quelle est votre différence avec les autres restaurants du quartier ? Ces réponses sont exactement ce que les IAs utilisent pour construire leurs recommandations.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Structurer vos avis avec plats mentionnés",
    detail: "Intégrez sur votre site des avis Schema.org Review qui citent des plats spécifiques, l'occasion de visite et le ressenti. Un avis qui dit 'le risotto aux truffes était exceptionnel pour notre anniversaire' vaut dix fois plus qu'une note générique pour les IAs.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "05",
    titre: "Créer des pages par occasion de visite",
    detail: "Une page par cas d'usage : repas d'affaires, dîner romantique, brunch en famille, groupe, séminaire. Les IAs répondent souvent à des requêtes d'occasion ('meilleur restaurant pour un anniversaire à Lyon'). Chaque page vous positionne sur une intention différente.",
    duree: "2h/page",
    impact: "Moyen",
    impactColor: "#f97316"
  }
];
const faqItems$2 = [
  {
    question: "Pourquoi mon restaurant n'apparaît pas dans les recommandations IA ?",
    reponse: "La plupart des restaurants sont bien référencés sur Google Maps et TripAdvisor, mais ces plateformes ne suffisent pas aux IAs génératives. ChatGPT et Perplexity cherchent des entités structurées sur votre propre site : type de cuisine, spécialités nommées, ambiance, localisation précise, et balisage Schema.org Restaurant."
  },
  {
    question: "Qu'est-ce que l'AIO pour un restaurant ?",
    reponse: "L'AI Optimization pour la restauration consiste à structurer l'identité du restaurant, sa carte, ses spécialités et son ambiance pour être reconnu et cité par les IAs. Quand un touriste demande à ChatGPT 'quel est le meilleur restaurant de fruits de mer à La Rochelle ?', un restaurant AIO-optimisé a une chance d'apparaître dans la réponse."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un restaurant ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org Restaurant avec type de cuisine, spécialités, horaires et localisation, une page À propos en Q&A (origine du chef, concept, fournisseurs locaux), des avis clients avec plats mentionnés explicitement, et du contenu sur les occasions de visite."
  },
  {
    question: "TripAdvisor et Google Maps suffisent-ils pour les IAs ?",
    reponse: "Non. TripAdvisor et Google Maps sont des plateformes tierces que les IAs consultent mais ne privilégient pas comme sources d'autorité. Pour être cité en priorité, un restaurant doit avoir ses propres signaux AIO sur son site : Schema.org Restaurant, contenu structuré sur ses spécialités, et FAQ répondant aux questions que les clients posent aux IAs avant de réserver."
  }
];
const auditExemple$2 = {
  marque: "La Table du Fleuve — Cuisine gastronomique bordelaise",
  score: 2.1,
  lacunes: ["Aucun Schema.org Restaurant sur le site", "Menu uniquement en PDF non lisible par les IAs", "Page À propos en texte non structuré", "Avis Google Maps non intégrés sur le site"],
  apresOptimisation: 7.6,
  actionsRealisees: ["Schema.org Restaurant + Menu + Chef", "Carte en HTML avec plats, ingrédients et origine produits", "Page Concept en Q&A (chef, fournisseurs girondins, concept)", "6 pages occasions (anniversaire, affaires, romantique...)"]
};
const autresSecteurs$2 = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Conseil RH", to: "/aio-rh" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
function FaqAccordion$2({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(isOpen ? null : i),
          style: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" },
          children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#f0f0f0", fontWeight: 500, lineHeight: 1.5 }, children: item.question }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: isOpen ? "#a3e635" : "#4a4a4a", flexShrink: 0, transition: "color 0.2s" }, children: isOpen ? "−" : "+" })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300, marginTop: "12px", paddingRight: "24px" }, children: item.reponse })
    ] }, i);
  }) });
}
function AioRestauration() {
  useReveal$2();
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd$2) } }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }, children: "Secteur — Restauration" }),
      /* @__PURE__ */ jsxs("h1", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "#f0f0f0", marginBottom: "32px" }, children: [
        "AIO pour les",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "Restaurants" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontSize: "0.88rem", color: "#d4d4d4", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }, children: `Vos clients demandent à ChatGPT "où manger une bonne cuisine italienne à Nantes ?" avant même d'ouvrir Google Maps. Si votre restaurant n'est pas structuré pour les IAs, vous n'existez pas dans leur réponse — et le restaurant d'en face peut vous y devancer.` }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx("button", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85", onMouseLeave: (e) => e.currentTarget.style.opacity = "1", children: "Auditer mon restaurant →" }) }),
        /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx("button", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }, onMouseEnter: (e) => {
          e.currentTarget.style.borderColor = "#e8e8e8";
          e.currentTarget.style.color = "#e8e8e8";
        }, onMouseLeave: (e) => {
          e.currentTarget.style.borderColor = "#3a3a3a";
          e.currentTarget.style.color = "#7a7a7a";
        }, children: "Glossaire AIO" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { padding: "60px", maxWidth: "860px", margin: "0 auto", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a" }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
      { chiffre: "54%", label: "des clients cherchent un restaurant via IA ou assistant vocal en 2025" },
      { chiffre: "6×", label: "plus de réservations directes pour un restaurant cité par les IAs locales" },
      { chiffre: "3 sem.", label: "pour apparaître dans les réponses IA locales avec Schema.org Restaurant" }
    ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", lineHeight: 1, marginBottom: "8px" }, children: stat.chiffre }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".01 — Le problème" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1.1 }, children: [
        "Pourquoi les IAs ignorent",
        /* @__PURE__ */ jsx("br", {}),
        "la plupart des restaurants"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals$2.map((item, i) => /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: `2px solid ${item.color}` }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "10px" }, children: item.titre }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
        ] })
      ] }) }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".02 — Exemple concret" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "Un audit réel,",
        /* @__PURE__ */ jsx("br", {}),
        "avant et après AIO"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }, children: [
          "Cas anonymisé — ",
          auditExemple$2.marque
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #ef4444" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                auditExemple$2.score,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple$2.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
            ] }, i))
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #a3e635" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                auditExemple$2.apresOptimisation,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple$2.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", fontStyle: "italic", borderTop: "1px solid #2a2a2a", paddingTop: "14px", marginTop: "16px" }, children: "💡 Résultat obtenu en 3 semaines. Le restaurant est désormais cité par ChatGPT sur 5 requêtes locales. Données issues d'un audit Otarcy réel, marque anonymisée." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".03 — Quick Wins" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "5 actions concrètes",
        /* @__PURE__ */ jsx("br", {}),
        "pour remplir vos tables via les IAs"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins$2.map((qw, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "#a3e635" }, children: qw.numero }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0" }, children: qw.titre })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a" }, children: qw.duree }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: qw.impactColor, padding: "2px 8px", border: `1px solid ${qw.impactColor}` }, children: qw.impact })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".04 — Questions fréquentes" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "AIO & Restauration —",
        /* @__PURE__ */ jsx("br", {}),
        "tout ce qu'il faut savoir"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: /* @__PURE__ */ jsx(FaqAccordion$2, { items: faqItems$2 }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: "Passez à l'action" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "16px", lineHeight: 1.1 }, children: [
          "Découvrez le score AIO",
          /* @__PURE__ */ jsx("br", {}),
          "de votre restaurant"
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }, children: "Otarcy analyse votre restaurant et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent où manger." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx("button", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85", onMouseLeave: (e) => e.currentTarget.style.opacity = "1", children: "Lancer mon audit gratuit →" }) }),
          /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx("button", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }, onMouseEnter: (e) => {
            e.currentTarget.style.borderColor = "#e8e8e8";
            e.currentTarget.style.color = "#e8e8e8";
          }, onMouseLeave: (e) => {
            e.currentTarget.style.borderColor = "#3a3a3a";
            e.currentTarget.style.color = "#7a7a7a";
          }, children: "Voir les offres" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: "14px" }, children: "Autres secteurs" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs$2.map((s) => /* @__PURE__ */ jsx(
          Link,
          {
            to: s.to,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", padding: "6px 14px", border: "1px solid #2a2a2a", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#a3e635";
              e.currentTarget.style.borderColor = "#a3e635";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#4a4a4a";
              e.currentTarget.style.borderColor = "#2a2a2a";
            },
            children: s.label
          },
          s.to
        )) })
      ] })
    ] })
  ] });
}
const schemaJsonLd$1 = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi un cabinet de conseil RH ou de recrutement est-il invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les cabinets RH ont souvent un site institutionnel bien conçu mais pauvre en signaux AIO. ChatGPT et Perplexity cherchent des entités précises : spécialité RH, secteurs couverts, taille d'entreprises ciblées, résultats mesurables (délais de recrutement, taux de rétention, nombre de placements). Sans ces données structurées, même un cabinet reconnu reste absent des réponses des IAs quand un DRH ou dirigeant pose une question sur le recrutement."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un cabinet RH ou un recruteur indépendant ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour le conseil RH consiste à structurer l'expertise du cabinet, ses spécialités (recrutement cadres, formation, QVCT, outplacement), ses résultats et son positionnement pour être reconnu et cité par les intelligences artificielles génératives. Quand un DRH demande à ChatGPT 'quel cabinet RH choisir pour recruter des profils tech à Paris ?', un cabinet AIO-optimisé a une chance d'apparaître dans la réponse."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel RH ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un cabinet RH sont : un Schema.org ProfessionalService avec spécialités et secteurs couverts, une page expertise structurée en Q&A avec résultats chiffrés (délai moyen, taux de rétention à 12 mois, nombre de placements), des études de cas clients anonymisées, et du contenu thématique sur les enjeux RH actuels (IA et recrutement, marché de l'emploi, retention des talents)."
          }
        },
        {
          "@type": "Question",
          name: "L'AIO est-il pertinent pour un recruteur indépendant ou un RH freelance ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO est particulièrement stratégique pour les indépendants RH. Les grands cabinets comme Michael Page ou Hays dominent Google mais investissent peu dans l'AIO. Un recruteur indépendant bien structuré pour les IAs peut apparaître en priorité dans les réponses de ChatGPT sur sa niche sectorielle ou géographique, là où les grands réseaux sont trop généralistes pour être cités."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Cabinets RH et Recruteurs — Otarcy",
      description: "Guide complet d'AI Optimization pour les cabinets de conseil RH, recruteurs et DRH. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos clients cherchent un expert RH.",
      url: "https://blackotarcyweb.vercel.app/aio-rh",
      publisher: { "@type": "Organization", name: "Otarcy", url: "https://blackotarcyweb.vercel.app" }
    }
  ]
};
function useReveal$1() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals$1 = [
  {
    icon: "📊",
    color: "#f97316",
    titre: "Expertise réelle, données invisibles pour les IAs",
    description: `"15 ans d'expérience en recrutement" ne suffit pas à ChatGPT. Les IAs cherchent des données précises et vérifiables : délai moyen de placement, taux de rétention à 12 mois, secteurs couverts nommés explicitement, taille d'entreprises ciblées. Sans ces chiffres structurés, votre expertise est opaque pour les moteurs d'IA.`
  },
  {
    icon: "🎯",
    color: "#60a5fa",
    titre: "Positionnement trop généraliste pour être cité",
    description: "Les IAs citent les experts de niche, pas les généralistes. Un cabinet qui couvre 'tous les secteurs' et 'tous les profils' ne sera jamais cité par ChatGPT sur une requête précise. Le positionnement sectoriel ou fonctionnel est un signal AIO majeur."
  },
  {
    icon: "📝",
    color: "#ef4444",
    titre: "Contenu institutionnel non consommable par les IAs",
    description: "Les brochures PDF, les plaquettes commerciales et les slides de présentation sont illisibles pour les IAs. ChatGPT a besoin de contenu textuel structuré sur votre site : études de cas, articles thématiques, FAQ sur vos méthodes. Sans ça, votre cabinet n'existe pas pour les moteurs d'IA."
  }
];
const quickWins$1 = [
  {
    numero: "01",
    titre: "Ajouter Schema.org ProfessionalService avec spécialités",
    detail: "Intégrez un JSON-LD ProfessionalService avec : nom du cabinet, spécialités RH (recrutement, formation, QVCT, outplacement), secteurs couverts, zone géographique et résultats clés. C'est le signal de base qu'attendent ChatGPT et Perplexity pour identifier et recommander un expert RH.",
    duree: "1h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Publier vos résultats en données structurées",
    detail: "Créez une page Résultats avec données explicites : délai moyen de placement par profil, taux de rétention à 12 mois, nombre de recrutements réalisés, secteurs les plus représentés. Ces chiffres sont exactement ce que les IAs recherchent pour recommander un cabinet crédible.",
    duree: "2h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Structurer votre expertise en Q&A thématiques",
    detail: "Une page par spécialité RH : recrutement tech, recrutement commercial, QVCT, outplacement, bilan de compétences. Format Q&A pour chacune : Qu'est-ce que c'est ? Pour qui ? Quelle méthode ? Quels résultats ? Les IAs citent les experts qui structurent leur savoir de façon explicite.",
    duree: "2h/page",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Publier des études de cas clients anonymisées",
    detail: "Pas de témoignages génériques — des cas concrets avec contexte (secteur, taille entreprise, problématique), approche déployée et résultats mesurables (délai, coût par recrutement, taux d'acceptation). Les IAs citent les preuves concrètes, pas les promesses marketing.",
    duree: "2h/cas",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "05",
    titre: "Produire du contenu sur les enjeux RH actuels",
    detail: "Articles structurés sur : IA et recrutement, marché de l'emploi par secteur, retention des talents, diversité & inclusion, télétravail et culture d'entreprise. Ces sujets sont massivement demandés aux IAs par les DRH — vous devenez la source qu'elles citent.",
    duree: "3h/article",
    impact: "Moyen",
    impactColor: "#f97316"
  }
];
const faqItems$1 = [
  {
    question: "Pourquoi mon cabinet RH est-il invisible auprès des IAs ?",
    reponse: "Les cabinets RH ont souvent un site institutionnel bien conçu mais pauvre en signaux AIO. ChatGPT et Perplexity cherchent des entités précises : spécialité RH, secteurs couverts, taille d'entreprises ciblées, résultats mesurables. Sans ces données structurées, même un cabinet reconnu reste absent des réponses des IAs."
  },
  {
    question: "Qu'est-ce que l'AIO pour un cabinet RH ?",
    reponse: "L'AI Optimization pour le conseil RH consiste à structurer l'expertise du cabinet, ses spécialités, ses résultats et son positionnement pour être reconnu et cité par les intelligences artificielles. Quand un DRH demande à ChatGPT 'quel cabinet RH choisir pour recruter des profils tech à Paris ?', un cabinet AIO-optimisé a une chance d'apparaître dans la réponse."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel RH ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org ProfessionalService avec spécialités et secteurs couverts, une page expertise en Q&A avec résultats chiffrés (délai moyen, taux de rétention à 12 mois, nombre de placements), des études de cas clients anonymisées, et du contenu thématique sur les enjeux RH actuels."
  },
  {
    question: "L'AIO est-il pertinent pour un recruteur indépendant ?",
    reponse: "Oui, particulièrement stratégique pour les indépendants RH. Les grands cabinets comme Michael Page ou Hays dominent Google mais investissent peu dans l'AIO. Un recruteur indépendant bien structuré peut apparaître en priorité dans les réponses de ChatGPT sur sa niche sectorielle ou géographique, là où les grands réseaux sont trop généralistes pour être cités."
  }
];
const auditExemple$1 = {
  marque: "Nexus RH — Cabinet de recrutement cadres tech & digital, Bordeaux",
  score: 2.6,
  lacunes: [
    "Aucun Schema.org ProfessionalService",
    "Résultats présentés en texte non structuré",
    "Aucune étude de cas publiée sur le site",
    "Contenu uniquement commercial, zéro contenu thématique"
  ],
  apresOptimisation: 7.3,
  actionsRealisees: [
    "Schema.org ProfessionalService + spécialités tech/digital",
    "Page Résultats : 340 placements, 38j délai moyen, 91% rétention 12 mois",
    "4 études de cas anonymisées (CTO, Lead Dev, Product Manager, Data...)",
    "6 articles thématiques (IA et recrutement, salaires tech 2025...)"
  ]
};
const autresSecteurs$1 = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Santé & Bien-être", to: "/aio-sante" }
];
function FaqAccordion$1({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(isOpen ? null : i),
          style: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" },
          children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#f0f0f0", fontWeight: 500, lineHeight: 1.5 }, children: item.question }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: isOpen ? "#a3e635" : "#4a4a4a", flexShrink: 0, transition: "color 0.2s" }, children: isOpen ? "−" : "+" })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300, marginTop: "12px", paddingRight: "24px" }, children: item.reponse })
    ] }, i);
  }) });
}
function AioRh() {
  useReveal$1();
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd$1) } }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }, children: "Secteur — Conseil RH & Recrutement" }),
      /* @__PURE__ */ jsxs("h1", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "#f0f0f0", marginBottom: "32px" }, children: [
        "AIO pour les Cabinets",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "RH & Recruteurs" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontSize: "0.88rem", color: "#d4d4d4", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }, children: `Les DRH et dirigeants consultent ChatGPT avant de choisir un cabinet RH. Ils posent des questions comme "quel recruteur spécialisé en profils tech choisir ?" ou "comment améliorer la rétention des talents ?". Si votre expertise n'est pas structurée pour les IAs, vous n'existez pas dans leur réponse.` }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
          "button",
          {
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "Auditer mon cabinet →"
          }
        ) }),
        /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx(
          "button",
          {
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#e8e8e8";
              e.currentTarget.style.color = "#e8e8e8";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#3a3a3a";
              e.currentTarget.style.color = "#7a7a7a";
            },
            children: "Glossaire AIO"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { padding: "60px", maxWidth: "860px", margin: "0 auto", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a" }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
      { chiffre: "71%", label: "des DRH utilisent une IA pour se renseigner avant de sélectionner un cabinet" },
      { chiffre: "4×", label: "plus de demandes entrantes pour un cabinet cité par les IAs sur sa niche" },
      { chiffre: "5 sem.", label: "pour apparaître dans les réponses IA sur votre spécialité RH" }
    ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", lineHeight: 1, marginBottom: "8px" }, children: stat.chiffre }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".01 — Le problème" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1.1 }, children: [
        "Pourquoi les IAs ignorent",
        /* @__PURE__ */ jsx("br", {}),
        "la plupart des cabinets RH"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals$1.map((item, i) => /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: `2px solid ${item.color}` }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "10px" }, children: item.titre }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
        ] })
      ] }) }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".02 — Exemple concret" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "Un audit réel,",
        /* @__PURE__ */ jsx("br", {}),
        "avant et après AIO"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }, children: [
          "Cas anonymisé — ",
          auditExemple$1.marque
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #ef4444" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                auditExemple$1.score,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple$1.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
            ] }, i))
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #a3e635" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                auditExemple$1.apresOptimisation,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple$1.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", fontStyle: "italic", borderTop: "1px solid #2a2a2a", paddingTop: "14px", marginTop: "16px" }, children: "💡 Résultat obtenu en 5 semaines. Le cabinet est désormais cité par Perplexity sur 4 requêtes RH tech en Nouvelle-Aquitaine. Données issues d'un audit Otarcy réel, marque anonymisée." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".03 — Quick Wins" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "5 actions concrètes",
        /* @__PURE__ */ jsx("br", {}),
        "pour être le cabinet que les IAs citent"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins$1.map((qw, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "#a3e635" }, children: qw.numero }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0" }, children: qw.titre })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a" }, children: qw.duree }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: qw.impactColor, padding: "2px 8px", border: `1px solid ${qw.impactColor}` }, children: qw.impact })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".04 — Questions fréquentes" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "AIO & Conseil RH —",
        /* @__PURE__ */ jsx("br", {}),
        "tout ce qu'il faut savoir"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: /* @__PURE__ */ jsx(FaqAccordion$1, { items: faqItems$1 }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: "Passez à l'action" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "16px", lineHeight: 1.1 }, children: [
          "Découvrez le score AIO",
          /* @__PURE__ */ jsx("br", {}),
          "de votre cabinet RH"
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }, children: "Otarcy analyse votre cabinet et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos clients cherchent un expert RH." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
            "button",
            {
              style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" },
              onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
              onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
              children: "Lancer mon audit gratuit →"
            }
          ) }),
          /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
            "button",
            {
              style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "#e8e8e8";
                e.currentTarget.style.color = "#e8e8e8";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "#3a3a3a";
                e.currentTarget.style.color = "#7a7a7a";
              },
              children: "Voir les offres"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: "14px" }, children: "Autres secteurs" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs$1.map((s) => /* @__PURE__ */ jsx(
          Link,
          {
            to: s.to,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", padding: "6px 14px", border: "1px solid #2a2a2a", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#a3e635";
              e.currentTarget.style.borderColor = "#a3e635";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#4a4a4a";
              e.currentTarget.style.borderColor = "#2a2a2a";
            },
            children: s.label
          },
          s.to
        )) })
      ] })
    ] })
  ] });
}
const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Pourquoi un professionnel de santé ou du bien-être est-il invisible auprès de ChatGPT ou Perplexity ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les professionnels de santé et du bien-être ont souvent une forte réputation locale mais une présence digitale peu structurée pour les IAs. ChatGPT et Perplexity cherchent des entités précises : spécialité, approche thérapeutique, formations et certifications, localisation, et types de problématiques traitées. Sans ces signaux structurés sur leur site, même un praticien reconnu reste absent des réponses des IAs."
          }
        },
        {
          "@type": "Question",
          name: "Qu'est-ce que l'AIO pour un professionnel de santé ou du bien-être ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'AI Optimization pour la santé et le bien-être consiste à structurer l'identité du praticien, ses spécialités, ses approches et ses résultats pour être reconnu et cité par les intelligences artificielles génératives. Quand un patient demande à ChatGPT 'quel ostéopathe choisir à Lyon pour des douleurs chroniques ?', un praticien AIO-optimisé a une chance d'apparaître dans la réponse."
          }
        },
        {
          "@type": "Question",
          name: "Quels sont les signaux AIO prioritaires pour un professionnel de santé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les signaux AIO prioritaires pour un professionnel de santé ou du bien-être sont : un Schema.org MedicalBusiness ou HealthAndBeautyBusiness avec spécialité et localisation, une page À propos structurée en Q&A avec formations, certifications et approches nommées explicitement, une FAQ sur les problématiques traitées, et du contenu éducatif sur les pathologies ou sujets couverts."
          }
        },
        {
          "@type": "Question",
          name: "L'AIO est-il compatible avec les règles déontologiques des professionnels de santé ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Oui, l'AIO pour la santé reste dans le cadre déontologique en structurant des informations factuelles : formations, certifications, spécialités, localisation, approches thérapeutiques reconnues. Il ne s'agit pas de faire des promesses de guérison ou des comparaisons entre praticiens, mais de rendre visible une expertise déjà existante auprès des moteurs d'IA."
          }
        }
      ]
    },
    {
      "@type": "WebPage",
      name: "AIO pour les Professionnels de Santé et du Bien-être — Otarcy",
      description: "Guide complet d'AI Optimization pour les professionnels de santé, thérapeutes et coachs bien-être. Apparaissez dans les recommandations de ChatGPT, Perplexity et Claude quand vos patients cherchent un praticien.",
      url: "https://blackotarcyweb.vercel.app/aio-sante",
      publisher: { "@type": "Organization", name: "Otarcy", url: "https://blackotarcyweb.vercel.app" }
    }
  ]
};
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
const problemSignals = [
  {
    icon: "🔬",
    color: "#f97316",
    titre: "Formations et certifications non lisibles par les IAs",
    description: "Un ostéopathe DO, un psychologue EMDR certifié ou un naturopathe FENAHMAN — ces qualifications sont clés pour vos patients mais souvent absentes des signaux que lisent ChatGPT et Perplexity. Sans balisage structuré, vos certifications n'existent pas pour les moteurs d'IA."
  },
  {
    icon: "🩺",
    color: "#60a5fa",
    titre: "Problématiques traitées non nommées explicitement",
    description: "Les IAs répondent à des requêtes précises : 'thérapeute spécialisé en burn-out', 'kiné spécialisé sport', 'naturopathe pour troubles digestifs'. Si vos spécialités ne sont pas nommées explicitement sur votre site avec le bon vocabulaire, vous n'apparaissez sur aucune de ces requêtes."
  },
  {
    icon: "📋",
    color: "#ef4444",
    titre: "Contenu trop institutionnel, trop peu éducatif",
    description: "Un site vitrine avec tarifs et prise de rendez-vous ne suffit pas aux IAs. Elles citent les praticiens qui produisent du contenu éducatif sur leurs spécialités : articles sur les pathologies, FAQ sur les approches, explication des méthodes. C'est ce contenu qui vous positionne comme référence."
  }
];
const quickWins = [
  {
    numero: "01",
    titre: "Ajouter Schema.org MedicalBusiness sur votre site",
    detail: "Intégrez un JSON-LD MedicalBusiness (ou HealthAndBeautyBusiness selon votre activité) avec : spécialité médicale ou thérapeutique, formations et certifications nommées, localisation, et types de consultations proposées. C'est le signal de base qu'attendent les IAs pour identifier un professionnel de santé.",
    duree: "1h",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "02",
    titre: "Structurer vos spécialités et approches en Q&A",
    detail: "Pour chaque spécialité ou approche que vous pratiquez (EMDR, TCC, ostéopathie crânienne, naturopathie, etc.) : une page dédiée en Q&A. Qu'est-ce que c'est ? Pour quelles problématiques ? Comment se déroule une séance ? Quels résultats attendus ? Les IAs utilisent ces pages pour répondre aux questions de vos futurs patients.",
    duree: "2h/approche",
    impact: "Très élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "03",
    titre: "Créer une FAQ sur les pathologies et problématiques traitées",
    detail: "Listez explicitement les problématiques que vous prenez en charge : anxiété, burn-out, douleurs chroniques, troubles du sommeil, TCA, etc. Une page FAQ avec Schema.org FAQPage répond directement aux questions que vos patients posent aux IAs avant de consulter.",
    duree: "2h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "04",
    titre: "Nommer vos formations et certifications avec entités complètes",
    detail: "Ne mentionnez pas juste 'certifié EMDR' — nommez l'organisme de formation, l'année, le niveau. Ces entités précises sont ce que ChatGPT vérifie pour évaluer la crédibilité d'un praticien. Un Schema.org Person avec educationalCredential structuré est un signal AIO majeur.",
    duree: "1h",
    impact: "Élevé",
    impactColor: "#a3e635"
  },
  {
    numero: "05",
    titre: "Publier du contenu éducatif sur vos thématiques",
    detail: "Articles accessibles sur les pathologies que vous traitez, les mécanismes en jeu, les approches possibles. Ce contenu éducatif positionne votre site comme référence thématique — les IAs le citent quand vos patients cherchent à comprendre leur problématique avant de consulter.",
    duree: "3h/article",
    impact: "Moyen",
    impactColor: "#f97316"
  }
];
const faqItems = [
  {
    question: "Pourquoi un professionnel de santé est-il invisible auprès des IAs ?",
    reponse: "Les professionnels de santé ont souvent une forte réputation locale mais une présence digitale peu structurée pour les IAs. ChatGPT et Perplexity cherchent des entités précises : spécialité, approche thérapeutique, formations et certifications, localisation, et types de problématiques traitées. Sans ces signaux structurés, même un praticien reconnu reste absent des réponses des IAs."
  },
  {
    question: "Qu'est-ce que l'AIO pour un professionnel de santé ou du bien-être ?",
    reponse: "L'AI Optimization pour la santé et le bien-être consiste à structurer l'identité du praticien, ses spécialités, ses approches et son expertise pour être reconnu et cité par les IAs. Quand un patient demande à ChatGPT 'quel ostéopathe choisir à Lyon pour des douleurs chroniques ?', un praticien AIO-optimisé a une chance d'apparaître dans la réponse."
  },
  {
    question: "Quels signaux AIO sont prioritaires pour un professionnel de santé ?",
    reponse: "Les signaux AIO prioritaires : un Schema.org MedicalBusiness avec spécialité et localisation, une page À propos en Q&A avec formations et certifications nommées explicitement, une FAQ sur les problématiques traitées avec Schema.org FAQPage, et du contenu éducatif sur les pathologies ou sujets couverts."
  },
  {
    question: "L'AIO est-il compatible avec les règles déontologiques ?",
    reponse: "Oui, l'AIO pour la santé reste dans le cadre déontologique en structurant des informations factuelles : formations, certifications, spécialités, localisation, approches thérapeutiques reconnues. Il ne s'agit pas de faire des promesses de guérison ou des comparaisons entre praticiens, mais de rendre visible une expertise déjà existante auprès des moteurs d'IA."
  }
];
const auditExemple = {
  marque: "Cabinet Solis — Psychologue & Thérapeute EMDR, Bordeaux",
  score: 2.3,
  lacunes: [
    "Aucun Schema.org MedicalBusiness sur le site",
    "Certifications EMDR mentionnées sans entités structurées",
    "Aucune page dédiée aux problématiques traitées",
    "Zéro contenu éducatif — site purement vitrine"
  ],
  apresOptimisation: 7.5,
  actionsRealisees: [
    "Schema.org MedicalBusiness + Person avec certifications",
    "3 pages approches (EMDR, TCC, thérapie brève) en Q&A",
    "FAQ 12 questions sur burn-out, anxiété, trauma, deuil",
    "5 articles éducatifs sur les pathologies traitées"
  ]
};
const autresSecteurs = [
  { label: "Coaching", to: "/aio-coaching" },
  { label: "E-commerce", to: "/aio-ecommerce" },
  { label: "Immobilier", to: "/aio-immobilier" },
  { label: "Restauration", to: "/aio-restauration" },
  { label: "Conseil RH", to: "/aio-rh" }
];
function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return /* @__PURE__ */ jsx("div", { children: items.map((item, i) => {
    const isOpen = openIndex === i;
    return /* @__PURE__ */ jsxs("div", { style: { borderTop: "1px solid #2a2a2a", padding: "16px 0" }, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setOpenIndex(isOpen ? null : i),
          style: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "16px" },
          children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: "#f0f0f0", fontWeight: 500, lineHeight: 1.5 }, children: item.question }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: isOpen ? "#a3e635" : "#4a4a4a", flexShrink: 0, transition: "color 0.2s" }, children: isOpen ? "−" : "+" })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300, marginTop: "12px", paddingRight: "24px" }, children: item.reponse })
    ] }, i);
  }) });
}
function AioSante() {
  useReveal();
  return /* @__PURE__ */ jsxs("div", { style: { background: "#0a0a0a", minHeight: "100vh", color: "#f0f0f0", fontFamily: "'Raleway', sans-serif" }, children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(schemaJsonLd) } }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px 80px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "24px", fontWeight: 500 }, children: "Secteur — Santé & Bien-être" }),
      /* @__PURE__ */ jsxs("h1", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.5rem)", letterSpacing: "0.04em", lineHeight: 1.05, color: "#f0f0f0", marginBottom: "32px" }, children: [
        "AIO pour les Pros",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { style: { color: "#a3e635" }, children: "de Santé & Bien-être" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontSize: "0.88rem", color: "#d4d4d4", lineHeight: 1.9, fontWeight: 300, maxWidth: "600px", marginBottom: "40px" }, children: `Vos patients cherchent "thérapeute spécialisé en burn-out à Nantes" ou "ostéopathe pour douleurs chroniques" directement dans ChatGPT avant même d'ouvrir PagesJaunes. Si vos spécialités et certifications ne sont pas structurées pour les IAs, un confrère moins qualifié mais mieux optimisé vous devancera.` }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
          "button",
          {
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: "Auditer mon cabinet →"
          }
        ) }),
        /* @__PURE__ */ jsx(Link, { to: "/glossaire", children: /* @__PURE__ */ jsx(
          "button",
          {
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = "#e8e8e8";
              e.currentTarget.style.color = "#e8e8e8";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = "#3a3a3a";
              e.currentTarget.style.color = "#7a7a7a";
            },
            children: "Glossaire AIO"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { style: { padding: "60px", maxWidth: "860px", margin: "0 auto", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a" }, children: /* @__PURE__ */ jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
      { chiffre: "67%", label: "des patients recherchent un praticien en ligne avant de prendre rendez-vous" },
      { chiffre: "5×", label: "plus de prises de contact pour un praticien cité par les IAs sur sa spécialité" },
      { chiffre: "4 sem.", label: "pour apparaître dans les réponses IA sur votre spécialité avec Schema.org" }
    ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
      /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#a3e635", lineHeight: 1, marginBottom: "8px" }, children: stat.chiffre }),
      /* @__PURE__ */ jsx("p", { style: { fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: stat.label })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "100px 60px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".01 — Le problème" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "48px", lineHeight: 1.1 }, children: [
        "Pourquoi les IAs ignorent",
        /* @__PURE__ */ jsx("br", {}),
        "la plupart des praticiens"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: problemSignals.map((item, i) => /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f", borderLeft: `2px solid ${item.color}` }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "20px" }, children: [
        /* @__PURE__ */ jsx("span", { style: { fontSize: "1.4rem", flexShrink: 0 }, children: item.icon }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0", marginBottom: "10px" }, children: item.titre }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: item.description })
        ] })
      ] }) }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".02 — Exemple concret" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "Un audit réel,",
        /* @__PURE__ */ jsx("br", {}),
        "avant et après AIO"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a7a7a", textTransform: "uppercase", marginBottom: "20px" }, children: [
          "Cas anonymisé — ",
          auditExemple.marque
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #ef4444" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "AVANT" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#ef4444" }, children: [
                auditExemple.score,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple.lacunes.map((l, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "✕" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", lineHeight: 1.5, fontWeight: 300 }, children: l })
            ] }, i))
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "20px", background: "#161616", border: "1px solid #2a2a2a", borderLeft: "2px solid #a3e635" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#f0f0f0" }, children: "APRÈS" }),
              /* @__PURE__ */ jsxs("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a3e635" }, children: [
                auditExemple.apresOptimisation,
                /* @__PURE__ */ jsx("span", { style: { fontSize: "0.9rem", color: "#4a4a4a" }, children: "/10" })
              ] })
            ] }),
            auditExemple.actionsRealisees.map((a, i) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsx("span", { style: { color: "#a3e635", fontSize: "0.7rem", marginTop: "2px", flexShrink: 0 }, children: "→" }),
              /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#d4d4d4", lineHeight: 1.5, fontWeight: 300 }, children: a })
            ] }, i))
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", color: "#4a4a4a", fontStyle: "italic", borderTop: "1px solid #2a2a2a", paddingTop: "14px", marginTop: "16px" }, children: "💡 Résultat obtenu en 4 semaines. Le cabinet est désormais cité par ChatGPT sur 6 requêtes locales liées au burn-out et à l'EMDR. Données issues d'un audit Otarcy réel, marque anonymisée." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".03 — Quick Wins" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "5 actions concrètes",
        /* @__PURE__ */ jsx("br", {}),
        "pour être le praticien que les IAs recommandent"
      ] }),
      /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "16px" }, children: quickWins.map((qw, i) => /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "#a3e635" }, children: qw.numero }),
            /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#f0f0f0" }, children: qw.titre })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#7a7a7a", padding: "2px 8px", border: "1px solid #2a2a2a" }, children: qw.duree }),
            /* @__PURE__ */ jsx("span", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.1em", color: qw.impactColor, padding: "2px 8px", border: `1px solid ${qw.impactColor}` }, children: qw.impact })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#d4d4d4", lineHeight: 1.7, fontWeight: 300 }, children: qw.detail })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx("p", { className: "reveal", style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: ".04 — Questions fréquentes" }),
      /* @__PURE__ */ jsxs("h2", { className: "reveal", style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "40px", lineHeight: 1.1 }, children: [
        "AIO & Santé —",
        /* @__PURE__ */ jsx("br", {}),
        "tout ce qu'il faut savoir"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "reveal", style: { padding: "24px 28px", border: "1px solid #2a2a2a", background: "#0f0f0f" }, children: /* @__PURE__ */ jsx(FaqAccordion, { items: faqItems }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { style: { padding: "0 60px 100px", maxWidth: "860px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { padding: "48px", border: "1px solid #a3e635", background: "#0a0a0a" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }, children: "Passez à l'action" }),
        /* @__PURE__ */ jsxs("h2", { style: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.04em", color: "#f0f0f0", marginBottom: "16px", lineHeight: 1.1 }, children: [
          "Découvrez le score AIO",
          /* @__PURE__ */ jsx("br", {}),
          "de votre cabinet"
        ] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: "0.78rem", color: "#7a7a7a", lineHeight: 1.7, fontWeight: 300, marginBottom: "32px", maxWidth: "480px" }, children: "Otarcy analyse votre cabinet et vous donne un score AIO + des recommandations concrètes pour apparaître dans les réponses de ChatGPT, Perplexity et Claude quand vos patients cherchent un praticien dans votre spécialité." }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsx(Link, { to: "/#audit", children: /* @__PURE__ */ jsx(
            "button",
            {
              style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", background: "#a3e635", color: "#0f0f0f", fontWeight: 600, border: "none", cursor: "pointer", transition: "opacity 0.2s" },
              onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
              onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
              children: "Lancer mon audit gratuit →"
            }
          ) }),
          /* @__PURE__ */ jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsx(
            "button",
            {
              style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "13px 32px", border: "1px solid #3a3a3a", background: "transparent", color: "#7a7a7a", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "#e8e8e8";
                e.currentTarget.style.color = "#e8e8e8";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "#3a3a3a";
                e.currentTarget.style.color = "#7a7a7a";
              },
              children: "Voir les offres"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "reveal", style: { marginTop: "40px" }, children: [
        /* @__PURE__ */ jsx("p", { style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#4a4a4a", textTransform: "uppercase", marginBottom: "14px" }, children: "Autres secteurs" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: autresSecteurs.map((s) => /* @__PURE__ */ jsx(
          Link,
          {
            to: s.to,
            style: { fontFamily: "'Raleway', sans-serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4a4a4a", padding: "6px 14px", border: "1px solid #2a2a2a", textDecoration: "none", transition: "color 0.2s, border-color 0.2s" },
            onMouseEnter: (e) => {
              e.currentTarget.style.color = "#a3e635";
              e.currentTarget.style.borderColor = "#a3e635";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.color = "#4a4a4a";
              e.currentTarget.style.borderColor = "#2a2a2a";
            },
            children: s.label
          },
          s.to
        )) })
      ] })
    ] })
  ] });
}
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return /* @__PURE__ */ jsx("div", { style: { minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("div", { style: { color: "rgba(255,255,255,0.4)", fontSize: "14px" }, children: "Chargement..." }) });
  return user ? /* @__PURE__ */ jsx(Fragment, { children }) : /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true });
}
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) : /* @__PURE__ */ jsx(Fragment, { children });
}
function App() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(PublicRoute, { children: /* @__PURE__ */ jsx(Login, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsx(ResetPassword, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsx(Pricing, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/glossaire", element: /* @__PURE__ */ jsx(Glossaire, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(Faq, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-coaching", element: /* @__PURE__ */ jsx(AioCoaching, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-ecommerce", element: /* @__PURE__ */ jsx(AioEcommerce, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-immobilier", element: /* @__PURE__ */ jsx(AioImmobilier, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-restauration", element: /* @__PURE__ */ jsx(AioRestauration, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-rh", element: /* @__PURE__ */ jsx(AioRh, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-sante", element: /* @__PURE__ */ jsx(AioSante, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "/dashboard", element: /* @__PURE__ */ jsx(PrivateRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) }) }),
    /* @__PURE__ */ jsx(Route, { path: "/aio-report", element: /* @__PURE__ */ jsx(PrivateRoute, { children: /* @__PURE__ */ jsx(AioReport, {}) }) })
  ] }) });
}
const App$1 = ViteReactSSG(App);
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App$1, {}) })
);
