import { CursorAgentError } from "@cursor/sdk";

import { extractCodeBlock } from "./extractCodeBlock";
import { validateComponentCode } from "./validateComponentCode";

const SYSTEM_PROMPT = `You are a React component generator. Generate a self-contained React component based on the user's description.

Rules:
- Export default a single React function component named "Component"
- Use TypeScript and Tailwind CSS classes for all styling
- Do NOT import any third-party libraries except React
- Do NOT use external CSS files or inline style objects unless absolutely necessary
- Make the component visually polished and modern
- Include realistic placeholder content where needed
- For mock data with long text (chat messages, paragraphs, etc.), use template literals with \\n or keep strings on one line — never break a double-quoted string across lines
- Output must be complete, syntactically valid TSX with all strings and brackets closed
- Wrap the complete code in a single \`\`\`tsx code block with no extra explanation outside the block`;

const MAX_GENERATION_ATTEMPTS = 2;

async function runGenerationPrompt(
  prompt: string,
  apiKey: string,
): Promise<
  | { ok: true; code: string; raw: string }
  | { ok: false; error: string; runId?: string; raw?: string }
> {
  const { Agent } = await import("@cursor/sdk");

  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: "composer-2.5" },
    cloud: {
      skipReviewerRequest: true,
    },
    name: "component-builder",
  });

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

  const validation = validateComponentCode(code);
  if (!validation.valid) {
    return {
      ok: false,
      error: validation.error,
      raw,
    };
  }

  return { ok: true, code, raw };
}

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
    let lastFailure: GenerateComponentFailure | null = null;

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const retryHint =
        attempt > 0 && lastFailure?.error
          ? `\n\nYour previous output had a syntax error: ${lastFailure.error}\nFix the code and return complete, valid TSX.`
          : "";

      const result = await runGenerationPrompt(
        `${SYSTEM_PROMPT}${retryHint}\n\nUser request: ${trimmed}`,
        apiKey,
      );

      if (result.ok) {
        return { ok: true, code: result.code, raw: result.raw };
      }

      lastFailure = {
        ok: false,
        error: result.error,
        runId: result.runId,
        raw: result.raw,
      };

      const isSyntaxError = result.raw !== undefined && result.error.includes("Syntax error");
      if (!isSyntaxError || attempt === MAX_GENERATION_ATTEMPTS - 1) {
        return lastFailure;
      }
    }

    return (
      lastFailure ?? {
        ok: false,
        error: "Failed to generate a valid component. Please try again.",
      }
    );
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
