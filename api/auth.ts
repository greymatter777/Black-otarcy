import type { VercelRequest } from "@vercel/node";

/**
 * Vérifie l'authentification via le header x-clerk-user-id.
 */
export function verifyClerkAuth(req: VercelRequest): string | null {
  const userId = req.headers["x-clerk-user-id"];
  if (!userId || typeof userId !== "string" || userId.trim() === "") return null;
  if (!userId.startsWith("user_")) return null;
  return userId.trim();
}
