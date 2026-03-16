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
- Create, rename, and delete chat sessions
- Persistent chat history stored in MongoDB
- Markdown rendering with syntax highlighting in AI responses
- Responsive layout with mobile-friendly sidebar

---

## Prerequisites

Before running this project, make sure you have the following:

### Tools

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org) | 18+ | Required to run the app locally |
| [npm](https://npmjs.com) | 9+ | Comes with Node.js |
| [Git](https://git-scm.com) | any | For cloning the repository |
| [Docker](https://docker.com) *(optional)* | 24+ | Only needed for Docker deployment |

### External Services

| Service | Purpose | Link |
|---|---|---|
| [Clerk](https://clerk.com) | User authentication | [dashboard.clerk.com](https://dashboard.clerk.com) |
| [MongoDB Atlas](https://cloud.mongodb.com) | Database (free M0 tier works) | [cloud.mongodb.com](https://cloud.mongodb.com) |
| [Google AI Studio](https://aistudio.google.com) | Gemini API key | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

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

```bash
cp .env.example .env.local
```

Then fill in the values in `.env.local`:

| Variable | Where to get |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks |
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `GEMINI_API_KEY` | Google AI Studio → API Keys |

### 4. Set up Clerk Webhook *(optional)*

In Clerk Dashboard → Webhooks, create a webhook pointing to:

```
https://your-domain.com/api/webhook
```

Subscribe to `user.created`, `user.updated`, and `user.deleted` events.

> Without the webhook, users are automatically created in MongoDB on first sign-in.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Docker

### Run with Docker Compose

```bash
docker-compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Run manually

```bash
docker build -t ai-chat-saas .
docker run -p 3000:3000 --env-file .env.local ai-chat-saas
```

---

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
