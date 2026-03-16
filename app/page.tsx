import Link from "next/link";

const FEATURES = [
  {
    icon: "🧠",
    title: "Powered by Gemini",
    desc: "Google Gemini AI for accurate, context-aware responses."
  },
  {
    icon: "💾",
    title: "Persistent History",
    desc: "All your conversations are saved and accessible anytime."
  },
  {
    icon: "🔒",
    title: "Secure Auth",
    desc: "Sign in with Clerk — your data stays private and protected."
  },
  {
    icon: "⚡",
    title: "Fast & Responsive",
    desc: "Optimized for both desktop and mobile with a clean dark UI."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 pb-16 pt-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-4xl">
          🤖
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
          AI Chat{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SaaS
          </span>
        </h1>
        <p className="max-w-xl text-lg text-slate-400">
          Intelligent conversations with persistent history, powered by Gemini AI.
          Sign in and start chatting in seconds.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-up"
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Get Started Free
          </Link>
          <Link
            href="/sign-in"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-900"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-4xl gap-4 px-6 pb-24 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-3 text-3xl">{f.icon}</div>
            <h3 className="mb-1 font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Built with Next.js, Gemini &amp; Clerk
      </footer>
    </main>
  );
}
