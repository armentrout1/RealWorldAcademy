import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Lightbulb, 
  BookOpen, 
  Rocket, 
  Target, 
  ChevronRight,
  BarChart,
  Sparkles,
  Award,
  Clock,
  Bot,
  MessageCircle,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PersonalizedLearningPath } from "@/components/ai";
import { DailyChallengeCard } from "@/components/challenges/DailyChallenge";
import { UserXP } from "@/components/challenges/UserXP";

const motivationalQuotes = [
  "Today is a great day to grow.",
  "What can you build today?",
  "Your future starts now.",
  "Small steps lead to big change.",
  "Learning is a journey, not a destination.",
  "Every expert was once a beginner.",
  "The best way to predict your future is to create it.",
  "Growth happens outside your comfort zone."
];

interface LessonProgressRecord {
  id: number;
  lessonId: number;
  status: string;
  completedAt?: string | null;
}

interface LessonRecord {
  id: number;
  title: string;
  subtitle?: string | null;
  subjectId: number;
}

interface LessonProgressWithLesson {
  progress: LessonProgressRecord;
  lesson?: LessonRecord | null;
}

interface IssuedCredential {
  id: number;
  status: string;
}

interface OfferingEnrollment {
  id: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const { user, isAuthenticated } = useAuth();

  const { data: lessonProgress = [] } = useQuery<LessonProgressWithLesson[]>({
    queryKey: ["/api/users", user?.id, "lesson-progress"],
    queryFn: () => apiRequest<LessonProgressWithLesson[]>(`/api/users/${user!.id}/lesson-progress`),
    enabled: Boolean(user?.id),
  });

  const { data: issuedCredentials = [] } = useQuery<IssuedCredential[]>({
    queryKey: ["/api/users", user?.id, "credentials"],
    queryFn: () => apiRequest<IssuedCredential[]>(`/api/users/${user!.id}/credentials`),
    enabled: Boolean(user?.id),
  });

  const { data: classEnrollments = [] } = useQuery<OfferingEnrollment[]>({
    queryKey: ["/api/my-offering-enrollments"],
    queryFn: () => apiRequest<OfferingEnrollment[]>("/api/my-offering-enrollments"),
    enabled: Boolean(user?.id),
  });

  const completedLessons = lessonProgress.filter((item) => item.progress.status === "completed");
  const inProgressLessons = lessonProgress.filter((item) => item.progress.status !== "completed");
  const continueLesson = inProgressLessons[0] || lessonProgress[0];
  const completedPercent = lessonProgress.length > 0
    ? Math.round((completedLessons.length / lessonProgress.length) * 100)
    : 0;
  
  useEffect(() => {
    // Select a random quote when the component mounts
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
          {isAuthenticated 
            ? `Welcome, ${user?.firstName}!` 
            : "Welcome to Your Real World Journey"}
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
          {isAuthenticated
            ? "Continue your learning journey from where you left off."
            : "Discover practical skills, explore your strengths, and prepare for real-world challenges with our personalized learning platform."}
        </p>
      </div>
      
      {/* User Progress Summary - Only show when logged in */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Lessons Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Real saved progress</span>
                  <span className="font-medium">{completedLessons.length} / {lessonProgress.length}</span>
                </div>
                <Progress value={completedPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Active Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>In progress</span>
                  <span className="font-medium">{inProgressLessons.length}</span>
                </div>
                <Progress value={inProgressLessons.length > 0 ? 40 : completedLessons.length > 0 ? 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-green-500" />
                Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Issued</span>
                  <span className="font-medium">{issuedCredentials.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className="font-medium">{issuedCredentials.length > 0 ? "Portfolio ready" : "Keep learning"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Marketplace sessions</span>
                  <span className="font-medium">{classEnrollments.length}</span>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/my-classes">View Classes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* User XP and Level - Only show when logged in */}
      {isAuthenticated && user?.id && (
        <div className="mb-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <UserXP userId={user.id} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Daily Challenges - Only show when logged in */}
      {isAuthenticated && user?.id && (
        <div className="mb-8">
          <DailyChallengeCard userId={user.id} />
        </div>
      )}
      
      {/* Recommended Next Steps - Only show when logged in */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2">
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Continue Your Learning
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {continueLesson ? (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-medium mb-1">{continueLesson.lesson?.title || "Continue your lesson"}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Status: {continueLesson.progress.status.replace("_", " ")}
                      </p>
                      <Progress value={continueLesson.progress.status === "completed" ? 100 : 50} className="h-2 mb-4" />
                      <Link href="/learn">
                        <Button variant="outline" size="sm">
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-medium mb-1">Start a pathway</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Choose Money Basics, Career Exploration, or Digital Productivity to begin saving progress.
                      </p>
                      <Link href="/learn">
                        <Button variant="outline" size="sm">
                          Browse Pathways
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h3 className="font-medium mb-1">Portfolio & Credentials</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Review completed lessons and issued credentials in your private record.
                    </p>
                    <Link href="/portfolio">
                      <Button variant="outline" size="sm" className="border-amber-200 bg-amber-100/50 hover:bg-amber-100">
                        Open Portfolio
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <PersonalizedLearningPath variant="card" />
          </div>
        </div>
      )}
      
      {/* Motivational Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-medium text-lg text-primary">Daily Inspiration</h3>
        </div>
        <p className="text-xl font-medium text-neutral-800">{quote}</p>
        <div className="mt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-neutral-500 hover:text-primary"
            onClick={() => {
              const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
              setQuote(motivationalQuotes[randomIndex]);
            }}
          >
            New quote
          </Button>
        </div>
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

      {/* Learning Buddy Card */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm mb-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2 border-indigo-200">
                <Bot className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Your Learning Buddy</h3>
                <p className="text-sm text-neutral-600">
                  Chat with your AI learning companion for help, motivation, and personalized guidance
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                onClick={() => {
                  // This button would handle the chat open through the Buddy component
                  // The actual implementation is in the Buddy component via its toggleChat method
                  const buddyEvent = new CustomEvent('buddyToggle', { detail: { action: 'open' } });
                  window.dispatchEvent(buddyEvent);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Buddy
              </Button>
              <Button 
                variant="ghost" 
                className="text-indigo-700 hover:bg-indigo-100"
                onClick={() => {
                  // This would open the Buddy customization dialog
                  const buddyEvent = new CustomEvent('buddyToggle', { detail: { action: 'customize' } });
                  window.dispatchEvent(buddyEvent);
                }}
              >
                <Bot className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      )}

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
