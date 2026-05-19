import { NextResponse } from "next/server";

export async function GET() {

  try {

    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: "gpt-4o-realtime-preview",

            audio: {
              output: {
                voice: "alloy",
              },
            },
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error: any) {

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