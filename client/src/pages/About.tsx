import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const About: React.FC = () => {
  return (
    <div>
      <section className="py-12 bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h1 className="font-inter font-bold text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-4">About Real World Academy</h1>
              <p className="text-lg text-neutral-700 mb-6">
                We're transforming education by focusing on what truly matters: practical skills for the modern world. Our mission is to empower learners with knowledge that directly applies to their personal and professional lives.
              </p>
              <Button className="bg-primary text-white font-medium">
                Get Started Today
              </Button>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Team collaboration" 
                className="rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-4">Our Vision & Mission</h2>
            <Separator className="my-4 mx-auto w-24 bg-primary h-1" />
            <p className="text-lg text-neutral-700">
              We believe that education should prepare individuals for the challenges and opportunities of the real world. Our vision is to create a learning environment where practical skills, self-discovery, and project-based experiences come together to empower the next generation of leaders and innovators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book-open text-primary text-2xl"></i>
                </div>
                <h3 className="font-inter font-semibold text-xl mb-2">Practical Education</h3>
                <p className="text-neutral-600">Focusing on skills and knowledge with real-world applications</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-graduate text-secondary text-2xl"></i>
                </div>
                <h3 className="font-inter font-semibold text-xl mb-2">Personal Growth</h3>
                <p className="text-neutral-600">Developing self-awareness and confidence through guided discovery</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-briefcase text-green-600 text-2xl"></i>
                </div>
                <h3 className="font-inter font-semibold text-xl mb-2">Career Readiness</h3>
                <p className="text-neutral-600">Building portfolios and skills that employers truly value</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-3">Our Team</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">
              Meet the dedicated educators, industry professionals, and learning specialists who make Real World Academy possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-inter font-semibold text-lg">David Chen</h3>
                <p className="text-neutral-600 text-sm mb-2">Founder & CEO</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-inter font-semibold text-lg">Sarah Johnson</h3>
                <p className="text-neutral-600 text-sm mb-2">Chief Learning Officer</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-inter font-semibold text-lg">Michael Rodriguez</h3>
                <p className="text-neutral-600 text-sm mb-2">Head of Technology</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-inter font-semibold text-lg">Emily Lee</h3>
                <p className="text-neutral-600 text-sm mb-2">Director of Curriculum</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="text-neutral-500 hover:text-primary transition-colors">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-white mb-4">Join Our Learning Community</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Take the first step toward building practical skills for the real world. Our innovative approach to education is designed to help you succeed in today's rapidly changing environment.
          </p>
          <Button className="bg-white text-primary font-medium">
            Enroll Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
