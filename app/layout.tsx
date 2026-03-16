import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Chat SaaS",
  description: "Production-ready fullstack AI chat SaaS with DeepSeek"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const hasClerkCredentials = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  return (
    <html lang="en">
      <body>{hasClerkCredentials ? <ClerkProvider>{children}</ClerkProvider> : children}</body>
    </html>
  );
}
