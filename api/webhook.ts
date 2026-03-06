import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const PLAN_LIMITS: Record<string, number> = {
  pro: -1,     // illimité
  agency: -1,  // illimité
  free: 3,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const clerkUserId = session.metadata?.clerk_user_id;
    const plan = session.metadata?.plan;

    if (!clerkUserId || !plan) {
      return res.status(400).json({ error: "Metadata manquante." });
    }

    const { error } = await supabase
      .from("users")
      .update({
        plan,
        audits_limit: PLAN_LIMITS[plan] ?? 3,
        audits_used: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clerkUserId);

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ error: "Erreur mise à jour utilisateur." });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const clerkUserId = subscription.metadata?.clerk_user_id;

    if (clerkUserId) {
      await supabase
        .from("users")
        .update({
          plan: "free",
          audits_limit: 3,
          audits_used: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clerkUserId);
    }
  }

  return res.status(200).json({ received: true });
}

// Lit le body brut pour Stripe (nécessaire pour la vérification de signature)
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
