import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Lightbulb, 
  BookOpen, 
  Rocket, 
  Target, 
  ChevronRight,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
          Welcome to Your Real World Journey
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
          Discover practical skills, explore your strengths, and prepare for real-world challenges with our personalized learning platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
        {/* Discover Your Strengths Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-4 gap-4">
                <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-lg">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Discover Your Strengths</h3>
              </div>
              <p className="text-neutral-600 mb-6 line-clamp-3">
                Take assessments to understand your unique strengths, talents, and areas for growth. Get a personalized profile that highlights your learning style.
              </p>
              <div className="mt-auto">
                <Link href="/self-discovery">
                  <Button className="w-full group-hover:bg-primary/90 group-hover:translate-y-[-2px] transition-all">
                    Start Discovery
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Explore Life Skills Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-4 gap-4">
                <div className="bg-green-100 w-14 h-14 flex items-center justify-center rounded-lg">
                  <BookOpen className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Explore Life Skills</h3>
              </div>
              <p className="text-neutral-600 mb-6 line-clamp-3">
                Browse our library of practical life skills courses - from financial literacy to effective communication, critical thinking, and digital competency.
              </p>
              <div className="mt-auto">
                <Link href="/learn">
                  <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:translate-y-[-2px] transition-all">
                    Browse Courses
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start a Real-World Project Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-4 gap-4">
                <div className="bg-purple-100 w-14 h-14 flex items-center justify-center rounded-lg">
                  <Rocket className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Start a Real-World Project</h3>
              </div>
              <p className="text-neutral-600 mb-6 line-clamp-3">
                Apply what you've learned with hands-on projects that solve real problems. Work individually or collaborate with peers on challenges that matter.
              </p>
              <div className="mt-auto">
                <Link href="/projects">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:translate-y-[-2px] transition-all">
                    Explore Projects
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenge Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg group">
          <CardContent className="p-0">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-4 gap-4">
                <div className="bg-amber-100 w-14 h-14 flex items-center justify-center rounded-lg">
                  <Target className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Daily Challenge</h3>
              </div>
              <p className="text-neutral-600 mb-6 line-clamp-3">
                Build habits through daily micro-challenges. Each day brings a new 5-minute task to develop your skills incrementally and track your progress over time.
              </p>
              <div className="mt-auto">
                <Link href="/dashboard/daily-challenge">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 group-hover:translate-y-[-2px] transition-all">
                    Today's Challenge
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-sky-50 p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart className="h-8 w-8 text-primary mr-3" />
            <div>
              <h3 className="font-medium text-lg">Your Progress Dashboard</h3>
              <p className="text-sm text-neutral-600">Track all your course progress and achievements</p>
            </div>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            View Full Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
