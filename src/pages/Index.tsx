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
    <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
const Hero = () => (
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
      Agence de création web
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
      Création de landing pages professionnelles
    </p>
  </section>
);

// ─── SECTION 02 — SERVICES ────────────────────────────
const mockProjects = [
  { title: "RESTAURANT & CAFÉ", sub: "Landing page + SEO", tags: ["Responsive", "Formulaire", "SEO"] },
  { title: "CABINET MÉDICAL", sub: "Site vitrine complet", tags: ["Mobile-first", "Hébergement", "Support"] },
  { title: "AGENCE IMMOBILIÈRE", sub: "Page de conversion", tags: ["CTA optimisé", "Rapide", "Moderne"] },
];

interface Project {
  title: string;
  sub: string;
  tags: string[];
}

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <div className="reveal" style={{ transitionDelay: `${index * 0.12}s` }}>
    <div
      style={{
        background: "#1c1c1c",
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
        aspectRatio: "4/3",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.04)",
        transition: "transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.4s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px",
          background: "linear-gradient(transparent, rgba(15,15,15,0.9))",
        }}
      >
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: "#7a7a7a",
            marginBottom: "6px",
          }}
        >
          {project.sub}
        </p>
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.35rem",
            letterSpacing: "0.08em",
            color: "#f0f0f0",
          }}
        >
          {project.title}
        </h3>
      </div>
    </div>
    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
      {project.tags.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "#4a4a4a",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const offerItems = [
  "Responsive (mobile, tablette, desktop)",
  "Optimisation SEO de base",
  "Formulaire de contact fonctionnel",
  "Hébergement inclus",
  "Révisions illimitées jusqu'à validation (24h)",
  "Support technique pendant 30 jours",
];

const Services = () => (
  <section
    id="services"
    style={{ minHeight: "100vh", background: "#0f0f0f", padding: "120px 60px 80px", position: "relative" }}
  >
    <span
      style={{
        position: "absolute",
        bottom: "40px",
        left: "60px",
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        color: "#4a4a4a",
      }}
    >
      .02
    </span>

    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        maxWidth: "1100px",
        margin: "0 auto 70px",
      }}
    >
      <div>
        <p
          className="reveal"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            color: "#7a7a7a",
            textTransform: "uppercase",
            marginBottom: "14px",
            fontWeight: 500,
          }}
        >
          Ce que nous offrons
        </p>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            letterSpacing: "0.05em",
            color: "#f0f0f0",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          NOS SERVICES
        </h2>
      </div>
      <p
        className="reveal"
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.75rem",
          color: "#7a7a7a",
          maxWidth: "280px",
          textAlign: "right",
          lineHeight: 1.8,
          fontWeight: 300,
        }}
      >
        Une offre unique, simple et complète. Tout ce dont votre entreprise a besoin pour être présente en ligne —
        sans complication.
      </p>
    </div>

    {/* Project cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "28px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {mockProjects.map((p, i) => (
        <ProjectCard key={i} project={p} index={i} />
      ))}
    </div>

    {/* Offer box */}
    <div
      className="reveal"
      style={{
        maxWidth: "1100px",
        margin: "70px auto 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#1c1c1c",
        borderRadius: "4px",
        padding: "44px 48px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "#7a7a7a",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontWeight: 500,
          }}
        >
          Offre unique
        </p>
        <h3
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2.8rem",
            color: "#f0f0f0",
            letterSpacing: "0.03em",
          }}
        >
          769€
        </h3>
        <p
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.7rem",
            color: "#4a4a4a",
            marginTop: "4px",
            letterSpacing: "0.1em",
          }}
        >
          TOUT INCLUS — UNE FOIS
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {offerItems.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#e8e8e8", fontSize: "0.7rem" }}>—</span>
            <span
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.72rem",
                color: "#7a7a7a",
                letterSpacing: "0.06em",
                fontWeight: 300,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* CTA link */}
    <div className="reveal" style={{ textAlign: "center", marginTop: "56px" }}>
      <Link
        to="/#contact"
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.68rem",
          letterSpacing: "0.28em",
          color: "#7a7a7a",
          textDecoration: "none",
          textTransform: "uppercase",
          fontWeight: 500,
          borderBottom: "1px solid #4a4a4a",
          paddingBottom: "4px",
          transition: "color 0.3s, border-color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#e8e8e8";
          e.currentTarget.style.borderBottomColor = "#e8e8e8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#7a7a7a";
          e.currentTarget.style.borderBottomColor = "#4a4a4a";
        }}
      >
        Démarrer un projet →
      </Link>
    </div>
  </section>
);

