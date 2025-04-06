import React from "react";
import { Link } from "wouter";
import { 
  GraduationCapIcon, 
  MapPinIcon, 
  MailIcon, 
  PhoneIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-foreground text-white py-12 border-t border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="bg-primary/90 rounded-lg p-2 shadow-sm">
                <GraduationCapIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-sans font-bold text-xl bg-gradient-to-r from-primary/90 to-sky-500 bg-clip-text text-transparent">
                Real World Academy
              </h2>
            </div>
            <p className="text-neutral-600 mb-5 leading-relaxed">
              A new way for the modern generation to learn skills that matter in today's world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-all duration-200">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-all duration-200">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-all duration-200">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-all duration-200">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-lg text-neutral-800 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/self-discovery" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  Self Discovery
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-lg text-neutral-800 mb-5">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">Support Center</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">Career Resources</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">Success Stories</a></li>
              <li><a href="#" className="text-neutral-600 hover:text-primary transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-sans font-semibold text-lg text-neutral-800 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mt-1 mr-3 text-primary/70" />
                <span className="text-neutral-600">123 Education Street, Learning City, ST 12345</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 mr-3 text-primary/70" />
                <a href="mailto:info@realworldacademy.com" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  info@realworldacademy.com
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3 text-primary/70" />
                <a href="tel:+1234567890" className="text-neutral-600 hover:text-primary transition-colors duration-200">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-200 text-neutral-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 Real World Academy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
