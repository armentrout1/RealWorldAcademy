import React from "react";
import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <h1 className="font-inter font-bold text-xl md:text-2xl text-neutral-900">Real World Academy</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="px-3 py-2 text-neutral-600 hover:text-primary transition-colors duration-200">
              <i className="far fa-bell text-lg"></i>
            </a>
            <div className="relative">
              <button className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Profile" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Alex Morgan</span>
                <i className="fas fa-chevron-down text-xs text-neutral-500"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
