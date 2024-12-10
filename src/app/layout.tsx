import MainLayout from "@/components/templates/MainLayout";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Use Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teemo Bot Discord",
  description: "Le meilleur bot discord Teemo tout-en-un",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`min-h-screen bg-[#252838] text-white flex flex-col ${inter.className}`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
