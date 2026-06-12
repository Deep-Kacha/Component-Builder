export function extractCodeBlock(text: string): string {
  const fencedMatch = text.match(
    /```(?:tsx|jsx|typescript|javascript|react)?\s*\n?([\s\S]*?)```/i,
  );

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return text.trim();
}
