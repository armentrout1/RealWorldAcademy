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
  teachingStyle?: string | null;
  subjectsTaught?: string[] | null;
  ageGroupsServed?: string[] | null;
  introVideoUrl?: string | null;
  sampleLessonUrls?: string[] | null;
  availabilitySummary?: string | null;
  timeZone?: string | null;
  offeringTypes?: string[] | null;
  trustLevel: string;
  status: string;
}

const splitList = (value: string) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

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
    teachingStyle: "",
    subjectsTaught: "",
    ageGroupsServed: "",
    introVideoUrl: "",
    sampleLessonUrls: "",
    availabilitySummary: "",
    timeZone: "",
    offeringTypes: "",
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
        teachingStyle: profile.teachingStyle || "",
        subjectsTaught: (profile.subjectsTaught || []).join(", "),
        ageGroupsServed: (profile.ageGroupsServed || []).join(", "),
        introVideoUrl: profile.introVideoUrl || "",
        sampleLessonUrls: (profile.sampleLessonUrls || []).join(", "),
        availabilitySummary: profile.availabilitySummary || "",
        timeZone: profile.timeZone || "",
        offeringTypes: (profile.offeringTypes || []).join(", "),
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
      return apiRequest<ContributorProfileRecord>("/api/contributor-profiles/me", {
        method: "PUT",
        body: {
          ...formData,
          expertiseTags: splitList(formData.expertiseTags),
          subjectsTaught: splitList(formData.subjectsTaught),
          ageGroupsServed: splitList(formData.ageGroupsServed),
          sampleLessonUrls: splitList(formData.sampleLessonUrls),
          offeringTypes: splitList(formData.offeringTypes),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contributor-profiles/me"] });
      toast({
        title: "Contributor profile saved",
        description: "Your educator identity is ready for curriculum, resources, and future offerings.",
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
            Educator Profile
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Build trust with families and admins by explaining who you are, how you teach, and what kind of learning you want to offer.
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
            <CardTitle>Educator Details</CardTitle>
            <CardDescription>This information helps reviewers and families understand the person behind the lessons, classes, and curriculum.</CardDescription>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subjectsTaught">Subjects Taught</Label>
                  <Input
                    id="subjectsTaught"
                    value={formData.subjectsTaught}
                    onChange={(event) => setFormData((current) => ({ ...current, subjectsTaught: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                    placeholder="math, cooking, finance, reading"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ageGroupsServed">Age Groups Served</Label>
                  <Input
                    id="ageGroupsServed"
                    value={formData.ageGroupsServed}
                    onChange={(event) => setFormData((current) => ({ ...current, ageGroupsServed: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                    placeholder="9-12, 13-15, 16-18, adults"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="introVideoUrl">Intro Video URL</Label>
                  <Input
                    id="introVideoUrl"
                    value={formData.introVideoUrl}
                    onChange={(event) => setFormData((current) => ({ ...current, introVideoUrl: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Input
                    id="timeZone"
                    value={formData.timeZone}
                    onChange={(event) => setFormData((current) => ({ ...current, timeZone: event.target.value }))}
                    disabled={saveProfileMutation.isPending}
                    placeholder="Central Time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offeringTypes">Future Offering Types</Label>
                <Input
                  id="offeringTypes"
                  value={formData.offeringTypes}
                  onChange={(event) => setFormData((current) => ({ ...current, offeringTypes: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                  placeholder="free sample, live class, recorded course, tutoring, coaching, curriculum bundle"
                />
                <p className="text-xs text-muted-foreground">Separate options with commas. Payments are not enabled yet.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleLessonUrls">Sample Lesson URLs</Label>
                <Input
                  id="sampleLessonUrls"
                  value={formData.sampleLessonUrls}
                  onChange={(event) => setFormData((current) => ({ ...current, sampleLessonUrls: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                  placeholder="https://..., https://..."
                />
                <p className="text-xs text-muted-foreground">Add public samples that show your teaching style.</p>
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

              <div className="space-y-2">
                <Label htmlFor="teachingStyle">Teaching Style</Label>
                <Textarea
                  id="teachingStyle"
                  className="min-h-[120px]"
                  value={formData.teachingStyle}
                  onChange={(event) => setFormData((current) => ({ ...current, teachingStyle: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                  placeholder="How do you help learners move from point A to point B?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availabilitySummary">Availability Summary</Label>
                <Textarea
                  id="availabilitySummary"
                  className="min-h-[90px]"
                  value={formData.availabilitySummary}
                  onChange={(event) => setFormData((current) => ({ ...current, availabilitySummary: event.target.value }))}
                  disabled={saveProfileMutation.isPending}
                  placeholder="Example: Weekday evenings, Saturday workshops, or recorded content only."
                />
              </div>

              <Button type="submit" disabled={saveProfileMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveProfileMutation.isPending ? "Saving..." : "Save Educator Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Educator Marketplace Checkpoint</CardTitle>
            <CardDescription>What this unlocks in Version 4.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Educator profiles make curriculum, resources, and future classes accountable and easier to review.</p>
            <p>Next, offerings can attach to this profile so families can browse free samples, live classes, tutoring, and curriculum bundles.</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/contribute">Contribute A Lesson</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
