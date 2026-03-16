import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getCurrentDbUser } from "@/lib/auth-user";

export async function POST() {
  try {
    const dbUser = await getCurrentDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const chat = await Chat.create({
      userId: dbUser._id,
      title: "New Chat",
      messages: []
    });

    return NextResponse.json({
      chat: {
        id: chat._id.toString(),
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create chat" },
      { status: 500 }
    );
  }
}
