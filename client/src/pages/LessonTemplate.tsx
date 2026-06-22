import React from "react";
import { ArrowLeft, BadgeCheck, Brain, Clock, Target } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LessonRecord {
  id: number;
  subjectId: number;
  title: string;
  subtitle?: string | null;
  learningObjective: string;
  warmUpQuestion: string;
  lessonExplanation: string;
  scenarioTitle: string;
  scenarioContent: string;
  activityType: string;
  activityContent: unknown;
  reflectionPrompt: string;
  estimatedMinutes: number;
  xpReward: number;
}

interface LessonProgressRecord {
  id: number;
  status: string;
  reflectionResponse?: string | null;
  notes?: string | null;
  completedAt?: string | null;
}

const staticLesson: LessonRecord = {
  id: 1,
  subjectId: 1,
  title: "The Smart Money Challenge: Saving vs. Spending",
  subtitle: "Learn how to make strategic decisions about when to save and when to spend your money.",
  learningObjective: "Understand needs and wants, create a simple savings plan, and make intentional spending decisions.",
  warmUpQuestion: "Imagine you just received $100 for your birthday. Would you spend it, save it, or split it?",
  lessonExplanation: "Money represents choices. Every dollar you have can either be spent now or saved for later, and both options have their place in a healthy financial life. The key to financial success is making intentional choices based on your priorities.",
  scenarioTitle: "The Concert Tickets",
  scenarioContent: "Mia has been saving $10 a week from her allowance. After two months, she has $80 saved. Her favorite band is coming to town, and tickets cost $50. She also wants a $200 bike in three months. What should she consider before deciding?",
  activityType: "savings-plan",
  activityContent: null,
  reflectionPrompt: "What is one situation in your life right now where you are trying to decide between saving and spending?",
  estimatedMinutes: 15,
  xpReward: 50,
};

const subjectLabelBySlug: Record<string, string> = {
  "money-basics": "Money Basics",
  "career-exploration": "Career Exploration",
  "digital-productivity": "Digital Productivity",
  "communication-relationships": "Communication & Relationships",
  "real-world-math": "Real-World Math",
};

const labelFromKey = (key: string) => key
  .replace(/([A-Z])/g, " $1")
  .replace(/[-_]/g, " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const renderActivityContent = (content: unknown): React.ReactNode => {
  if (!content) return null;

  if (typeof content === "string") {
    return <p>{content}</p>;
  }

  if (Array.isArray(content)) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {content.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof content === "object") {
    return (
      <div className="space-y-4">
        {Object.entries(content as Record<string, unknown>)
          .filter(([key]) => key !== "contributor" && key !== "sourceSubmissionId")
          .map(([key, value]) => (
            <div key={key}>
              <h4 className="mb-1 text-sm font-medium">{labelFromKey(key)}</h4>
              {Array.isArray(value) ? (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {value.map((item, index) => (
                    <li key={index}>{String(item)}</li>
                  ))}
                </ul>
              ) : typeof value === "object" && value !== null ? (
                <div className="rounded-md border bg-white p-3 text-sm">
                  {renderActivityContent(value)}
                </div>
              ) : (
                <p className="text-sm">{String(value)}</p>
              )}
            </div>
          ))}
      </div>
    );
  }

  return <p>{String(content)}</p>;
};

