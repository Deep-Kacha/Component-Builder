import assert from "node:assert/strict";
import test from "node:test";

import { validateComponentCode } from "./validateComponentCode";

test("validateComponentCode accepts valid TSX", () => {
  const result = validateComponentCode(
    `export default function Component() {
      return <button className="px-4 py-2">Click me</button>;
    }`,
  );

  assert.equal(result.valid, true);
});

test("validateComponentCode rejects unterminated string literals", () => {
  const result = validateComponentCode(
    `export default function Component() {
      const messages = [{ content: "hello
      }];
      return <div>{messages[0].content}</div>;
    }`,
  );

  assert.equal(result.valid, false);
  if (!result.valid) {
    assert.match(result.error, /unterminated string/i);
  }
});

test("validateComponentCode rejects missing JSX closing tags", () => {
  const result = validateComponentCode(
    `export default function Component() {
      return <div><span>Hi</div>;
    }`,
  );

  assert.equal(result.valid, false);
});
