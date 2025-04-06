import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/types";

const FeaturedCourses: React.FC = () => {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ['/api/courses/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900">Featured Courses</h2>
            <Link href="/learn">
              <a className="text-primary font-medium hover:underline">View All</a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-4">Error Loading Courses</h2>
            <p className="text-red-500">Failed to load featured courses. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900">Featured Courses</h2>
          <Link href="/learn">
            <a className="text-primary font-medium hover:underline">View All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
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
                  <Link href="/learn">
                    <Button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors duration-200">
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
