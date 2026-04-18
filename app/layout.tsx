import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My First 5K",
  description: "AI-powered personalised 5K training plan for beginners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏃</span>
              <span className="font-bold text-lg text-gray-900">My First 5K</span>
            </div>
            <a
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Coaching Guidelines
            </a>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
