"use client";

import { useSyncExternalStore } from "react";

import { IframeLivePreview } from "./IframeLivePreview";
import { SandpackLivePreview } from "./SandpackLivePreview";

interface LivePreviewProps {
  code: string;
}

function subscribe() {
  return () => {};
}

function canUseSandpack(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    typeof window.crypto?.subtle?.digest === "function"
  );
}

export function LivePreview({ code }: LivePreviewProps) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div className="absolute inset-0 sandpack-preview-shell" data-testid="live-preview">
      {!isClient ? null : canUseSandpack() ? (
        <SandpackLivePreview code={code} />
      ) : (
        <IframeLivePreview code={code} />
      )}
    </div>
  );
}
