import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { verifyClerkAuth } from "./_auth";
import { checkRateLimit } from "./_ratelimit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

const VALID_PLANS = ["pro", "agency"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "https://blackotarcyweb.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const clerkUserId = await verifyClerkAuth(req.headers["authorization"] as string);
  if (!clerkUserId) return res.status(401).json({ error: "Token invalide ou expiré." });

  // Rate limit checkout — 5 tentatives/minute
  const { allowed } = checkRateLimit(`checkout:${clerkUserId}`, 5, 60_000);
  if (!allowed) return res.status(429).json({ error: "Trop de tentatives. Attendez une minute." });

  const { plan } = req.body;
  if (!plan || !VALID_PLANS.includes(plan) || !PRICE_IDS[plan]) {
    return res.status(400).json({ error: "Plan invalide." });
  }

  const userEmail = req.headers["x-clerk-user-email"] as string | undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      ...(userEmail ? { customer_email: userEmail } : {}),
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      metadata: { clerk_user_id: clerkUserId, plan },
      success_url: "https://blackotarcyweb.vercel.app/?success=true",
      cancel_url: "https://blackotarcyweb.vercel.app/pricing?canceled=true",
    });

    return res.status(200).json({ url: session.url });
  } catch {
    return res.status(500).json({ error: "Erreur lors de la création du paiement." });
  }
}
