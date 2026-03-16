"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "@/components/MessageBubble";
import PromptInput from "@/components/PromptInput";
import { Message } from "@/types/chat";

type ChatBoxProps = {
  title: string;
  messages: Message[];
  isLoading: boolean;
  onSubmitPrompt: (prompt: string) => Promise<void>;
};

const SUGGESTIONS = [
  "Explain how async/await works in JavaScript",
  "Write a Python function to sort a list of dicts",
  "What are the SOLID principles?",
  "How does React reconciliation work?"
];

export default function ChatBox({ title, messages, isLoading, onSubmitPrompt }: ChatBoxProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <section className="flex h-full flex-1 flex-col overflow-hidden bg-slate-900">
      <header className="shrink-0 border-b border-slate-800 px-4 py-3 pl-16 md:pl-4">
        <h2 className="truncate text-base font-semibold text-white">{title}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-3xl">
                🤖
              </div>
              <h3 className="text-lg font-semibold text-white">How can I help you today?</h3>
              <p className="mt-1 text-sm text-slate-400">Ask me anything — code, concepts, or ideas.</p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSubmitPrompt(s)}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-indigo-500 hover:bg-slate-700 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <MessageBubble key={`${index}-${message.role}`} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-slate-800 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <PromptInput onSubmit={onSubmitPrompt} disabled={isLoading} />
    </section>
  );
}
