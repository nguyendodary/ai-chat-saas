export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatListItem = {
  id: string;
  title: string;
  createdAt: string;
};

export type ChatDetails = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};
