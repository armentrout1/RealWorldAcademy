import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navigation: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            <Link href="/" className={`px-4 py-3 font-medium ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Home
            </Link>
            <Link href="/dashboard" className={`px-4 py-3 font-medium ${isActive('/dashboard') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Dashboard
            </Link>
            <Link href="/learn" className={`px-4 py-3 font-medium ${isActive('/learn') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Learn
            </Link>
            <Link href="/self-discovery" className={`px-4 py-3 font-medium ${isActive('/self-discovery') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Self Discovery
            </Link>
            <Link href="/projects" className={`px-4 py-3 font-medium ${isActive('/projects') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Projects
            </Link>
            <Link href="/about" className={`px-4 py-3 font-medium ${isActive('/about') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                About
            </Link>
          </div>
          <div className="md:hidden">
            <button 
              className="p-2 text-neutral-600 focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'} bg-white border-b border-neutral-200 pb-2`}>
        <div className="container mx-auto px-4 py-2 space-y-2">
          <Link href="/" className={`block px-4 py-2 font-medium ${isActive('/') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Home
          </Link>
          <Link href="/dashboard" className={`block px-4 py-2 font-medium ${isActive('/dashboard') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Dashboard
          </Link>
          <Link href="/learn" className={`block px-4 py-2 font-medium ${isActive('/learn') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Learn
          </Link>
          <Link href="/self-discovery" className={`block px-4 py-2 font-medium ${isActive('/self-discovery') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Self Discovery
          </Link>
          <Link href="/projects" className={`block px-4 py-2 font-medium ${isActive('/projects') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Projects
          </Link>
          <Link href="/about" className={`block px-4 py-2 font-medium ${isActive('/about') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              About
          </Link>
          
          <div className="flex items-center space-x-4 pt-2 border-t border-neutral-200">
            <a href="#" className="px-3 py-2 text-neutral-600 hover:text-primary transition-colors duration-200">
              <i className="far fa-bell text-lg"></i>
            </a>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Profile" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Alex Morgan</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
