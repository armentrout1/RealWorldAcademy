import React from "react";
import { Link } from "wouter";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white rounded-lg p-1">
                <i className="fas fa-graduation-cap text-primary text-lg"></i>
              </div>
              <h2 className="font-inter font-bold text-xl">Real World Academy</h2>
            </div>
            <p className="text-neutral-400 mb-4">A new way for the modern generation to learn skills that matter in today's world.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">Dashboard</a>
                </Link>
              </li>
              <li>
                <Link href="/learn">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">Learn</a>
                </Link>
              </li>
              <li>
                <Link href="/self-discovery">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">Self Discovery</a>
                </Link>
              </li>
              <li>
                <Link href="/projects">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">Projects</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-neutral-400 hover:text-white transition-colors duration-200">About</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Support Center</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Career Resources</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">Success Stories</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-inter font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-neutral-400"></i>
                <span className="text-neutral-400">123 Education Street, Learning City, ST 12345</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-neutral-400"></i>
                <a href="mailto:info@realworldacademy.com" className="text-neutral-400 hover:text-white transition-colors duration-200">info@realworldacademy.com</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-neutral-400"></i>
                <a href="tel:+1234567890" className="text-neutral-400 hover:text-white transition-colors duration-200">(123) 456-7890</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-700 text-neutral-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2023 Real World Academy. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
