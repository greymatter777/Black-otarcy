import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { plan } = req.body;
  const clerkUserId = req.headers["x-clerk-user-id"] as string;
  const userEmail = req.headers["x-clerk-user-email"] as string;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Non authentifié." });
  }

  if (!plan || !PRICE_IDS[plan]) {
    return res.status(400).json({ error: "Plan invalide." });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],
      metadata: {
        clerk_user_id: clerkUserId,
        plan,
      },
      success_url: `${process.env.VITE_APP_URL ?? "https://blackotarcyweb.vercel.app"}/?success=true`,
      cancel_url: `${process.env.VITE_APP_URL ?? "https://blackotarcyweb.vercel.app"}/?canceled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Erreur lors de la création du paiement." });
  }
}