// ─── SECTION 03 — CONTACT ─────────────────────────────
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #4a4a4a",
    color: "#f0f0f0",
    fontFamily: "'Raleway', sans-serif",
    fontSize: "0.78rem",
    fontWeight: 300,
    padding: "10px 0",
    width: "100%",
    outline: "none",
    letterSpacing: "0.08em",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Raleway', sans-serif",
    fontSize: "0.58rem",
    letterSpacing: "0.2em",
    color: "#4a4a4a",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
    fontWeight: 500,
  };

  const contactDetails = [
    { label: "Adresse", value: "Paris, France" },
    { label: "Téléphone", value: "+33 6 XX XX XX XX" },
    { label: "E-mail", value: "contact@otarcy.com" },
  ];

  const fields = [
    { label: "Votre nom", name: "name" as keyof FormData, type: "text", placeholder: "Jean Dupont", required: true },
    { label: "Votre email", name: "email" as keyof FormData, type: "email", placeholder: "jean@entreprise.com", required: true },
    { label: "Téléphone", name: "phone" as keyof FormData, type: "tel", placeholder: "+33 6 XX XX XX XX", required: false },
  ];

  return (
    <section
      id="contact"
      style={{
        minHeight: "100vh",
        background: "#161616",
        padding: "120px 60px 80px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: "#4a4a4a",
        }}
      >
        .03
      </span>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          width: "100%",
        }}
      >
        {/* Left — Info */}
        <div>
          <p
            className="reveal"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "#7a7a7a",
              textTransform: "uppercase",
              marginBottom: "14px",
              fontWeight: 500,
            }}
          >
            Prise de contact
          </p>
          <h2
            className="reveal"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              letterSpacing: "0.05em",
              color: "#f0f0f0",
              textTransform: "uppercase",
              lineHeight: 1,
              marginBottom: "40px",
            }}
          >
            CONTACT
          </h2>
          <p
            className="reveal"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.76rem",
              color: "#7a7a7a",
              lineHeight: 2,
              fontWeight: 300,
              marginBottom: "48px",
              maxWidth: "340px",
            }}
          >
            Vous avez un projet en tête ? Envoyez-nous vos détails et nous vous recontacterons dans les 24 heures pour
            discuter de votre landing page.
          </p>

          {contactDetails.map((item, i) => (
            <div className="reveal" key={i} style={{ transitionDelay: `${i * 0.1}s`, marginBottom: "24px" }}>
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  color: "#4a4a4a",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.76rem",
                  color: "#7a7a7a",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Right — Form */}
        <div>
          <h3
            className="reveal"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.6rem",
              letterSpacing: "0.12em",
              color: "#f0f0f0",
              textTransform: "uppercase",
              marginBottom: "36px",
            }}
          >
            FORMULAIRE DE CONTACT
          </h3>

          {sent && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "4px",
                padding: "12px 18px",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.72rem",
                  color: "#4ade80",
                  letterSpacing: "0.08em",
                }}
              >
                ✓ Message envoyé avec succès ! Nous vous recontacterons bientôt.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map((field, i) => (
              <div className="reveal" key={field.name} style={{ marginBottom: "22px", transitionDelay: `${(i + 1) * 0.1}s` }}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  required={field.required}
                />
              </div>
            ))}

            <div className="reveal" style={{ marginBottom: "32px", transitionDelay: "0.4s" }}>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Décrivez votre projet..."
                style={{ ...inputStyle, resize: "none", minHeight: "70px" }}
                required
              />
            </div>

            <div className="reveal" style={{ transitionDelay: "0.5s" }}>
              <button
                type="submit"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.28em",
                  color: "#0f0f0f",
                  background: "#e8e8e8",
                  border: "none",
                  padding: "14px 32px",
                  borderRadius: "2px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  transition: "background 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#fff";
                  (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#e8e8e8";
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                Envoyer le message →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// ─── PAGE EXPORT ──────────────────────────────────────
const Index = () => {
  useReveal();

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh" }}>
      <Navbar />
      <SideLeft />
      <SideRight />
      <Hero />
      <Services />
      <Contact />
    </div>
  );
};

export default Index;
