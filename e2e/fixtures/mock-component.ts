export const MOCK_COMPONENT_CODE = `import React, { useState } from "react";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      data-testid="generated-login-form"
      className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-zinc-900">Sign in</h2>
      <p className="mt-2 text-sm text-zinc-500">Welcome back</p>
      <form className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-violet-600 px-4 py-2 font-medium text-white"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
`;

export const MOCK_GENERATE_RESPONSE = {
  code: MOCK_COMPONENT_CODE,
  raw: `\`\`\`tsx\n${MOCK_COMPONENT_CODE}\n\`\`\``,
};
