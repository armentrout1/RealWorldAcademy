import React from "react";
import { Award, BookOpen, CheckCircle2, ExternalLink, FileText, LockKeyhole } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface CredentialDefinition {
  id: number;
  title: string;
  description: string;
  disclaimer: string;
}

interface IssuedCredential {
  id: number;
  credentialId: number;
  status: string;
  issuedAt?: string | null;
  shareCode: string;
}

interface LessonProgressRecord {
  id: number;
  lessonId: number;
  status: string;
  reflectionResponse?: string | null;
  notes?: string | null;
  completedAt?: string | null;
}

interface LessonRecord {
  id: number;
  title: string;
  subtitle?: string | null;
}

interface LessonProgressWithLesson {
  progress: LessonProgressRecord;
  lesson?: LessonRecord | null;
}

export default function Portfolio() {
  const { user } = useAuth();

  const { data: credentialDefinitions = [] } = useQuery<CredentialDefinition[]>({
    queryKey: ["/api/credentials"],
  });

  const { data: issuedCredentials = [] } = useQuery<IssuedCredential[]>({
    queryKey: ["/api/users", user?.id, "credentials"],
    queryFn: () => apiRequest<IssuedCredential[]>(`/api/users/${user!.id}/credentials`),
    enabled: Boolean(user?.id),
  });

  const { data: lessonProgress = [] } = useQuery<LessonProgressWithLesson[]>({
    queryKey: ["/api/users", user?.id, "lesson-progress"],
    queryFn: () => apiRequest<LessonProgressWithLesson[]>(`/api/users/${user!.id}/lesson-progress`),
    enabled: Boolean(user?.id),
  });

  const completedLessons = lessonProgress.filter((item) => item.progress.status === "completed");
  const credentialById = new Map(credentialDefinitions.map((credential) => [credential.id, credential]));

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-1 h-5 w-5 text-amber-700" />
              <div>
                <h1 className="text-xl font-semibold text-amber-950">Sign in to view your portfolio</h1>
                <p className="text-sm text-amber-800">
                  Your transcript is built from completed lessons and issued Real World Academy credentials.
                </p>
              </div>
            </div>
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
          <Badge className="mb-3">Student Record</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio & Transcript</h1>
          <p className="mt-2 text-muted-foreground">
            A private record of completed lessons, reflections, and transparent non-accredited credentials.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/credentials">Manage Credentials</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Issued Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{issuedCredentials.length}</div>
            <p className="text-sm text-muted-foreground">Saved to this account</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedLessons.length}</div>
            <p className="text-sm text-muted-foreground">Across active pathways</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transcript Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Private</div>
            <p className="text-sm text-muted-foreground">Share controls can come later</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Completed Learning
            </CardTitle>
            <CardDescription>Lesson work that can support credentials and homeschool records.</CardDescription>
          </CardHeader>
          <CardContent>
            {completedLessons.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Completed lessons will appear here after the student finishes pathway work.
              </div>
            ) : (
              <div className="space-y-4">
                {completedLessons.map(({ progress, lesson }) => (
                  <div key={progress.id} className="rounded-md border p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-semibold">{lesson?.title || `Lesson ${progress.lessonId}`}</div>
                        {lesson?.subtitle && (
                          <div className="text-sm text-muted-foreground">{lesson.subtitle}</div>
                        )}
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete
                      </Badge>
                    </div>
                    {(progress.reflectionResponse || progress.notes) && (
                      <>
                        <Separator className="my-3" />
                        <div className="grid gap-3 md:grid-cols-2">
                          {progress.reflectionResponse && (
                            <div>
                              <div className="text-xs font-medium uppercase text-muted-foreground">Reflection</div>
                              <p className="mt-1 text-sm">{progress.reflectionResponse}</p>
                            </div>
                          )}
                          {progress.notes && (
                            <div>
                              <div className="text-xs font-medium uppercase text-muted-foreground">Notes</div>
                              <p className="mt-1 text-sm">{progress.notes}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Credential Record
            </CardTitle>
            <CardDescription>Transparent credentials issued by Real World Academy.</CardDescription>
          </CardHeader>
          <CardContent>
            {issuedCredentials.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Earned credentials will appear here after requirements are complete.
              </div>
            ) : (
              <div className="space-y-3">
                {issuedCredentials.map((issuedCredential) => {
                  const definition = credentialById.get(issuedCredential.credentialId);

                  return (
                    <div key={issuedCredential.id} className="rounded-md border p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-1 h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold">{definition?.title || `Credential ${issuedCredential.id}`}</div>
                          <div className="text-sm text-muted-foreground">Status: {issuedCredential.status}</div>
                          {issuedCredential.issuedAt && (
                            <div className="text-sm text-muted-foreground">
                              Issued: {new Date(issuedCredential.issuedAt).toLocaleDateString()}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-muted-foreground">Share code: {issuedCredential.shareCode}</div>
                          <Button variant="outline" size="sm" className="mt-3" asChild>
                            <Link href={`/verify/${encodeURIComponent(issuedCredential.shareCode)}`}>
                              Verify Public Record
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
