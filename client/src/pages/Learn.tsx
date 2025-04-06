import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Microscope,
  BookOpen,
  PiggyBank,
  Laptop,
  Briefcase,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";

// Define a type for our subject modules
interface SubjectModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  modules: {
    title: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
  }[];
}

// Subject module data
const subjectModules: SubjectModule[] = [
  {
    id: "math",
    title: "Real-World Math",
    subtitle: "Learn how to budget, invest, and compare loans.",
    description: "Forget about solving for X. Our math curriculum focuses on practical applications you'll use every day, from calculating mortgage payments to understanding data and statistics in the news.",
    icon: <Calculator className="h-10 w-10" />,
    color: "bg-blue-500",
    modules: [
      { title: "Budgeting Fundamentals", duration: "3 weeks", level: "Beginner" },
      { title: "Investment Mathematics", duration: "4 weeks", level: "Intermediate" },
      { title: "Statistical Thinking", duration: "6 weeks", level: "Advanced" }
    ]
  },
  {
    id: "science",
    title: "Practical Science",
    subtitle: "Understand the world through hands-on experiments.",
    description: "Science isn't just lab coats and test tubes. Learn how scientific thinking applies to everything from cooking the perfect meal to understanding climate change and making informed health decisions.",
    icon: <Microscope className="h-10 w-10" />,
    color: "bg-green-500",
    modules: [
      { title: "Kitchen Chemistry", duration: "4 weeks", level: "Beginner" },
      { title: "Environmental Science in Daily Life", duration: "5 weeks", level: "Intermediate" },
      { title: "The Science of Health & Fitness", duration: "6 weeks", level: "Intermediate" }
    ]
  },
  {
    id: "history",
    title: "Global Perspective",
    subtitle: "See how the past connects to today's world.",
    description: "History comes alive when you understand how past events shaped our present reality. Explore diverse perspectives and learn how historical patterns influence modern politics, culture, and social issues.",
    icon: <BookOpen className="h-10 w-10" />,
    color: "bg-amber-500",
    modules: [
      { title: "Modern History & Current Events", duration: "4 weeks", level: "Beginner" },
      { title: "Cultural Histories of Global Societies", duration: "6 weeks", level: "Intermediate" },
      { title: "Economic History & Modern Markets", duration: "5 weeks", level: "Advanced" }
    ]
  },
  {
    id: "finance",
    title: "Financial Literacy",
    subtitle: "Master money, credit, and the basics of adult life.",
    description: "From taxes to retirement accounts, gain the financial knowledge that's essential for adulting. Learn to manage debt, build credit, save strategically, and make informed financial decisions.",
    icon: <PiggyBank className="h-10 w-10" />,
    color: "bg-purple-500",
    modules: [
      { title: "Personal Finance Basics", duration: "3 weeks", level: "Beginner" },
      { title: "Credit & Debt Management", duration: "4 weeks", level: "Intermediate" },
      { title: "Retirement & Long-Term Planning", duration: "5 weeks", level: "Advanced" }
    ]
  },
  {
    id: "technology",
    title: "Technology Skills",
    subtitle: "Build digital competence for the modern workplace.",
    description: "Develop the tech skills employers actually want. Learn to leverage digital tools for productivity, basic coding concepts, data analysis, and how to adapt to rapidly changing technologies.",
    icon: <Laptop className="h-10 w-10" />,
    color: "bg-cyan-500",
    modules: [
      { title: "Digital Productivity Tools", duration: "3 weeks", level: "Beginner" },
      { title: "Coding Fundamentals for Non-Programmers", duration: "6 weeks", level: "Intermediate" },
      { title: "Data Literacy & Analysis", duration: "5 weeks", level: "Intermediate" }
    ]
  },
  {
    id: "careers",
    title: "Future Careers",
    subtitle: "Prepare for jobs that don't exist yet.",
    description: "The working world is transforming rapidly. Develop adaptable skills, learn about emerging industries, and build the mindset needed to thrive in the changing landscape of work.",
    icon: <Briefcase className="h-10 w-10" />,
    color: "bg-rose-500",
    modules: [
      { title: "Future of Work & Emerging Careers", duration: "4 weeks", level: "Beginner" },
      { title: "Entrepreneurial Thinking", duration: "5 weeks", level: "Intermediate" },
      { title: "Building a Personal Brand", duration: "3 weeks", level: "Intermediate" }
    ]
  }
];

