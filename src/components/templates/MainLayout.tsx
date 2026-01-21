"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/organisms/Footer";

// Import Header dynamically with no SSR to avoid localStorage issues
const Header = dynamic(() => import("@/components/organisms/Header"), {
  ssr: false,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
