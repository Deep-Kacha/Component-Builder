const baseUrl = process.argv[2] ?? "http://localhost:3000";
const prompt =
  process.argv[3] ?? "a simple blue button labeled Click me";
const timeoutMs = Number(process.argv[4] ?? 120_000);

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

const started = Date.now();

try {
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal: controller.signal,
  });

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  const data = await response.json();

  console.log(`URL:     ${baseUrl}/api/generate`);
  console.log(`Status:  ${response.status} (${elapsed}s)`);

  if (data.code) {
    console.log(`Code:    yes (${data.code.length} chars)`);
    console.log(`Preview: ${data.code.slice(0, 200).replace(/\n/g, "\\n")}`);
  } else if (data.error) {
    console.log(`Error:   ${data.error}`);
    if (data.retryable !== undefined) {
      console.log(`Retry:   ${data.retryable}`);
    }
  } else {
    console.log(`Body:    ${JSON.stringify(data).slice(0, 500)}`);
  }

  process.exit(response.ok && data.code ? 0 : 1);
} catch (error) {
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  if (error instanceof Error && error.name === "AbortError") {
    console.error(`Timed out after ${timeoutMs / 1000}s (waited ${elapsed}s)`);
  } else {
    console.error(`Request failed after ${elapsed}s:`, error);
  }

  process.exit(1);
} finally {
  clearTimeout(timer);
}
