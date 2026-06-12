"use client";

import { Eye, Code2, Loader2 } from "lucide-react";

import type { PreviewView } from "@/lib/types";

import { CodeViewer } from "./CodeViewer";
import { LivePreview } from "./LivePreview";

interface PreviewPanelProps {
  code: string;
  isLoading: boolean;
  activeView: PreviewView;
  onViewChange: (view: PreviewView) => void;
}

export function PreviewPanel({
  code,
  isLoading,
  activeView,
  onViewChange,
}: PreviewPanelProps) {
  return (
    <section
      data-testid="preview-panel"
      className="flex h-full min-h-0 flex-col bg-[#0f1117]"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Output</h2>
          <p className="text-xs text-zinc-400">
            Live preview and generated source code
          </p>
        </div>

        <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
          <button
            data-testid="preview-tab"
            type="button"
            onClick={() => onViewChange("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeView === "preview"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            data-testid="code-tab"
            type="button"
            onClick={() => onViewChange("code")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeView === "code"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Code
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div
            data-testid="preview-loading"
            className="flex h-full flex-col items-center justify-center gap-4 text-zinc-400"
          >
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-200">
                Generating component...
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Cloud generation usually takes 30–90 seconds
              </p>
            </div>
          </div>
        ) : !code ? (
          <div
            data-testid="preview-empty-state"
            className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-zinc-500"
          >
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8">
              <Eye className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-4 text-sm font-medium text-zinc-300">
                No component yet
              </p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed">
                Describe a component in the chat and click Generate to see a
                live preview here.
              </p>
            </div>
          </div>
        ) : activeView === "preview" ? (
          <LivePreview code={code} />
        ) : (
          <CodeViewer code={code} />
        )}
      </div>
    </section>
  );
}
