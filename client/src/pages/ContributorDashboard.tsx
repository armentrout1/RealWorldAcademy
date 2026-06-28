import React from "react";
import { Link } from "wouter";
import { BookMarked, BookOpen, ClipboardList, UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContributorProfileRecord {
  id: number;
  displayName: string;
  subjectsTaught?: string[] | null;
  ageGroupsServed?: string[] | null;
  offeringTypes?: string[] | null;
  availabilitySummary?: string | null;
  trustLevel: string;
  status: string;
}

interface ContributorSubmission {
  id: number;
  title: string;
  subject: string;
  ageGroup: string;
  status: string;
  reviewerNote?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
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
  status: string;
  reviewerNote?: string | null;
  submittedAt?: string | null;
}

interface OfferingInterest {
  id: number;
  educatorOfferingId: number;
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
}

const emptyOfferingForm = {
  title: "",
  description: "",
  offeringType: "free_sample",
  subject: "",
  ageGroup: "",
  format: "free",
  duration: "",
  priceCents: "",
  sampleUrl: "",
  parentExpectations: "",
  completionEvidence: "",
};

const statusBadge = (status: string) => {
  const label = status.replace("_", " ");
  if (status === "approved" || status === "contacted" || status === "closed") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "pending_review" || status === "new" || status === "waitlisted") return <Badge className="bg-amber-500">{label}</Badge>;
  if (status === "changes_requested" || status === "rejected") return <Badge variant="destructive">{label}</Badge>;
  return <Badge variant="secondary">{label}</Badge>;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

const interestStatuses = ["new", "contacted", "waitlisted", "closed", "archived"];

export default function ContributorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [offeringForm, setOfferingForm] = React.useState(emptyOfferingForm);

  const { data: profile, isLoading: profileLoading } = useQuery<ContributorProfileRecord | null>({
    queryKey: ["/api/contributor-profiles/me"],
    queryFn: () => apiRequest<ContributorProfileRecord | null>("/api/contributor-profiles/me"),
    enabled: Boolean(user?.id),
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<ContributorSubmission[]>({
    queryKey: ["/api/contributor-submissions/me"],
    queryFn: () => apiRequest<ContributorSubmission[]>("/api/contributor-submissions/me"),
    enabled: Boolean(profile?.id),
  });

  const { data: offerings = [], isLoading: offeringsLoading } = useQuery<EducatorOffering[]>({
    queryKey: ["/api/educator-offerings/me"],
    queryFn: () => apiRequest<EducatorOffering[]>("/api/educator-offerings/me"),
    enabled: Boolean(profile?.id),
  });

  const { data: interests = [], isLoading: interestsLoading } = useQuery<OfferingInterest[]>({
    queryKey: ["/api/offering-interests/me"],
    queryFn: () => apiRequest<OfferingInterest[]>("/api/offering-interests/me"),
    enabled: Boolean(profile?.id),
  });

  const offeringMutation = useMutation({
    mutationFn: (submitForReview: boolean) => apiRequest<EducatorOffering>("/api/educator-offerings", {
      method: "POST",
      body: {
        ...offeringForm,
        priceCents: offeringForm.priceCents ? Number(offeringForm.priceCents) : null,
        submitForReview,
      },
    }),
    onSuccess: (_, submitForReview) => {
      setOfferingForm(emptyOfferingForm);
      queryClient.invalidateQueries({ queryKey: ["/api/educator-offerings/me"] });
      toast({
        title: submitForReview ? "Offering submitted" : "Offering saved",
        description: submitForReview
          ? "Admins can now review this educator offering."
          : "Your draft offering has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Offering not saved",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const interestMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest<OfferingInterest>(`/api/offering-interests/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/offering-interests/me"] });
      toast({ title: "Interest updated", description: "The family request status has been saved." });
    },
    onError: (error) => {
      toast({
        title: "Interest update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To View Educator Work</CardTitle>
            <CardDescription>Educator dashboards are connected to creator and teacher profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileLoading && !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              Create Your Educator Profile
            </CardTitle>
            <CardDescription>
              Version 4 uses educator profiles to connect submissions, review history, published curriculum, and future classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/contributor-profile">Set Up Educator Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="mb-3">Educator Workspace</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <ClipboardList className="h-7 w-7 text-primary" />
            Educator Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track submitted curriculum now and prepare your profile for future classes, tutoring, and learning services.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/contributor-profile">Edit Profile</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/curriculum-collections">
              <BookMarked className="mr-2 h-4 w-4" />
              Build Collection
            </Link>
          </Button>
          <Button asChild>
            <Link href="/contribute">Contribute Lesson</Link>
          </Button>
          <Button asChild>
            <Link href="/contribute-resource">Submit Resource</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published/Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.filter((item) => item.status === "approved").length}</div>
            <p className="text-sm text-muted-foreground">approved submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.filter((item) => item.status === "pending_review").length}</div>
            <p className="text-sm text-muted-foreground">waiting on admin review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trust Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">{profile?.trustLevel || "new"}</div>
            <p className="text-sm text-muted-foreground">review speed can improve over time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Educator Profile Snapshot
          </CardTitle>
          <CardDescription>These fields will power marketplace discovery as offerings come online.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div>
            <p className="font-medium">Subjects</p>
            <p className="mt-1 text-muted-foreground">{profile?.subjectsTaught?.length ? profile.subjectsTaught.join(", ") : "Add subjects you teach"}</p>
          </div>
          <div>
            <p className="font-medium">Age Groups</p>
            <p className="mt-1 text-muted-foreground">{profile?.ageGroupsServed?.length ? profile.ageGroupsServed.join(", ") : "Add learner age groups"}</p>
          </div>
          <div>
            <p className="font-medium">Future Offerings</p>
            <p className="mt-1 text-muted-foreground">{profile?.offeringTypes?.length ? profile.offeringTypes.join(", ") : "Add classes, tutoring, or bundles"}</p>
          </div>
          <div className="md:col-span-3">
            <p className="font-medium">Availability</p>
            <p className="mt-1 text-muted-foreground">{profile?.availabilitySummary || "Add when or how families can learn from you."}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Educator Offerings</CardTitle>
            <CardDescription>Draft free samples, classes, tutoring, coaching, or bundles before marketplace payments are enabled.</CardDescription>
          </CardHeader>
          <CardContent>
            {offeringsLoading ? (
              <p className="py-8 text-center text-muted-foreground">Loading offerings...</p>
            ) : offerings.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No offerings yet. Create a free sample or class draft to start the marketplace review path.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offering</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerings.map((offering) => (
                    <TableRow key={offering.id}>
                      <TableCell>
                        <div className="font-medium">{offering.title}</div>
                        <div className="text-xs text-muted-foreground">{offering.subject} | {offering.ageGroup}</div>
                      </TableCell>
                      <TableCell>{offering.offeringType.replace("_", " ")}</TableCell>
                      <TableCell>{statusBadge(offering.status)}</TableCell>
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
            <CardTitle>Create Offering</CardTitle>
            <CardDescription>Start with free samples or placeholders. Paid checkout comes later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offeringTitle">Title</Label>
              <Input
                id="offeringTitle"
                value={offeringForm.title}
                onChange={(event) => setOfferingForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Teen budgeting workshop"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={offeringForm.offeringType}
                  onValueChange={(offeringType) => setOfferingForm((current) => ({ ...current, offeringType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free_sample">Free Sample</SelectItem>
                    <SelectItem value="live_class">Live Class</SelectItem>
                    <SelectItem value="recorded_course">Recorded Course</SelectItem>
                    <SelectItem value="tutoring">Tutoring</SelectItem>
                    <SelectItem value="coaching">Coaching</SelectItem>
                    <SelectItem value="curriculum_bundle">Curriculum Bundle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={offeringForm.format}
                  onValueChange={(format) => setOfferingForm((current) => ({ ...current, format }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid_placeholder">Paid Placeholder</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="recorded">Recorded</SelectItem>
                    <SelectItem value="one_on_one">One-on-One</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offeringSubject">Subject</Label>
                <Input
                  id="offeringSubject"
                  value={offeringForm.subject}
                  onChange={(event) => setOfferingForm((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="Financial literacy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringAge">Age Group</Label>
                <Input
                  id="offeringAge"
                  value={offeringForm.ageGroup}
                  onChange={(event) => setOfferingForm((current) => ({ ...current, ageGroup: event.target.value }))}
                  placeholder="13-15"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offeringDuration">Duration</Label>
                <Input
                  id="offeringDuration"
                  value={offeringForm.duration}
                  onChange={(event) => setOfferingForm((current) => ({ ...current, duration: event.target.value }))}
                  placeholder="1 hour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringPrice">Price Cents</Label>
                <Input
                  id="offeringPrice"
                  type="number"
                  min="0"
                  value={offeringForm.priceCents}
                  onChange={(event) => setOfferingForm((current) => ({ ...current, priceCents: event.target.value }))}
                  placeholder="2500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sampleUrl">Sample URL</Label>
              <Input
                id="sampleUrl"
                value={offeringForm.sampleUrl}
                onChange={(event) => setOfferingForm((current) => ({ ...current, sampleUrl: event.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offeringDescription">Description</Label>
              <Textarea
                id="offeringDescription"
                className="min-h-[100px]"
                value={offeringForm.description}
                onChange={(event) => setOfferingForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="What will learners understand or be able to do after this?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentExpectations">Parent Expectations</Label>
              <Textarea
                id="parentExpectations"
                className="min-h-[80px]"
                value={offeringForm.parentExpectations}
                onChange={(event) => setOfferingForm((current) => ({ ...current, parentExpectations: event.target.value }))}
                placeholder="What should parents know before assigning or enrolling?"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => offeringMutation.mutate(false)}
                disabled={offeringMutation.isPending}
              >
                Save Draft
              </Button>
              <Button
                onClick={() => offeringMutation.mutate(true)}
                disabled={offeringMutation.isPending}
              >
                Submit For Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Family Interest Queue</CardTitle>
          <CardDescription>Requests from families browsing your approved educator offerings.</CardDescription>
        </CardHeader>
        <CardContent>
          {interestsLoading ? (
            <p className="py-8 text-center text-muted-foreground">Loading family requests...</p>
          ) : interests.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No family requests yet. Approved offerings will collect interest from public educator profiles.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Family</TableHead>
                  <TableHead>Offering</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interests.map((interest) => (
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
                      <div className="font-medium">{interest.offering?.title || "Offering removed"}</div>
                      <div className="text-xs text-muted-foreground">
                        {interest.offering ? `${interest.offering.subject} | ${interest.offering.ageGroup}` : "No offering details"}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground">
                      {interest.message || "No message included"}
                    </TableCell>
                    <TableCell>{formatDate(interest.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {statusBadge(interest.status)}
                        <Select
                          value={interest.status}
                          onValueChange={(status) => interestMutation.mutate({ id: interest.id, status })}
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
                      </div>
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
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Your Curriculum Submissions
          </CardTitle>
          <CardDescription>Reviewer notes will appear here when changes are requested.</CardDescription>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <p className="py-8 text-center text-muted-foreground">Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="mb-4 text-sm text-muted-foreground">No submissions yet.</p>
              <Button asChild>
                <Link href="/contribute">Submit Your First Lesson</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Reviewer Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.title}</TableCell>
                    <TableCell>{submission.subject}</TableCell>
                    <TableCell>{submission.ageGroup}</TableCell>
                    <TableCell>{statusBadge(submission.status)}</TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground">
                      {submission.reviewerNote || "No note yet"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
