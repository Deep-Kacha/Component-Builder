"use client";

import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { useMemo } from "react";

interface SandpackLivePreviewProps {
  code: string;
}

const APP_WRAPPER = `import Component from "./Component";

export default function App() {
  return (
    <div className="flex min-h-full w-full items-start justify-center bg-zinc-50 p-6">
      <Component />
    </div>
  );
}
`;

export function SandpackLivePreview({ code }: SandpackLivePreviewProps) {
  const files = useMemo(
    () => ({
      "/Component.tsx": code,
      "/App.tsx": APP_WRAPPER,
    }),
    [code],
  );

  return (
    <SandpackProvider
      template="react-ts"
      files={files}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
        activeFile: "/Component.tsx",
      }}
      theme="dark"
    >
      <SandpackPreview
        showNavigator={false}
        showRefreshButton={false}
        showOpenInCodeSandbox={false}
        style={{
          height: "100%",
          width: "100%",
          flex: 1,
        }}
      />
    </SandpackProvider>
  );
}
