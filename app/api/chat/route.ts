import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateGeminiReply } from "@/lib/gemini";
import { getCurrentDbUser } from "@/lib/auth-user";
import Chat from "@/models/Chat";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function generateTitleFromPrompt(prompt: string) {
  const cleaned = prompt.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return "New Chat";
  }
  return cleaned.length > 40 ? `${cleaned.slice(0, 40)}...` : cleaned;
}

export async function GET(request: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = request.nextUrl.searchParams.get("chatId");
    await connectToDatabase();

    if (chatId) {
      const chat = (await Chat.findOne({ _id: chatId, userId: dbUser._id }).lean()) as {
        _id: { toString: () => string };
        title: string;
        messages: ChatMessage[];
        createdAt: Date;
      } | null;

      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      return NextResponse.json({
        chat: {
          id: chat._id.toString(),
          title: chat.title,
          messages: chat.messages,
          createdAt: chat.createdAt
        }
      });
    }

    const chats = (await Chat.find({ userId: dbUser._id })
      .sort({ createdAt: -1 })
      .select("_id title createdAt")
      .lean()) as unknown as Array<{
      _id: { toString: () => string };
      title: string;
      createdAt: Date;
    }>;

    return NextResponse.json({
      chats: chats.map((chat) => ({
        id: chat._id.toString(),
        title: chat.title,
        createdAt: chat.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load chats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, prompt } = await request.json();

    if (!chatId || !prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();

    const chat = await Chat.findOne({ _id: chatId, userId: dbUser._id });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const userMessage: ChatMessage = { role: "user", content: prompt.trim() };
    const updatedMessages = [...chat.messages, userMessage].map((message) => ({
      role: message.role,
      content: message.content
    }));

    const assistantContent = await generateGeminiReply(updatedMessages);
    const assistantMessage: ChatMessage = { role: "assistant", content: assistantContent };

    chat.messages.push(userMessage, assistantMessage);

    if (chat.title === "New Chat" && chat.messages.length <= 2) {
      chat.title = generateTitleFromPrompt(prompt);
    }

    await chat.save();

    return NextResponse.json({
      chat: {
        id: String(chat._id),
        title: chat.title
      },
      message: assistantMessage
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send prompt" },
      { status: 500 }
    );
  }
}
