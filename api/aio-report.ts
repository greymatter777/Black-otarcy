import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brand, auditId } = req.body;

  if (!brand || typeof brand !== "string") {
    return res.status(400).json({ error: "Le nom de la marque est requis." });
  }

  const clerkUserId = req.headers["x-clerk-user-id"] as string;
  if (!clerkUserId) {
    return res.status(401).json({ error: "Non authentifié." });
  }

  // Vérifie le plan — AIO réservé Pro et Agence
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", clerkUserId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }

  if (user.plan === "free") {
    return res.status(403).json({ error: "Le rapport AIO est réservé aux plans Pro et Agence." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API manquante." });
  }

  const isAgency = user.plan === "agency";

  const prompt = `Tu es un expert en AIO (AI Optimization) — l'optimisation de la présence des marques dans les réponses des intelligences artificielles (ChatGPT, Claude, Gemini, Perplexity, etc.).

Effectue un audit AIO complet de la marque "${brand.trim()}".

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

    if (!groqRes.ok) {
      return res.status(502).json({ error: "Erreur IA." });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";

    let parsed: any;
    try {
      const clean = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "Réponse IA invalide. Réessayez." });
    }

    // Sauvegarde dans Supabase si auditId fourni
    if (auditId) {
      await supabase
        .from("audits")
        .update({ aio: parsed })
        .eq("id", auditId)
        .eq("user_id", clerkUserId);
    }

    return res.status(200).json({ ...parsed, plan: user.plan });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
}
