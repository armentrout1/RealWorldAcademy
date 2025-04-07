import React, { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, CheckCircle, Clock, MessageSquare, Search, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock lesson data for review
const mockPendingLessons = [
  {
    id: 1,
    title: "Building a Personal Budget",
    subject: "Financial Literacy",
    ageGroup: "13-15",
    contributorName: "Alex Johnson",
    affiliation: "High School Economics Teacher",
    submittedDate: "2025-04-05T14:30:00Z",
    status: "pending"
  },
  {
    id: 2,
    title: "Digital Communication Ethics",
    subject: "Communication",
    ageGroup: "16-18",
    contributorName: "Maria Rodriguez",
    affiliation: "Digital Media Specialist",
    submittedDate: "2025-04-04T09:15:00Z",
    status: "pending"
  },
  {
    id: 3,
    title: "Coding Basics: Your First Webpage",
    subject: "Technology",
    ageGroup: "9-12",
    contributorName: "David Chen",
    affiliation: "Computer Science Teacher",
    submittedDate: "2025-04-03T16:45:00Z",
    status: "pending"
  }
];

const mockApprovedLessons = [
  {
    id: 4,
    title: "Managing Social Media Stress",
    subject: "Well-Being",
    ageGroup: "13-15",
    contributorName: "Sarah Williams",
    affiliation: "School Counselor",
    submittedDate: "2025-04-01T11:20:00Z",
    approvedDate: "2025-04-02T14:10:00Z",
    status: "approved"
  },
  {
    id: 5,
    title: "Creative Problem Solving",
    subject: "Critical Thinking",
    ageGroup: "9-12",
    contributorName: "James Lee",
    affiliation: "STEM Program Coordinator",
    submittedDate: "2025-03-29T10:05:00Z",
    approvedDate: "2025-03-30T16:30:00Z",
    status: "approved"
  }
];

// Full mock lesson for viewing
const mockFullLesson = {
  id: 1,
  title: "Building a Personal Budget",
  subject: "Financial Literacy",
  ageGroup: "13-15",
  contributorName: "Alex Johnson",
  contributorEmail: "alex.johnson@school.edu",
  affiliation: "High School Economics Teacher",
  submittedDate: "2025-04-05T14:30:00Z",
  status: "pending",
  objective: "By the end of this lesson, students will be able to create a basic personal budget, identify income sources and spending categories, and understand the importance of saving for future goals.",
  warmUp: "Think about the last three things you spent money on. Were they needs or wants? How do you decide what to spend your money on?",
  coreContent: "A personal budget is a financial plan that allocates income towards expenses, savings, and debt repayment. Creating a budget helps you take control of your finances, avoid overspending, and save for future goals.\n\nKey components of a budget include:\n\n1. Income: Money coming in from allowance, jobs, gifts, etc.\n2. Fixed Expenses: Regular costs that don't change (subscriptions, regular purchases)\n3. Variable Expenses: Costs that change month to month (entertainment, eating out)\n4. Savings: Money set aside for future goals\n\nThe 50/30/20 rule is a simple budgeting framework:\n- 50% for needs\n- 30% for wants\n- 20% for savings and debt repayment",
  scenario: "Maya is a 14-year-old who receives $80 per month from allowance and helping neighbors with yard work. She wants to save for a $240 tablet, but also needs to pay for her $10 monthly music subscription and wants to have money for going out with friends.\n\nHow can Maya create a budget that allows her to save for her tablet while still having money for her needs and some wants?",
  activity: "Create Your First Budget\n\n1. List all sources of income (allowance, jobs, gifts)\n2. Identify your regular expenses and categorize as needs or wants\n3. Set a savings goal (what are you saving for?)\n4. Create a budget sheet with these categories:\n   - Monthly Income\n   - Needs (___% of income)\n   - Wants (___% of income)\n   - Savings (___% of income)\n5. Track your spending for one month to see how well you stick to your budget",
  reflection: "How did creating a budget change how you think about money? What was the most challenging part of making a budget? How might budgeting skills help you in the future?",
  badge: "Budget Master"
};

export default function AdminLessons() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"preview" | "feedback">("preview");
  const [feedbackText, setFeedbackText] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const { toast } = useToast();

  // Filter lessons based on search query and subject filter
  const filterLessons = (lessons: any[]) => {
    return lessons.filter(lesson => {
      const matchesSearch = 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.contributorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = filterSubject ? lesson.subject === filterSubject : true;
      
      return matchesSearch && matchesSubject;
    });
  };

  const pendingLessons = filterLessons(mockPendingLessons);
  const approvedLessons = filterLessons(mockApprovedLessons);

  // View lesson details
  const handleViewLesson = (lesson: any) => {
    setSelectedLesson(mockFullLesson); // In a real app, we'd fetch the full lesson data
    setViewMode("preview");
  };

  // Approve lesson
  const handleApproveLesson = () => {
    toast({
      title: "Lesson Approved!",
      description: `"${selectedLesson.title}" has been approved and added to the curriculum.`,
    });
    setSelectedLesson(null);
  };

  // Send feedback
  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Error",
        description: "Please enter feedback before sending.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Sent",
      description: `Feedback for "${selectedLesson.title}" has been sent to the contributor.`,
    });
    setSelectedLesson(null);
    setFeedbackText("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <h1 className="text-2xl font-bold">Lesson Review Dashboard</h1>
        
        <div className="w-[150px]"></div> {/* Empty div for flex alignment */}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={filterSubject}
          onValueChange={setFilterSubject}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Subjects</SelectItem>
            <SelectItem value="Financial Literacy">Financial Literacy</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Well-Being">Well-Being</SelectItem>
            <SelectItem value="Critical Thinking">Critical Thinking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending Review
            <Badge className="ml-2 bg-orange-500 hover:bg-orange-500">{pendingLessons.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved Lessons
            <Badge className="ml-2 bg-green-500 hover:bg-green-500">{approvedLessons.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingLessons.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No pending lessons found.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lessons Awaiting Review</CardTitle>
                <CardDescription>
                  Review and approve contributor submissions or provide feedback for improvement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lesson Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Age Group</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingLessons.map(lesson => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>{lesson.subject}</TableCell>
                        <TableCell>{lesson.ageGroup}</TableCell>
                        <TableCell>{lesson.contributorName}</TableCell>
                        <TableCell>{formatDate(lesson.submittedDate)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewLesson(lesson)}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {approvedLessons.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No approved lessons found.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Approved Lessons</CardTitle>
                <CardDescription>
                  These lessons have been reviewed and approved for the curriculum.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lesson Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Age Group</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedLessons.map(lesson => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>{lesson.subject}</TableCell>
                        <TableCell>{lesson.ageGroup}</TableCell>
                        <TableCell>{lesson.contributorName}</TableCell>
                        <TableCell>{formatDate(lesson.approvedDate || '')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleViewLesson(lesson)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Lesson review dialog */}
      {selectedLesson && (
        <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{selectedLesson.subject}</Badge>
                <Badge variant="outline">{selectedLesson.ageGroup} years</Badge>
                {selectedLesson.status === "pending" ? (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                    <Clock className="mr-1 h-3 w-3" />
                    Pending Review
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl">{selectedLesson.title}</DialogTitle>
              <DialogDescription className="text-base">
                Submitted by {selectedLesson.contributorName} ({selectedLesson.affiliation}) on {formatDate(selectedLesson.submittedDate)}
              </DialogDescription>
              
              {selectedLesson.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant={viewMode === "preview" ? "default" : "outline"} 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setViewMode("preview")}
                  >
                    <BookOpen className="h-4 w-4" />
                    Preview Lesson
                  </Button>
                  <Button 
                    variant={viewMode === "feedback" ? "default" : "outline"} 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setViewMode("feedback")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Send Feedback
                  </Button>
                </div>
              )}
            </DialogHeader>

            {viewMode === "preview" ? (
              <>
                <div className="space-y-6 mt-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lesson Objective</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.objective}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Warm-Up</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.warmUp}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Core Content</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.coreContent}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Real-World Scenario</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.scenario}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Activity</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.activity}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Reflection Prompt</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{selectedLesson.reflection}</p>
                  </div>
                  
                  {selectedLesson.badge && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Completion Badge</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                            {selectedLesson.badge}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedLesson.status === "pending" && (
                  <DialogFooter className="flex gap-2 mt-6 pt-4 border-t">
                    <div className="flex-1 text-left">
                      <Button variant="outline" onClick={() => setViewMode("feedback")}>
                        Request Changes
                      </Button>
                    </div>
                    <Button onClick={handleApproveLesson} className="gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      Approve Lesson
                    </Button>
                  </DialogFooter>
                )}
              </>
            ) : (
              <>
                <div className="space-y-4 mt-2">
                  <p>
                    Send feedback to {selectedLesson.contributorName} about their lesson submission.
                    Be specific about what needs improvement or clarification.
                  </p>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Feedback Message:</h3>
                    <Textarea 
                      placeholder="Your feedback on the lesson submission..."
                      className="min-h-[200px]"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex gap-2 mt-6 pt-4 border-t">
                  <div className="flex-1 text-left">
                    <Button variant="outline" onClick={() => setViewMode("preview")}>
                      Back to Preview
                    </Button>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleSendFeedback}
                    disabled={!feedbackText.trim()}
                    className="gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Send Feedback
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}