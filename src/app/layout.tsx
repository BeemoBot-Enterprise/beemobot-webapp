import "@/styles/globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Onest, Geist } from "next/font/google";
import { HeaderHF } from "@/components/_design/Header";
import { FooterHF } from "@/components/_design/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="fr" suppressHydrationWarning className={`${geist.variable} ${bricolage.variable} ${onest.variable}`}>
      <body className="min-h-screen bg-hf-bg text-hf-navy flex flex-col font-body antialiased">
        <HeaderHF />
        <main className="flex-grow">{children}</main>
        <FooterHF />
      </body>
    </html>
  );
}
