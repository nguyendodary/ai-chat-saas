import { Schema, model, models, Types } from "mongoose";

export type MessageRole = "user" | "assistant";

export type Message = {
  role: MessageRole;
  content: string;
};

export type ChatDocument = {
  userId: Types.ObjectId;
  title: string;
  messages: Message[];
  createdAt: Date;
};

const MessageSchema = new Schema<Message>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true }
  },
  { _id: false }
);

const ChatSchema = new Schema<ChatDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    messages: { type: [MessageSchema], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Chat = models.Chat || model<ChatDocument>("Chat", ChatSchema);

export default Chat;
