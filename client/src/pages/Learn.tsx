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
  Filter,
  MessageCircle,
  Heart,
  Sparkles,
  Code
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
      // Entrepreneurship & Work Skills
      'entrepreneurship': {
        '9-12': [
          {
            title: "What is a Business?",
            description: "Learn about different types of businesses and what entrepreneurs do.",
            activity: "Spot The Business: Identify 5 different businesses in your neighborhood and what they sell."
          },
          {
            title: "Problem Solvers",
            description: "Discover how businesses solve problems that people have.",
            activity: "Problem Detective: Find something that's annoying or difficult at home or school. How could you fix it?"
          },
          {
            title: "Kid Business Ideas",
            description: "Explore simple businesses you could start right now, like lemonade stands or craft sales.",
            activity: "Mini Business Plan: Draw a picture of a business you could start this summer."
          }
        ],
        '13-15': [
          {
            title: "How to Price Something You Sell",
            description: "Learn the basics of costs, pricing, and what makes people willing to pay for something.",
            activity: "Pricing Exercise: Calculate the right price for a custom bracelet business including materials and time."
          },
          {
            title: "Marketing Basics",
            description: "Discover how to tell people about your product or service in a way that gets them interested.",
            activity: "Create a social media post to promote a neighborhood pet-sitting business."
          },
          {
            title: "Customer Service",
            description: "Learn why keeping customers happy is just as important as getting new ones.",
            activity: "Role Play: Practice handling a customer complaint about a product that broke."
          }
        ],
        '16-18': [
          {
            title: "Starting a Side Hustle or Micro-Business",
            description: "Learn practical steps to turn your skills into income through freelancing or a small business.",
            activity: "Side Hustle Starter: Identify three marketable skills you have and potential customers for each."
          },
          {
            title: "Financial Management",
            description: "Master the basics of business finances, record-keeping, and taxes for young entrepreneurs.",
            activity: "Build a simple income/expense tracking spreadsheet for a small business."
          },
          {
            title: "Building Your Professional Network",
            description: "Learn how to connect with mentors, peers, and potential customers or employers.",
            activity: "Networking Challenge: Draft an email to someone in a field you're interested in asking for advice."
          }
        ]
      },
      // Tech in the Real World
      'tech-real-world': {
        '9-12': [
          {
            title: "What is the Cloud?",
            description: "Learn what 'the cloud' really means and how it helps us store and share information.",
            activity: "Cloud Drawing: Illustrate how you think the cloud works, then compare to the actual explanation."
          },
          {
            title: "Digital Safety Basics",
            description: "Discover important ways to stay safe when using computers, tablets, and other devices.",
            activity: "Password Creator: Practice making strong passwords that are easy for you to remember but hard for others to guess."
          },
          {
            title: "Fun with Digital Tools",
            description: "Explore kid-friendly apps and programs that help you create, learn, and solve problems.",
            activity: "Digital Scavenger Hunt: Find three free tools online that can help with homework."
          }
        ],
        '13-15': [
          {
            title: "Using Google Docs & Spreadsheets",
            description: "Master the basics of document creation, formatting, and collaboration tools.",
            activity: "Group Project Template: Create a shared document with sections for different team members."
          },
          {
            title: "Digital Organization",
            description: "Learn systems for organizing files, managing information, and staying productive online.",
            activity: "Folder Challenge: Create a logical folder structure for organizing school projects and personal files."
          },
          {
            title: "Finding Quality Information",
            description: "Develop skills to evaluate online sources and find reliable information for school and life.",
            activity: "Source Evaluator: Analyze these three websites and determine which is most trustworthy."
          }
        ],
        '16-18': [
          {
            title: "How to Build a Simple Website",
            description: "Learn the basics of web design, no coding required, using modern drag-and-drop tools.",
            activity: "Site Builder: Create a one-page personal portfolio or interest site using a template."
          },
          {
            title: "Digital Productivity Systems",
            description: "Master advanced tools for task management, time tracking, and workflow optimization.",
            activity: "Productivity Audit: Analyze your current digital habits and implement one new productivity system."
          },
          {
            title: "Data Visualization Basics",
            description: "Learn to create charts, graphs, and visual representations that communicate information clearly.",
            activity: "Data Story: Create three different chart types from the same dataset and explain which works best."
          }
        ]
      },
      // Default lesson structure for other subjects
      'default': {
        '9-12': [
          {
            title: "Beginner concepts",
            description: "Age-appropriate introduction to the fundamentals of this subject.",
            activity: "Interactive activity for younger students."
          }
        ],
        '13-15': [
          {
            title: "Intermediate concepts",
            description: "More advanced topics with real-world applications for teens.",
            activity: "Practical exercise for middle teens."
          }
        ],
        '16-18': [
          {
            title: "Advanced concepts",
            description: "Complex topics and independent application for older teens.",
            activity: "Challenge activity for older students."
          }
        ]
      }
    };

    // Return the appropriate content based on subject and age group
    return lessons[subject.id as keyof typeof lessons] || lessons['default'];
  };
  
  const lessonContent = getAgeGroupContent()[selectedAgeGroup] || [];

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
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Overview</h2>
              
              {/* Age Group Selector */}
              <div className="bg-neutral-100 p-1 rounded-lg inline-flex my-2">
                <button 
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedAgeGroup === '9-12' ? 'bg-white shadow-sm text-primary' : 'text-neutral-600 hover:bg-neutral-200'}`}
                  onClick={() => setSelectedAgeGroup('9-12')}
                >
                  Ages 9-12
                </button>
                <button 
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedAgeGroup === '13-15' ? 'bg-white shadow-sm text-primary' : 'text-neutral-600 hover:bg-neutral-200'}`}
                  onClick={() => setSelectedAgeGroup('13-15')}
                >
                  Ages 13-15
                </button>
                <button 
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedAgeGroup === '16-18' ? 'bg-white shadow-sm text-primary' : 'text-neutral-600 hover:bg-neutral-200'}`}
                  onClick={() => setSelectedAgeGroup('16-18')}
                >
                  Ages 16-18
                </button>
              </div>
            </div>
            
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
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-xl mb-4">
              Age-Appropriate Lessons
              <span className="ml-2 text-base font-normal text-neutral-500">
                {
                  selectedAgeGroup === '9-12' ? '(Beginner Level)' : 
                  selectedAgeGroup === '13-15' ? '(Intermediate Level)' : 
                  '(Advanced Level)'
                }
              </span>
            </h2>
            
            <div className="space-y-6">
              {lessonContent.map((lesson, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className={`${subject.color} bg-opacity-10 p-4 border-b`}>
                    <h3 className="font-medium text-lg">{lesson.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-neutral-700 mb-4">{lesson.description}</p>
                    
                    <div className="bg-neutral-50 p-4 rounded-md border border-neutral-100">
                      <div className="font-medium mb-2 text-neutral-800">Interactive Component</div>
                      <p className="text-neutral-600">{lesson.activity}</p>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        Start Lesson
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
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
