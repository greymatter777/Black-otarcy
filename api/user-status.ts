import type { VercelRequest, VercelResponse } from "@vercel/node";

// Pour l'instant, retourne 3 audits par défaut.
// On branchera Supabase à l'étape suivante pour persister le compteur.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // TODO: vérifier le token Clerk et lire Supabase
  return res.status(200).json({
    auditsLeft: 3,
    plan: "free",
  });
}
