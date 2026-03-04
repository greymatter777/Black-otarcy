import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brand } = req.body;

  if (!brand || typeof brand !== "string" || brand.trim().length === 0) {
    return res.status(400).json({ error: "Le nom de la marque est requis." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API Groq manquante côté serveur." });
  }

  const prompt = `Tu es un expert en branding et en stratégie de marque. Effectue un audit complet de la marque "${brand.trim()}".

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :
{
  "score": <nombre entier de 1 à 10>,
  "analysis": "<analyse de 3-4 phrases sur la présence, la notoriété et l'image de la marque>",
  "strengths": ["<force 1>", "<force 2>", "<force 3>"],
  "weaknesses": ["<faiblesse 1>", "<faiblesse 2>"],
  "recommendations": ["<recommandation 1>", "<recommandation 2>", "<recommandation 3>"]
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
        max_tokens: 1000,
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
      // Strip possible markdown fences
      const clean = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("JSON parse error. Raw content:", rawContent);
      return res.status(500).json({ error: "Réponse IA invalide. Réessayez." });
    }

    return res.status(200).json({
      score: parsed.score ?? 0,
      analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [],
      weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [],
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Erreur serveur inattendue." });
  }
}
