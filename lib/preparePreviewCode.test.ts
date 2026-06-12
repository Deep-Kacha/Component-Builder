import assert from "node:assert/strict";
import test from "node:test";

import { buildIframePreviewHtml, preparePreviewCode } from "./preparePreviewCode";

test("preparePreviewCode strips imports and default export", () => {
  const input = `import React, { useState } from "react";

export default function Component() {
  const [value, setValue] = useState("");
  return <button>{value}</button>;
}`;

  const output = preparePreviewCode(input);

  assert.match(output, /^function Component\(\)/);
  assert.doesNotMatch(output, /import\s+/);
  assert.doesNotMatch(output, /export\s+default/);
});

test("buildIframePreviewHtml renders a runnable preview document", () => {
  const html = buildIframePreviewHtml(
    `export default function Component() { return <p>Hello</p>; }`,
  );

  assert.match(html, /<script type="text\/babel"/);
  assert.match(html, /function Component\(\)/);
  assert.match(html, /<Component \/>/);
});
