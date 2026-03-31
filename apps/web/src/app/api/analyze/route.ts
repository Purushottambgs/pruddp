import { type NextRequest, NextResponse } from "next/server";

// Allow up to 60 seconds for the analysis pipeline
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { url?: string };

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json({ error: "url is required", code: "MISSING_URL" }, { status: 400 });
    }

    const apiUrl =
      process.env["API_URL"] ??
      process.env["NEXT_PUBLIC_API_URL"] ??
      "http://localhost:3001";

    const upstream = await fetch(`${apiUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: body.url }),
      signal: AbortSignal.timeout(55000),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { error: "Analysis failed — please try again", code: "ANALYSIS_ERROR" },
      { status: 500 }
    );
  }
}
