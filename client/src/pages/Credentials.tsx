import React from "react";
import { Award, CheckCircle2, ExternalLink, LockKeyhole } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CredentialDefinition {
  id: number;
  title: string;
  slug: string;
  description: string;
  criteriaSummary: string;
  disclaimer: string;
}

interface CredentialRequirement {
  id: number;
  title: string;
  description: string;
  requirementType: string;
  required: boolean;
}

interface CredentialDetail extends CredentialDefinition {
  requirements: CredentialRequirement[];
}

interface IssuedCredential {
  id: number;
  credentialId: number;
  status: string;
  issuedAt?: string;
  shareCode: string;
}

export default function Credentials() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: credentials = [], isLoading } = useQuery<CredentialDefinition[]>({
    queryKey: ["/api/credentials"],
  });

  const selectedCredential = credentials[0];

  const { data: credentialDetail } = useQuery<CredentialDetail | null>({
    queryKey: ["/api/credentials", selectedCredential?.slug],
    queryFn: async () => {
      if (!selectedCredential?.slug) return null;
      return apiRequest<CredentialDetail>(`/api/credentials/${selectedCredential.slug}`);
    },
    enabled: Boolean(selectedCredential?.slug),
  });

  const { data: issuedCredentials = [] } = useQuery<IssuedCredential[]>({
    queryKey: ["/api/users", user?.id, "credentials"],
    queryFn: async () => {
      if (!user?.id) return [];
      return apiRequest<IssuedCredential[]>(`/api/users/${user.id}/credentials`);
    },
    enabled: Boolean(user?.id),
  });

  const issueCredential = useMutation({
    mutationFn: async (credentialId: number) => {
      if (!user?.id) throw new Error("Please log in to issue credentials.");
      return apiRequest<IssuedCredential>(`/api/users/${user.id}/credentials/${credentialId}/issue`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "credentials"] });
      toast({
        title: "Credential issued",
        description: "Your credential is now saved to your record.",
      });
    },
    onError: (error) => {
      toast({
        title: "Credential not ready",
        description: error instanceof Error ? error.message : "Complete the required lessons first.",
        variant: "destructive",
      });
    },
  });

  const issuedCredentialIds = new Set(issuedCredentials.map((credential) => credential.credentialId));
  const credentialById = new Map(credentials.map((credential) => [credential.id, credential]));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
        <p className="text-muted-foreground mt-2">
          Earn transparent Real World Academy credentials by completing guided pathways and reviewable work.
        </p>
      </div>

      {!user && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-amber-700" />
              <p className="text-sm text-amber-900">Log in to save and issue credentials to your student record.</p>
            </div>
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">Loading credentials...</CardContent>
            </Card>
          ) : credentials.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">No credentials are available yet.</CardContent>
            </Card>
          ) : (
            credentials.map((credential) => {
              const isIssued = issuedCredentialIds.has(credential.id);
              return (
                <Card key={credential.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge className="mb-2">Pathway Credential</Badge>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          {credential.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{credential.description}</CardDescription>
                      </div>
                      {isIssued && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Issued
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Criteria</h3>
                      <p className="text-sm text-muted-foreground">{credential.criteriaSummary}</p>
                    </div>
                    {credentialDetail?.id === credential.id && (
                      <div>
                        <h3 className="font-medium mb-2">Requirements</h3>
                        <div className="space-y-2">
                          {credentialDetail.requirements.map((requirement) => (
                            <div key={requirement.id} className="rounded-md border p-3 text-sm">
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-medium">{requirement.title}</span>
                                <Badge variant={requirement.required ? "default" : "outline"}>
                                  {requirement.required ? "Required" : "Review"}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mt-1">{requirement.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{credential.disclaimer}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/learn/money-basics/budgeting-basics">
                        Continue Pathway
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      disabled={!user || isIssued || issueCredential.isPending}
                      onClick={() => issueCredential.mutate(credential.id)}
                    >
                      {isIssued ? "Credential Issued" : "Issue Credential"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Issued Credentials</CardTitle>
            <CardDescription>Credentials saved to this account.</CardDescription>
          </CardHeader>
          <CardContent>
            {issuedCredentials.length === 0 ? (
              <p className="text-sm text-muted-foreground">Complete pathway requirements to issue your first credential.</p>
            ) : (
              <div className="space-y-3">
                {issuedCredentials.map((credential) => (
                  <div key={credential.id} className="rounded-md border p-3">
                    <div className="font-medium">
                      {credentialById.get(credential.credentialId)?.title || `Credential #${credential.id}`}
                    </div>
                    <div className="text-sm text-muted-foreground">Status: {credential.status}</div>
                    {credential.issuedAt && (
                      <div className="text-sm text-muted-foreground">
                        Issued: {new Date(credential.issuedAt).toLocaleDateString()}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href={`/verify/${encodeURIComponent(credential.shareCode)}`}>
                        Verify
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
