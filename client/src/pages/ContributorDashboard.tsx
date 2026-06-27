import React from "react";
import { Link } from "wouter";
import { BookMarked, BookOpen, ClipboardList, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";

interface ContributorProfileRecord {
  id: number;
  displayName: string;
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

const statusBadge = (status: string) => {
  const label = status.replace("_", " ");
  if (status === "approved") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "pending_review") return <Badge className="bg-amber-500">{label}</Badge>;
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

export default function ContributorDashboard() {
  const { user } = useAuth();

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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To View Contributor Work</CardTitle>
            <CardDescription>Contributor dashboards are connected to creator profiles.</CardDescription>
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
              Create Your Contributor Profile
            </CardTitle>
            <CardDescription>
              Version 3 uses creator profiles to connect submissions, review history, and published curriculum.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/contributor-profile">Set Up Creator Profile</Link>
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
          <Badge className="mb-3">Contributor Workspace</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <ClipboardList className="h-7 w-7 text-primary" />
            Contributor Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Track the curriculum you have submitted and what reviewers need from you next.
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