export default function LessonTemplate() {
  const [location] = useLocation();
  const lessonMatch = /^\/learn\/([^/]+)\/([^/]+)$/.exec(location);
  const subjectSlug = lessonMatch?.[1];
  const lessonSlug = lessonMatch?.[2];
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentSection, setCurrentSection] = React.useState("overview");
  const [completedSections, setCompletedSections] = React.useState<string[]>([]);
  const [reflectionResponse, setReflectionResponse] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [earnedBadge, setEarnedBadge] = React.useState(false);

  const { data: lesson = staticLesson } = useQuery<LessonRecord>({
    queryKey: ["/api/subjects", subjectSlug, "lessons", lessonSlug],
    queryFn: async () => {
      if (!subjectSlug || !lessonSlug) return staticLesson;
      return apiRequest<LessonRecord>(`/api/subjects/${subjectSlug}/lessons/${lessonSlug}`);
    },
    initialData: staticLesson,
  });

  const subjectLabel = subjectSlug ? subjectLabelBySlug[subjectSlug] || labelFromKey(subjectSlug) : "Pathway";
  const subjectHref = subjectSlug ? `/learn/${subjectSlug}` : "/learn";

  const { data: savedProgress } = useQuery<LessonProgressRecord | null>({
    queryKey: ["/api/users", user?.id, "lessons", lesson.id, "progress"],
    queryFn: async () => {
      if (!user?.id || !lesson.id) return null;
      return apiRequest<LessonProgressRecord | null>(`/api/users/${user.id}/lessons/${lesson.id}/progress`);
    },
    enabled: Boolean(user?.id && lesson.id),
  });

  React.useEffect(() => {
    if (!savedProgress) return;
    setReflectionResponse(savedProgress.reflectionResponse || "");
    setNotes(savedProgress.notes || "");
    if (savedProgress.status === "completed") {
      setEarnedBadge(true);
      setCompletedSections(["overview", "lesson", "activity", "reflection"]);
    }
  }, [savedProgress]);

  const progress = earnedBadge
    ? 100
    : Math.round((completedSections.length / 4) * 100);

  const saveProgressMutation = useMutation({
    mutationFn: async (status: "in_progress" | "completed") => {
      if (!user?.id) throw new Error("Please log in to save lesson progress.");
      return apiRequest(`/api/users/${user.id}/lessons/${lesson.id}/progress`, {
        method: "PATCH",
        body: {
          status,
          reflectionResponse,
          notes,
          answers: {
            completedSections,
            savedFrom: "lesson-template",
          },
        },
      });
    },
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "lessons", lesson.id, "progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "category-progress"] });
      if (status === "completed") {
        setEarnedBadge(true);
        setCompletedSections(["overview", "lesson", "activity", "reflection"]);
      }
      toast({
        title: status === "completed" ? "Lesson complete" : "Progress saved",
        description: status === "completed" ? `You earned ${lesson.xpReward} XP.` : "Your lesson work has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Could not save progress",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProgress = (section: string) => {
    setCurrentSection(section);
    setCompletedSections((current) => current.includes(section) ? current : [...current, section]);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href={subjectHref}>
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to {subjectLabel}
          </Button>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{lesson.estimatedMinutes} minutes</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <Progress value={progress} className="w-[100px] h-2" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Badge className="mb-2">{subjectLabel}</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{lesson.subtitle}</p>
        </div>

        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Lesson Objective</CardTitle>
            </div>
            <CardDescription>By the end of this lesson, you should be able to:</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p>{lesson.learningObjective}</p>
          </CardContent>
        </Card>

        <Tabs value={currentSection} onValueChange={updateProgress} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-500" />
                  <CardTitle>Warm-Up</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p>{lesson.warmUpQuestion}</p>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => updateProgress("lesson")}>Continue to Lesson</Button>
            </div>
          </TabsContent>

          <TabsContent value="lesson" className="space-y-4">
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <CardTitle>Core Lesson</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p>{lesson.lessonExplanation}</p>
                <div className="bg-primary/5 p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Real-Life Scenario: {lesson.scenarioTitle}</h3>
                  <p>{lesson.scenarioContent}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => updateProgress("activity")}>Continue to Activity</Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-950 border-b">
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p>Complete the activity below, then save your notes or response in the reflection section.</p>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Activity Type</h3>
                  <p className="capitalize">{lesson.activityType.replace(/-/g, " ")}</p>
                </div>
                {lesson.activityContent !== null && lesson.activityContent !== undefined && (
                  <div className="rounded-md border p-4">
                    <h3 className="mb-3 font-medium">Activity Details</h3>
                    {renderActivityContent(lesson.activityContent)}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => updateProgress("reflection")}>Continue to Reflection</Button>
            </div>
          </TabsContent>

          <TabsContent value="reflection" className="space-y-4">
            <Card>
              <CardHeader className="bg-purple-50 dark:bg-purple-950 border-b">
                <CardTitle>Reflect & Apply</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-3">
                  <div className="bg-white dark:bg-black p-3 rounded-md border">
                    <p>{lesson.reflectionPrompt}</p>
                    <textarea
                      className="w-full h-24 mt-2 p-2 border rounded-md bg-muted"
                      placeholder="Type your response here..."
                      value={reflectionResponse}
                      onChange={(event) => setReflectionResponse(event.target.value)}
                    />
                  </div>

                  <div className="bg-white dark:bg-black p-3 rounded-md border">
                    <p>Notes for your parent or future self</p>
                    <textarea
                      className="w-full h-24 mt-2 p-2 border rounded-md bg-muted"
                      placeholder="Add any notes, questions, or project details..."
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                    />
                  </div>
                </div>

                {earnedBadge && (
                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mt-4 flex items-center gap-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <BadgeCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lesson Complete</h3>
                      <p className="text-sm">Your work has been saved and {lesson.xpReward} XP has been awarded.</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-3 border-t pt-4">
                <Button variant="outline" asChild>
                  <Link href={subjectHref}>Back to {subjectLabel}</Link>
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    disabled={!user || saveProgressMutation.isPending}
                    onClick={() => saveProgressMutation.mutate("in_progress")}
                  >
                    Save Progress
                  </Button>
                  <Button
                    disabled={!user || saveProgressMutation.isPending}
                    onClick={() => saveProgressMutation.mutate("completed")}
                  >
                    {earnedBadge ? "Lesson Complete" : "Complete Lesson"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
