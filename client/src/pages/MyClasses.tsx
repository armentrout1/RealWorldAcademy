import React from "react";
import { Link } from "wouter";
import { CalendarClock, Download, GraduationCap, Mail, Star, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OfferingEnrollment {
  id: number;
  requesterName: string;
  requesterEmail: string;
  learnerAgeGroup?: string | null;
  learnerCount: number;
  message?: string | null;
  status: string;
  createdAt?: string | null;
  reservedAt?: string | null;
  offering?: {
    id: number;
    title: string;
    subject: string;
    ageGroup: string;
    offeringType: string;
    priceCents?: number | null;
    currency?: string | null;
  } | null;
  session?: {
    id: number;
    title: string;
    startsAt?: string | null;
    duration?: string | null;
    capacity?: number | null;
    reservedSeats: number;
    registrationNote?: string | null;
  } | null;
  contributorProfile?: {
    id: number;
    displayName: string;
    affiliation?: string | null;
    trustLevel: string;
  } | null;
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const statusBadge = (status: string) => {
  const label = status.replace("_", " ");
  if (status === "reserved" || status === "completed") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "requested" || status === "waitlisted") return <Badge className="bg-amber-500">{label}</Badge>;
  if (status === "cancelled") return <Badge variant="destructive">{label}</Badge>;
  return <Badge variant="secondary">{label}</Badge>;
};

const escapeIcsText = (value: string) => value.replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n");

const formatIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

const downloadCalendarFile = (enrollment: OfferingEnrollment) => {
  if (!enrollment.session?.startsAt) return;

  const start = new Date(enrollment.session.startsAt);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const title = enrollment.session.title || enrollment.offering?.title || "Real World Academy Class";
  const description = [
    enrollment.offering?.title,
    enrollment.contributorProfile?.displayName ? `Educator: ${enrollment.contributorProfile.displayName}` : null,
    enrollment.session.registrationNote,
  ].filter(Boolean).join("\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Real World Academy//Marketplace Class//EN",
    "BEGIN:VEVENT",
    `UID:rwa-class-${enrollment.id}@realworldacademy.local`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `real-world-academy-class-${enrollment.id}.ics`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function MyClasses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewForms, setReviewForms] = React.useState<Record<number, { rating: string; reviewText: string }>>({});
  const { data: enrollments = [], isLoading } = useQuery<OfferingEnrollment[]>({
    queryKey: ["/api/my-offering-enrollments"],
    queryFn: () => apiRequest<OfferingEnrollment[]>("/api/my-offering-enrollments"),
    enabled: Boolean(user?.id),
  });

  const activeEnrollments = enrollments.filter((item) => !["cancelled", "archived"].includes(item.status));
  const reservedCount = enrollments.filter((item) => item.status === "reserved").length;
  const requestedCount = enrollments.filter((item) => item.status === "requested").length;
  const waitlistedCount = enrollments.filter((item) => item.status === "waitlisted").length;

  const reviewMutation = useMutation({
    mutationFn: ({ enrollmentId, rating, reviewText }: { enrollmentId: number; rating: number; reviewText: string }) =>
      apiRequest(`/api/my-offering-enrollments/${enrollmentId}/reviews`, {
        method: "POST",
        body: { rating, reviewText },
      }),
    onSuccess: (_, variables) => {
      setReviewForms((current) => ({ ...current, [variables.enrollmentId]: { rating: "5", reviewText: "" } }));
      queryClient.invalidateQueries({ queryKey: ["/api/my-offering-enrollments"] });
      toast({ title: "Review submitted", description: "Thanks. An admin will moderate it before it becomes public." });
    },
    onError: (error) => {
      toast({
        title: "Review not submitted",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (enrollmentId: number) => apiRequest(`/api/my-offering-enrollments/${enrollmentId}/checkout`, { method: "POST" }),
    onSuccess: () => {
      toast({ title: "Checkout ready", description: "Payment provider wiring can now create a hosted checkout session." });
    },
    onError: (error) => {
      toast({
        title: "Checkout not live yet",
        description: error instanceof Error ? error.message : "Payments still need provider configuration.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To View Classes</CardTitle>
            <CardDescription>Your requested and reserved marketplace sessions are connected to your account email.</CardDescription>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="mb-3">Family Learning</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <CalendarClock className="h-7 w-7 text-primary" />
            My Classes
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Track session requests, reservations, waitlists, and completed educator-led classes.
          </p>
        </div>
        <Button asChild>
          <Link href="/educators">Find Educators</Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeEnrollments.length}</div>
            <p className="text-sm text-muted-foreground">class records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Requested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{requestedCount}</div>
            <p className="text-sm text-muted-foreground">awaiting educator follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reservedCount}</div>
            <p className="text-sm text-muted-foreground">seat confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{waitlistedCount}</div>
            <p className="text-sm text-muted-foreground">waiting for seats</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-muted-foreground">Loading classes...</p>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Classes Yet</CardTitle>
            <CardDescription>Request a seat from an approved educator session to start building your class schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/educators">Browse Educators</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {statusBadge(enrollment.status)}
                      {enrollment.offering?.subject && <Badge variant="outline">{enrollment.offering.subject}</Badge>}
                    </div>
                    <CardTitle>{enrollment.session?.title || enrollment.offering?.title || "Class session"}</CardTitle>
                    <CardDescription>{enrollment.offering?.title || "Educator offering"}</CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDateTime(enrollment.session?.startsAt)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm md:grid-cols-3">
                  <div className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2 font-medium">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Educator
                    </div>
                    <p className="text-muted-foreground">{enrollment.contributorProfile?.displayName || "Pending"}</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2 font-medium">
                      <Users className="h-4 w-4 text-primary" />
                      Learners
                    </div>
                    <p className="text-muted-foreground">
                      {enrollment.learnerCount}{enrollment.learnerAgeGroup ? ` | ${enrollment.learnerAgeGroup}` : ""}
                    </p>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2 font-medium">
                      <Mail className="h-4 w-4 text-primary" />
                      Contact
                    </div>
                    <p className="break-all text-muted-foreground">{enrollment.requesterEmail}</p>
                  </div>
                </div>

                {enrollment.session?.registrationNote && (
                  <p className="rounded-md border bg-slate-50 p-3 text-sm text-muted-foreground">
                    {enrollment.session.registrationNote}
                  </p>
                )}
                {enrollment.message && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Your note:</span> {enrollment.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {enrollment.session?.startsAt && ["reserved", "completed"].includes(enrollment.status) && (
                    <Button variant="outline" size="sm" onClick={() => downloadCalendarFile(enrollment)}>
                      <Download className="mr-2 h-4 w-4" />
                      Calendar
                    </Button>
                  )}
                  {enrollment.offering?.priceCents && ["requested", "reserved"].includes(enrollment.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => checkoutMutation.mutate(enrollment.id)}
                      disabled={checkoutMutation.isPending}
                    >
                      Payment Readiness
                    </Button>
                  )}
                </div>

                {enrollment.status === "completed" && (
                  <div className="rounded-md border bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-2 font-medium">
                      <Star className="h-4 w-4 text-primary" />
                      Review This Class
                    </div>
                    <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                      <Select
                        value={reviewForms[enrollment.id]?.rating || "5"}
                        onValueChange={(rating) => setReviewForms((current) => ({
                          ...current,
                          [enrollment.id]: { rating, reviewText: current[enrollment.id]?.reviewText || "" },
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={String(rating)}>{rating} star{rating === 1 ? "" : "s"}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        className="min-h-[84px]"
                        value={reviewForms[enrollment.id]?.reviewText || ""}
                        onChange={(event) => setReviewForms((current) => ({
                          ...current,
                          [enrollment.id]: {
                            rating: current[enrollment.id]?.rating || "5",
                            reviewText: event.target.value,
                          },
                        }))}
                        placeholder="What helped your learner, and who would this class be good for?"
                      />
                    </div>
                    <Button
                      className="mt-3"
                      size="sm"
                      onClick={() => reviewMutation.mutate({
                        enrollmentId: enrollment.id,
                        rating: Number(reviewForms[enrollment.id]?.rating || "5"),
                        reviewText: reviewForms[enrollment.id]?.reviewText || "",
                      })}
                      disabled={reviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
