import React, { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ExternalLink, Send, Video } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContributorProfileRecord {
  id: number;
  displayName: string;
  affiliation?: string | null;
  trustLevel: string;
}

const audienceOptions = ["student", "parent", "teacher"];
const resourceTypes = ["video", "link", "pdf", "worksheet", "guide", "activity"];

export default function ContributeResource() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    resourceType: "video",
    category: "",
    audience: ["student", "parent"],
    ageGroup: "",
    url: "",
    sourceLabel: "",
    duration: "",
    learningUse: "",
    safetyNotes: "",
    thumbnailUrl: "",
  });

  const { data: profile, isLoading: profileLoading } = useQuery<ContributorProfileRecord | null>({
    queryKey: ["/api/contributor-profiles/me"],
    queryFn: () => apiRequest<ContributorProfileRecord | null>("/api/contributor-profiles/me"),
    enabled: Boolean(user?.id),
  });

  const submitResourceMutation = useMutation({
    mutationFn: () => apiRequest("/api/resource-submissions", {
      method: "POST",
      body: formData,
    }),
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Resource submitted", description: "Your resource is waiting for review." });
    },
    onError: (error) => {
      toast({
        title: "Resource was not submitted",
        description: error instanceof Error ? error.message : "Check required fields and try again.",
        variant: "destructive",
      });
    },
  });

  const toggleAudience = (audience: string) => {
    setFormData((current) => ({
      ...current,
      audience: current.audience.includes(audience)
        ? current.audience.filter((item) => item !== audience)
        : [...current.audience, audience],
    }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To Contribute A Resource</CardTitle>
            <CardDescription>Resource submissions are connected to creator profiles and review history.</CardDescription>
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
            <CardTitle>Create Your Contributor Profile</CardTitle>
            <CardDescription>Resources need a creator profile before they can enter review.</CardDescription>
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

  if (submitted) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              Resource Submitted
            </CardTitle>
            <CardDescription>Admins will review the resource before it appears publicly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/contribute-resource">Submit Another Resource</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contributor-dashboard">Creator Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-3">Resource Curation</Badge>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <Video className="h-7 w-7 text-primary" />
          Contribute A Resource
        </h1>
        <p className="mt-2 text-muted-foreground">
          Submit videos, links, guides, worksheets, or activities that can support reviewed homeschool learning.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Give reviewers enough context to judge usefulness, safety, and age fit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <Select value={formData.resourceType} onValueChange={(value) => setFormData({ ...formData, resourceType: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} placeholder="financial-literacy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Age Group</Label>
              <Input id="ageGroup" value={formData.ageGroup} onChange={(event) => setFormData({ ...formData, ageGroup: event.target.value })} placeholder="11-14" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceLabel">Source / Channel</Label>
              <Input id="sourceLabel" value={formData.sourceLabel} onChange={(event) => setFormData({ ...formData, sourceLabel: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="url">Resource URL</Label>
              <Input id="url" value={formData.url} onChange={(event) => setFormData({ ...formData, url: event.target.value })} placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" value={formData.duration} onChange={(event) => setFormData({ ...formData, duration: event.target.value })} placeholder="12 min" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input id="thumbnailUrl" value={formData.thumbnailUrl} onChange={(event) => setFormData({ ...formData, thumbnailUrl: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Audience</Label>
              <div className="flex flex-wrap gap-4 rounded-md border p-3">
                {audienceOptions.map((audience) => (
                  <label key={audience} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={formData.audience.includes(audience)} onCheckedChange={() => toggleAudience(audience)} />
                    {audience}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="learningUse">How This Supports Learning</Label>
              <Textarea id="learningUse" rows={3} value={formData.learningUse} onChange={(event) => setFormData({ ...formData, learningUse: event.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="safetyNotes">Safety / Parent Review Notes</Label>
              <Textarea id="safetyNotes" rows={3} value={formData.safetyNotes} onChange={(event) => setFormData({ ...formData, safetyNotes: event.target.value })} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => submitResourceMutation.mutate()} disabled={submitResourceMutation.isPending}>
              <Send className="mr-2 h-4 w-4" />
              {submitResourceMutation.isPending ? "Submitting..." : "Submit For Review"}
            </Button>
            {formData.url && (
              <Button variant="outline" asChild>
                <a href={formData.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview URL
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
