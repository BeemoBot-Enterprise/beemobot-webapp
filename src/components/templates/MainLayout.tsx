import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";

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
