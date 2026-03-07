interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Stockage en mémoire — reset à chaque cold start Vercel
const store = new Map<string, RateLimitEntry>();

/**
 * Vérifie si une clé (userId ou IP) dépasse la limite.
 * @param key      Identifiant unique (userId ou IP)
 * @param limit    Nombre max de requêtes
 * @param windowMs Fenêtre de temps en ms (défaut: 60s)
 */
export function checkRateLimit(key: string, limit: number, windowMs = 60_000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
