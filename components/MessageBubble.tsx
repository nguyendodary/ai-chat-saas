"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Message } from "@/types/chat";

type MessageBubbleProps = {
  message: Message;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-600"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-indigo-600 px-4 py-3 text-sm leading-relaxed text-white md:text-base">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl bg-slate-800 px-4 py-3 text-sm leading-relaxed text-slate-100 md:text-base">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              const isBlock = codeString.includes("\n") || match;

              if (isBlock) {
                return (
                  <div className="group relative my-2 overflow-hidden rounded-lg">
                    <CopyButton text={codeString} />
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match?.[1] || "text"}
                      PreTag="div"
                      customStyle={{ margin: 0, borderRadius: "0.5rem", fontSize: "0.8rem" }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code
                  className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-xs text-slate-200"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            ul({ children }) {
              return <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>;
            },
            ol({ children }) {
              return <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>;
            },
            li({ children }) {
              return <li className="mb-0.5">{children}</li>;
            },
            h1({ children }) {
              return <h1 className="mb-2 text-lg font-bold text-white">{children}</h1>;
            },
            h2({ children }) {
              return <h2 className="mb-2 text-base font-bold text-white">{children}</h2>;
            },
            h3({ children }) {
              return <h3 className="mb-1 font-semibold text-white">{children}</h3>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="my-2 border-l-4 border-indigo-500 pl-3 text-slate-300">
                  {children}
                </blockquote>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="my-2 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="border border-slate-600 bg-slate-700 px-3 py-1.5 text-left font-semibold">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return <td className="border border-slate-600 px-3 py-1.5">{children}</td>;
            },
            hr() {
              return <hr className="my-3 border-slate-600" />;
            },
            strong({ children }) {
              return <strong className="font-semibold text-white">{children}</strong>;
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
