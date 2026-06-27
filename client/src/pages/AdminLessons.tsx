import React, { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookMarked, BookOpen, Inbox, Search, ShieldCheck, Users } from "lucide-react";

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
  status: string;
  reviewerNote?: string | null;
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

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "student" | "parent" | "admin";
  ageGroup?: string | null;
}

const curriculumStatuses = ["pending_review", "approved", "changes_requested", "rejected", "archived"];
const collectionStatuses = ["approved", "published", "changes_requested", "rejected", "archived"];
const feedbackStatuses = ["new", "reviewing", "resolved", "archived"];
const roles = ["student", "parent", "admin"];

export default function AdminLessons() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<CurriculumSubmission | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CurriculumCollection | null>(null);
  const [reviewNote, setReviewNote] = useState("");
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

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<FeedbackSubmission[]>({
    queryKey: ["/api/feedback"],
    queryFn: () => apiRequest<FeedbackSubmission[]>("/api/feedback"),
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest<AdminUser[]>("/api/admin/users"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, reviewerNote }: { id: number; status: string; reviewerNote?: string }) =>
      apiRequest<CurriculumSubmission>(`/api/curriculum-submissions/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-submissions"] });
      setSelectedSubmission(null);
      setReviewNote("");
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
    mutationFn: ({ id, status, reviewerNote }: { id: number; status: string; reviewerNote?: string }) =>
      apiRequest<CurriculumCollection>(`/api/admin/curriculum-collections/${id}/review`, {
        method: "PATCH",
        body: { status, reviewerNote },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/curriculum-collections"] });
      setSelectedCollection(null);
      setReviewNote("");
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

  const filteredFeedback = feedback.filter((item) =>
    [item.name, item.email, item.audience, item.category, item.status, item.message]
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

  const counts = {
    pending: submissions.filter((submission) => submission.status === "pending_review").length,
    collections: collections.filter((collection) => collection.status === "pending_review").length,
    feedback: feedback.filter((item) => item.status === "new" || item.status === "reviewing").length,
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

      <div className="mb-6 grid gap-4 md:grid-cols-4">
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
          placeholder="Search submissions, collections, feedback, users..."
          className="pl-8"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <Tabs defaultValue="curriculum">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
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
                            setReviewNote(submission.reviewerNote || "");
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
                            setReviewNote(collection.reviewerNote || "");
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
