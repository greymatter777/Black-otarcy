import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clerkUserId = req.headers["x-clerk-user-id"] as string;
  if (!clerkUserId) {
    return res.status(401).json({ error: "Non authentifié." });
  }

  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("user_id", clerkUserId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Erreur lors de la récupération de l'historique." });
  }

  return res.status(200).json({ audits: data ?? [] });
}
