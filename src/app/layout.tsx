import MainLayout from "@/components/templates/MainLayout";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Use Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeemoBot - Le Bot Discord Teemo Ultime",
  description:
    "Le bot Discord League of Legends ultime. Statistiques de champions, recommandations de builds, suivi de joueurs et mini-jeux amusants. Ajoutez BeemoBot à votre serveur dès aujourd'hui !",
  keywords: [
    "Bot Discord",
    "League of Legends",
    "LoL",
    "Teemo",
    "BeemoBot",
    "statistiques de champions",
    "builds",
  ],
  openGraph: {
    title: "BeemoBot - Le Bot Discord Teemo Ultime",
    description:
      "Statistiques de champions, recommandations de builds, suivi de joueurs et mini-jeux pour votre serveur Discord.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-[var(--bg-void)] text-white flex flex-col ${inter.className}`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
