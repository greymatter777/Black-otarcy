import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

async function verifySupabaseAuth(req: VercelRequest): Promise<{ userId: string; email: string } | null> {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return { userId: user.id, email: user.email ?? "" };
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, limit: number, windowMs = 60_000): { allowed: boolean } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) { rateLimitStore.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true }; }
  if (entry.count >= limit) return { allowed: false };
  entry.count++;
  return { allowed: true };
}

function sanitizeBrand(input: unknown): { valid: boolean; value: string; error?: string } {
  if (typeof input !== "string") return { valid: false, value: "", error: "Nom de marque invalide." };
  let clean = input.replace(/<[^>]*>/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim();
  const injectionPatterns = [/ignore previous instructions/i, /ignore all instructions/i, /you are now/i, /act as/i, /jailbreak/i, /system:/i];
  for (const p of injectionPatterns) { if (p.test(clean)) return { valid: false, value: "", error: "Nom de marque invalide." }; }
  if (!clean) return { valid: false, value: "", error: "Le nom de la marque est requis." };
  if (clean.length > 100) return { valid: false, value: "", error: "100 caractères max." };
  return { valid: true, value: clean };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = await verifySupabaseAuth(req);
  if (!auth) return res.status(401).json({ error: "Non authentifié." });
  const { userId, email } = auth;

  const { allowed } = checkRateLimit(`audit:${userId}`, 10, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de requêtes. Attendez une minute." });

  const { valid, value: brand, error: sanitizeError } = sanitizeBrand(req.body?.brand);
  if (!valid) return res.status(400).json({ error: sanitizeError });

  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

  let { data: user } = await supabase.from("users").select("*").eq("id", userId).single();
  if (!user) {
    await supabase.from("users").insert({ id: userId, email, plan: "free", audits_used: 0, audits_limit: 3 });
    const { data } = await supabase.from("users").select("*").eq("id", userId).single();
    user = data;
  }
  if (!user) return res.status(500).json({ error: "Erreur utilisateur." });
  if (user.audits_limit !== -1 && user.audits_used >= user.audits_limit)
    return res.status(403).json({ error: "Limite d'audits atteinte." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Configuration serveur manquante." });
  const isPro = user.plan === "pro" || user.plan === "agency";

  const prompt = `Tu es un expert en branding. Effectue un audit complet de la marque "${brand}".
Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "score": <1-10>,
  "analysis": "<analyse 3-4 phrases>",
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"]${isPro ? `,
  "swot": { "strengths": ["<s1>","<s2>","<s3>"], "weaknesses": ["<w1>","<w2>","<w3>"], "opportunities": ["<o1>","<o2>","<o3>"], "threats": ["<t1>","<t2>","<t3>"] },
  "kpis": { "notoriete": <0-100>, "coherence": <0-100>, "digital": <0-100>, "contenu": <0-100> }` : ""}
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: isPro ? 2000 : 1000 }),
    });
    if (!groqRes.ok) return res.status(502).json({ error: "Erreur IA." });
    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "";
    let parsed: any;
    try { parsed = JSON.parse(rawContent.replace(/```json|```/g, "").trim()); }
    catch { return res.status(500).json({ error: "Réponse IA invalide. Réessayez." }); }

    await supabase.from("audits").insert({
      user_id: userId, brand, score: parsed.score ?? 0, analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [], weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [], swot: parsed.swot ?? null, kpis: parsed.kpis ?? null,
    });
    await supabase.from("users").update({ audits_used: user.audits_used + 1, updated_at: new Date().toISOString() }).eq("id", userId);

    return res.status(200).json({
      score: parsed.score ?? 0, analysis: parsed.analysis ?? "",
      strengths: parsed.strengths ?? [], weaknesses: parsed.weaknesses ?? [],
      recommendations: parsed.recommendations ?? [], swot: parsed.swot ?? null, kpis: parsed.kpis ?? null, plan: user.plan,
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Erreur serveur.", debug: err?.message });
  }
}
