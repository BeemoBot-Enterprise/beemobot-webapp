import MainLayout from "@/components/templates/MainLayout";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Use Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeemoBot - The Ultimate Teemo Discord Bot",
  description:
    "The ultimate League of Legends Discord bot. Champion stats, build recommendations, player tracking, and fun minigames. Add BeemoBot to your server today!",
  keywords: [
    "Discord bot",
    "League of Legends",
    "LoL",
    "Teemo",
    "BeemoBot",
    "champion stats",
    "builds",
  ],
  openGraph: {
    title: "BeemoBot - The Ultimate Teemo Discord Bot",
    description:
      "Champion stats, build recommendations, player tracking, and fun minigames for your Discord server.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-[var(--bg-void)] text-white flex flex-col ${inter.className}`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
