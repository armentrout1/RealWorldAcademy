import React from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, BookMarked, ExternalLink, PlayCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const getCollectionIdFromPath = (path: string) => {
  const match = path.match(/^\/collections\/(\d+)/);
  return match ? Number(match[1]) : null;
};

function CollectionDetail({ collectionId }: { collectionId: number }) {
  const { data: collection, isLoading } = useQuery<CurriculumCollection>({
    queryKey: [`/api/curriculum-collections/${collectionId}`],
    queryFn: () => apiRequest<CurriculumCollection>(`/api/curriculum-collections/${collectionId}`),
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
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="space-y-4">
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
