import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyClerkAuth } from "./_auth";
import { checkRateLimit } from "./_ratelimit";
import { sanitizeBrand } from "./_sanitize";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ─── 1. AUTH JWT Clerk ────────────────────────────────
  const clerkUserId = await verifyClerkAuth(req.headers["authorization"] as string);
  if (!clerkUserId) {
    return res.status(401).json({ error: "Token invalide ou expiré. Reconnectez-vous." });
  }

  // ─── 2. RATE LIMIT — 5 rapports AIO/minute par user ──
  const { allowed } = checkRateLimit(`aio:${clerkUserId}`, 5, 60_000);
  if (!allowed) {
    return res.status(429).json({ error: "Trop de requêtes. Attendez une minute avant de réessayer." });
  }

  // ─── 3. SANITIZE INPUT ────────────────────────────────
  const { valid, value: brand, error: sanitizeError } = sanitizeBrand(req.body?.brand);
  if (!valid) return res.status(400).json({ error: sanitizeError });

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", clerkUserId)
    .single();

  if (userError || !user) return res.status(404).json({ error: "Utilisateur introuvable." });

  if (user.plan === "free") {
    return res.status(403).json({ error: "Le rapport AIO est réservé aux plans Pro et Agence." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration serveur manquante." });

  const isAgency = user.plan === "agency";

  const prompt = `Tu es un expert en AIO (AI Optimization) — l'optimisation de la présence des marques dans les réponses des intelligences artificielles (ChatGPT, Claude, Gemini, Perplexity, etc.).

Effectue un audit AIO complet de la marque "${brand}".

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :
{
  "aio_score": <nombre entier de 1 à 100>,
  "ai_perception": {
    "notoriete_ia": <score 0-100>,
    "sentiment": "<positif|neutre|négatif>",
    "niveau_detail": "<élevé|moyen|faible>",
    "citation_spontanee": <true|false>,
    "resume": "<2-3 phrases sur comment les IAs perçoivent cette marque>"
  },
  "visibilite": {
    "sujets_associes": ["<sujet 1>", "<sujet 2>", "<sujet 3>"],
    "concurrents_mieux_positionnes": ["<concurrent 1>", "<concurrent 2>", "<concurrent 3>"],
    "gaps_contenu": ["<gap 1>", "<gap 2>", "<gap 3>"]
  },
  "plan_optimisation": {
    "actions_prioritaires": [
      {"action": "<action concrète>", "impact": "<élevé|moyen|faible>", "delai": "<court|moyen|long terme>"},
      {"action": "<action concrète>", "impact": "<élevé|moyen|faible>", "delai": "<court|moyen|long terme>"},
      {"action": "<action concrète>", "impact": "<élevé|moyen|faible>", "delai": "<court|moyen|long terme>"}
    ],
    "strategie_contenu": ["<recommandation 1>", "<recommandation 2>", "<recommandation 3>"],
    "strategie_citations": ["<recommandation 1>", "<recommandation 2>"]${isAgency ? `,
    "strategie_marketing_ia": ["<recommandation canal 1>", "<recommandation canal 2>", "<recommandation canal 3>"],
    "quick_wins": ["<action rapide 1>", "<action rapide 2>", "<action rapide 3>"]` : ""}
  }
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqRes.ok) return res.status(502).json({ error: "Erreur IA." });

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";

    let parsed: any;
    try {
      const clean = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "Réponse IA invalide. Réessayez." });
    }

    if (req.body?.auditId) {
      await supabase
        .from("audits")
        .update({ aio: parsed })
        .eq("id", req.body.auditId)
        .eq("user_id", clerkUserId);
    }

    return res.status(200).json({ ...parsed, plan: user.plan });
  } catch {
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
}
