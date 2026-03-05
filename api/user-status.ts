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

  // Récupère l'ID Clerk depuis le header
  const clerkUserId = req.headers["x-clerk-user-id"] as string;
  const userEmail = req.headers["x-clerk-user-email"] as string;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Non authentifié." });
  }

  // Vérifie si l'utilisateur existe déjà
  let { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", clerkUserId)
    .single();

  // Si l'utilisateur n'existe pas encore, on le crée
  if (error || !user) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: clerkUserId,
        email: userEmail ?? "",
        plan: "free",
        audits_used: 0,
        audits_limit: 3,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur création utilisateur:", insertError);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    user = newUser;
  }

  const auditsLeft =
    user.audits_limit === -1
      ? 999 // illimité
      : Math.max(0, user.audits_limit - user.audits_used);

  return res.status(200).json({
    auditsLeft,
    auditsUsed: user.audits_used,
    auditsLimit: user.audits_limit,
    plan: user.plan,
    email: user.email,
  });
}
