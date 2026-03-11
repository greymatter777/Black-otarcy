import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ─── HOOK REVEAL ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const FAQ = [
  {
    categorie: "Comprendre l'AIO",
    couleur: "#a3e635",
    questions: [
      {
        q: "Qu'est-ce que l'AIO (AI Optimization) ?",
        r: "L'AIO, ou AI Optimization, est la discipline qui consiste à rendre une marque, une entreprise ou un contenu visible dans les réponses générées par les intelligences artificielles conversationnelles comme ChatGPT, Claude, Gemini ou Perplexity. Contrairement au SEO traditionnel centré sur Google, l'AIO optimise la façon dont les IA perçoivent, comprennent et citent une marque.",
      },
      {
        q: "Quelle est la différence entre AIO et SEO ?",
        r: "Le SEO optimise pour les algorithmes de classement de Google — il vise à faire remonter des liens dans les résultats de recherche. L'AIO optimise pour la compréhension sémantique des LLMs — il vise à faire apparaître une marque dans les réponses générées par les IA. Les deux sont complémentaires : un bon SEO améliore la visibilité web générale, un bon AIO améliore la visibilité dans les réponses IA. Mais les techniques sont différentes : l'AIO privilégie la clarté des entités, la cohérence entre sources et le contenu structuré en Q&A.",
      },
      {
        q: "Pourquoi les IA citent-elles certaines marques et pas d'autres ?",
        r: "Les LLMs construisent leur représentation du monde à partir des textes sur lesquels ils ont été entraînés. Ils citent les marques qui sont décrites de façon claire, cohérente et répétée dans de nombreuses sources. Si votre marque est décrite différemment sur votre site, votre LinkedIn et dans la presse, les LLMs peinent à construire une représentation fiable — et préfèrent citer des marques dont l'identité est sans ambiguïté.",
      },
      {
        q: "L'AIO est-il réservé aux grandes entreprises ?",
        r: "Non — c'est même l'inverse. Les grandes entreprises ont une notoriété naturelle qui les fait déjà apparaître dans les LLMs. Les PME, elles, doivent construire activement leur présence IA. L'AIO est la discipline qui permet aux petites et moyennes entreprises de rivaliser sur ce terrain en optimisant des signaux accessibles : cohérence du positionnement, structure du contenu, présence multi-sources.",
      },
    ],
  },
  {
    categorie: "Otarcy & son fonctionnement",
    couleur: "#60a5fa",
    questions: [
      {
        q: "Qu'est-ce qu'Otarcy exactement ?",
        r: "Otarcy est le premier outil SaaS français d'AI Optimization (AIO) pour les PME. Il permet à n'importe quelle entreprise d'analyser sa visibilité auprès des intelligences artificielles, d'obtenir un score AIO sur 10, et de recevoir un plan d'action personnalisé pour améliorer sa présence dans les réponses de ChatGPT, Claude, Gemini et Perplexity.",
      },
      {
        q: "Comment fonctionne l'audit Otarcy concrètement ?",
        r: "L'utilisateur saisit le nom de sa marque. Otarcy interroge le modèle Groq (llama-3.3-70b) pour analyser en temps réel comment les LLMs perçoivent cette marque. L'audit génère un score AIO sur 10, une analyse des forces et faiblesses, des recommandations priorisées, et pour les plans Pro et Agence : une analyse SWOT complète, des KPIs de marque, des templates LinkedIn et un plan de contenu.",
      },
      {
        q: "Combien d'audits puis-je faire gratuitement ?",
        r: "Le plan Découverte (gratuit, sans carte bancaire) offre 3 audits. Les plans AIO Essentiel (19€/mois) et AIO Expert (99€/mois) donnent accès à des audits illimités et à des fonctionnalités avancées comme le SWOT, les KPIs, l'export PDF et les templates LinkedIn.",
      },
      {
        q: "Les résultats d'Otarcy sont-ils fiables ?",
        r: "Otarcy utilise un LLM de pointe (llama-3.3-70b via Groq) pour simuler la façon dont les IAs perçoivent une marque. Les résultats reflètent l'état actuel de la représentation de votre marque dans les modèles de langage. Comme tout outil basé sur l'IA, les analyses sont des indicateurs fiables — pas des certitudes absolues. Nous recommandons de combiner l'audit Otarcy avec des tests manuels dans ChatGPT et Perplexity.",
      },
    ],
  },
  {
    categorie: "Stratégie & mise en œuvre",
    couleur: "#f97316",
    questions: [
      {
        q: "Par où commencer pour optimiser ma marque pour les IA ?",
        r: "La première étape est de tester comment les IA vous perçoivent aujourd'hui : demandez à ChatGPT et Perplexity « qui est [nom de votre marque] ? » et notez les résultats. Ensuite, les 3 actions prioritaires sont : (1) définir une phrase de positionnement claire et la répliquer sur toutes vos sources, (2) ajouter un balisage Schema.org sur votre site, (3) créer une page FAQ structurée. Un audit Otarcy vous donnera un plan d'action personnalisé en quelques secondes.",
      },
      {
        q: "Combien de temps faut-il pour voir des résultats AIO ?",
        r: "Les LLMs intègrent les nouvelles informations lors de leurs phases d'entraînement, qui ont lieu tous les quelques mois. Pour les IAs avec recherche web en temps réel (Perplexity, ChatGPT avec recherche), les améliorations peuvent être visibles en quelques semaines. Pour les modèles sans accès web, les changements sont visibles sur les modèles mis à jour, généralement dans un délai de 3 à 6 mois. C'est pourquoi l'AIO est un investissement long terme — commencer tôt donne un avantage durable.",
      },
      {
        q: "Le contenu de mon site suffit-il pour être visible dans les IA ?",
        r: "Non. La visibilité IA repose sur la triangulation de plusieurs sources. Un LLM compare ce que dit votre site avec ce que disent votre LinkedIn, les mentions presse, les annuaires, les avis clients. Si ces sources sont cohérentes, votre marque est représentée clairement. Si elles divergent, le LLM produit une représentation floue — ou vous ignore. Il faut donc une stratégie multi-sources, pas seulement un site bien écrit.",
      },
      {
        q: "Faut-il avoir un blog pour faire de l'AIO ?",
        r: "Un blog aide, mais ce n'est pas indispensable. Ce qui compte le plus pour l'AIO, c'est la qualité et la cohérence du contenu existant, pas la quantité. Une page À propos bien structurée en Q&A, une page FAQ, un balisage Schema.org et une bio LinkedIn alignée ont plus d'impact qu'un blog de 50 articles mal optimisés. Cela dit, produire du contenu de référence (glossaires, études de cas, données originales) renforce progressivement l'autorité thématique de votre marque.",
      },
    ],
  },
  {
    categorie: "Abonnement & données",
    couleur: "#7a7a7a",
    questions: [
      {
        q: "Mes données sont-elles sécurisées ?",
        r: "Otarcy utilise Supabase pour l'authentification et le stockage des données, avec Row Level Security (RLS) activé — chaque utilisateur n'accède qu'à ses propres données. Les paiements sont gérés par Stripe, qui est certifié PCI-DSS. Vos données ne sont jamais revendues ni utilisées pour entraîner des modèles d'IA tiers.",
      },
      {
        q: "Puis-je annuler mon abonnement à tout moment ?",
        r: "Oui. Les abonnements Otarcy sont mensuels et sans engagement. Vous pouvez annuler à tout moment depuis votre tableau de bord. Après annulation, vous conservez l'accès aux fonctionnalités de votre plan jusqu'à la fin de la période payée.",
      },
      {
        q: "Otarcy propose-t-il des tarifs pour les agences ?",
        r: "Le plan AIO Expert (99€/mois) est conçu pour les agences et consultants marketing. Il inclut des audits illimités, la stratégie marketing IA complète et les Quick Wins. Pour des besoins spécifiques ou des volumes importants, contactez-nous directement via LinkedIn.",
      },
    ],
  },
];

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Faq() {
  const [ouvert, setOuvert] = useState<string | null>(null);
  useReveal();

  const totalQuestions = FAQ.reduce((acc, cat) => acc + cat.questions.length, 0);

  const toggle = (key: string) => setOuvert(ouvert === key ? null : key);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
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
            "mainEntity": FAQ.flatMap((cat) =>
              cat.questions.map((item) => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.r,
                },
              }))
            ),
          }),
        }}
      />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 36px",
        background: "rgba(10,10,10,0.95)",
        borderBottom: "1px solid #1a1a1a",
        backdropFilter: "blur(12px)",
      }}>
        <Link to="/" style={{ display: "flex", flexDirection: "column", lineHeight: 0.9, textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>OT</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", letterSpacing: "0.15em", color: "#7a7a7a" }}>CY</span>
        </Link>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
          >← ACCUEIL</Link>
          <Link to="/glossaire" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7a7a7a", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7a7a7a")}
          >GLOSSAIRE</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", padding: "140px 60px 60px", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#a3e635", textTransform: "uppercase", marginBottom: "16px", fontWeight: 500 }}>
            Ressource — FAQ
          </p>
          <h1 className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.06em", color: "#f0f0f0", lineHeight: 0.95, marginBottom: "24px" }}>
            QUESTIONS FRÉQUENTES
          </h1>
          <p className="reveal" style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.88rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, maxWidth: "580px" }}>
            {totalQuestions} questions sur l'AI Optimization, le fonctionnement d'Otarcy et la stratégie AIO pour les PME françaises.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "60px 60px 100px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {FAQ.map((categorie, ci) => (
            <div key={ci} className="reveal" style={{ marginBottom: "56px" }}>

              {/* Titre catégorie */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ width: "3px", height: "24px", background: categorie.couleur, flexShrink: 0 }} />
                <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", color: categorie.couleur, textTransform: "uppercase", fontWeight: 500 }}>
                  {categorie.categorie}
                </p>
              </div>

              {/* Questions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#1a1a1a" }}>
                {categorie.questions.map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const isOpen = ouvert === key;
                  return (
                    <div key={qi} style={{ background: "#0f0f0f" }}>
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        style={{
                          width: "100%", textAlign: "left", background: "transparent",
                          border: "none", cursor: "pointer", padding: "20px 24px",
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          gap: "16px",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget.parentElement as HTMLDivElement).style.background = "#111"; }}
                        onMouseLeave={(e) => { if (!isOpen) (e.currentTarget.parentElement as HTMLDivElement).style.background = "#0f0f0f"; }}
                      >
                        <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.82rem", color: isOpen ? "#f0f0f0" : "#d4d4d4", fontWeight: isOpen ? 600 : 400, lineHeight: 1.5, margin: 0, flex: 1 }}>
                          {item.q}
                        </p>
                        <span style={{ color: isOpen ? "#a3e635" : "#4a4a4a", fontSize: "1rem", flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block", marginTop: "2px" }}>
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div style={{ padding: "0 24px 24px", borderTop: "1px solid #1a1a1a" }}>
                          <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.78rem", color: "#7a7a7a", lineHeight: 1.9, fontWeight: 300, margin: "16px 0 0 0" }}>
                            {item.r}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Liens vers ressources */}
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }}>
            <Link to="/glossaire" style={{ textDecoration: "none", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", display: "block", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#a3e635"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; }}
            >
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#a3e635", marginBottom: "8px" }}>GLOSSAIRE AIO →</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6 }}>
                Tous les termes essentiels de l'AI Optimization définis clairement.
              </p>
            </Link>
            <Link to="/pricing" style={{ textDecoration: "none", padding: "24px", border: "1px solid #2a2a2a", background: "#0f0f0f", display: "block", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#60a5fa"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a2a"; }}
            >
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em", color: "#60a5fa", marginBottom: "8px" }}>TARIFS →</p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.72rem", color: "#7a7a7a", fontWeight: 300, lineHeight: 1.6 }}>
                Comparez les plans Découverte, AIO Essentiel et AIO Expert.
              </p>
            </Link>
          </div>

          {/* CTA */}
          <div className="reveal" style={{ padding: "32px", border: "1px solid #a3e635", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: "#f0f0f0", marginBottom: "6px" }}>
                PRÊT POUR L'AUDIT AIO ?
              </p>
              <p style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.75rem", color: "#7a7a7a", fontWeight: 300 }}>
                3 audits gratuits — sans carte bancaire.
              </p>
            </div>
            <Link to="/#audit"
              style={{ fontFamily: "'Raleway', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", padding: "12px 28px", background: "#a3e635", color: "#0f0f0f", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Auditer ma marque →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
