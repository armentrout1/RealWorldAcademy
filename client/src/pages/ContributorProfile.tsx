import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { BadgeCheck, Save, UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContributorProfileRecord {
  id: number;
  userId: number;
  displayName: string;
  bio?: string | null;
  affiliation?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  expertiseTags?: string[] | null;
  trustLevel: string;
  status: string;
}

export default function ContributorProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    affiliation: "",
    website: "",
    avatarUrl: "",
    expertiseTags: "",
  });

  const { data: profile, isLoading } = useQuery<ContributorProfileRecord | null>({
    queryKey: ["/api/contributor-profiles/me"],
    queryFn: () => apiRequest<ContributorProfileRecord | null>("/api/contributor-profiles/me"),
    enabled: Boolean(user?.id),
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        affiliation: profile.affiliation || "",
        website: profile.website || "",
        avatarUrl: profile.avatarUrl || "",
        expertiseTags: (profile.expertiseTags || []).join(", "),
      });
    } else if (user && !isLoading) {
      setFormData((current) => ({
        ...current,
        displayName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      }));
    }
  }, [profile, user, isLoading]);

  const saveProfileMutation = useMutation({
    mutationFn: () => {
      const expertiseTags = formData.expertiseTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      return apiRequest<ContributorProfileRecord>("/api/contributor-profiles/me", {
        method: "PUT",
        body: {
          ...formData,
          expertiseTags,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributor-profiles/me"] });
      toast({
        title: "Contributor profile saved",
        description: "Your creator identity is ready for curriculum submissions.",
      });
    },
    onError: (error) => {
      toast({
        title: "Profile not saved",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Add the creator name families and admins should see.",
        variant: "destructive",
      });
      return;
    }

    saveProfileMutation.mutate();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To Create A Contributor Profile</CardTitle>
            <CardDescription>
              Creator identity connects your curriculum submissions to a real profile.
            </CardDescription>
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
          <Badge className="mb-3">Version 3 Creator Identity</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <UserRound className="h-7 w-7 text-primary" />
            Contributor Profile
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Build trust with families and admins by explaining who you are, what you know, and what kind of learning you want to contribute.
          </p>
        </div>
        {profile && (
          <Badge variant="secondary" className="w-fit gap-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            {profile.trustLevel}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Creator Details</CardTitle>
            <CardDescription>This information helps reviewers and families understand the person behind the curriculum.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(event) => setFormData((current) => ({ ...current, displayName: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="affiliation">Affiliation</Label>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={(event) => setFormData((current) => ({ ...current, affiliation: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(event) => setFormData((current) => ({ ...current, website: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={(event) => setFormData((current) => ({ ...current, avatarUrl: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertiseTags">Expertise Tags</Label>
                <Input
                  id="expertiseTags"
                  value={formData.expertiseTags}
                  onChange={(event) => setFormData((current) => ({ ...current, expertiseTags: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas, like finance, homeschool, career prep.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  className="min-h-[180px]"
                  value={formData.bio}
                  onChange={(event) => setFormData((current) => ({ ...current, bio: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                />
              </div>

              <Button type="submit" disabled={saveProfileMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveProfileMutation.isPending ? "Saving..." : "Save Contributor Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creator Checkpoint</CardTitle>
            <CardDescription>What this unlocks in Version 3.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Contributor profiles make curriculum submissions accountable and easier to review.</p>
            <p>Next, submissions can be linked directly to this profile so published lessons can show creator attribution.</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contribute">Contribute A Lesson</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
