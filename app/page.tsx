"use client";

import { useCallback, useState } from "react";

import { ChatPanel } from "@/components/ChatPanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import type { Message, PreviewView } from "@/lib/types";

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<PreviewView>("preview");

  const handleGenerate = useCallback(async (prompt: string) => {
    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setActiveView("preview");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      let data: { code?: string; error?: string } = {};
      try {
        data = (await response.json()) as { code?: string; error?: string };
      } catch {
        throw new Error("Invalid response from server.");
      }

      if (!response.ok || !data.code) {
        const errorMessage: Message = {
          id: createMessageId(),
          role: "error",
          content: data.error ?? "Failed to generate component. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      setGeneratedCode(data.code);

      const assistantMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content:
          "Component generated successfully. Check the live preview on the right, or switch to Code view to copy the source.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: createMessageId(),
        role: "error",
        content:
          error instanceof Error
            ? error.message
            : "Network error. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex h-dvh w-screen flex-col overflow-hidden bg-zinc-100 lg:flex-row">
      <div className="flex min-h-0 w-full flex-1 flex-col lg:h-full lg:w-[38%] lg:flex-none xl:w-[36%]">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onGenerate={handleGenerate}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-zinc-200 lg:h-full lg:border-t-0">
        <PreviewPanel
          code={generatedCode}
          isLoading={isLoading}
          activeView={activeView}
          onViewChange={setActiveView}
        />
      </div>
    </div>
  );
}
