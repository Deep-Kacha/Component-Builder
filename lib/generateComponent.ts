import { CursorAgentError } from "@cursor/sdk";

import { extractCodeBlock } from "./extractCodeBlock";

const SYSTEM_PROMPT = `You are a React component generator. Generate a self-contained React component based on the user's description.

Rules:
- Export default a single React function component named "Component"
- Use TypeScript and Tailwind CSS classes for all styling
- Do NOT import any third-party libraries except React
- Do NOT use external CSS files or inline style objects unless absolutely necessary
- Make the component visually polished and modern
- Include realistic placeholder content where needed
- Wrap the complete code in a single \`\`\`tsx code block with no extra explanation outside the block`;

export type GenerateComponentSuccess = {
  ok: true;
  code: string;
  raw: string;
};

export type GenerateComponentFailure = {
  ok: false;
  error: string;
  retryable?: boolean;
  runId?: string;
  raw?: string;
};

export type GenerateComponentResult =
  | GenerateComponentSuccess
  | GenerateComponentFailure;

export async function generateComponent(
  prompt: string,
): Promise<GenerateComponentResult> {
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { ok: false, error: "Prompt is required." };
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "CURSOR_API_KEY is not configured. Copy .env.local.example to .env.local and add your key.",
    };
  }

  try {
    const { Agent } = await import("@cursor/sdk");

    const result = await Agent.prompt(
      `${SYSTEM_PROMPT}\n\nUser request: ${trimmed}`,
      {
        apiKey,
        model: { id: "composer-2.5" },
        cloud: {
          skipReviewerRequest: true,
        },
        name: "component-builder",
      },
    );

    if (result.status === "error") {
      return {
        ok: false,
        error:
          "Component generation failed. Please try again with a different prompt.",
        runId: result.id,
      };
    }

    const raw = result.result ?? "";
    const code = extractCodeBlock(raw);

    if (!code) {
      return {
        ok: false,
        error: "No component code was returned. Please try again.",
        raw,
      };
    }

    return { ok: true, code, raw };
  } catch (error) {
    if (error instanceof CursorAgentError) {
      const message =
        error.message === "Network request failed"
          ? "Could not reach Cursor cloud. Check your internet connection and try again."
          : error.message;

      return {
        ok: false,
        error: message,
        retryable: error.isRetryable,
      };
    }

    console.error("Generate component error:", error);
    return {
      ok: false,
      error: "An unexpected error occurred while generating the component.",
    };
  }
}
