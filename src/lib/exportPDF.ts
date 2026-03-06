import jsPDF from "jspdf";

interface AuditData {
  brand: string;
  score: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at?: string;
  userEmail?: string;
}

export function exportAuditPDF(audit: AuditData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  let y = 0;

  // ─── COULEURS ────────────────────────────────────────
  const BLACK = [15, 15, 15] as [number, number, number];
  const DARK = [22, 22, 22] as [number, number, number];
  const WHITE = [240, 240, 240] as [number, number, number];
  const MUTED = [122, 122, 122] as [number, number, number];
  const DIM = [74, 74, 74] as [number, number, number];
  const GREEN = [163, 230, 53] as [number, number, number];
  const RED = [239, 68, 68] as [number, number, number];
  const scoreColor: [number, number, number] =
    audit.score >= 7 ? GREEN : audit.score >= 5 ? WHITE : RED;

  // ─── FOND NOIR TOTAL ─────────────────────────────────
  doc.setFillColor(...BLACK);
  doc.rect(0, 0, W, H, "F");

  // ─── HEADER BAND ─────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 52, "F");

  // Logo OTARCY
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text("OT", 14, 18);
  doc.setTextColor(...MUTED);
  doc.text("AR", 14, 26);

  // Trait vertical séparateur logo
  doc.setDrawColor(...DIM);
  doc.setLineWidth(0.3);
  doc.line(34, 10, 34, 34);

  // Titre audit
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("AIO BRAND AUDIT", 40, 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...WHITE);
  doc.text(audit.brand.toUpperCase(), 40, 28);

  // Date
  const date = audit.created_at
    ? new Date(audit.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...DIM);
  doc.text(date, 40, 36);
  if (audit.userEmail) {
    doc.text(audit.userEmail, 40, 42);
  }

  // Score cercle
  const cx = 182;
  const cy = 26;
  const r = 16;
  doc.setDrawColor(...DIM);
  doc.setLineWidth(1.5);
  doc.circle(cx, cy, r, "S");
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(2);
  // Arc approximé avec segments
  const segments = 36;
  const filled = Math.round((audit.score / 10) * segments);
  for (let i = 0; i < filled; i++) {
    const a1 = ((i / segments) * 360 - 90) * (Math.PI / 180);
    const a2 = (((i + 1) / segments) * 360 - 90) * (Math.PI / 180);
    doc.line(
      cx + r * Math.cos(a1), cy + r * Math.sin(a1),
      cx + r * Math.cos(a2), cy + r * Math.sin(a2)
    );
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WHITE);
  doc.text(`${audit.score}`, cx - (audit.score >= 10 ? 5 : 3), cy + 3);
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("/10", cx - 2, cy + 9);

  y = 62;

  // ─── SECTION ANALYSE ─────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(14, y - 4, W - 28, 2, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("ANALYSE", 14, y + 2);

  doc.setDrawColor(...DIM);
  doc.setLineWidth(0.2);
  doc.line(14, y + 5, W - 14, y + 5);

  y += 10;

  // Texte analyse avec wrap
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 212, 212);
  const analysisLines = doc.splitTextToSize(audit.analysis, W - 28);
  doc.text(analysisLines, 14, y);
  y += analysisLines.length * 5.5 + 10;

  // ─── 3 COLONNES ──────────────────────────────────────
  const colW = (W - 28 - 8) / 3;
  const col1x = 14;
  const col2x = col1x + colW + 4;
  const col3x = col2x + colW + 4;

  const sections = [
    { title: "FORCES", items: audit.strengths, color: GREEN, symbol: "+" },
    { title: "FAIBLESSES", items: audit.weaknesses, color: RED, symbol: "−" },
    { title: "RECOMMANDATIONS", items: audit.recommendations, color: WHITE, symbol: "→" },
  ];

  const colXs = [col1x, col2x, col3x];
  const colStartY = y;
  let maxColH = 0;

  sections.forEach((section, idx) => {
    const x = colXs[idx];
    let cy2 = colStartY;

    // Header colonne
    doc.setFillColor(...DARK);
    doc.rect(x, cy2 - 4, colW, 12, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(section.title, x + 4, cy2 + 3);

    cy2 += 14;

    section.items.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...section.color);
      doc.text(section.symbol, x + 2, cy2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(212, 212, 212);
      const lines = doc.splitTextToSize(item, colW - 10);
      doc.text(lines, x + 8, cy2);
      cy2 += lines.length * 4.8 + 4;
    });

    maxColH = Math.max(maxColH, cy2 - colStartY);
  });

  y = colStartY + maxColH + 16;

  // ─── FOOTER ──────────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, H - 18, W, 18, "F");

  doc.setDrawColor(...DIM);
  doc.setLineWidth(0.2);
  doc.line(14, H - 18, W - 14, H - 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...DIM);
  doc.text("OTARCY — AIO Brand Audit", 14, H - 9);
  doc.text("blackotarcyweb.vercel.app", W - 14, H - 9, { align: "right" });

  // ─── TÉLÉCHARGEMENT ──────────────────────────────────
  const filename = `otarcy-audit-${audit.brand.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
