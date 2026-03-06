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

  const { brand } = req.body;

  if (!brand || typeof brand !== "string" || brand.trim().length === 0) {
    return res.status(400).json({ error: "Le nom de la marque est requis." });
  }

  const clerkUserId = req.headers["x-clerk-user-id"] as string;
  if (!clerkUserId) {
    return res.status(401).json({ error: "Vous devez être connecté pour lancer un audit." });
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", clerkUserId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }

  if (user.audits_limit !== -1 && user.audits_used >= user.audits_limit) {
    return res.status(403).json({ error: "Limite d'audits atteinte. Passez au plan Pro." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API Groq manquante côté serveur." });
  }

  const isPro = user.plan === "pro" || user.plan === "agency";

  const prompt = `Tu es un expert en branding et en stratégie de marque. Effectue un audit complet de la marque "${brand.trim()}".

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :
{
  "score": <nombre entier de 1 à 10>,
  "analysis": "<analyse de 3-4 phrases sur la présence, la notoriété et l'image de la marque>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "weaknesses": ["<faiblesse 1>", "<faiblesse 2>"],
  "recommendations": ["<recommandation 1>", "<recommandation 2>", "<recommandation 3>"]${isPro ? `,
  "swot": {
    "strengths": ["<force stratégique 1>", "<force stratégique 2>", "<force stratégique 3>"],
    "weaknesses": ["<faiblesse stratégique 1>", "<faiblesse stratégique 2>", "<faiblesse stratégique 3>"],
    "opportunities": ["<opportunité 1>", "<opportunité 2>", "<opportunité 3>"],
    "threats": ["<menace 1>", "<menace 2>", "<menace 3>"]
  },
  "kpis": {
    "notoriete": <score 0-100>,
    "coherence": <score 0-100>,
    "digital": <score 0-100>,
    "contenu": <score 0-100>
  }` : ""}
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
        max_tokens: isPro ? 2000 : 1000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", groqRes.status, errText);
      return res.status(502).json({ error: "Erreur lors de l'appel à l'IA." });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";

    let parsed: any;
    try {
      const clean = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("JSON parse error. Raw content:", rawContent);
      return res.status(500).json({ error: "Réponse IA invalide. Réessayez." });
    }

    // Sauvegarde dans Supabase
    await supabase.from("audits").insert({
      user_id: clerkUserId,
      brand: brand.trim(),
      score: parsed.score ?? 0,
      analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [],
      swot: parsed.swot ?? null,
      kpis: parsed.kpis ?? null,
    });

    await supabase
      .from("users")
      .update({ audits_used: user.audits_used + 1, updated_at: new Date().toISOString() })
      .eq("id", clerkUserId);

    return res.status(200).json({
      score: parsed.score ?? 0,
      analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [],
      swot: parsed.swot ?? null,
      kpis: parsed.kpis ?? null,
      plan: user.plan,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
}
