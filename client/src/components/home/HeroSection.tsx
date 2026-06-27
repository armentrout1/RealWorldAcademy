import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h1 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4">
              Real Learning for Real Life
            </h1>
            <p className="text-lg text-neutral-700 mb-6">
              A modern place for learners, families, and educators to build factual skills, practical understanding,
              human creativity, useful work, and guided growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/learn">
                <Button className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg">
                  Start Learning
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border border-primary hover:bg-primary/5 transition-colors duration-200">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Students learning together" 
              className="rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
