"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/organisms/Footer";

const Header = dynamic(() => import("@/components/organisms/Header"), {
  ssr: false,
});
const SupportFab = dynamic(() => import("@/components/organisms/SupportFab"), {
  ssr: false,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    <SupportFab />
  </>
);

export default MainLayout;
