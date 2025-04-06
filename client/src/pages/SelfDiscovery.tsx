import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SelfDiscovery: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-inter font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Self Discovery</h1>
        <p className="text-lg text-neutral-600">Explore your strengths, passions, and potential career paths that align with your values.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-white">
          <CardHeader>
            <CardTitle>Personality Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discover your unique personality traits and how they influence your learning style and career preferences.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button className="bg-primary text-white font-medium">
                Take the Assessment
              </Button>
              <Button variant="outline" className="text-primary border-primary">
                Learn More
              </Button>
            </div>
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <h4 className="font-medium text-lg mb-2">What You'll Discover:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Your primary personality traits and tendencies</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Optimal learning environments for your personality type</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Career paths that align with your natural strengths</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Strategies to leverage your strengths and manage challenges</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Personality Assessment</span>
                  <span className="text-sm text-green-600">Completed</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Skills Inventory</span>
                  <span className="text-sm text-primary">60%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Career Values</span>
                  <span className="text-sm text-neutral-500">Not Started</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Learning Style</span>
                  <span className="text-sm text-neutral-500">Not Started</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="font-inter font-bold text-2xl text-neutral-900 mb-6">Self-Discovery Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-5xl"></i>
          </div>
          <CardContent className="p-5">
            <h3 className="font-inter font-semibold text-lg mb-2">Skills Inventory</h3>
            <p className="text-neutral-600 text-sm mb-4">Identify your existing skills and discover areas for improvement to reach your career goals.</p>
            <Button className="w-full bg-primary text-white">
              Start Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-lg flex items-center justify-center">
            <i className="fas fa-compass text-white text-5xl"></i>
          </div>
          <CardContent className="p-5">
            <h3 className="font-inter font-semibold text-lg mb-2">Career Values</h3>
            <p className="text-neutral-600 text-sm mb-4">Understand what truly matters to you in a career and how to align your work with your values.</p>
            <Button className="w-full bg-primary text-white">
              Explore Values
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg flex items-center justify-center">
            <i className="fas fa-lightbulb text-white text-5xl"></i>
          </div>
          <CardContent className="p-5">
            <h3 className="font-inter font-semibold text-lg mb-2">Learning Style</h3>
            <p className="text-neutral-600 text-sm mb-4">Discover how you best absorb and process information to optimize your learning experience.</p>
            <Button className="w-full bg-primary text-white">
              Find Your Style
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelfDiscovery;
