import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { AIAssistant } from "@/components/ai";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white/90 text-neutral-800 font-sans">
      <Header />
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Layout;
