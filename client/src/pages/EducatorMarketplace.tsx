import React from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ExternalLink, GraduationCap, Mail, Search, ShieldCheck, Video } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  sampleUrl?: string | null;
  parentExpectations?: string | null;
  completionEvidence?: string | null;
  status: string;
  approvedSessions?: OfferingSession[];
  eligibleCredentials?: Array<{
    id: number;
    title: string;
    slug: string;
    disclaimer: string;
  }>;
}

interface OfferingSession {
  id: number;
  title: string;
  startsAt?: string | null;
  endsAt?: string | null;
  duration?: string | null;
  capacity?: number | null;
  reservedSeats: number;
  locationNote?: string | null;
  registrationNote?: string | null;
}

interface EducatorProfile {
  id: number;
  displayName: string;
  bio?: string | null;
  affiliation?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  expertiseTags?: string[] | null;
  teachingStyle?: string | null;
  subjectsTaught?: string[] | null;
  ageGroupsServed?: string[] | null;
  introVideoUrl?: string | null;
  sampleLessonUrls?: string[] | null;
  availabilitySummary?: string | null;
  timeZone?: string | null;
  offeringTypes?: string[] | null;
  trustLevel: string;
  approvedOfferings?: EducatorOffering[];
}

const getEducatorIdFromPath = (path: string) => {
  const match = path.match(/^\/educators\/(\d+)/);
  return match ? Number(match[1]) : null;
};

const formatOfferingType = (value: string) => value.replace(/_/g, " ");

