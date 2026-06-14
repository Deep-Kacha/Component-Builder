import { parse } from "@babel/parser";

export type ValidateComponentCodeResult =
  | { valid: true }
  | { valid: false; error: string; line?: number; column?: number };

function formatValidationError(
  message: string,
  line?: number,
  column?: number,
): string {
  if (line !== undefined && column !== undefined) {
    return `Syntax error at line ${line}, column ${column}: ${message}`;
  }

  return message;
}

export function validateComponentCode(code: string): ValidateComponentCodeResult {
  try {
    parse(code, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: false,
    });
    return { valid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const babelError = error as SyntaxError & {
        loc?: { line: number; column: number };
      };
      const line = babelError.loc?.line;
      const column = babelError.loc?.column;
      const message = error.message.replace(/^\(\d+:\d+\)\s*/, "").trim();

      return {
        valid: false,
        error: formatValidationError(message, line, column),
        line,
        column,
      };
    }

    return { valid: false, error: "Generated code is not valid TypeScript/JSX." };
  }
}
