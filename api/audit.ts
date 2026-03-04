import { Groq } from "groq-sdk";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 405 });
  }

  try {
    const { brand } = await req.json();
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "Tu es un expert marketing. Réponds UNIQUEMENT en JSON avec ces clés : score (nombre), analysis (texte), recommendations (tableau de textes)."
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
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}