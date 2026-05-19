import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const text = body.text;

    const accent = body.accent || "American";

    let voice = "alloy";

    if (accent === "American") {
      voice = "alloy";
    }

    else if (accent === "British") {
      voice = "echo";
    }

    else if (accent === "Indian") {
      voice = "fable";
    }

    else if (accent === "European") {
      voice = "nova";
    }

    console.log("VOICE:", voice);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any,
      input: text,
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error: any) {

    console.error(error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}