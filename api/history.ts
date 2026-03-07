import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyClerkAuth } from "./_auth";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const clerkUserId = await verifyClerkAuth(req.headers["authorization"] as string);
  if (!clerkUserId) return res.status(401).json({ error: "Token invalide ou expiré." });

  const { data, error } = await supabase
    .from("audits").select("*").eq("user_id", clerkUserId)
    .order("created_at", { ascending: false }).limit(50);

  if (error) return res.status(500).json({ error: "Erreur lors de la récupération de l'historique." });

  return res.status(200).json({ audits: data ?? [] });
}
