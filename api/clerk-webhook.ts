import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Webhook } from "svix";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    return res.status(500).json({ error: "Webhook secret manquant." });
  }

  // Vérification signature Clerk via svix
  const svixId = req.headers["svix-id"] as string;
  const svixTimestamp = req.headers["svix-timestamp"] as string;
  const svixSignature = req.headers["svix-signature"] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: "Headers svix manquants." });
  }

  // Lit le body brut
  const rawBody = await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  let event: any;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ error: "Signature invalide." });
  }

  // Traite l'événement user.created
  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      return res.status(400).json({ error: "Email introuvable." });
    }

    try {
      // Ajoute le contact dans l'audience Resend
      await resend.contacts.create({
        email,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });

      console.log(`✅ Contact ajouté à Resend : ${email}`);
    } catch (err) {
      console.error("Erreur Resend:", err);
      // On ne bloque pas — l'utilisateur est quand même créé
    }
  }

  return res.status(200).json({ received: true });
}
