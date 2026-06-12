"use client";

import { Loader2, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Message } from "@/lib/types";

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onGenerate: (prompt: string) => void;
}

const SUGGESTIONS = [
  "A pricing card with three tiers and a highlighted plan",
  "A login form with email, password, and social buttons",
  "A stats dashboard widget with icons and trend indicators",
];

export function ChatPanel({ messages, isLoading, onGenerate }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onGenerate(trimmed);
    setInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section
      data-testid="chat-panel"
      className="flex h-full min-h-0 flex-col border-r border-zinc-200 bg-white"
    >
      <header className="shrink-0 border-b border-zinc-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              Component Builder
            </h1>
            <p className="text-sm text-zinc-500">
              Describe a UI component, powered by Cursor SDK
            </p>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm leading-relaxed text-zinc-600">
                Tell me what to build — buttons, cards, forms, dashboards, and
                more. I&apos;ll generate React + Tailwind code and render a live
                preview on the right.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
                Try an example
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setInput(suggestion)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role !== "user" && (
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-violet-600 text-white"
                      : message.role === "error"
                        ? "border border-red-200 bg-red-50 text-red-700"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating via Cursor cloud...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-zinc-200 bg-white p-4">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
          <textarea
            data-testid="chat-input"
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the component you want to build..."
            rows={3}
            disabled={isLoading}
            className="w-full resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Press Enter to generate, Shift+Enter for new line
            </p>
            <button
              data-testid="generate-button"
              type="button"
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
