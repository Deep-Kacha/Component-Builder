"use client";

import { useMemo } from "react";

import { buildIframePreviewHtml } from "@/lib/preparePreviewCode";

interface IframeLivePreviewProps {
  code: string;
}

export function IframeLivePreview({ code }: IframeLivePreviewProps) {
  const srcDoc = useMemo(() => buildIframePreviewHtml(code), [code]);

  return (
    <iframe
      title="Component preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="h-full w-full border-0 bg-white"
    />
  );
}
