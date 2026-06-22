import React from "react";
import { Award, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";

interface CredentialVerificationRecord {
  shareCode: string;
  status: string;
  issuedAt?: string | null;
  reviewNote?: string | null;
  learner: {
    fullName: string;
  };
  credential: {
    title: string;
    description: string;
    criteriaSummary: string;
    disclaimer: string;
  };
}

export default function CredentialVerification() {
  const [location] = useLocation();
  const shareCode = decodeURIComponent(location.replace(/^\/verify\//, "")).trim();

  const { data: verification, isLoading, error } = useQuery<CredentialVerificationRecord>({
    queryKey: ["/api/credential-verifications", shareCode],
    queryFn: () => apiRequest<CredentialVerificationRecord>(`/api/credential-verifications/${encodeURIComponent(shareCode)}`),
    enabled: Boolean(shareCode),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Verifying credential...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-950">Credential Not Found</CardTitle>
            <CardDescription className="text-amber-800">
              This verification link does not match an issued Real World Academy credential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/credentials">View Credentials</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge className="mb-3 gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Credential
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{verification.credential.title}</h1>
          <p className="mt-2 text-muted-foreground">
            Public verification for a Real World Academy completion credential.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {verification.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            {verification.learner.fullName}
          </CardTitle>
          <CardDescription>{verification.credential.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Issued</div>
              <div className="mt-1 font-medium">
                {verification.issuedAt ? new Date(verification.issuedAt).toLocaleDateString() : "Issue date unavailable"}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Verification Code</div>
              <div className="mt-1 break-all font-mono text-sm">{verification.shareCode}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">Criteria</div>
            <p className="mt-2 text-sm leading-6">{verification.credential.criteriaSummary}</p>
          </div>

          {verification.reviewNote && (
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Review Note</div>
              <p className="mt-2 text-sm leading-6">{verification.reviewNote}</p>
            </div>
          )}

          <div className="rounded-md border bg-slate-50 p-4 text-sm text-muted-foreground">
            {verification.credential.disclaimer}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
