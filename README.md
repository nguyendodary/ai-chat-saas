# AI Chat SaaS

A fullstack AI chat application built with Next.js, Google Gemini, Clerk authentication, and MongoDB.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI:** Google Gemini API
- **Auth:** Clerk
- **Database:** MongoDB Atlas + Mongoose
- **Styling:** Tailwind CSS

## Features

- Sign up / Sign in with Clerk
- Create, rename, delete chat sessions
- Persistent chat history in MongoDB
- Markdown + syntax highlighting in AI responses
- Responsive layout with mobile sidebar

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nguyendodary/ai-chat-saas.git
cd ai-chat-saas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Where to get |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks |
| `MONGODB_URI` | [cloud.mongodb.com](https://cloud.mongodb.com) |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### 4. Set up Clerk Webhook (optional)

In Clerk Dashboard → Webhooks, create a new webhook pointing to:
```
https://your-domain.com/api/webhook
```
Subscribe to `user.created`, `user.updated`, `user.deleted` events.

> Without the webhook, users are auto-created in MongoDB on first sign-in.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── (auth)/          # Sign-in / Sign-up pages
│   ├── api/             # API routes (chat, create, delete, rename, webhook)
│   ├── chat/            # Main chat page
│   └── page.tsx         # Landing page
├── components/          # ChatBox, Sidebar, MessageBubble, PromptInput
├── lib/                 # MongoDB, Gemini, auth helpers
├── models/              # Mongoose models (User, Chat)
└── types/               # TypeScript types
```
