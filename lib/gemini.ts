import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash"];

export async function generateGeminiReply(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  if (messages.length === 0) throw new Error("No messages provided");

  const genAI = new GoogleGenerativeAI(apiKey);
  // Force v1 endpoint — v1beta does not expose these models
  const modelConfig = { apiVersion: "v1" } as Parameters<typeof genAI.getGenerativeModel>[1];
  const lastMessage = messages[messages.length - 1];

  // Build alternating history for Gemini
  const historyMessages = messages.slice(0, -1);
  const history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  for (const msg of historyMessages) {
    const geminiRole = msg.role === "assistant" ? "model" : "user";
    if (history.length > 0 && history[history.length - 1].role === geminiRole) continue;
    history.push({ role: geminiRole, parts: [{ text: msg.content }] });
  }

  if (history.length > 0 && history[0].role !== "user") history.shift();
  if (history.length > 0 && history[history.length - 1].role === "user") history.pop();

  // Try each model in order
  let lastError: Error | null = null;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName }, modelConfig);
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const text = result.response.text().trim();
      if (!text) throw new Error("Empty response");
      return text;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Gemini] Model ${modelName} failed:`, msg);
      lastError = err instanceof Error ? err : new Error(msg);

      // Only retry on quota/rate limit errors
      if (!msg.includes("429") && !msg.includes("quota") && !msg.includes("Too Many Requests") && !msg.includes("404")) {
        break;
      }
    }
  }

  const errMsg = lastError?.message ?? "Unknown error";
  if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("Too Many Requests")) {
    throw new Error("Gemini API rate limit reached. Please wait a moment and try again.");
  }
  if (errMsg.includes("API_KEY") || errMsg.includes("API key")) {
    throw new Error("Invalid Gemini API key.");
  }
  throw new Error(`AI error: ${errMsg}`);
}
