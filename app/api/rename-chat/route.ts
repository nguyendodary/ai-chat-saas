import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import { getCurrentDbUser } from "@/lib/auth-user";

export async function PATCH(request: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, title } = await request.json();

    if (!chatId || !title || typeof title !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connectToDatabase();

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: dbUser._id },
      { title: title.trim().slice(0, 60) || "Untitled Chat" },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      chat: {
        id: chat._id.toString(),
        title: chat.title
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to rename chat" },
      { status: 500 }
    );
  }
}
