import { Link } from "wouter";
import { CalendarClock, GraduationCap, Mail, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
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

export default function MyClasses() {
  const { user } = useAuth();
  const { data: enrollments = [], isLoading } = useQuery<OfferingEnrollment[]>({
    queryKey: ["/api/my-offering-enrollments"],
    queryFn: () => apiRequest<OfferingEnrollment[]>("/api/my-offering-enrollments"),
    enabled: Boolean(user?.id),
  });

  const activeEnrollments = enrollments.filter((item) => !["cancelled", "archived"].includes(item.status));
  const reservedCount = enrollments.filter((item) => item.status === "reserved").length;
  const requestedCount = enrollments.filter((item) => item.status === "requested").length;
  const waitlistedCount = enrollments.filter((item) => item.status === "waitlisted").length;

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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
