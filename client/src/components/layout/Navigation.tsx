import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, BellIcon } from "lucide-react";

const Navigation: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            <Link href="/" className={`px-4 py-3 font-medium ${isActive('/') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Home
            </Link>
            <Link href="/dashboard" className={`px-4 py-3 font-medium ${isActive('/dashboard') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Dashboard
            </Link>
            <Link href="/learn" className={`px-4 py-3 font-medium ${isActive('/learn') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Learn
            </Link>
            <Link href="/self-discovery" className={`px-4 py-3 font-medium ${isActive('/self-discovery') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Self Discovery
            </Link>
            <Link href="/projects" className={`px-4 py-3 font-medium ${isActive('/projects') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Projects
            </Link>
            <Link href="/team-projects" className={`px-4 py-3 font-medium ${isActive('/team-projects') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Team Projects
            </Link>
            <Link href="/financial-literacy" className={`px-4 py-3 font-medium ${isActive('/financial-literacy') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Financial Literacy
            </Link>
            <Link href="/how-we-learn" className={`px-4 py-3 font-medium ${isActive('/how-we-learn') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              How We Learn
            </Link>
            <Link href="/plan-your-future" className={`px-4 py-3 font-medium ${isActive('/plan-your-future') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              Plan Your Future
            </Link>
            <Link href="/about" className={`px-4 py-3 font-medium ${isActive('/about') 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
            } transition-all duration-200`}>
              About
            </Link>
          </div>
          <div className="md:hidden">
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'} bg-white border-b border-neutral-100 pb-2 shadow-md`}>
        <div className="container mx-auto px-4 py-2 space-y-2">
          <Link href="/" className={`block px-4 py-2 font-medium rounded-md ${isActive('/') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Home
          </Link>
          <Link href="/dashboard" className={`block px-4 py-2 font-medium rounded-md ${isActive('/dashboard') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Dashboard
          </Link>
          <Link href="/learn" className={`block px-4 py-2 font-medium rounded-md ${isActive('/learn') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Learn
          </Link>
          <Link href="/self-discovery" className={`block px-4 py-2 font-medium rounded-md ${isActive('/self-discovery') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Self Discovery
          </Link>
          <Link href="/projects" className={`block px-4 py-2 font-medium rounded-md ${isActive('/projects') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Projects
          </Link>
          <Link href="/team-projects" className={`block px-4 py-2 font-medium rounded-md ${isActive('/team-projects') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Team Projects
          </Link>
          <Link href="/financial-literacy" className={`block px-4 py-2 font-medium rounded-md ${isActive('/financial-literacy') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Financial Literacy
          </Link>
          <Link href="/how-we-learn" className={`block px-4 py-2 font-medium rounded-md ${isActive('/how-we-learn') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            How We Learn
          </Link>
          <Link href="/plan-your-future" className={`block px-4 py-2 font-medium rounded-md ${isActive('/plan-your-future') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            Plan Your Future
          </Link>
          <Link href="/about" className={`block px-4 py-2 font-medium rounded-md ${isActive('/about') 
            ? 'text-primary bg-blue-50' 
            : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
          } transition-colors duration-200`}>
            About
          </Link>
          
          <div className="flex items-center space-x-4 pt-2 border-t border-neutral-200">
            <button className="p-2 rounded-full hover:bg-blue-50 text-neutral-600 hover:text-primary transition-colors duration-200">
              <BellIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Profile" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-neutral-700">Alex Morgan</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
