import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuckyStar Garages",
  description: "WhatsApp garage bot and mobile-first operations dashboard",
  applicationName: "LuckyStar Garages",
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
