import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, BellIcon } from "lucide-react";

const primaryNavItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Pathways" },
  { href: "/library", label: "Lessons" },
  { href: "/collections", label: "Collections" },
  { href: "/credentials", label: "Credentials" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/resource-center", label: "Resources" },
  { href: "/parent-dashboard", label: "Parent Dashboard" },
  { href: "/contribute", label: "Contribute" },
  { href: "/curriculum-collections", label: "Build Collections" },
  { href: "/contributor-dashboard", label: "Creator Dashboard" },
  { href: "/contributor-profile", label: "Creator Profile" },
];

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
            {primaryNavItems.map((item) => (
              <Link key={item.href} href={item.href} className={`px-4 py-3 font-medium whitespace-nowrap ${isActive(item.href)
                ? 'text-primary border-b-2 border-primary'
                : 'text-neutral-600 hover:text-primary border-b-2 border-transparent hover:border-primary'
              } transition-all duration-200`}>
                {item.label}
              </Link>
            ))}
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
          {primaryNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={`block px-4 py-2 font-medium rounded-md ${isActive(item.href)
              ? 'text-primary bg-blue-50'
              : 'text-neutral-600 hover:text-primary hover:bg-blue-50'
            } transition-colors duration-200`}>
              {item.label}
            </Link>
          ))}
          
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
