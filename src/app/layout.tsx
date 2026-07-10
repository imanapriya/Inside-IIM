import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanguard AI - Autonomous Investment Research Agent",
  description: "An agentic AI research environment that runs fundamental and sentiment analyses, providing structured investment recommendations with full trace capability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
