import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-inter font-bold text-2xl md:text-3xl text-white mb-4">Ready to Learn Skills That Matter?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">Join thousands of students who are building practical skills for the modern world with our innovative approach to education.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-neutral-100 transition-colors duration-200 shadow-md">
              Get Started
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition-colors duration-200">
              Learn More About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
