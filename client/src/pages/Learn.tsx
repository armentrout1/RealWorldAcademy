import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calculator,
  Microscope,
  BookOpen,
  PiggyBank,
  Laptop,
  Briefcase,
  ChevronRight,
  Search,
  Filter,
  MessageCircle,
  Heart,
  Sparkles,
  Code,
  Brain,
  GraduationCap,
  Globe
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

interface BackendSubject {
  id: number;
  title: string;
  description: string;
  slug: string;
  iconName: string;
  color: string;
  category: string;
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
  },
  // New Subject: Communication & Relationships
  {
    id: "communication",
    title: "Communication & Relationships",
    subtitle: "Learn how to express yourself, listen, and work well with others.",
    description: "Effective communication is the foundation of success in every area of life. Develop skills to express yourself clearly, listen attentively, and build healthy relationships both personally and professionally.",
    icon: <MessageCircle className="h-10 w-10" />,
    color: "bg-indigo-500",
    modules: [
      { title: "Using Kind Words", duration: "3 weeks", level: "Beginner" },
      { title: "Handling Arguments With Respect", duration: "4 weeks", level: "Intermediate" },
      { title: "How to Speak in a Job Interview", duration: "3 weeks", level: "Advanced" }
    ]
  },
  // New Subject: Health & Wellness
  {
    id: "health",
    title: "Health & Wellness",
    subtitle: "Understand your body, your mind, and how to take care of both.",
    description: "Your physical and mental wellbeing affects everything you do. Learn practical strategies for maintaining health, managing stress, building resilience, and creating balanced habits that support your goals.",
    icon: <Heart className="h-10 w-10" />,
    color: "bg-red-500",
    modules: [
      { title: "What Is Sleep and Why It Matters", duration: "3 weeks", level: "Beginner" },
      { title: "Eating for Energy", duration: "4 weeks", level: "Intermediate" },
      { title: "Mental Health Basics and Boundaries", duration: "5 weeks", level: "Advanced" }
    ]
  },
  // New Subject: Entrepreneurship & Work Skills
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Work Skills",
    subtitle: "Start a hustle, prep for jobs, and build skills employers want.",
    description: "Whether you want to start your own business or excel in a career, these practical skills will give you an edge. Learn how to identify opportunities, solve problems creatively, and bring ideas to life.",
    icon: <Sparkles className="h-10 w-10" />,
    color: "bg-orange-500",
    modules: [
      { title: "What is a Business?", duration: "3 weeks", level: "Beginner" },
      { title: "How to Price Something You Sell", duration: "4 weeks", level: "Intermediate" },
      { title: "Starting a Side Hustle or Micro-Business", duration: "6 weeks", level: "Advanced" }
    ]
  },
  // New Subject: Tech in the Real World
  {
    id: "tech-real-world",
    title: "Tech in the Real World",
    subtitle: "Explore tools, apps, and digital skills used by real professionals.",
    description: "Technology isn't just about coding. This track focuses on the practical digital tools and platforms professionals use every day, and how you can leverage them for school, work, and personal projects.",
    icon: <Code className="h-10 w-10" />,
    color: "bg-teal-500",
    modules: [
      { title: "What is the Cloud?", duration: "2 weeks", level: "Beginner" },
      { title: "Using Google Docs & Spreadsheets", duration: "3 weeks", level: "Intermediate" },
      { title: "How to Build a Simple Website", duration: "5 weeks", level: "Advanced" }
    ]
  }
];

const iconByName: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-10 w-10" />,
  wallet: <PiggyBank className="h-10 w-10" />,
  "message-circle": <MessageCircle className="h-10 w-10" />,
};

const colorByName: Record<string, string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  violet: "bg-indigo-500",
};

const mapSubjectFromApi = (subject: BackendSubject): SubjectModule => {
  const existingSubject = subjectModules.find((module) => module.id === subject.slug);
  if (existingSubject) return existingSubject;

  return {
    id: subject.slug,
    title: subject.title,
    subtitle: subject.description,
    description: subject.description,
    icon: iconByName[subject.iconName] || <BookOpen className="h-10 w-10" />,
    color: colorByName[subject.color] || "bg-blue-500",
    modules: [
      {
        title: "Guided pathway lessons",
        duration: "Self-paced",
        level: "Beginner",
      },
    ],
  };
};

