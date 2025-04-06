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
            <Link href="/">
              <a className={`px-4 py-3 font-medium ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Home
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={`px-4 py-3 font-medium ${isActive('/dashboard') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Dashboard
              </a>
            </Link>
            <Link href="/learn">
              <a className={`px-4 py-3 font-medium ${isActive('/learn') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Learn
              </a>
            </Link>
            <Link href="/self-discovery">
              <a className={`px-4 py-3 font-medium ${isActive('/self-discovery') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Self Discovery
              </a>
            </Link>
            <Link href="/projects">
              <a className={`px-4 py-3 font-medium ${isActive('/projects') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                Projects
              </a>
            </Link>
            <Link href="/about">
              <a className={`px-4 py-3 font-medium ${isActive('/about') ? 'text-primary border-b-2 border-primary' : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'} transition-colors duration-200`}>
                About
              </a>
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
          <Link href="/">
            <a className={`block px-4 py-2 font-medium ${isActive('/') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Home
            </a>
          </Link>
          <Link href="/dashboard">
            <a className={`block px-4 py-2 font-medium ${isActive('/dashboard') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Dashboard
            </a>
          </Link>
          <Link href="/learn">
            <a className={`block px-4 py-2 font-medium ${isActive('/learn') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Learn
            </a>
          </Link>
          <Link href="/self-discovery">
            <a className={`block px-4 py-2 font-medium ${isActive('/self-discovery') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Self Discovery
            </a>
          </Link>
          <Link href="/projects">
            <a className={`block px-4 py-2 font-medium ${isActive('/projects') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              Projects
            </a>
          </Link>
          <Link href="/about">
            <a className={`block px-4 py-2 font-medium ${isActive('/about') ? 'text-primary bg-neutral-100' : 'text-neutral-600 hover:text-primary hover:bg-neutral-100'} rounded-md`}>
              About
            </a>
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
