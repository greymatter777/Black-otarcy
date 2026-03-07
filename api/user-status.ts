import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { verifyClerkAuth } from "../lib/auth";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-clerk-user-id, x-clerk-user-email");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const clerkUserId = verifyClerkAuth(req);
  if (!clerkUserId) return res.status(401).json({ error: "Non authentifié." });

  const userEmail = req.headers["x-clerk-user-email"] as string ?? "";

  let { data: user, error } = await supabase
    .from("users").select("*").eq("id", clerkUserId).single();

  if (error || !user) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({ id: clerkUserId, email: userEmail, plan: "free", audits_used: 0, audits_limit: 3 })
      .select().single();
    if (insertError) return res.status(500).json({ error: "Erreur serveur." });
    user = newUser;
  }

  return res.status(200).json({
    auditsLeft: user.audits_limit === -1 ? 999 : Math.max(0, user.audits_limit - user.audits_used),
    auditsUsed: user.audits_used,
    auditsLimit: user.audits_limit,
    plan: user.plan,
    email: user.email,
  });
}
