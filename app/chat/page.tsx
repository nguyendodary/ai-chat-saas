"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBox";
import { ChatDetails, ChatListItem, Message } from "@/types/chat";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { error?: string } | undefined)?.error || "Request failed";
  }
  return "Something went wrong";
}

function BootstrapSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        <p className="text-sm">Loading your chats...</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState("AI Chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadChat(chatId: string) {
    if (!hasClerkKey) return;
    const response = await axios.get<{ chat: ChatDetails }>(`/api/chat?chatId=${chatId}`);
    setActiveChatId(response.data.chat.id);
    setTitle(response.data.chat.title);
    setMessages(response.data.chat.messages);
  }

  async function createChat() {
    if (!hasClerkKey) { setError("Auth is not configured"); return; }
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post<{ chat: ChatDetails }>("/api/create-chat");
      const newChat = response.data.chat;
      setChats((prev) => [{ id: newChat.id, title: newChat.title, createdAt: newChat.createdAt }, ...prev]);
      setActiveChatId(newChat.id);
      setTitle(newChat.title);
      setMessages([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function renameChat(chatId: string, nextTitle: string) {
    if (!hasClerkKey) { setError("Auth is not configured"); return; }
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.patch<{ chat: { id: string; title: string } }>("/api/rename-chat", {
        chatId,
        title: nextTitle
      });
      setChats((prev) =>
        prev.map((c) => (c.id === response.data.chat.id ? { ...c, title: response.data.chat.title } : c))
      );
      if (activeChatId === chatId) setTitle(response.data.chat.title);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteChat(chatId: string) {
    if (!hasClerkKey) { setError("Auth is not configured"); return; }
    setError(null);
    setIsLoading(true);
    try {
      await axios.delete("/api/delete-chat", { data: { chatId } });
      const nextChats = chats.filter((c) => c.id !== chatId);
      setChats(nextChats);
      if (activeChatId === chatId) {
        if (nextChats.length > 0) {
          await loadChat(nextChats[0].id);
        } else {
          setActiveChatId(null);
          setTitle("AI Chat");
          setMessages([]);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function sendPrompt(prompt: string) {
    if (!hasClerkKey) { setError("Auth is not configured"); return; }
    if (!activeChatId) return;

    const optimisticMessage: Message = { role: "user", content: prompt };
    const previousMessages = messages;
    setMessages((prev) => [...prev, optimisticMessage]);
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post<{ chat: { id: string; title: string }; message: Message }>(
        "/api/chat",
        { chatId: activeChatId, prompt }
      );
      setMessages((prev) => [...prev, response.data.message]);
      setTitle(response.data.chat.title);
      setChats((prev) =>
        prev.map((c) => (c.id === response.data.chat.id ? { ...c, title: response.data.chat.title } : c))
      );
    } catch (err) {
      setMessages(previousMessages);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function bootstrap() {
      if (!hasClerkKey) {
        setError("Auth is not configured. Please add Clerk environment variables.");
        setIsBootstrapping(false);
        return;
      }
      setError(null);
      try {
        const chatsResponse = await axios.get<{ chats: ChatListItem[] }>("/api/chat");
        const loadedChats = chatsResponse.data.chats;
        setChats(loadedChats);

        if (loadedChats.length > 0) {
          const chatResponse = await axios.get<{ chat: ChatDetails }>(`/api/chat?chatId=${loadedChats[0].id}`);
          setActiveChatId(chatResponse.data.chat.id);
          setTitle(chatResponse.data.chat.title);
          setMessages(chatResponse.data.chat.messages);
        } else {
          const createdResponse = await axios.post<{ chat: ChatDetails }>("/api/create-chat");
          const newChat = createdResponse.data.chat;
          setChats([{ id: newChat.id, title: newChat.title, createdAt: newChat.createdAt }]);
          setActiveChatId(newChat.id);
          setTitle(newChat.title);
          setMessages([]);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsBootstrapping(false);
      }
    }
    void bootstrap();
  }, [hasClerkKey]);

  const isBusy = useMemo(
    () => !hasClerkKey || isLoading || isBootstrapping,
    [hasClerkKey, isLoading, isBootstrapping]
  );

  if (isBootstrapping) return <BootstrapSkeleton />;

  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={loadChat}
        onCreateChat={createChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        isBusy={isBusy}
      />
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
          <span className="text-sm font-medium text-slate-400">AI Chat SaaS</span>
          {hasClerkKey ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <span className="text-xs text-amber-300">Auth not configured</span>
          )}
        </div>
        {error && (
          <div className="shrink-0 border-b border-rose-900 bg-rose-950 px-4 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatBox
            title={title}
            messages={messages}
            isLoading={isLoading}
            onSubmitPrompt={sendPrompt}
          />
        </div>
      </section>
    </main>
  );
}
