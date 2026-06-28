import React, { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookMarked, BookOpen, Flag, GraduationCap, Inbox, LinkIcon, Search, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  resourceTitle?: string | null;
  resourceType?: string | null;
  resourceUrl?: string | null;
  resourceDescription?: string | null;
  resourceSourceLabel?: string | null;
  resourceDuration?: string | null;
  resourceSafetyNotes?: string | null;
  resourceParentPrompt?: string | null;
  resourceStudentPrompt?: string | null;
  status: string;
  reviewerNote?: string | null;
  internalReviewNote?: string | null;
  reviewRubric?: ReviewRubric | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  publishedLesson?: {
    id: number;
    title: string;
    slug: string;
  };
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    bio?: string | null;
    expertiseTags?: string[] | null;
    trustLevel: string;
    status: string;
  } | null;
}

interface CurriculumCollectionItem {
  id: number;
  itemType: string;
  title: string;
  description?: string | null;
  url?: string | null;
  embedUrl?: string | null;
  sourceLabel?: string | null;
  duration?: string | null;
  safetyNotes?: string | null;
  order: number;
  parentPrompt?: string | null;
  studentPrompt?: string | null;
}

interface CurriculumCollection {
  id: number;
  title: string;
  description: string;
  subject: string;
  ageGroup: string;
  estimatedWeeks: number;
  learningGoals?: string[] | null;
  parentNotes?: string | null;
  finalProject?: string | null;
  status: string;
  reviewerNote?: string | null;
  internalReviewNote?: string | null;
  reviewRubric?: ReviewRubric | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    bio?: string | null;
    expertiseTags?: string[] | null;
    trustLevel: string;
    status: string;
  } | null;
  items?: CurriculumCollectionItem[];
}

interface FeedbackSubmission {
  id: number;
  name: string;
  email: string;
  audience: string;
  category: string;
  message: string;
  status: string;
  createdAt?: string | null;
}

interface ContentReport {
  id: number;
  reporterName?: string | null;
  reporterEmail?: string | null;
  contentType: string;
  contentId: number;
  contentTitle: string;
  category: string;
  message: string;
  status: string;
  adminNote?: string | null;
  actionTaken?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
}

interface EducatorOffering {
  id: number;
  title: string;
  description: string;
  offeringType: string;
  subject: string;
  ageGroup: string;
  format: string;
  duration?: string | null;
  priceCents?: number | null;
  status: string;
  reviewerNote?: string | null;
  submittedAt?: string | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    trustLevel: string;
    subjectsTaught?: string[] | null;
    ageGroupsServed?: string[] | null;
  } | null;
}

interface OfferingInterest {
  id: number;
  requesterName: string;
  requesterEmail: string;
  learnerAgeGroup?: string | null;
  message?: string | null;
  status: string;
  createdAt?: string | null;
  offering?: {
    id: number;
    title: string;
    offeringType: string;
    subject: string;
    ageGroup: string;
  } | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    trustLevel: string;
  } | null;
  session?: {
    id: number;
    title: string;
    startsAt?: string | null;
  } | null;
}

interface OfferingSession {
  id: number;
  title: string;
  startsAt?: string | null;
  endsAt?: string | null;
  duration?: string | null;
  capacity?: number | null;
  reservedSeats: number;
  meetingUrl?: string | null;
  registrationNote?: string | null;
  status: string;
  submittedAt?: string | null;
  offering?: {
    id: number;
    title: string;
    subject: string;
    ageGroup: string;
  } | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    trustLevel: string;
  } | null;
}

interface ResourceSubmission {
  id: number;
  contributorName: string;
  contributorEmail: string;
  affiliation: string;
  title: string;
  description: string;
  resourceType: string;
  category: string;
  audience?: string[] | null;
  ageGroup: string;
  url: string;
  embedUrl?: string | null;
  sourceLabel?: string | null;
  duration?: string | null;
  learningUse: string;
  safetyNotes: string;
  thumbnailUrl?: string | null;
  status: string;
  reviewerNote?: string | null;
  internalReviewNote?: string | null;
  reviewRubric?: ReviewRubric | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    bio?: string | null;
    expertiseTags?: string[] | null;
    trustLevel: string;
    status: string;
  } | null;
}

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "student" | "parent" | "admin";
  ageGroup?: string | null;
}

type ReviewRubric = Record<string, string>;

