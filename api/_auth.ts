/**
 * Vérifie l'authentification via le header x-clerk-user-id.
 * Version simplifiée sans @clerk/backend — compatible avec le plan gratuit Vercel.
 * La vérification JWT complète peut être activée plus tard avec @clerk/backend.
 */
export function verifyClerkAuth(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const userId = req.headers["x-clerk-user-id"];
  if (!userId || typeof userId !== "string" || userId.trim() === "") return null;
  // Vérifie le format Clerk user ID (commence par "user_")
  if (!userId.startsWith("user_")) return null;
  return userId.trim();
}
