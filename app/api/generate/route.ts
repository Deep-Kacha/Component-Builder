import { NextResponse } from "next/server";

import { generateComponent } from "@/lib/generateComponent";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = typeof body.prompt === "string" ? body.prompt : "";

  const result = await generateComponent(prompt);

  if (!result.ok) {
    const status =
      result.error === "Prompt is required."
        ? 400
        : result.error.includes("CURSOR_API_KEY")
          ? 500
          : result.retryable
            ? 503
            : result.runId || result.raw
              ? 502
              : 500;

    return NextResponse.json(
      {
        error: result.error,
        ...(result.retryable !== undefined && { retryable: result.retryable }),
        ...(result.runId && { runId: result.runId }),
        ...(result.raw && { raw: result.raw }),
      },
      { status },
    );
  }

  return NextResponse.json({ code: result.code, raw: result.raw });
}
