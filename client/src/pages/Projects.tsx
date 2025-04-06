import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Projects: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-inter font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Projects</h1>
        <p className="text-lg text-neutral-600">Build a portfolio of real-world projects to demonstrate your skills to potential employers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <Card className="lg:col-span-3 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-inter font-bold text-2xl text-neutral-900 mb-1">My Projects</h2>
              <p className="text-neutral-600">Track your progress and manage your portfolio projects.</p>
            </div>
            <Button className="bg-primary text-white">
              <i className="fas fa-plus mr-2"></i>Start New Project
            </Button>
          </div>

          <div className="space-y-4">
            <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">In Progress</span>
                    <h3 className="font-inter font-semibold text-lg mb-1">Personal Finance Dashboard</h3>
                    <p className="text-neutral-600 text-sm">Create an interactive dashboard to track personal income, expenses, and savings goals.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="text-primary border-primary">
                      <i className="fas fa-edit mr-1"></i> Edit
                    </Button>
                    <Button className="bg-primary text-white">
                      Continue <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-600">Progress</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded mb-2">Just Started</span>
                    <h3 className="font-inter font-semibold text-lg mb-1">Professional Communication Portfolio</h3>
                    <p className="text-neutral-600 text-sm">Develop a portfolio of business communication samples including emails, reports, and presentations.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="text-primary border-primary">
                      <i className="fas fa-edit mr-1"></i> Edit
                    </Button>
                    <Button className="bg-primary text-white">
                      Continue <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-600">Progress</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded mb-2">Completed</span>
                    <h3 className="font-inter font-semibold text-lg mb-1">Digital Marketing Campaign</h3>
                    <p className="text-neutral-600 text-sm">Plan and execute a mock digital marketing campaign including strategy, content, and analytics.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="text-primary border-primary">
                      <i className="fas fa-file-download mr-1"></i> Download
                    </Button>
                    <Button className="bg-neutral-200 text-neutral-700 hover:bg-neutral-300">
                      View <i className="fas fa-external-link-alt ml-1"></i>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-neutral-600">Progress</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Completed</span>
                  <span className="font-bold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">In Progress</span>
                  <span className="font-bold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Not Started</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <i className="fas fa-lightbulb text-primary"></i>
                </div>
                <h3 className="font-inter font-semibold text-lg">Project Ideas</h3>
              </div>
              <p className="text-neutral-600 text-sm mb-4">Looking for inspiration? Explore our library of project ideas to build your portfolio.</p>
              <Button className="w-full bg-primary text-white">
                Browse Ideas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="font-inter font-bold text-2xl text-neutral-900 mb-6">Featured Student Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Project showcase" className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Student avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium">Sarah Johnson</span>
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Financial Health Dashboard</h3>
            <p className="text-neutral-600 text-sm mb-3">An interactive tool to visualize personal finances and track savings goals.</p>
            <Button variant="outline" className="w-full text-primary border-primary">
              View Project
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Project showcase" className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Student avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium">James Rivera</span>
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Digital Marketing Portfolio</h3>
            <p className="text-neutral-600 text-sm mb-3">A comprehensive showcase of social media, content, and email marketing strategies.</p>
            <Button variant="outline" className="w-full text-primary border-primary">
              View Project
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Project showcase" className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Student avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium">Michelle Chen</span>
            </div>
            <h3 className="font-inter font-semibold text-lg mb-2">Professional Presentation Collection</h3>
            <p className="text-neutral-600 text-sm mb-3">A series of business presentations showcasing communication and design skills.</p>
            <Button variant="outline" className="w-full text-primary border-primary">
              View Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