const curriculumStatuses = ["pending_review", "approved", "changes_requested", "rejected", "archived"];
const collectionStatuses = ["approved", "published", "changes_requested", "rejected", "archived"];
const resourceStatuses = ["approved", "changes_requested", "rejected", "archived"];
const feedbackStatuses = ["new", "reviewing", "resolved", "archived"];
const reportStatuses = ["new", "reviewing", "resolved", "archived"];
const offeringReviewStatuses = ["approved", "changes_requested", "rejected", "archived"];
const sessionReviewStatuses = ["approved", "changes_requested", "rejected", "cancelled", "archived"];
const interestStatuses = ["new", "contacted", "waitlisted", "closed", "archived"];
const roles = ["student", "parent", "admin"];
const rubricCriteria = [
  ["safety", "Safety"],
  ["ageFit", "Age Fit"],
  ["sourceTrust", "Source Trust"],
  ["originality", "Originality"],
  ["usefulness", "Learning Usefulness"],
  ["clarity", "Clarity"],
  ["credentialFit", "Credential Fit"],
] as const;
const rubricRatings = ["pass", "needs_changes", "concern"];

const emptyRubric = (): ReviewRubric => Object.fromEntries(rubricCriteria.map(([key]) => [key, "pass"]));

export default function AdminLessons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<CurriculumSubmission | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CurriculumCollection | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceSubmission | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [internalReviewNote, setInternalReviewNote] = useState("");
  const [reviewRubric, setReviewRubric] = useState<ReviewRubric>(emptyRubric());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<CurriculumSubmission[]>({
    queryKey: ["/api/curriculum-submissions"],
    queryFn: () => apiRequest<CurriculumSubmission[]>("/api/curriculum-submissions"),
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery<CurriculumCollection[]>({
    queryKey: ["/api/admin/curriculum-collections"],
    queryFn: () => apiRequest<CurriculumCollection[]>("/api/admin/curriculum-collections"),
  });

  const { data: resourceSubmissions = [], isLoading: resourcesLoading } = useQuery<ResourceSubmission[]>({
    queryKey: ["/api/resource-submissions"],
    queryFn: () => apiRequest<ResourceSubmission[]>("/api/resource-submissions"),
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<FeedbackSubmission[]>({
    queryKey: ["/api/feedback"],
    queryFn: () => apiRequest<FeedbackSubmission[]>("/api/feedback"),
  });

  const { data: contentReports = [], isLoading: reportsLoading } = useQuery<ContentReport[]>({
    queryKey: ["/api/content-reports"],
    queryFn: () => apiRequest<ContentReport[]>("/api/content-reports"),
  });

  const { data: educatorOfferings = [], isLoading: offeringsLoading } = useQuery<EducatorOffering[]>({
    queryKey: ["/api/admin/educator-offerings"],
    queryFn: () => apiRequest<EducatorOffering[]>("/api/admin/educator-offerings"),
  });

  const { data: offeringInterests = [], isLoading: interestsLoading } = useQuery<OfferingInterest[]>({
    queryKey: ["/api/admin/offering-interests"],
    queryFn: () => apiRequest<OfferingInterest[]>("/api/admin/offering-interests"),
  });

  const { data: offeringSessions = [], isLoading: sessionsLoading } = useQuery<OfferingSession[]>({
    queryKey: ["/api/admin/offering-sessions"],
    queryFn: () => apiRequest<OfferingSession[]>("/api/admin/offering-sessions"),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest<AdminUser[]>("/api/admin/users"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reviewerNote,
      internalReviewNote,
      reviewRubric,
    }: { id: number; status: string; reviewerNote?: string; internalReviewNote?: string; reviewRubric?: ReviewRubric }) =>
      apiRequest<CurriculumSubmission>(`/api/curriculum-submissions/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote, internalReviewNote, reviewRubric },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-submissions"] });
      setSelectedSubmission(null);
      setReviewNote("");
      setInternalReviewNote("");
      setReviewRubric(emptyRubric());
      toast({
        title: "Review updated",
        description: "Approved submissions are now published into the lesson library.",
      });
    },
    onError: (error) => {
      toast({
        title: "Review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const collectionReviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reviewerNote,
      internalReviewNote,
      reviewRubric,
    }: { id: number; status: string; reviewerNote?: string; internalReviewNote?: string; reviewRubric?: ReviewRubric }) =>
      apiRequest<CurriculumCollection>(`/api/admin/curriculum-collections/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote, internalReviewNote, reviewRubric },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/curriculum-collections"] });
      setSelectedCollection(null);
      setReviewNote("");
      setInternalReviewNote("");
      setReviewRubric(emptyRubric());
      toast({
        title: "Collection review updated",
        description: "Approved collections are now available to public collection surfaces.",
      });
    },
    onError: (error) => {
      toast({
        title: "Collection review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const resourceReviewMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reviewerNote,
      internalReviewNote,
      reviewRubric,
    }: { id: number; status: string; reviewerNote?: string; internalReviewNote?: string; reviewRubric?: ReviewRubric }) =>
      apiRequest<ResourceSubmission>(`/api/resource-submissions/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote, internalReviewNote, reviewRubric },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resource-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      setSelectedResource(null);
      setReviewNote("");
      setInternalReviewNote("");
      setReviewRubric(emptyRubric());
      toast({
        title: "Resource review updated",
        description: "Approved resources are published into the Resource Center.",
      });
    },
    onError: (error) => {
      toast({
        title: "Resource review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<FeedbackSubmission>(`/api/feedback/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({ title: "Feedback updated", description: "The feedback queue status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Feedback update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const reportMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<ContentReport>(`/api/content-reports/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-reports"] });
      toast({ title: "Report updated", description: "The content report status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Report update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const offeringReviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<EducatorOffering>(`/api/admin/educator-offerings/${id}/review`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/educator-offerings"] });
      toast({ title: "Offering reviewed", description: "The educator offering review status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Offering review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const interestMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<OfferingInterest>(`/api/admin/offering-interests/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/offering-interests"] });
      toast({ title: "Interest updated", description: "The marketplace interest status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Interest update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const sessionReviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<OfferingSession>(`/api/admin/offering-sessions/${id}/review`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/offering-sessions"] });
      toast({ title: "Session reviewed", description: "The session review status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Session review failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });



  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      apiRequest<AdminUser>(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        body: { role },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated", description: "The user's role has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Role update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredSubmissions = submissions.filter((submission) =>
    [submission.title, submission.contributorName, submission.subject, submission.status]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredCollections = collections.filter((collection) =>
    [
      collection.title,
      collection.contributorProfile?.displayName,
      collection.subject,
      collection.ageGroup,
      collection.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredResources = resourceSubmissions.filter((resource) =>
    [
      resource.title,
      resource.contributorProfile?.displayName || resource.contributorName,
      resource.resourceType,
      resource.category,
      resource.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredFeedback = feedback.filter((item) =>
    [item.name, item.email, item.audience, item.category, item.status, item.message]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredReports = contentReports.filter((report) =>
    [
      report.reporterName,
      report.reporterEmail,
      report.contentType,
      report.contentTitle,
      report.category,
      report.status,
      report.message,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredOfferings = educatorOfferings.filter((offering) =>
    [
      offering.title,
      offering.contributorProfile?.displayName,
      offering.offeringType,
      offering.subject,
      offering.ageGroup,
      offering.status,
      offering.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredInterests = offeringInterests.filter((interest) =>
    [
      interest.requesterName,
      interest.requesterEmail,
      interest.learnerAgeGroup,
      interest.message,
      interest.status,
      interest.offering?.title,
      interest.offering?.subject,
      interest.contributorProfile?.displayName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredSessions = offeringSessions.filter((session) =>
    [
      session.title,
      session.status,
      session.meetingUrl,
      session.registrationNote,
      session.offering?.title,
      session.offering?.subject,
      session.contributorProfile?.displayName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    [user.fullName, user.email, user.role, user.ageGroup]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const hydrateReviewState = (item: {
    reviewerNote?: string | null;
    internalReviewNote?: string | null;
    reviewRubric?: ReviewRubric | null;
  }) => {
    setReviewNote(item.reviewerNote || "");
    setInternalReviewNote(item.internalReviewNote || "");
    setReviewRubric({ ...emptyRubric(), ...(item.reviewRubric || {}) });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not recorded";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const statusBadge = (status: string) => {
    const normalized = status.replace("_", " ");
    if (status === "approved" || status === "resolved") return <Badge className="bg-emerald-600">{normalized}</Badge>;
    if (status === "pending_review" || status === "new" || status === "reviewing") return <Badge className="bg-amber-500">{normalized}</Badge>;
    if (status === "rejected" || status === "changes_requested") return <Badge variant="destructive">{normalized}</Badge>;
    return <Badge variant="secondary">{normalized}</Badge>;
  };

  const renderReviewControls = () => (
    <div className="space-y-4 rounded-md border bg-slate-50 p-4">
      <div>
        <h3 className="font-semibold">Structured Review Rubric</h3>
        <p className="text-sm text-muted-foreground">
          Use this as the internal quality gate before publishing community-created content.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rubricCriteria.map(([key, label]) => (
          <div key={key} className="space-y-1">
            <div className="text-sm font-medium">{label}</div>
            <Select
              value={reviewRubric[key] || "pass"}
              onValueChange={(value) => setReviewRubric((current) => ({ ...current, [key]: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rubricRatings.map((rating) => (
                  <SelectItem key={rating} value={rating}>{rating.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">Internal Admin Note</h3>
        <Textarea
          value={internalReviewNote}
          onChange={(event) => setInternalReviewNote(event.target.value)}
          placeholder="Internal-only notes about safety, quality, source trust, or future follow-up..."
          className="min-h-[90px]"
        />
      </div>
    </div>
  );

  const counts = {
    pending: submissions.filter((submission) => submission.status === "pending_review").length,
    collections: collections.filter((collection) => collection.status === "pending_review").length,
    resources: resourceSubmissions.filter((resource) => resource.status === "pending_review").length,
    offerings: educatorOfferings.filter((offering) => offering.status === "pending_review").length,
    sessions: offeringSessions.filter((session) => session.status === "pending_review").length,
    interests: offeringInterests.filter((interest) => ["new", "waitlisted"].includes(interest.status)).length,
    feedback: feedback.filter((item) => item.status === "new" || item.status === "reviewing").length,
    reports: contentReports.filter((item) => item.status === "new" || item.status === "reviewing").length,
    users: users.length,
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" className="gap-1" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <div className="w-[150px]" />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4 text-primary" />
              Curriculum Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.pending}</div>
            <p className="text-sm text-muted-foreground">pending submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BookMarked className="h-4 w-4 text-primary" />
              Collection Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.collections}</div>
            <p className="text-sm text-muted-foreground">pending collections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <LinkIcon className="h-4 w-4 text-primary" />
              Resource Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.resources}</div>
            <p className="text-sm text-muted-foreground">pending resources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-primary" />
              Offering Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.offerings + counts.sessions}</div>
            <p className="text-sm text-muted-foreground">{counts.sessions} sessions, {counts.interests} interests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Inbox className="h-4 w-4 text-primary" />
              Feedback Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.feedback}</div>
            <p className="text-sm text-muted-foreground">open messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Flag className="h-4 w-4 text-primary" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.reports}</div>
            <p className="text-sm text-muted-foreground">open concerns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.users}</div>
            <p className="text-sm text-muted-foreground">accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search submissions, collections, resources, offerings, reports, feedback, users..."
          className="pl-8"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <Tabs defaultValue="curriculum">
        <TabsList className="mb-6 grid w-full grid-cols-7">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="offerings">Offerings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Review Queue</CardTitle>
              <CardDescription>Approve, reject, archive, or request changes for contributor submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              {submissionsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading submissions...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.title}</TableCell>
                        <TableCell>
                          <div className="font-medium">{submission.contributorProfile?.displayName || submission.contributorName}</div>
                          <div className="text-xs text-muted-foreground">
                            {submission.contributorProfile
                              ? `${submission.contributorProfile.trustLevel} creator`
                              : submission.contributorEmail}
                          </div>
                        </TableCell>
                        <TableCell>{submission.subject}</TableCell>
                        <TableCell>{statusBadge(submission.status)}</TableCell>
                        <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedSubmission(submission);
                            hydrateReviewState(submission);
                          }}>
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card>
            <CardHeader>
              <CardTitle>Collection Review Queue</CardTitle>
              <CardDescription>Review multi-step curriculum paths before families can browse them.</CardDescription>
            </CardHeader>
            <CardContent>
              {collectionsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading collections...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Collection</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>
                          <div className="font-medium">{collection.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {collection.estimatedWeeks} weeks | {collection.items?.length || 0} items
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{collection.contributorProfile?.displayName || "Unknown creator"}</div>
                          <div className="text-xs text-muted-foreground">
                            {collection.contributorProfile
                              ? `${collection.contributorProfile.trustLevel} creator`
                              : "No linked profile"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{collection.subject}</div>
                          <div className="text-xs text-muted-foreground">{collection.ageGroup}</div>
                        </TableCell>
                        <TableCell>{statusBadge(collection.status)}</TableCell>
                        <TableCell>{formatDate(collection.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedCollection(collection);
                            hydrateReviewState(collection);
                          }}>
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Review Queue</CardTitle>
              <CardDescription>Review submitted videos, links, guides, worksheets, and activities before publication.</CardDescription>
            </CardHeader>
            <CardContent>
              {resourcesLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading resources...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Contributor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-xs text-muted-foreground">{resource.category} | {resource.ageGroup}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{resource.contributorProfile?.displayName || resource.contributorName}</div>
                          <div className="text-xs text-muted-foreground">
                            {resource.contributorProfile ? `${resource.contributorProfile.trustLevel} creator` : resource.contributorEmail}
                          </div>
                        </TableCell>
                        <TableCell>{resource.resourceType}</TableCell>
                        <TableCell>{statusBadge(resource.status)}</TableCell>
                        <TableCell>{formatDate(resource.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedResource(resource);
                            hydrateReviewState(resource);
                          }}>
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offerings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Educator Offering Review Queue</CardTitle>
              <CardDescription>Review free samples, classes, tutoring, coaching, and bundles before marketplace discovery.</CardDescription>
            </CardHeader>
            <CardContent>
              {offeringsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading educator offerings...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offering</TableHead>
                      <TableHead>Educator</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOfferings.map((offering) => (
                      <TableRow key={offering.id}>
                        <TableCell>
                          <div className="font-medium">{offering.title}</div>
                          <div className="text-xs text-muted-foreground">{offering.subject} | {offering.ageGroup}</div>
                          <p className="mt-1 line-clamp-2 max-w-md text-xs text-muted-foreground">{offering.description}</p>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{offering.contributorProfile?.displayName || "Unknown educator"}</div>
                          <div className="text-xs text-muted-foreground">
                            {offering.contributorProfile
                              ? `${offering.contributorProfile.trustLevel} educator`
                              : "No linked profile"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{offering.offeringType.replace("_", " ")}</div>
                          <div className="text-xs text-muted-foreground">{offering.format.replace("_", " ")}</div>
                        </TableCell>
                        <TableCell>
                          {offering.priceCents ? `$${(offering.priceCents / 100).toFixed(2)}` : "Free/TBD"}
                        </TableCell>
                        <TableCell>
                          {offering.status === "pending_review" ? (
                            <Select
                              value={offering.status}
                              onValueChange={(status) => offeringReviewMutation.mutate({ id: offering.id, status })}
                              disabled={offeringReviewMutation.isPending}
                            >
                              <SelectTrigger className="w-[170px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending_review">pending review</SelectItem>
                                {offeringReviewStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : statusBadge(offering.status)}
                        </TableCell>
                        <TableCell>{formatDate(offering.submittedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Session Review Queue</CardTitle>
              <CardDescription>Review dates, capacity, and external meeting links before families can request seats.</CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading class sessions...</p>
              ) : filteredSessions.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No class sessions match the current search.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Offering</TableHead>
                      <TableHead>Educator</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Meeting</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(session.startsAt)}{session.duration ? ` | ${session.duration}` : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{session.offering?.title || "Offering unavailable"}</div>
                          <div className="text-xs text-muted-foreground">
                            {session.offering ? `${session.offering.subject} | ${session.offering.ageGroup}` : "No offering details"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{session.contributorProfile?.displayName || "Unknown educator"}</div>
                          <div className="text-xs text-muted-foreground">{session.contributorProfile?.trustLevel || "No trust level"}</div>
                        </TableCell>
                        <TableCell>{session.capacity ? `${session.reservedSeats}/${session.capacity}` : `${session.reservedSeats} requested`}</TableCell>
                        <TableCell className="max-w-[220px]">
                          {session.meetingUrl ? (
                            <a className="break-all text-xs text-primary underline" href={session.meetingUrl} target="_blank" rel="noreferrer">
                              {session.meetingUrl}
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">No link</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {session.status === "pending_review" ? (
                            <Select
                              value={session.status}
                              onValueChange={(status) => sessionReviewMutation.mutate({ id: session.id, status })}
                              disabled={sessionReviewMutation.isPending}
                            >
                              <SelectTrigger className="w-[170px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending_review">pending review</SelectItem>
                                {sessionReviewStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : statusBadge(session.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace Interest Queue</CardTitle>
              <CardDescription>Monitor family requests before enrollment and payments are automated.</CardDescription>
            </CardHeader>
            <CardContent>
              {interestsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading offering interests...</p>
              ) : filteredInterests.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No family interest requests match the current search.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Family</TableHead>
                      <TableHead>Offering</TableHead>
                      <TableHead>Educator</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterests.map((interest) => (
                      <TableRow key={interest.id}>
                        <TableCell>
                          <div className="font-medium">{interest.requesterName}</div>
                          <a className="text-xs text-primary underline" href={`mailto:${interest.requesterEmail}`}>
                            {interest.requesterEmail}
                          </a>
                          {interest.learnerAgeGroup && (
                            <div className="text-xs text-muted-foreground">Learner: {interest.learnerAgeGroup}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{interest.offering?.title || "Offering unavailable"}</div>
                          <div className="text-xs text-muted-foreground">
                            {interest.offering ? `${interest.offering.subject} | ${interest.offering.ageGroup}` : "No offering details"}
                          </div>
                          {interest.session && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Session: {interest.session.title} ({formatDate(interest.session.startsAt)})
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{interest.contributorProfile?.displayName || "Unknown educator"}</div>
                          <div className="text-xs text-muted-foreground">
                            {interest.contributorProfile?.trustLevel || "No trust level"}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-sm text-sm text-muted-foreground">
                          {interest.message || "No message included"}
                        </TableCell>
                        <TableCell>{formatDate(interest.createdAt)}</TableCell>
                        <TableCell>
                          <Select
                            value={interest.status}
                            onValueChange={(status) => interestMutation.mutate({ id: interest.id, status })}
                            disabled={interestMutation.isPending}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {interestStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Content Reports</CardTitle>
              <CardDescription>Review family concerns about accuracy, safety, age fit, broken links, and source rights.</CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading reports...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Concern</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="font-medium">{report.contentTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            {report.contentType} #{report.contentId}
                          </div>
                        </TableCell>
                        <TableCell>{report.category.replace("_", " ")}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-3 text-sm">{report.message}</p>
                          {report.actionTaken && (
                            <p className="mt-1 text-xs text-muted-foreground">Action: {report.actionTaken}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{report.reporterName || "Anonymous"}</div>
                          <div className="text-xs text-muted-foreground">{report.reporterEmail || "No email"}</div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={report.status}
                            onValueChange={(status) => reportMutation.mutate({ id: report.id, status })}
                            disabled={reportMutation.isPending}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {reportStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Queue</CardTitle>
              <CardDescription>Track public beta feedback, bug reports, safety concerns, and feature ideas.</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading feedback...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.email}</div>
                          <div className="text-xs text-muted-foreground">{item.audience}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-3 text-sm">{item.message}</p>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.status}
                            onValueChange={(status) => feedbackMutation.mutate({ id: item.id, status })}
                            disabled={feedbackMutation.isPending}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {feedbackStatuses.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Users & Roles
              </CardTitle>
              <CardDescription>Promote trusted operators to admin or classify accounts as parent/student.</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <p className="py-8 text-center text-muted-foreground">Loading users...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age Group</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || `User ${user.id}`}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.ageGroup || "Not set"}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role || "student"}
                            onValueChange={(role) => roleMutation.mutate({ userId: user.id, role })}
                            disabled={roleMutation.isPending}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCollection && (
        <Dialog open={Boolean(selectedCollection)} onOpenChange={(open) => !open && setSelectedCollection(null)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{selectedCollection.subject}</Badge>
                <Badge variant="outline">{selectedCollection.ageGroup}</Badge>
                <Badge variant="secondary">{selectedCollection.estimatedWeeks} weeks</Badge>
                {statusBadge(selectedCollection.status)}
              </div>
              <DialogTitle>{selectedCollection.title}</DialogTitle>
              <DialogDescription>
                Built by {selectedCollection.contributorProfile?.displayName || "unknown creator"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="rounded-md border bg-slate-50 p-4">
                <h3 className="mb-2 font-semibold">Contributor Context</h3>
                {selectedCollection.contributorProfile ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedCollection.contributorProfile.trustLevel} creator</Badge>
                      <Badge variant="outline">{selectedCollection.contributorProfile.status}</Badge>
                    </div>
                    {selectedCollection.contributorProfile.affiliation && (
                      <p>Affiliation: {selectedCollection.contributorProfile.affiliation}</p>
                    )}
                    {selectedCollection.contributorProfile.expertiseTags?.length ? (
                      <p>Expertise: {selectedCollection.contributorProfile.expertiseTags.join(", ")}</p>
                    ) : null}
                    {selectedCollection.contributorProfile.bio && (
                      <p className="whitespace-pre-line">{selectedCollection.contributorProfile.bio}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No contributor profile is linked to this collection.</p>
                )}
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Description</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{selectedCollection.description}</p>
              </div>

              {selectedCollection.learningGoals?.length ? (
                <div>
                  <h3 className="mb-2 font-semibold">Learning Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCollection.learningGoals.map((goal) => (
                      <Badge key={goal} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedCollection.parentNotes && (
                <div>
                  <h3 className="mb-1 font-semibold">Parent Notes</h3>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{selectedCollection.parentNotes}</p>
                </div>
              )}

              {selectedCollection.finalProject && (
                <div>
                  <h3 className="mb-1 font-semibold">Final Project</h3>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{selectedCollection.finalProject}</p>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Collection Items</h3>
                {(selectedCollection.items || []).map((item) => (
                  <div key={item.id} className="rounded-md border p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Step {item.order}</Badge>
                      <Badge variant="secondary">{item.itemType}</Badge>
                      <h4 className="font-medium">{item.title}</h4>
                    </div>
                    {item.url && (
                      <a className="break-all text-sm text-primary underline" href={item.url} target="_blank" rel="noreferrer">
                        {item.url}
                      </a>
                    )}
                    {(item.sourceLabel || item.duration) && (
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {item.sourceLabel && <Badge variant="outline">Source: {item.sourceLabel}</Badge>}
                        {item.duration && <Badge variant="outline">{item.duration}</Badge>}
                      </div>
                    )}
                    {item.embedUrl && (
                      <p className="mt-2 break-all text-xs text-muted-foreground">Embed: {item.embedUrl}</p>
                    )}
                    {item.safetyNotes && (
                      <p className="mt-2 rounded-md border bg-amber-50 p-2 text-sm text-amber-900">
                        <span className="font-medium">Safety notes:</span> {item.safetyNotes}
                      </p>
                    )}
                    {item.description && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{item.description}</p>}
                    {item.parentPrompt && <p className="mt-2 text-sm"><span className="font-medium">Parent:</span> {item.parentPrompt}</p>}
                    {item.studentPrompt && <p className="mt-1 text-sm"><span className="font-medium">Student:</span> {item.studentPrompt}</p>}
                  </div>
                ))}
              </div>

              {renderReviewControls()}

              <div className="space-y-2">
                <h3 className="font-semibold">Reviewer Note</h3>
                <Textarea
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Add notes for the contributor or internal review history..."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-wrap gap-2">
              {collectionStatuses.map((status) => (
                <Button
                  key={status}
                  variant={status === "approved" || status === "published" ? "default" : status === "rejected" ? "destructive" : "outline"}
                  disabled={collectionReviewMutation.isPending}
                  onClick={() => collectionReviewMutation.mutate({
                    id: selectedCollection.id,
                    status,
                    reviewerNote: reviewNote || undefined,
                    internalReviewNote: internalReviewNote || undefined,
                    reviewRubric,
                  })}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedResource && (
        <Dialog open={Boolean(selectedResource)} onOpenChange={(open) => !open && setSelectedResource(null)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{selectedResource.resourceType}</Badge>
                <Badge variant="outline">{selectedResource.category}</Badge>
                <Badge variant="secondary">{selectedResource.ageGroup}</Badge>
                {statusBadge(selectedResource.status)}
              </div>
              <DialogTitle>{selectedResource.title}</DialogTitle>
              <DialogDescription>
                Submitted by {selectedResource.contributorProfile?.displayName || selectedResource.contributorName} ({selectedResource.contributorEmail})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="rounded-md border bg-slate-50 p-4">
                <h3 className="mb-2 font-semibold">Contributor Context</h3>
                {selectedResource.contributorProfile ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedResource.contributorProfile.trustLevel} creator</Badge>
                      <Badge variant="outline">{selectedResource.contributorProfile.status}</Badge>
                    </div>
                    {selectedResource.contributorProfile.affiliation && (
                      <p>Affiliation: {selectedResource.contributorProfile.affiliation}</p>
                    )}
                    {selectedResource.contributorProfile.expertiseTags?.length ? (
                      <p>Expertise: {selectedResource.contributorProfile.expertiseTags.join(", ")}</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No contributor profile is linked to this resource.</p>
                )}
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Description</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{selectedResource.description}</p>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-semibold">Source</h3>
                <div className="space-y-2 text-sm">
                  <a className="break-all text-primary underline" href={selectedResource.url} target="_blank" rel="noreferrer">
                    {selectedResource.url}
                  </a>
                  {selectedResource.embedUrl && <p className="break-all text-muted-foreground">Embed: {selectedResource.embedUrl}</p>}
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.sourceLabel && <Badge variant="outline">Source: {selectedResource.sourceLabel}</Badge>}
                    {selectedResource.duration && <Badge variant="outline">{selectedResource.duration}</Badge>}
                    {selectedResource.audience?.map((audience) => <Badge key={audience} variant="secondary">{audience}</Badge>)}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Learning Use</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{selectedResource.learningUse}</p>
              </div>

              <div className="rounded-md border bg-amber-50 p-4">
                <h3 className="mb-1 font-semibold text-amber-950">Safety Notes</h3>
                <p className="whitespace-pre-line text-sm text-amber-900">{selectedResource.safetyNotes}</p>
              </div>

              {renderReviewControls()}

              <div className="space-y-2">
                <h3 className="font-semibold">Reviewer Note</h3>
                <Textarea
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Add notes for the contributor or internal review history..."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-wrap gap-2">
              {resourceStatuses.map((status) => (
                <Button
                  key={status}
                  variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "outline"}
                  disabled={resourceReviewMutation.isPending}
                  onClick={() => resourceReviewMutation.mutate({
                    id: selectedResource.id,
                    status,
                    reviewerNote: reviewNote || undefined,
                    internalReviewNote: internalReviewNote || undefined,
                    reviewRubric,
                  })}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedSubmission && (
        <Dialog open={Boolean(selectedSubmission)} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{selectedSubmission.subject}</Badge>
                <Badge variant="outline">{selectedSubmission.ageGroup}</Badge>
                {statusBadge(selectedSubmission.status)}
              </div>
              <DialogTitle>{selectedSubmission.title}</DialogTitle>
              <DialogDescription>
                Submitted by {selectedSubmission.contributorProfile?.displayName || selectedSubmission.contributorName} ({selectedSubmission.contributorEmail})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="rounded-md border bg-slate-50 p-4">
                <h3 className="mb-2 font-semibold">Contributor Context</h3>
                {selectedSubmission.contributorProfile ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedSubmission.contributorProfile.trustLevel} creator</Badge>
                      <Badge variant="outline">{selectedSubmission.contributorProfile.status}</Badge>
                    </div>
                    {selectedSubmission.contributorProfile.affiliation && (
                      <p>Affiliation: {selectedSubmission.contributorProfile.affiliation}</p>
                    )}
                    {selectedSubmission.contributorProfile.expertiseTags?.length ? (
                      <p>Expertise: {selectedSubmission.contributorProfile.expertiseTags.join(", ")}</p>
                    ) : null}
                    {selectedSubmission.contributorProfile.bio && (
                      <p className="whitespace-pre-line">{selectedSubmission.contributorProfile.bio}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This submission is not linked to a creator profile yet. Review with the contributor's typed name and email only.
                  </p>
                )}
              </div>

              {[ 
                ["Objective", selectedSubmission.objective],
                ["Warm-Up", selectedSubmission.warmUp],
                ["Core Content", selectedSubmission.coreContent],
                ["Scenario", selectedSubmission.scenario],
                ["Activity", selectedSubmission.activity],
                ["Reflection", selectedSubmission.reflection],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="mb-1 font-semibold">{title}</h3>
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{body}</p>
                  <Separator className="mt-4" />
                </div>
              ))}

              {selectedSubmission.resourceTitle && selectedSubmission.resourceUrl && (
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-semibold">Attached Resource</h3>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedSubmission.resourceType || "link"}</Badge>
                    {selectedSubmission.resourceDuration && <Badge variant="outline">{selectedSubmission.resourceDuration}</Badge>}
                    {selectedSubmission.resourceSourceLabel && <Badge variant="outline">Source: {selectedSubmission.resourceSourceLabel}</Badge>}
                  </div>
                  <p className="font-medium">{selectedSubmission.resourceTitle}</p>
                  <a className="break-all text-sm text-primary underline" href={selectedSubmission.resourceUrl} target="_blank" rel="noreferrer">
                    {selectedSubmission.resourceUrl}
                  </a>
                  {selectedSubmission.resourceDescription && (
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{selectedSubmission.resourceDescription}</p>
                  )}
                  {selectedSubmission.resourceSafetyNotes && (
                    <p className="mt-2 rounded-md border bg-amber-50 p-2 text-sm text-amber-900">
                      <span className="font-medium">Safety notes:</span> {selectedSubmission.resourceSafetyNotes}
                    </p>
                  )}
                  {selectedSubmission.resourceParentPrompt && (
                    <p className="mt-2 text-sm"><span className="font-medium">Parent:</span> {selectedSubmission.resourceParentPrompt}</p>
                  )}
                  {selectedSubmission.resourceStudentPrompt && (
                    <p className="mt-1 text-sm"><span className="font-medium">Student:</span> {selectedSubmission.resourceStudentPrompt}</p>
                  )}
                </div>
              )}

              {renderReviewControls()}

              <div className="space-y-2">
                <h3 className="font-semibold">Reviewer Note</h3>
                <Textarea
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  placeholder="Add notes for the contributor or internal review history..."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-wrap gap-2">
              {curriculumStatuses.filter((status) => status !== "pending_review").map((status) => (
                <Button
                  key={status}
                  variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "outline"}
                  disabled={reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate({
                    id: selectedSubmission.id,
                    status,
                    reviewerNote: reviewNote || undefined,
                    internalReviewNote: internalReviewNote || undefined,
                    reviewRubric,
                  })}
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
