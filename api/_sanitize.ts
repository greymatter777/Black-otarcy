/**
 * Nettoie et valide le nom de marque.
 * - Strip HTML / balises
 * - Limite la longueur
 * - Retire les caractères de contrôle et injections prompt
 */
export function sanitizeBrand(input: unknown): { valid: boolean; value: string; error?: string } {
  if (typeof input !== "string") {
    return { valid: false, value: "", error: "Le nom de la marque doit être une chaîne de caractères." };
  }

  // Strip HTML tags
  let clean = input.replace(/<[^>]*>/g, "");

  // Strip control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, "");

  // Retire les tentatives d'injection de prompt
  const promptInjectionPatterns = [
    /ignore previous instructions/i,
    /ignore all instructions/i,
    /you are now/i,
    /act as/i,
    /jailbreak/i,
    /system:/i,
    /\[INST\]/i,
  ];

  for (const pattern of promptInjectionPatterns) {
    if (pattern.test(clean)) {
      return { valid: false, value: "", error: "Nom de marque invalide." };
    }
  }

  // Trim et limite longueur
  clean = clean.trim();

  if (clean.length === 0) {
    return { valid: false, value: "", error: "Le nom de la marque est requis." };
  }

  if (clean.length > 100) {
    return { valid: false, value: "", error: "Le nom de la marque ne peut pas dépasser 100 caractères." };
  }

  return { valid: true, value: clean };
}