// Define a type for age groups
type AgeGroup = '9-12' | '13-15' | '16-18';

// Subject Detail Component
const SubjectDetail: React.FC<{ subject: SubjectModule }> = ({ subject }) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('9-12');

  // Define age-appropriate content for the selected subject based on age group
  const getAgeGroupContent = () => {
    const lessons = {
      // Communication & Relationships
      'communication': {
        '9-12': [
          {
            title: "Using Kind Words",
            description: "Learn how to express yourself positively and build friendships through communication.",
            activity: "Practice Exercise: Write three kind ways to ask someone to share a toy or game with you."
          },
          {
            title: "Active Listening",
            description: "Discover the power of truly hearing what others say and how it helps you connect.",
            activity: "Game: 'Telephone' but with added details to practice remembering what you heard."
          },
          {
            title: "Respecting Differences",
            description: "Understand how everyone has unique thoughts and feelings, and why that's a good thing.",
            activity: "Think About It: What's something you learned from a friend who thinks differently than you?"
          }
        ],
        '13-15': [
          {
            title: "Handling Arguments With Respect",
            description: "Learn how to disagree without being mean, and how to stand up for yourself respectfully.",
            activity: "Scenario Practice: How would you respond if someone disagrees with your idea for a group project?"
          },
          {
            title: "Digital Communication",
            description: "Understand how tone gets lost online and strategies for clear communication in texts and social media.",
            activity: "Exercise: Rewrite these unclear texts to avoid misunderstandings."
          },
          {
            title: "Emotional Intelligence",
            description: "Learn to recognize your emotions and how they affect your communication with others.",
            activity: "Reflection: Describe a time when emotions made communication harder and what you could do differently."
          }
        ],
        '16-18': [
          {
            title: "How to Speak in a Job Interview",
            description: "Master the art of professional communication for interviews, networking, and workplace success.",
            activity: "Practice: Record yourself answering common interview questions and analyze your responses."
          },
          {
            title: "Conflict Resolution",
            description: "Learn advanced techniques for managing disagreements and finding win-win solutions.",
            activity: "Case Study: How would you resolve this workplace conflict between team members?"
          },
          {
            title: "Public Speaking",
            description: "Overcome nervousness and deliver confident, compelling presentations and speeches.",
            activity: "Challenge: Prepare a 3-minute pitch about something you're passionate about."
          }
        ]
      },
      // Health & Wellness
      'health': {
        '9-12': [
          {
            title: "What Is Sleep and Why It Matters",
            description: "Learn why your body needs sleep and how it helps your brain, growth, and mood.",
            activity: "Create a bedtime routine chart with 5 steps to help you get better sleep."
          },
          {
            title: "Fueling Your Body",
            description: "Understand different food groups and how they give you energy for different activities.",
            activity: "Food Detective: Find three foods in your kitchen and identify what nutrients they provide."
          },
          {
            title: "Moving Your Body",
            description: "Discover fun ways to stay active and why exercise makes you feel good.",
            activity: "Movement Challenge: Create a 5-minute exercise routine you can do in your bedroom."
          }
        ],
        '13-15': [
          {
            title: "Eating for Energy",
            description: "Learn how different foods affect your energy, focus, and performance throughout the day.",
            activity: "Food & Mood Journal: Track what you eat and how you feel for three days - notice any patterns?"
          },
          {
            title: "Stress Management",
            description: "Discover techniques to recognize and manage stress in healthy ways.",
            activity: "Try these three 2-minute breathing exercises when you feel overwhelmed."
          },
          {
            title: "Digital Wellness",
            description: "Learn how screen time affects your sleep, posture, and mental health.",
            activity: "Screen Audit: Track your actual screen time for a day and create a balanced plan."
          }
        ],
        '16-18': [
          {
            title: "Mental Health Basics and Boundaries",
            description: "Understand common mental health challenges, when to seek help, and how to set healthy boundaries.",
            activity: "Boundary Practice: Write responses to common scenarios where you need to protect your time or energy."
          },
          {
            title: "Fitness for Life",
            description: "Design sustainable exercise routines that fit your life, goals, and interests.",
            activity: "Create a realistic weekly fitness plan accounting for your current schedule and energy levels."
          },
          {
            title: "Nutrition Navigation",
            description: "Learn to make informed food choices while balancing social life, budget, and health goals.",
            activity: "Budget Meal Planner: Design three days of nutritious meals for under $25 total."
          }
        ]
      },
      // Default empty content for other subjects
      'default': {
        '9-12': [],
        '13-15': [],
        '16-18': []
      }
    };

    // Get content for the selected subject or default empty content
    const subjectContent = (lessons as any)[subject.id] || lessons.default;
    return subjectContent[selectedAgeGroup] || [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/learn">
          <Button variant="ghost" className="pl-0">
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Subjects
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className={`${subject.color} text-white p-6 rounded-lg mb-6`}>
            <div className="flex items-start justify-between">
              <div className="bg-white p-3 rounded-md shadow-md mb-4">
                {subject.icon}
              </div>
              <div className="space-x-2">
                {subject.modules.map(module => (
                  <Badge key={module.title} variant={module.level === "Beginner" ? "default" : 
                                    module.level === "Intermediate" ? "secondary" : "outline"}>
                    {module.level}
                  </Badge>
                ))}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{subject.title}</h1>
            <p className="text-xl opacity-90 mb-4">{subject.subtitle}</p>
            <p className="opacity-85">{subject.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Age-Appropriate Content</h2>
              <div className="flex space-x-2">
                <Button 
                  variant={selectedAgeGroup === '9-12' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgeGroup('9-12')}
                >
                  Ages 9-12
                </Button>
                <Button 
                  variant={selectedAgeGroup === '13-15' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgeGroup('13-15')}
                >
                  Ages 13-15
                </Button>
                <Button 
                  variant={selectedAgeGroup === '16-18' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgeGroup('16-18')}
                >
                  Ages 16-18
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {getAgeGroupContent().length > 0 ? (
                getAgeGroupContent().map((lesson: { title: string; description: string; activity: string }, idx: number) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle>{lesson.title}</CardTitle>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-gray-50 border-t">
                      <h4 className="font-medium mb-2">Activity</h4>
                      <p>{lesson.activity}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline">Lesson {idx + 1}</Badge>
                      <Link href={`/learn/${subject.id}/${subject.id === "money-basics" || subject.id === "financial-literacy" ? "budgeting-basics" : subject.modules[0]?.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>
                        <Button>Start Lesson</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Content Coming Soon</h3>
                  <p className="text-neutral-600">We're working on age-appropriate content for this subject.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Module Overview</h2>
            <div className="space-y-4">
              {subject.modules.map((module, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{module.title}</h3>
                      <div className="flex items-center mt-2 text-neutral-500">
                        <span className="text-sm">{module.duration}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm">4 lessons</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant={module.level === "Beginner" ? "default" : 
                                    module.level === "Intermediate" ? "secondary" : "outline"}>
                        {module.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/learn/${subject.id}/${subject.id === "money-basics" || subject.id === "financial-literacy" ? "budgeting-basics" : module.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>
                      <Button className="w-full sm:w-auto">Start Learning</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 space-y-6">
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
                .filter(s => s.id !== subject.id)
                .slice(0, 3)
                .map(s => (
                  <Link key={s.id} href={`/learn/${s.id}`}>
                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <div className={`${s.color} p-2 rounded-md mr-3 text-white`}>
                        {s.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{s.title}</h4>
                        <p className="text-sm text-neutral-500">{s.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Learn: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>("13-15");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("all");
  const [location] = useLocation();
  
  // Check if we're on a subject detail page
  const subjectMatch = /^\/learn\/([^\/]+)$/.exec(location);
  
  if (subjectMatch) {
    const subjectId = subjectMatch[1];
    const subject = subjectModules.find(s => s.id === subjectId);
    
    if (!subject) {
      return (
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Subject Not Found</h2>
          <p className="mb-6">We couldn't find the subject you're looking for.</p>
          <Link href="/learn">
            <Button>Back to Subjects</Button>
          </Link>
        </div>
      );
    }
    
    return <SubjectDetail subject={subject} />;
  }
  
  // Content categories
  const categories = [
    { id: "all", name: "All Subjects" },
    { id: "core", name: "Core Skills" },
    { id: "life", name: "Life Skills" },
    { id: "academic", name: "Academic" },
    { id: "career", name: "Career Prep" }
  ];
  
  // Map subjects to categories for filtering
  const subjectCategories: Record<string, string> = {
    math: "core",
    "real-world-math": "core",
    science: "academic",
    history: "academic",
    finance: "life",
    "financial-literacy": "life",
    "money-basics": "life",
    technology: "core",
    careers: "career",
    communication: "life",
    "communication-relationships": "life",
    health: "life",
    entrepreneurship: "career",
    "tech-real-world": "core"
  };
  
  // Query subjects from the API, with local seed content as a fallback while V2 is being wired.
  const { data: dbSubjects, isLoading } = useQuery<SubjectModule[]>({
    queryKey: ['/api/subjects'],
    queryFn: async () => {
      try {
        const subjects = await apiRequest<BackendSubject[]>('/api/subjects');
        return subjects.length > 0 ? subjects.map(mapSubjectFromApi) : subjectModules;
      } catch (error) {
        console.error("Falling back to local subject modules:", error);
        return subjectModules;
      }
    },
    initialData: subjectModules,
  });
  
  // Filter subjects based on search, category, age group and skill level
  const filteredSubjects = React.useMemo(() => {
    if (!dbSubjects) return [];
    
    return dbSubjects.filter(subject => {
      // Search filter
      const matchesSearch = 
        searchTerm === "" || 
        subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = 
        selectedCategory === "all" || 
        subjectCategories[subject.id] === selectedCategory;
      
      // Skill level filter (based on modules)
      const matchesSkillLevel = 
        selectedSkillLevel === "all" ||
        subject.modules.some(module => 
          module.level.toLowerCase() === selectedSkillLevel.toLowerCase()
        );
      
      return matchesSearch && matchesCategory && matchesSkillLevel;
    });
  }, [dbSubjects, searchTerm, selectedCategory, selectedAgeGroup, selectedSkillLevel]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Learn Real-World Skills</h1>
          <p className="text-lg text-neutral-600">
            Explore our structured learning paths designed for practical application
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                <Input
                  placeholder="Search subjects..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedAgeGroup} onValueChange={(value) => setSelectedAgeGroup(value as AgeGroup)}>
                <SelectTrigger>
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9-12">Ages 9-12</SelectItem>
                  <SelectItem value="13-15">Ages 13-15</SelectItem>
                  <SelectItem value="16-18">Ages 16-18</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Lessons Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Featured Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-purple-500 text-white mr-3">
                    <PiggyBank className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Smart Money Challenge</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-3">Learn essential financial skills with our interactive money management challenge.</p>
                <div className="flex space-x-2 mb-3">
                  <Badge variant="secondary">Financial Literacy</Badge>
                  <Badge variant="outline">New</Badge>
                </div>
                <Link href="/learn/money-basics">
                  <Button size="sm" className="w-full">Start Lesson</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-blue-500 text-white mr-3">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Practical Math: Percentages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-3">Master calculating discounts, tips, and taxes in this real-world math lesson.</p>
                <div className="flex space-x-2 mb-3">
                  <Badge variant="secondary">Math</Badge>
                  <Badge variant="outline">Popular</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full">Coming Soon</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-green-500 text-white mr-3">
                    <Microscope className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Kitchen Chemistry</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-3">Explore the science behind cooking with hands-on experiments you can do at home.</p>
                <div className="flex space-x-2 mb-3">
                  <Badge variant="secondary">Science</Badge>
                  <Badge variant="outline">Beginner</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for different organization views */}
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {selectedCategory === "all" 
                ? "All Subjects" 
                : categories.find(c => c.id === selectedCategory)?.name}
              <span className="ml-2 text-sm font-normal text-neutral-500">
                ({filteredSubjects.length} {filteredSubjects.length === 1 ? "subject" : "subjects"})
              </span>
            </h2>
            <TabsList>
              <TabsTrigger value="grid">
                <div className="flex items-center"><Brain className="h-4 w-4 mr-2" /> Subject Grid</div>
              </TabsTrigger>
              <TabsTrigger value="journey">
                <div className="flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> Learning Journey</div>
              </TabsTrigger>
              <TabsTrigger value="map">
                <div className="flex items-center"><Globe className="h-4 w-4 mr-2" /> Skill Map</div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Subject Grid View */}
          <TabsContent value="grid" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-neutral-100 rounded-lg p-6 h-64 animate-pulse"></div>
                ))}
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject) => (
                  <Link key={subject.id} href={`/learn/${subject.id}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className={`${subject.color} text-white rounded-t-lg`}>
                        <div className="flex justify-between items-start">
                          <div className="bg-white p-2 rounded-md shadow">
                            {subject.icon}
                          </div>
                          <Badge variant="outline" className="bg-white text-neutral-800">
                            For ages {selectedAgeGroup}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2">{subject.title}</CardTitle>
                        <CardDescription className="text-white opacity-90">{subject.subtitle}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-neutral-600 line-clamp-2">{subject.description}</p>
                        <div className="mt-4 space-y-2">
                          {subject.modules
                            .filter(module => selectedSkillLevel === "all" || 
                                  module.level.toLowerCase() === selectedSkillLevel.toLowerCase())
                            .slice(0, 2)
                            .map((module, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <div className={`h-2 w-2 rounded-full mr-2 ${
                                  module.level === "Beginner" ? "bg-green-500" :
                                  module.level === "Intermediate" ? "bg-yellow-500" : "bg-red-500"
                                }`}></div>
                                <span>{module.title}</span>
                              </div>
                            ))}
                          {subject.modules.length > 2 && (
                            <div className="text-sm text-neutral-500">
                              + {subject.modules.length - 2} more modules
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full">
                          <span>Explore Subject</span>
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-medium">No subjects match your filters</h3>
                <p className="mt-2 text-neutral-600">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedSkillLevel("all");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Learning Journey View */}
          <TabsContent value="journey">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-8">
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold">Step 1: Build Foundation</h3>
                  <p className="text-neutral-600 mt-1">Start with these fundamental subjects to build a strong base</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {filteredSubjects
                      .filter(s => ["math", "communication", "health"].includes(s.id))
                      .map(subject => (
                        <Card key={subject.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md ${subject.color} text-white mr-3`}>
                                {subject.icon}
                              </div>
                              <CardTitle className="text-lg">{subject.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-neutral-600 mb-3">{subject.subtitle}</p>
                            <Link href={`/learn/${subject.id}`}>
                              <Button size="sm" variant="outline" className="w-full">Start</Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold">Step 2: Expand Skills</h3>
                  <p className="text-neutral-600 mt-1">Once you've mastered the basics, broaden your knowledge</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {filteredSubjects
                      .filter(s => ["finance", "technology", "science"].includes(s.id))
                      .map(subject => (
                        <Card key={subject.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md ${subject.color} text-white mr-3`}>
                                {subject.icon}
                              </div>
                              <CardTitle className="text-lg">{subject.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-neutral-600 mb-3">{subject.subtitle}</p>
                            <Link href={`/learn/${subject.id}`}>
                              <Button size="sm" variant="outline" className="w-full">Start</Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-6 py-2">
                  <h3 className="text-xl font-semibold">Step 3: Specialize</h3>
                  <p className="text-neutral-600 mt-1">Choose your path and develop expertise in areas that interest you</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {filteredSubjects
                      .filter(s => ["entrepreneurship", "careers", "tech-real-world"].includes(s.id))
                      .map(subject => (
                        <Card key={subject.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-md ${subject.color} text-white mr-3`}>
                                {subject.icon}
                              </div>
                              <CardTitle className="text-lg">{subject.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-neutral-600 mb-3">{subject.subtitle}</p>
                            <Link href={`/learn/${subject.id}`}>
                              <Button size="sm" variant="outline" className="w-full">Start</Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Skill Map View */}
          <TabsContent value="map">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold">Skills Ecosystem</h3>
                <p className="text-neutral-600 mt-1">
                  See how different subjects connect and build on each other
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {/* Core Skills Hub */}
                <div className="relative border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Core Skills
                  </div>
                  <div className="space-y-3 mt-3">
                    {filteredSubjects
                      .filter(s => subjectCategories[s.id] === "core")
                      .map(subject => (
                        <Link key={subject.id} href={`/learn/${subject.id}`}>
                          <div className="flex items-center p-2 hover:bg-blue-100 rounded-md transition-colors">
                            <div className={`p-1.5 rounded-md ${subject.color} text-white mr-2`}>
                              {React.cloneElement(subject.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <span className="font-medium">{subject.title}</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
                
                {/* Life Skills Hub */}
                <div className="relative border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
                  <div className="absolute -top-3 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Life Skills
                  </div>
                  <div className="space-y-3 mt-3">
                    {filteredSubjects
                      .filter(s => subjectCategories[s.id] === "life")
                      .map(subject => (
                        <Link key={subject.id} href={`/learn/${subject.id}`}>
                          <div className="flex items-center p-2 hover:bg-purple-100 rounded-md transition-colors">
                            <div className={`p-1.5 rounded-md ${subject.color} text-white mr-2`}>
                              {React.cloneElement(subject.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <span className="font-medium">{subject.title}</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
                
                {/* Career Prep Hub */}
                <div className="relative border-2 border-orange-200 rounded-lg p-6 bg-orange-50">
                  <div className="absolute -top-3 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Career Prep
                  </div>
                  <div className="space-y-3 mt-3">
                    {filteredSubjects
                      .filter(s => subjectCategories[s.id] === "career")
                      .map(subject => (
                        <Link key={subject.id} href={`/learn/${subject.id}`}>
                          <div className="flex items-center p-2 hover:bg-orange-100 rounded-md transition-colors">
                            <div className={`p-1.5 rounded-md ${subject.color} text-white mr-2`}>
                              {React.cloneElement(subject.icon as React.ReactElement, { size: 20 })}
                            </div>
                            <span className="font-medium">{subject.title}</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              
              {/* Cross-Skills Connections */}
              <div className="border-t-2 border-dashed border-neutral-200 pt-6 mt-6">
                <h4 className="text-lg font-semibold mb-4">Cross-Disciplinary Pathways</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Future Entrepreneur Path</CardTitle>
                      <CardDescription>Combine these skills to prepare for business success</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <div className="bg-orange-500 text-white p-1.5 rounded mr-2">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Entrepreneurship & Work Skills</p>
                          <p className="text-xs text-neutral-500">Foundation skills</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-purple-500 text-white p-1.5 rounded mr-2">
                          <PiggyBank size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Financial Literacy</p>
                          <p className="text-xs text-neutral-500">Money management</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-indigo-500 text-white p-1.5 rounded mr-2">
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Communication & Relationships</p>
                          <p className="text-xs text-neutral-500">People skills</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tech Career Path</CardTitle>
                      <CardDescription>Skills that prepare you for the digital economy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center">
                        <div className="bg-teal-500 text-white p-1.5 rounded mr-2">
                          <Code size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Tech in the Real World</p>
                          <p className="text-xs text-neutral-500">Foundation skills</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-cyan-500 text-white p-1.5 rounded mr-2">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Technology Skills</p>
                          <p className="text-xs text-neutral-500">Technical abilities</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-500 text-white p-1.5 rounded mr-2">
                          <Calculator size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Real-World Math</p>
                          <p className="text-xs text-neutral-500">Analytical thinking</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Learn;
