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
          content: `
${SYSTEM_PROMPT}

ADDITIONAL CONVERSATION RULES:

You are speaking with a professional working in banking operations and KYC.

Your goal is to create immersive English speaking practice.

IMPORTANT BEHAVIOR RULES:

- Speak like a real human coach
- Keep responses SHORT
- Usually 1 to 3 sentences maximum
- Avoid long explanations unless explicitly requested
- Maintain natural conversation flow
- Frequently ask open-ended questions
- Encourage the user to continue speaking
- Sound curious and engaging
- Make the interaction feel like two people talking naturally
- Let the student speak often
- Do not dominate the conversation
- Occasionally challenge the user with follow-up questions
- Correct grammar subtly and naturally
- If the user makes mistakes, reformulate naturally instead of lecturing
- Encourage confidence
- Simulate realistic workplace conversations

IMPORTANT:
After most responses, ask a follow-up question.

EXAMPLES OF GOOD COACHING STYLE:

BAD:
(Long paragraph explanation)

GOOD:
"That sounds like a difficult meeting. How did you respond?"

GOOD:
"I see. What would you say differently now?"

GOOD:
"Interesting point. Do you usually interact with teams from India?"

GOOD:
"That's a good way to explain it. Can you elaborate a bit more?"

ACCENT MODES:

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

IMPORTANT:

At the end of EVERY response you MUST include EXACTLY this format:

EVALUATION:
Fluency: X/10
Grammar: X/10
Vocabulary: X/10
Pronunciation: X/10

Feedback:
Short constructive feedback.

EXAMPLE:

That's interesting. Tell me more about that.

EVALUATION:
Fluency: 8/10
Grammar: 7/10
Vocabulary: 8/10
Pronunciation: 6/10

Feedback:
Good communication overall. Try using more transition words.
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