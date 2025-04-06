import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types";

const Learn: React.FC = () => {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-inter font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Learn</h1>
        <p className="text-lg text-neutral-600">Discover courses designed to help you acquire real-world skills.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow">
            <input 
              type="text" 
              placeholder="Search for courses..." 
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="soft-skills">Soft Skills</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Duration</option>
              <option value="short">Short (&lt; 4 weeks)</option>
              <option value="medium">Medium (4-8 weeks)</option>
              <option value="long">Long (&gt; 8 weeks)</option>
            </select>
            <Button className="bg-primary text-white">
              <i className="fas fa-filter mr-2"></i>Filter
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg animate-pulse">
              <div className="h-48 bg-neutral-200"></div>
              <CardContent className="p-5">
                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full mb-3"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-4">Error Loading Courses</h2>
          <p className="text-red-500">Failed to load courses. Please try again later.</p>
        </div>
      )}

      {courses && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img src={course.image} alt={`Course: ${course.title}`} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded">Technology</span>
                  <div className="flex items-center text-amber-500">
                    <i className="fas fa-star text-sm"></i>
                    <span className="ml-1 text-sm font-medium text-neutral-700">{course.rating}</span>
                  </div>
                </div>
                <h3 className="font-inter font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-neutral-600 text-sm mb-3">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <i className="far fa-clock text-neutral-500"></i>
                    <span className="text-sm text-neutral-500">{course.duration}</span>
                  </div>
                  <Button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors duration-200">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Learn;
