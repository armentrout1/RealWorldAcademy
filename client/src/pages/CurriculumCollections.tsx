import React, { useState } from "react";
import { Link } from "wouter";
import { BookMarked, ClipboardCheck, ListPlus, Plus, Send, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContributorProfileRecord {
  id: number;
  displayName: string;
  trustLevel: string;
  status: string;
}

interface CollectionItemForm {
  itemType: string;
  title: string;
  description: string;
  url: string;
  sourceLabel: string;
  duration: string;
  safetyNotes: string;
  parentPrompt: string;
  studentPrompt: string;
}

interface CurriculumCollectionRecord {
  id: number;
  title: string;
  subject: string;
  ageGroup: string;
  estimatedWeeks: number;
  status: string;
  reviewerNote?: string | null;
  submittedAt?: string | null;
  items?: CollectionItemForm[];
}

const emptyItem = (): CollectionItemForm => ({
  itemType: "video",
  title: "",
  description: "",
  url: "",
  sourceLabel: "",
  duration: "",
  safetyNotes: "",
  parentPrompt: "",
  studentPrompt: "",
});

const statusBadge = (status: string) => {
  const label = status.replace("_", " ");
  if (status === "approved" || status === "published") return <Badge className="bg-emerald-600">{label}</Badge>;
  if (status === "pending_review") return <Badge className="bg-amber-500">{label}</Badge>;
  if (status === "changes_requested" || status === "rejected") return <Badge variant="destructive">{label}</Badge>;
  return <Badge variant="secondary">{label}</Badge>;
};

const itemTypeOptions = [
  { value: "video", label: "Video" },
  { value: "lesson", label: "Lesson" },
  { value: "resource", label: "Resource" },
  { value: "activity", label: "Activity" },
  { value: "link", label: "Link" },
];

export default function CurriculumCollections() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    ageGroup: "",
    estimatedWeeks: "4",
    learningGoals: "",
    parentNotes: "",
    finalProject: "",
  });
  const [items, setItems] = useState<CollectionItemForm[]>([emptyItem()]);

  const { data: profile, isLoading: profileLoading } = useQuery<ContributorProfileRecord | null>({
    queryKey: ["/api/contributor-profiles/me"],
    queryFn: () => apiRequest<ContributorProfileRecord | null>("/api/contributor-profiles/me"),
    enabled: Boolean(user?.id),
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery<CurriculumCollectionRecord[]>({
    queryKey: ["/api/curriculum-collections/me"],
    queryFn: () => apiRequest<CurriculumCollectionRecord[]>("/api/curriculum-collections/me"),
    enabled: Boolean(profile?.id),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      ageGroup: "",
      estimatedWeeks: "4",
      learningGoals: "",
      parentNotes: "",
      finalProject: "",
    });
    setItems([emptyItem()]);
  };

  const createCollectionMutation = useMutation({
    mutationFn: () => apiRequest<CurriculumCollectionRecord>("/api/curriculum-collections", {
      method: "POST",
      body: {
        ...formData,
        estimatedWeeks: Number(formData.estimatedWeeks || 1),
        learningGoals: formData.learningGoals.split(",").map((goal) => goal.trim()).filter(Boolean),
        items,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-collections/me"] });
      resetForm();
      toast({ title: "Collection saved", description: "Your draft curriculum collection is ready in your workspace." });
    },
    onError: (error) => {
      toast({
        title: "Collection was not saved",
        description: error instanceof Error ? error.message : "Check the required fields and try again.",
        variant: "destructive",
      });
    },
  });

  const submitCollectionMutation = useMutation({
    mutationFn: (collectionId: number) => apiRequest<CurriculumCollectionRecord>(`/api/curriculum-collections/${collectionId}/submit`, {
      method: "PATCH",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/curriculum-collections/me"] });
      toast({ title: "Collection submitted", description: "It is now waiting for curriculum review." });
    },
    onError: (error) => {
      toast({
        title: "Collection was not submitted",
        description: error instanceof Error ? error.message : "Add at least one collection item first.",
        variant: "destructive",
      });
    },
  });

  const updateItem = (index: number, updates: Partial<CollectionItemForm>) => {
    setItems((current) => current.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (index: number) => {
    setItems((current) => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle>Sign In To Build Curriculum Collections</CardTitle>
            <CardDescription>Creator tools are connected to a contributor profile and review history.</CardDescription>
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
              <BookMarked className="h-5 w-5 text-primary" />
              Create Your Contributor Profile
            </CardTitle>
            <CardDescription>Collections need a creator profile before they can enter review.</CardDescription>
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
          <Badge className="mb-3">Version 3 Builder</Badge>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <BookMarked className="h-7 w-7 text-primary" />
            Curriculum Collections
          </h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Build a multi-week homeschool sequence with videos, lessons, activities, parent notes, and a final project.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/contributor-dashboard">Creator Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-primary" />
              Draft A Collection
            </CardTitle>
            <CardDescription>Save this as a draft first, then submit it for review from your collection list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Collection Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  placeholder="Real-world personal finance for middle school"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Family-Facing Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  rows={3}
                  placeholder="What will a family be able to do with this collection?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  placeholder="Financial Literacy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Input
                  id="ageGroup"
                  value={formData.ageGroup}
                  onChange={(event) => setFormData({ ...formData, ageGroup: event.target.value })}
                  placeholder="11-14"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedWeeks">Estimated Weeks</Label>
                <Input
                  id="estimatedWeeks"
                  type="number"
                  min="1"
                  value={formData.estimatedWeeks}
                  onChange={(event) => setFormData({ ...formData, estimatedWeeks: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="learningGoals">Learning Goals</Label>
                <Input
                  id="learningGoals"
                  value={formData.learningGoals}
                  onChange={(event) => setFormData({ ...formData, learningGoals: event.target.value })}
                  placeholder="Budgeting, saving, comparing choices"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parentNotes">Parent Notes</Label>
                <Textarea
                  id="parentNotes"
                  value={formData.parentNotes}
                  onChange={(event) => setFormData({ ...formData, parentNotes: event.target.value })}
                  rows={3}
                  placeholder="What should a parent know before using this collection?"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="finalProject">Final Project</Label>
                <Textarea
                  id="finalProject"
                  value={formData.finalProject}
                  onChange={(event) => setFormData({ ...formData, finalProject: event.target.value })}
                  rows={3}
                  placeholder="Describe the project students complete at the end."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Collection Items</h2>
                  <p className="text-sm text-muted-foreground">Add videos, activities, links, and lesson references in order.</p>
                </div>
                <Button type="button" variant="outline" onClick={() => setItems((current) => [...current, emptyItem()])}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="secondary">Item {index + 1}</Badge>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} disabled={items.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={item.itemType} onValueChange={(value) => updateItem(index, { itemType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose type" />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={item.title} onChange={(event) => updateItem(index, { title: event.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>URL</Label>
                      <Input value={item.url} onChange={(event) => updateItem(index, { url: event.target.value })} placeholder="https://youtube.com/..." />
                    </div>
                    {item.itemType === "video" && (
                      <>
                        <div className="space-y-2">
                          <Label>Source / Channel</Label>
                          <Input
                            value={item.sourceLabel}
                            onChange={(event) => updateItem(index, { sourceLabel: event.target.value })}
                            placeholder="CrashCourse, Khan Academy, local mentor..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={item.duration}
                            onChange={(event) => updateItem(index, { duration: event.target.value })}
                            placeholder="12 min"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Safety / Parent Notes For This Video</Label>
                          <Textarea
                            value={item.safetyNotes}
                            onChange={(event) => updateItem(index, { safetyNotes: event.target.value })}
                            rows={2}
                            placeholder="Why is this video appropriate, useful, and worth a parent's attention?"
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Parent Prompt</Label>
                      <Textarea value={item.parentPrompt} onChange={(event) => updateItem(index, { parentPrompt: event.target.value })} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Student Prompt</Label>
                      <Textarea value={item.studentPrompt} onChange={(event) => updateItem(index, { studentPrompt: event.target.value })} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => createCollectionMutation.mutate()} disabled={createCollectionMutation.isPending}>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              {createCollectionMutation.isPending ? "Saving..." : "Save Draft Collection"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Collections</CardTitle>
            <CardDescription>Drafts stay private until you submit them for review.</CardDescription>
          </CardHeader>
          <CardContent>
            {collectionsLoading ? (
              <p className="py-8 text-center text-muted-foreground">Loading collections...</p>
            ) : collections.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No collections yet. Save your first draft to start building a pathway.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div className="font-medium">{collection.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {collection.subject} | {collection.estimatedWeeks} weeks | {collection.items?.length || 0} items
                        </div>
                        {collection.reviewerNote && (
                          <div className="mt-2 text-xs text-destructive">{collection.reviewerNote}</div>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(collection.status)}</TableCell>
                      <TableCell className="text-right">
                        {["draft", "changes_requested"].includes(collection.status) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => submitCollectionMutation.mutate(collection.id)}
                            disabled={submitCollectionMutation.isPending}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Submit
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">In review</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
