import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white/90 text-neutral-800 font-sans">
      <Header />
      <Navigation />
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950">
        Real World Academy credentials are transparent completion records, not accredited school credit.{" "}
        <a href="/terms" className="font-medium underline underline-offset-2">Learn more</a>
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
