import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const userMessage = body.message;
    const accent = body.accent || "American";

    console.log("ACCENT RECEIVED:", accent);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [

        {
  role: "system",
  content: SYSTEM_PROMPT + `

Current accent mode: ${accent}

AMERICAN:
- Friendly
- Direct
- Casual professional tone

BRITISH:
- More polite and formal
- British vocabulary and phrasing

INDIAN:
- Indian corporate communication style
- Simulate realistic offshore KYC interactions

EUROPEAN:
- Clear international English
- Neutral professional communication
`,
},

        {
          role: "user",
          content: userMessage,
        },
      ],
    });

const aiResponse =
  completion.choices[0].message.content || "";

console.log("FULL AI RESPONSE:");
console.log(aiResponse);

return NextResponse.json({
  response: aiResponse,
});

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}