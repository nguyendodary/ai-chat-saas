"use client";

import { useState } from "react";
import { ChatListItem } from "@/types/chat";

type SidebarProps = {
  chats: ChatListItem[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => Promise<void>;
  onCreateChat: () => Promise<void>;
  onRenameChat: (chatId: string, title: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void>;
  isBusy: boolean;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onRenameChat,
  onDeleteChat,
  isBusy
}: SidebarProps) {
  const [renameId, setRenameId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <aside className="flex h-full w-full flex-col bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <span className="text-sm font-semibold text-slate-300">Chats</span>
        <button
          onClick={onCreateChat}
          disabled={isBusy}
          title="New Chat"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Chat
        </button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-700 p-3 text-center text-sm text-slate-400">
            No chats yet. Create one to get started.
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group rounded-lg border px-3 py-2 transition ${
                activeChatId === chat.id
                  ? "border-indigo-500/50 bg-slate-800"
                  : "border-transparent hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {renameId === chat.id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const next = title.trim();
                    if (!next) return;
                    await onRenameChat(chat.id, next);
                    setRenameId(null);
                    setTitle("");
                  }}
                  className="space-y-2"
                >
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-500"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRenameId(null); setTitle(""); }}
                      className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-100 hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <button
                    onClick={() => { onSelectChat(chat.id); setIsOpen(false); }}
                    className="w-full truncate text-left text-sm text-slate-100"
                  >
                    {chat.title}
                  </button>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{formatDate(chat.createdAt)}</span>
                    <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => { setRenameId(chat.id); setTitle(chat.title); }}
                        title="Rename"
                        className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeleteChat(chat.id)}
                        title="Delete"
                        className="rounded p-1 text-slate-400 hover:bg-rose-900 hover:text-rose-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-slate-800 p-2 text-slate-300 shadow-lg transition hover:bg-slate-700 md:hidden"
        aria-label="Open sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden h-full w-72 shrink-0 border-r border-slate-800 md:flex md:flex-col">
        {sidebarContent}
      </div>
    </>
  );
}
