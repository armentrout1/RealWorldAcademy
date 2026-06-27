import React from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, BookMarked, CheckCircle2, Circle, ExternalLink, PlayCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CollectionItem {
  id: number;
  itemType: string;
  title: string;
  description?: string | null;
  url?: string | null;
  order: number;
  parentPrompt?: string | null;
  studentPrompt?: string | null;
}

interface CurriculumCollection {
  id: number;
  title: string;
  description: string;
  subject: string;
  ageGroup: string;
  estimatedWeeks: number;
  learningGoals?: string[] | null;
  parentNotes?: string | null;
  finalProject?: string | null;
  contributorProfile?: {
    displayName: string;
    affiliation?: string | null;
    trustLevel: string;
  } | null;
  items?: CollectionItem[];
}

interface CollectionProgress {
  id: number;
  collectionId: number;
  status: string;
  currentItemId?: number | null;
  completedItemIds?: number[] | null;
  percentComplete: number;
  startedAt?: string | null;
  completedAt?: string | null;
}

const getCollectionIdFromPath = (path: string) => {
  const match = path.match(/^\/collections\/(\d+)/);
  return match ? Number(match[1]) : null;
};

function CollectionDetail({ collectionId }: { collectionId: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: collection, isLoading } = useQuery<CurriculumCollection>({
    queryKey: [`/api/curriculum-collections/${collectionId}`],
    queryFn: () => apiRequest<CurriculumCollection>(`/api/curriculum-collections/${collectionId}`),
  });

  const { data: progress } = useQuery<CollectionProgress | null>({
    queryKey: [`/api/curriculum-collections/${collectionId}/progress`],
    queryFn: () => apiRequest<CollectionProgress | null>(`/api/curriculum-collections/${collectionId}/progress`),
    enabled: Boolean(user?.id),
  });

  const startCollectionMutation = useMutation({
    mutationFn: () => apiRequest<CollectionProgress>(`/api/curriculum-collections/${collectionId}/start`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/curriculum-collections/${collectionId}/progress`] });
      toast({ title: "Collection started", description: "Your progress is now being tracked." });
    },
    onError: (error) => {
      toast({
        title: "Could not start collection",
        description: error instanceof Error ? error.message : "Please sign in and try again.",
        variant: "destructive",
      });
    },
  });

  const completeItemMutation = useMutation({
    mutationFn: (itemId: number) => apiRequest<CollectionProgress>(`/api/curriculum-collections/${collectionId}/progress`, {
      method: "PATCH",
      body: { itemId },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/curriculum-collections/${collectionId}/progress`] });
      toast({ title: "Step marked complete", description: "Collection progress has been updated." });
    },
    onError: (error) => {
      toast({
        title: "Progress was not updated",
        description: error instanceof Error ? error.message : "Please start the collection first.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <p className="py-12 text-center text-muted-foreground">Loading collection...</p>;
  }

  if (!collection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collection Not Available</CardTitle>
          <CardDescription>This collection may still be in review.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/collections">Back To Collections</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completedItemIds = progress?.completedItemIds || [];
  const hasStarted = Boolean(progress);
  const isCompleted = progress?.status === "completed";

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/collections">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back To Collections
        </Link>
      </Button>

      <div className="rounded-md border bg-white p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge>{collection.subject}</Badge>
          <Badge variant="outline">{collection.ageGroup}</Badge>
          <Badge variant="secondary">{collection.estimatedWeeks} weeks</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{collection.title}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{collection.description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Curated by {collection.contributorProfile?.displayName || "Real World Academy contributor"}
          {collection.contributorProfile?.affiliation ? `, ${collection.contributorProfile.affiliation}` : ""}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {user ? (
            <Button
              onClick={() => startCollectionMutation.mutate()}
              disabled={startCollectionMutation.isPending || hasStarted}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {hasStarted ? isCompleted ? "Collection Completed" : "Collection Started" : "Start Collection"}
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Log In To Track Progress</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {(collection.items || []).map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Step {item.order}</Badge>
                  <Badge variant="secondary">{item.itemType}</Badge>
                </div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
                {item.description && <CardDescription>{item.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-3">
                {item.url && (
                  <Button variant="outline" asChild>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Resource
                    </a>
                  </Button>
                )}
                {item.parentPrompt && (
                  <p className="text-sm"><span className="font-medium">Parent prompt:</span> {item.parentPrompt}</p>
                )}
                {item.studentPrompt && (
                  <p className="text-sm"><span className="font-medium">Student prompt:</span> {item.studentPrompt}</p>
                )}
                {user && hasStarted && (
                  <Button
                    variant={completedItemIds.includes(item.id) ? "secondary" : "default"}
                    onClick={() => completeItemMutation.mutate(item.id)}
                    disabled={completeItemMutation.isPending || completedItemIds.includes(item.id)}
                  >
                    {completedItemIds.includes(item.id) ? (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    ) : (
                      <Circle className="mr-2 h-4 w-4" />
                    )}
                    {completedItemIds.includes(item.id) ? "Completed" : "Mark Step Complete"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
              <CardDescription>
                {user
                  ? hasStarted ? `${progress?.percentComplete || 0}% complete` : "Start this collection to track progress."
                  : "Log in to track this collection."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={progress?.percentComplete || 0} className="h-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{completedItemIds.length} completed</span>
                <span>{collection.items?.length || 0} total</span>
              </div>
              {isCompleted && <Badge className="bg-emerald-600">completed</Badge>}
            </CardContent>
          </Card>

          {collection.learningGoals?.length ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Goals</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {collection.learningGoals.map((goal) => (
                  <Badge key={goal} variant="secondary">{goal}</Badge>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {collection.parentNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parent Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{collection.parentNotes}</p>
              </CardContent>
            </Card>
          )}

          {collection.finalProject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Final Project</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{collection.finalProject}</p>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

export default function CollectionLibrary() {
  const [location] = useLocation();
  const collectionId = getCollectionIdFromPath(location);

  const { data: collections = [], isLoading } = useQuery<CurriculumCollection[]>({
    queryKey: ["/api/curriculum-collections"],
    queryFn: () => apiRequest<CurriculumCollection[]>("/api/curriculum-collections"),
    enabled: !collectionId,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {collectionId ? (
        <CollectionDetail collectionId={collectionId} />
      ) : (
        <>
          <div className="mb-8">
            <Badge className="mb-3">Family Pathways</Badge>
            <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
              <BookMarked className="h-7 w-7 text-primary" />
              Curriculum Collections
            </h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Browse approved multi-step learning paths built from lessons, videos, activities, parent prompts, and final projects.
            </p>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-muted-foreground">Loading collections...</p>
          ) : collections.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Collections Published Yet</CardTitle>
                <CardDescription>Approved curriculum collections will appear here as they clear review.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/learn">Explore Pathways</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => (
                <Card key={collection.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge>{collection.subject}</Badge>
                      <Badge variant="outline">{collection.ageGroup}</Badge>
                    </div>
                    <CardTitle>{collection.title}</CardTitle>
                    <CardDescription>{collection.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <Separator />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{collection.estimatedWeeks} weeks</span>
                      <span>{collection.items?.length || 0} steps</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/collections/${collection.id}`}>View Collection</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
