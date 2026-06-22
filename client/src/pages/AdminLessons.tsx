import React, { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";

interface CurriculumSubmission {
  id: number;
  contributorName: string;
  contributorEmail: string;
  affiliation: string;
  title: string;
  subject: string;
  ageGroup: string;
  objective: string;
  warmUp: string;
  coreContent: string;
  scenario: string;
  activity: string;
  reflection: string;
  badge?: string | null;
  status: string;
  reviewerNote?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
}

export default function AdminLessons() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<CurriculumSubmission | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "feedback">("preview");
  const [feedbackText, setFeedbackText] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<CurriculumSubmission[]>({
    queryKey: ["/api/curriculum-submissions"],
    queryFn: () => apiRequest<CurriculumSubmission[]>("/api/curriculum-submissions"),
  });

  // Filter lessons based on search query and subject filter
  const filterLessons = (lessons: CurriculumSubmission[]) => {
    return lessons.filter(lesson => {
      const matchesSearch = 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.contributorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubject = filterSubject ? lesson.subject === filterSubject : true;
      
      return matchesSearch && matchesSubject;
    });
  };

  const pendingLessons = filterLessons(submissions.filter((lesson) => lesson.status === "pending_review"));
  const approvedLessons = filterLessons(submissions.filter((lesson) => lesson.status === "approved"));

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reviewerNote }: { id: number; status: "approved" | "changes_requested"; reviewerNote?: string }) =>
      apiRequest<CurriculumSubmission>(`/api/curriculum-submissions/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote },
      }),
    onSuccess: (_submission, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-submissions"] });
      toast({
        title: variables.status === "approved" ? "Lesson approved" : "Changes requested",
        description: variables.status === "approved"
          ? "This submission has been approved for publication readiness."
          : "The contributor feedback has been recorded.",
      });
      setSelectedLesson(null);
      setFeedbackText("");
    },
    onError: (error) => {
      toast({
        title: "Review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  // View lesson details
  const handleViewLesson = (lesson: CurriculumSubmission) => {
    setSelectedLesson(lesson);
    setViewMode("preview");
  };

  // Approve lesson
  const handleApproveLesson = () => {
    if (!selectedLesson) return;
    reviewMutation.mutate({
      id: selectedLesson.id,
      status: "approved",
      reviewerNote: "Approved for publication readiness.",
    });
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

    if (!selectedLesson) return;
    reviewMutation.mutate({
      id: selectedLesson.id,
      status: "changes_requested",
      reviewerNote: feedbackText,
    });
  };

  // Format date for display
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not recorded";
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
          value={filterSubject || "__all"}
          onValueChange={(value) => setFilterSubject(value === "__all" ? "" : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All Subjects</SelectItem>
            <SelectItem value="Financial Literacy">Financial Literacy</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Well-Being">Well-Being</SelectItem>
            <SelectItem value="Critical Thinking">Critical Thinking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading curriculum submissions...</p>
          </CardContent>
        </Card>
      ) : (
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
                        <TableCell>{formatDate(lesson.submittedAt)}</TableCell>
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
                        <TableCell>{formatDate(lesson.reviewedAt)}</TableCell>
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
      )}
      
      {/* Lesson review dialog */}
      {selectedLesson && (
        <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{selectedLesson.subject}</Badge>
                <Badge variant="outline">{selectedLesson.ageGroup} years</Badge>
                {selectedLesson.status === "pending_review" ? (
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
                Submitted by {selectedLesson.contributorName} ({selectedLesson.affiliation}) on {formatDate(selectedLesson.submittedAt)}
              </DialogDescription>
              
              {selectedLesson.status === "pending_review" && (
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
                
                {selectedLesson.status === "pending_review" && (
                  <DialogFooter className="flex gap-2 mt-6 pt-4 border-t">
                    <div className="flex-1 text-left">
                      <Button variant="outline" onClick={() => setViewMode("feedback")}>
                        Request Changes
                      </Button>
                    </div>
                    <Button onClick={handleApproveLesson} className="gap-1" disabled={reviewMutation.isPending}>
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
                    disabled={!feedbackText.trim() || reviewMutation.isPending}
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
