"use client";

import { KeyboardEvent, useRef, useState } from "react";

type PromptInputProps = {
  onSubmit: (prompt: string) => Promise<void>;
  disabled?: boolean;
};

export default function PromptInput({ onSubmit, disabled }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function adjustHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  async function handleSubmit() {
    const value = prompt.trim();
    if (!value || disabled) return;
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await onSubmit(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="flex items-end gap-3 border-t border-slate-800 bg-slate-900 p-4">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type your prompt... (Enter to send, Shift+Enter for new line)"
        rows={1}
        disabled={disabled}
        className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-500 disabled:opacity-50 md:text-base"
        style={{ minHeight: "44px", maxHeight: "200px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !prompt.trim()}
        className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
      >
        Send
      </button>
    </div>
  );
}
