import { Groq } from "groq-sdk";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Autorisé seulement en POST' }), { status: 405 });
  }

  try {
    const { brand } = await req.json();
    const key = process.env.GROQ_API_KEY;

    if (!key) {
      return new Response(JSON.stringify({ error: 'Clé API manquante dans Vercel' }), { status: 500 });
    }

    const groq = new Groq({ apiKey: key });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Tu es un expert marketing. Réponds UNIQUEMENT en JSON valide avec ces clés : score (nombre), analysis (texte), recommendations (tableau de textes)."
        },
        {
          role: "user",
          content: `Analyse la marque : ${brand}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    
    return new Response(content, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Erreur interne : ' + error.message }), { status: 500 });
  }
}