// Subject Detail Component
const SubjectDetail: React.FC<{ subject: SubjectModule }> = ({ subject }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Link href="/learn">
          <Button variant="ghost" className="p-0 mr-2">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
        </Link>
        <span className="text-neutral-500">Back to all subjects</span>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`${subject.color} text-white p-3 rounded-xl`}>
              {subject.icon}
            </div>
            <div>
              <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900">{subject.title}</h1>
              <p className="text-lg text-neutral-600">{subject.subtitle}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-xl mb-3">Overview</h2>
            <p className="text-neutral-700 leading-relaxed mb-6">{subject.description}</p>
            
            <h2 className="font-semibold text-xl mb-3">Why Study This?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-medium text-lg mb-2">Real-World Application</h3>
                <p className="text-neutral-600">Learn skills you'll actually use in everyday situations, not just theoretical concepts.</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-medium text-lg mb-2">Career Relevance</h3>
                <p className="text-neutral-600">Develop competencies that employers value regardless of your chosen field.</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-medium text-lg mb-2">Practical Focus</h3>
                <p className="text-neutral-600">Hands-on projects and real-world scenarios instead of just theoretical readings.</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                <h3 className="font-medium text-lg mb-2">Lifelong Skills</h3>
                <p className="text-neutral-600">Gain knowledge that remains relevant even as specific technologies change.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-xl mb-6">Learning Modules</h2>
            <div className="space-y-4">
              {subject.modules.map((module, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">{module.title}</h3>
                    <Badge variant={module.level === "Beginner" ? "default" : 
                                    module.level === "Intermediate" ? "secondary" : "outline"}>
                      {module.level}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2 text-neutral-500">
                    <span className="text-sm">{module.duration}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">4 lessons</span>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full sm:w-auto">Start Learning</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ready to start?</CardTitle>
              <CardDescription>Enroll in this subject track and start building practical skills.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">Enroll Now</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Related Subjects</CardTitle>
              <CardDescription>Explore complementary skill areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {subjectModules
                .filter(m => m.id !== subject.id)
                .slice(0, 3)
                .map(module => (
                  <Link key={module.id} href={`/learn/${module.id}`}>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-50 cursor-pointer">
                      <div className={`${module.color} text-white p-1.5 rounded`}>
                        {React.cloneElement(module.icon as React.ReactElement, { className: 'h-4 w-4' })}
                      </div>
                      <span>{module.title}</span>
                    </div>
                  </Link>
                ))
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Learn: React.FC = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if we're on a subject detail page
  const matchSubject = location.match(/\/learn\/(.+)/);
  if (matchSubject) {
    const subjectId = matchSubject[1];
    const subject = subjectModules.find(s => s.id === subjectId);
    
    if (subject) {
      return <SubjectDetail subject={subject} />;
    }
  }
  
  // Filter modules based on search query
  const filteredModules = searchQuery 
    ? subjectModules.filter(module => 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        module.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subjectModules;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Learn Real-World Skills</h1>
        <p className="text-lg text-neutral-600">Traditional subjects reimagined with practical, real-world applications.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..." 
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Link key={module.id} href={`/learn/${module.id}`}>
            <Card className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer h-full">
              <div className={`${module.color} text-white p-6`}>
                <div className="bg-white/10 w-fit p-3 rounded-lg backdrop-blur-sm">
                  {module.icon}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-sans font-semibold text-xl mb-2">{module.title}</h3>
                <p className="text-neutral-600 mb-4">{module.subtitle}</p>
                <div className="text-sm text-neutral-500 mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <span>•</span>
                    <span>{module.modules.length} Learning Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span>Practical Projects & Assessments</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button className="w-full" variant="outline">
                  Explore Modules
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Learn;