const formatPrice = (offering: EducatorOffering) => {
  if (!offering.priceCents) return "Free/TBD";
  return `$${(offering.priceCents / 100).toFixed(2)}`;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

function EducatorDetail({ educatorId }: { educatorId: number }) {
  const { toast } = useToast();
  const [selectedOfferingId, setSelectedOfferingId] = React.useState<number | null>(null);
  const [selectedSessionId, setSelectedSessionId] = React.useState<number | null>(null);
  const [interestForm, setInterestForm] = React.useState({
    requesterName: "",
    requesterEmail: "",
    learnerAgeGroup: "",
    learnerCount: "1",
    message: "",
  });

  const { data: educator, isLoading } = useQuery<EducatorProfile>({
    queryKey: [`/api/educators/${educatorId}`],
    queryFn: () => apiRequest<EducatorProfile>(`/api/educators/${educatorId}`),
  });

  const interestMutation = useMutation({
    mutationFn: (educatorOfferingId: number) => apiRequest("/api/offering-interests", {
      method: "POST",
      body: {
        educatorOfferingId,
        offeringSessionId: selectedSessionId,
        ...interestForm,
      },
    }),
    onSuccess: () => {
      setSelectedOfferingId(null);
      setSelectedSessionId(null);
      setInterestForm({ requesterName: "", requesterEmail: "", learnerAgeGroup: "", learnerCount: "1", message: "" });
      toast({
        title: "Request sent",
        description: "The educator can now follow up from their Real World Academy dashboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Request not sent",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <p className="py-12 text-center text-muted-foreground">Loading educator...</p>;
  }

  if (!educator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Educator Not Available</CardTitle>
          <CardDescription>This profile may still be in review.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/educators">Back To Educators</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/educators">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back To Educators
        </Link>
      </Button>

      <section className="rounded-md border bg-white p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10">
              {educator.avatarUrl ? (
                <img src={educator.avatarUrl} alt={educator.displayName} className="h-full w-full object-cover" />
              ) : (
                <GraduationCap className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <Badge className="mb-2">{educator.trustLevel} educator</Badge>
              <h1 className="text-3xl font-bold tracking-tight">{educator.displayName}</h1>
              {educator.affiliation && <p className="mt-1 text-muted-foreground">{educator.affiliation}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {(educator.subjectsTaught || []).map((subject) => (
                  <Badge key={subject} variant="secondary">{subject}</Badge>
                ))}
                {(educator.ageGroupsServed || []).map((ageGroup) => (
                  <Badge key={ageGroup} variant="outline">{ageGroup}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {educator.website && (
              <Button variant="outline" asChild>
                <a href={educator.website} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
            {educator.introVideoUrl && (
              <Button asChild>
                <a href={educator.introVideoUrl} target="_blank" rel="noreferrer">
                  <Video className="mr-2 h-4 w-4" />
                  Intro Video
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
              {educator.bio && <p>{educator.bio}</p>}
              {educator.teachingStyle && <p>{educator.teachingStyle}</p>}
              {!educator.bio && !educator.teachingStyle && <p>This educator has not added a teaching style yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Offerings</CardTitle>
              <CardDescription>Free samples and reviewed class/service listings. Paid checkout is not enabled yet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {educator.approvedOfferings?.length ? educator.approvedOfferings.map((offering) => (
                <div key={offering.id} className="rounded-md border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge>{formatOfferingType(offering.offeringType)}</Badge>
                        <Badge variant="outline">{offering.format.replace(/_/g, " ")}</Badge>
                        <Badge variant="secondary">{formatPrice(offering)}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold">{offering.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{offering.description}</p>
                    </div>
                    {offering.sampleUrl && (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                          <a href={offering.sampleUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Sample
                          </a>
                        </Button>
                        <Button onClick={() => {
                          setSelectedOfferingId(offering.id);
                          setSelectedSessionId(null);
                        }}>
                          <Mail className="mr-2 h-4 w-4" />
                          Request Info
                        </Button>
                      </div>
                    )}
                    {!offering.sampleUrl && (
                      <Button onClick={() => {
                        setSelectedOfferingId(offering.id);
                        setSelectedSessionId(null);
                      }}>
                        <Mail className="mr-2 h-4 w-4" />
                        Request Info
                      </Button>
                    )}
                  </div>
                  {(offering.parentExpectations || offering.completionEvidence) && (
                    <>
                      <Separator className="my-4" />
                      <div className="grid gap-3 text-sm md:grid-cols-2">
                        {offering.parentExpectations && (
                          <p><span className="font-medium">Parent expectations:</span> {offering.parentExpectations}</p>
                        )}
                        {offering.completionEvidence && (
                          <p><span className="font-medium">Completion evidence:</span> {offering.completionEvidence}</p>
                        )}
                      </div>
                    </>
                  )}
                  {offering.eligibleCredentials?.length ? (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h4 className="font-medium">Credential Support</h4>
                        <div className="flex flex-wrap gap-2">
                          {offering.eligibleCredentials.map((credential) => (
                            <Badge key={credential.id} variant="secondary">
                              Supports {credential.title}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Completion can support Real World Academy completion credentials, not accredited school credit.
                        </p>
                      </div>
                    </>
                  ) : null}
                  {offering.approvedSessions?.length ? (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <h4 className="font-medium">Upcoming Sessions</h4>
                        {offering.approvedSessions.map((session) => (
                          <div key={session.id} className="rounded-md border bg-slate-50 p-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="font-medium">{session.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(session.startsAt)}{session.duration ? ` | ${session.duration}` : ""}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {session.capacity
                                    ? `${Math.max(session.capacity - session.reservedSeats, 0)} of ${session.capacity} seats open`
                                    : "Seat count managed by educator"}
                                </div>
                                {session.registrationNote && (
                                  <p className="mt-2 text-sm text-muted-foreground">{session.registrationNote}</p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedOfferingId(offering.id);
                                  setSelectedSessionId(session.id);
                                  setInterestForm((current) => ({
                                    ...current,
                                    message: current.message || `I am interested in ${session.title}.`,
                                  }));
                                }}
                              >
                                Request Seat
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {selectedOfferingId === offering.id && (
                    <div className="mt-4 rounded-md border bg-slate-50 p-4">
                      {selectedSessionId && (
                        <Badge className="mb-3" variant="secondary">
                          Requesting a seat for {offering.approvedSessions?.find((session) => session.id === selectedSessionId)?.title || "selected session"}
                        </Badge>
                      )}
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`requesterName-${offering.id}`}>Your Name</Label>
                          <Input
                            id={`requesterName-${offering.id}`}
                            value={interestForm.requesterName}
                            onChange={(event) => setInterestForm((current) => ({ ...current, requesterName: event.target.value }))}
                            placeholder="Parent or learner name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`requesterEmail-${offering.id}`}>Email</Label>
                          <Input
                            id={`requesterEmail-${offering.id}`}
                            type="email"
                            value={interestForm.requesterEmail}
                            onChange={(event) => setInterestForm((current) => ({ ...current, requesterEmail: event.target.value }))}
                            placeholder="you@example.com"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`learnerAge-${offering.id}`}>Learner Age Group</Label>
                          <Input
                            id={`learnerAge-${offering.id}`}
                            value={interestForm.learnerAgeGroup}
                            onChange={(event) => setInterestForm((current) => ({ ...current, learnerAgeGroup: event.target.value }))}
                            placeholder="Example: 10-12, teen, adult"
                          />
                        </div>
                        {selectedSessionId && (
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`learnerCount-${offering.id}`}>Learners</Label>
                            <Input
                              id={`learnerCount-${offering.id}`}
                              type="number"
                              min="1"
                              value={interestForm.learnerCount}
                              onChange={(event) => setInterestForm((current) => ({ ...current, learnerCount: event.target.value }))}
                            />
                          </div>
                        )}
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`requestMessage-${offering.id}`}>Message</Label>
                          <Textarea
                            id={`requestMessage-${offering.id}`}
                            className="min-h-[90px]"
                            value={interestForm.message}
                            onChange={(event) => setInterestForm((current) => ({ ...current, message: event.target.value }))}
                            placeholder="Share what you are hoping to learn, timing needs, or questions."
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          onClick={() => interestMutation.mutate(offering.id)}
                          disabled={interestMutation.isPending}
                        >
                          Send Request
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedOfferingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No approved offerings yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marketplace Trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Approved offerings are reviewed before discovery.
              </p>
              <p>Real World Academy is not an accredited school, and paid checkout is not enabled yet.</p>
            </CardContent>
          </Card>

          {educator.availabilitySummary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{educator.availabilitySummary}</p>
                {educator.timeZone && <p className="mt-2 text-xs text-muted-foreground">{educator.timeZone}</p>}
              </CardContent>
            </Card>
          )}

          {educator.sampleLessonUrls?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Lessons</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {educator.sampleLessonUrls.map((url, index) => (
                  <Button key={url} variant="outline" asChild>
                    <a href={url} target="_blank" rel="noreferrer">Sample {index + 1}</a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default function EducatorMarketplace() {
  const [location] = useLocation();
  const educatorId = getEducatorIdFromPath(location);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [ageFilter, setAgeFilter] = React.useState("all");
  const [formatFilter, setFormatFilter] = React.useState("all");

  const { data: educators = [], isLoading } = useQuery<EducatorProfile[]>({
    queryKey: ["/api/educators"],
    queryFn: () => apiRequest<EducatorProfile[]>("/api/educators"),
  });

  if (educatorId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EducatorDetail educatorId={educatorId} />
      </div>
    );
  }

  const subjects = Array.from(new Set(educators.flatMap((educator) => educator.subjectsTaught || []))).sort();
  const ageGroups = Array.from(new Set(educators.flatMap((educator) => educator.ageGroupsServed || []))).sort();
  const formats = Array.from(new Set(educators.flatMap((educator) => educator.offeringTypes || []))).sort();

  const filteredEducators = educators.filter((educator) => {
    const haystack = [
      educator.displayName,
      educator.bio,
      educator.affiliation,
      educator.teachingStyle,
      ...(educator.subjectsTaught || []),
      ...(educator.ageGroupsServed || []),
      ...(educator.offeringTypes || []),
    ].join(" ").toLowerCase();

    const matchesSearch = haystack.includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || educator.subjectsTaught?.includes(subjectFilter);
    const matchesAge = ageFilter === "all" || educator.ageGroupsServed?.includes(ageFilter);
    const matchesFormat = formatFilter === "all" || educator.offeringTypes?.includes(formatFilter);

    return matchesSearch && matchesSubject && matchesAge && matchesFormat;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-3">Educator Marketplace Preview</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Find Educators and Teacher-Creators</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Browse approved educator profiles, free samples, and reviewed offerings. Paid checkout comes later;
          this surface is the trust and discovery layer first.
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_180px]">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search educators, subjects, teaching styles..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            {ageGroups.map((ageGroup) => <SelectItem key={ageGroup} value={ageGroup}>{ageGroup}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            {formats.map((format) => <SelectItem key={format} value={format}>{format.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="py-12 text-center text-muted-foreground">Loading educators...</p>
      ) : filteredEducators.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Educators Yet</CardTitle>
            <CardDescription>Approved educator profiles and offerings will appear here as the marketplace grows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/contributor-profile">Create Educator Profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEducators.map((educator) => (
            <Card key={educator.id} className="flex h-full flex-col">
              <CardHeader>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10">
                      {educator.avatarUrl ? (
                        <img src={educator.avatarUrl} alt={educator.displayName} className="h-full w-full object-cover" />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{educator.displayName}</CardTitle>
                      <CardDescription>{educator.affiliation || `${educator.trustLevel} educator`}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{educator.approvedOfferings?.length || 0} offers</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(educator.subjectsTaught || []).slice(0, 3).map((subject) => (
                    <Badge key={subject}>{subject}</Badge>
                  ))}
                  {(educator.ageGroupsServed || []).slice(0, 2).map((ageGroup) => (
                    <Badge key={ageGroup} variant="outline">{ageGroup}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {educator.teachingStyle || educator.bio || "This educator is preparing their marketplace profile."}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href={`/educators/${educator.id}`}>View Profile</Link>
                  </Button>
                  {educator.introVideoUrl && (
                    <Button variant="outline" asChild>
                      <a href={educator.introVideoUrl} target="_blank" rel="noreferrer">Intro</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
