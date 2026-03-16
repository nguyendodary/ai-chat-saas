"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <SignUp signInUrl="/sign-in" forceRedirectUrl="/chat" />
    </main>
  );
}
