"use client";

import { Component, type ReactNode } from "react";

import { AlertTriangle } from "lucide-react";

interface PreviewErrorBoundaryProps {
  children: ReactNode;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
}

export class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  state: PreviewErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PreviewErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center text-zinc-400">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Preview could not render
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
              The generated code has a syntax or runtime error. Switch to the
              Code tab to inspect the source, then try generating again with a
              simpler prompt.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
