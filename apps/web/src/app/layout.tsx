import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Pruddo — Real reviews. Real prices. Before you buy.",
  description:
    "Pruddo aggregates reviews from Reddit, YouTube, and Amazon and generates AI trust scores so you can shop with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
