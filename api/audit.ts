import { Groq } from "groq-sdk";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: any) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { brand } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return new Response(JSON.stringify({ error: 'Clé API manquante' }), { status: 500 });
    }

    const groq = new Groq({ apiKey: groqKey });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse de marque. Réponds uniquement en JSON valide avec les clés: score (nombre), analysis (texte), recommendations (tableau de textes)."
        },
        {
          role: "user",
          content: `Analyse la réputation et la présence en ligne de la marque : ${brand}`
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
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}