import MainLayout from "@/components/templates/MainLayout";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "BeemoBot — Bot Discord League of Legends",
  description:
    "Le bot Discord pour ta communauté League of Legends. Stats, profils, leaderboards et mini-jeux.",
  keywords: ["Bot Discord", "League of Legends", "LoL", "BeemoBot"],
  openGraph: {
    title: "BeemoBot — Bot Discord League of Legends",
    description:
      "Stats, profils, leaderboards et mini-jeux pour ta communauté Discord.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={geist.variable}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
