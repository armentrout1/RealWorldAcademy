import React from "react";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BellIcon, ChevronDownIcon, GraduationCapIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-primary/90 rounded-lg p-2 shadow-sm">
              <GraduationCapIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-sans font-bold text-xl md:text-2xl bg-gradient-to-r from-primary/90 to-sky-500 bg-clip-text text-transparent">
              Real World Academy
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <button className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-primary transition-colors duration-200">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 rounded-full px-2 py-1 hover:bg-neutral-100 transition-colors duration-200">
                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Profile" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-neutral-700">Alex Morgan</span>
                <ChevronDownIcon className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
