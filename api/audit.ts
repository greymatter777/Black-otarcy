import Groq from "groq-sdk";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const buildUserPrompt = (brand: string) =>
  `Agis comme un expert en analyse de marché.
Fais un résumé de la réputation de ${brand}, cite ses 3 points forts
et donne une note de recommandation de 1 à 10.

Répond STRICTEMENT en JSON avec la structure suivante :
{
  "summary": "texte",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "score": 8
}`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const forceGroq = process.env.USE_GROQ === "1";

  const useGroq =
    !!groqKey && (forceGroq || (!openaiKey && !anthropicKey));

  const { brand } = req.body || {};

  if (!brand || typeof brand !== "string") {
    return res.status(400).json({
      error: "Le champ 'brand' (string) est requis dans le corps de la requête.",
    });
  }

  const userPrompt = buildUserPrompt(brand);

  try {
    if (useGroq) {
      console.log("Utilisation du moteur : Groq (Llama 3)");

      const groq = new Groq({
        apiKey: groqKey,
      });

      const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert en analyse de marché. Réponds uniquement en JSON valide.",
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.3,
      });

      const groqContent =
        completion.choices?.[0]?.message?.content ?? null;

      let groqParsed: any = null;
      try {
        if (typeof groqContent === "string") {
          groqParsed = JSON.parse(groqContent);
        }
      } catch (e) {
        console.warn(
          "Impossible de parser la réponse Groq (Llama 3) en JSON:",
          e
        );
      }

      const score = groqParsed?.score ?? null;
      const summary =
        groqParsed?.summary ??
        groqParsed?.analysis ??
        groqContent;
      const strengths =
        groqParsed?.strengths ?? groqParsed?.points_forts ?? null;

      const responsePayload = {
        brand,
        // On conserve la même structure que précédemment
        openai: {
          score,
          summary,
          strengths,
          raw: groqContent,
        },
        anthropic: {
          score,
          summary,
          strengths,
          raw: groqContent,
        },
      };

      return res.status(200).json(responsePayload);
    }

    // Si Groq n'est pas disponible et que tu souhaites réactiver
    // OpenAI / Anthropic plus tard, tu peux décommenter le bloc suivant
    // et adapter la logique de sélection ci-dessus.
    //
    // console.log("Utilisation du moteur : OpenAI + Anthropic");
    //
    // if (!openaiKey || !anthropicKey) {
    //   return res.status(500).json({
    //     error:
    //       "Les variables d'environnement OPENAI_API_KEY et ANTHROPIC_API_KEY doivent être configurées.",
    //   });
    // }
    //
    // const [openaiRes, anthropicRes] = await Promise.all([
    //   fetch(OPENAI_URL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${openaiKey}`,
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-4.1-mini",
    //       messages: [
    //         {
    //           role: "system",
    //           content:
    //             "Tu es un expert en analyse de marché. Réponds uniquement en JSON valide.",
    //         },
    //         { role: "user", content: userPrompt },
    //       ],
    //     }),
    //   }),
    //   fetch(ANTHROPIC_URL, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": anthropicKey,
    //       "anthropic-version": "2023-06-01",
    //     },
    //     body: JSON.stringify({
    //       model: "claude-3-5-sonnet-latest",
    //       max_tokens: 800,
    //       messages: [
    //         {
    //           role: "user",
    //           content: userPrompt,
    //         },
    //       ],
    //     }),
    //   }),
    // ]);
    //
    // if (!openaiRes.ok) {
    //   const errText = await openaiRes.text();
    //   console.error("OpenAI error:", errText);
    //   return res
    //     .status(500)
    //     .json({ error: "Erreur lors de l'appel à OpenAI." });
    // }
    //
    // if (!anthropicRes.ok) {
    //   const errText = await anthropicRes.text();
    //   console.error("Anthropic error:", errText);
    //   return res
    //     .status(500)
    //     .json({ error: "Erreur lors de l'appel à Anthropic." });
    // }
    //
    // const openaiJson: any = await openaiRes.json();
    // const anthropicJson: any = await anthropicRes.json();
    //
    // const openaiContent =
    //   openaiJson.choices?.[0]?.message?.content?.[0]?.text ??
    //   openaiJson.choices?.[0]?.message?.content ??
    //   null;
    //
    // const anthropicContent =
    //   anthropicJson.content?.[0]?.text ?? anthropicJson.content ?? null;
    //
    // let openaiParsed: any = null;
    // let anthropicParsed: any = null;
    //
    // try {
    //   if (typeof openaiContent === "string") {
    //     openaiParsed = JSON.parse(openaiContent);
    //   }
    // } catch (e) {
    //   console.warn("Impossible de parser la réponse OpenAI en JSON:", e);
    // }
    //
    // try {
    //   if (typeof anthropicContent === "string") {
    //     anthropicParsed = JSON.parse(anthropicContent);
    //   }
    // } catch (e) {
    //   console.warn(
    //     "Impossible de parser la réponse Anthropic en JSON:",
    //     e
    //   );
    // }
    //
    // const responsePayload = {
    //   brand,
    //   openai: {
    //     score: openaiParsed?.score ?? null,
    //     summary: openaiParsed?.summary ?? openaiContent,
    //     strengths: openaiParsed?.strengths ?? null,
    //     raw: openaiContent,
    //   },
    //   anthropic: {
    //     score: anthropicParsed?.score ?? null,
    //     summary: anthropicParsed?.summary ?? anthropicContent,
    //     strengths: anthropicParsed?.strengths ?? null,
    //     raw: anthropicContent,
    //   },
    // };
    //
    // return res.status(200).json(responsePayload);

    return res.status(500).json({
      error:
        "Aucun moteur IA disponible. Configure GROQ_API_KEY ou réactive OpenAI/Anthropic.",
    });
  } catch (error) {
    console.error("Erreur interne API /api/audit:", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

