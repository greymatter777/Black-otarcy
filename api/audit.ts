import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyClerkAuth } from "./_auth";
import { checkRateLimit } from "./_ratelimit";
import { sanitizeBrand } from "./_sanitize";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-clerk-user-id, x-clerk-user-email");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // DIAGNOSTIC TEMPORAIRE
  const hasSupabaseUrl = !!process.env.VITE_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_KEY;
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  if (!hasSupabaseUrl || !hasServiceKey || !hasGroqKey) {
    return res.status(500).json({ 
      error: "Variables manquantes",
      debug: { hasSupabaseUrl, hasServiceKey, hasGroqKey }
    });
  }

  const clerkUserId = verifyClerkAuth(req);
  if (!clerkUserId) return res.status(401).json({ error: "Non authentifié." });

  const { allowed } = checkRateLimit(`audit:${clerkUserId}`, 10, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes. Attendez une minute." });

  const { valid, value: brand, error: sanitizeError } = sanitizeBrand(req.body?.brand);
  if (!valid) return res.status(400).json({ error: sanitizeError });

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data: user, error: userError } = await supabase
    .from("users").select("*").eq("id", clerkUserId).single();

  if (userError || !user) return res.status(404).json({ error: "Utilisateur introuvable.", debug: userError?.message });

  if (user.audits_limit !== -1 && user.audits_used >= user.audits_limit) {
    return res.status(403).json({ error: "Limite d'audits atteinte. Passez au plan Pro." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const isPro = user.plan === "pro" || user.plan === "agency";

  const prompt = `Tu es un expert en branding et en stratégie de marque. Effectue un audit complet de la marque "${brand}".

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :
{
  "score": <nombre entier de 1 à 10>,
  "analysis": "<analyse de 3-4 phrases sur la présence, la notoriété et l'image de la marque>",
  "recommendations": ["<recommandation concrète 1>", "<recommandation concrète 2>", "<recommandation concrète 3>"]${isPro ? `,
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: isPro ? 2000 : 1000,
      }),
    });

    if (!groqRes.ok) return res.status(502).json({ error: "Erreur lors de l'appel à l'IA." });

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";

    let parsed: any;
    try {
      const clean = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "Réponse IA invalide. Réessayez." });
    }

    await supabase.from("audits").insert({
      user_id: clerkUserId,
      brand,
      score: parsed.score ?? 0,
      analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [],
      swot: parsed.swot ?? null,
      kpis: parsed.kpis ?? null,
    });

    await supabase.from("users")
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
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur serveur inattendue.", debug: err?.message });
  }
}
