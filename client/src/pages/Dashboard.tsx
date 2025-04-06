import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-inter font-bold text-3xl md:text-4xl text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Welcome back to your learning journey!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600">Courses in Progress</span>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="fas fa-book text-primary"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold">3</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600">Completed Courses</span>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold">5</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600">Hours Learned</span>
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <i className="fas fa-clock text-secondary"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold">42</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-neutral-600">Certificates</span>
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-certificate text-purple-600"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold">2</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden mr-4">
                      <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Course thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">Digital Skills for the Modern Workplace</h4>
                      <div className="flex items-center text-sm text-neutral-500 mb-2">
                        <span className="mr-3"><i className="far fa-clock mr-1"></i> 5 of 8 weeks</span>
                        <span><i className="fas fa-chart-pie mr-1"></i> 65% complete</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <button className="text-primary text-sm font-medium hover:underline">Continue Course <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden mr-4">
                      <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Course thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">Financial Literacy 101</h4>
                      <div className="flex items-center text-sm text-neutral-500 mb-2">
                        <span className="mr-3"><i className="far fa-clock mr-1"></i> 3 of 6 weeks</span>
                        <span><i className="fas fa-chart-pie mr-1"></i> 45% complete</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <button className="text-primary text-sm font-medium hover:underline">Continue Course <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden mr-4">
                      <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Course thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">Effective Communication Skills</h4>
                      <div className="flex items-center text-sm text-neutral-500 mb-2">
                        <span className="mr-3"><i className="far fa-clock mr-1"></i> 1 of 4 weeks</span>
                        <span><i className="fas fa-chart-pie mr-1"></i> 25% complete</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <button className="text-primary text-sm font-medium hover:underline">Continue Course <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-video text-primary"></i>
                    </div>
                    <div>
                      <h5 className="font-medium">Live Workshop</h5>
                      <p className="text-sm text-neutral-500">Financial Planning Basics</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>Tomorrow, 3:00 PM</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-users text-purple-600"></i>
                    </div>
                    <div>
                      <h5 className="font-medium">Group Discussion</h5>
                      <p className="text-sm text-neutral-500">Communication Challenges</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>Friday, 5:30 PM</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-neutral-200">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-graduation-cap text-green-600"></i>
                    </div>
                    <div>
                      <h5 className="font-medium">Assignment Due</h5>
                      <p className="text-sm text-neutral-500">Digital Skills Project</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>Next Monday, 11:59 PM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
