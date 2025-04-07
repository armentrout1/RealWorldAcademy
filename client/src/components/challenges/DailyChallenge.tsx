import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Timer, Award } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';

// Define types based on the schema
interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  type: string;
  activeDate: string;
  difficultyLevel: number;
  icon: string;
}

interface UserChallenge {
  id: number;
  userId: number;
  challengeId: number;
  completedAt: string;
  xpEarned: number;
}

interface DailyChallengeCardProps {
  userId: number;
}

export function DailyChallengeCard({ userId }: DailyChallengeCardProps) {
  const queryClient = useQueryClient();

  // Fetch daily challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery<DailyChallenge[]>({
    queryKey: ['/api/challenges/daily'],
    enabled: true,
  });

  // Fetch completed challenges for today
  const { data: completedChallenges = [], isLoading: completedLoading } = useQuery<UserChallenge[]>({
    queryKey: ['/api/users', userId, 'challenges/today'],
    enabled: !!userId,
  });

  // Mutation for completing a challenge
  const completeChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      return apiRequest(`/api/users/${userId}/challenges/complete`, {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      });
    },
    onSuccess: () => {
      // Invalidate challenges queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'challenges/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] }); // Refresh user XP/level
      toast({
        title: "Challenge completed!",
        description: "You've earned XP and made progress on your learning journey.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to complete challenge",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const isChallengeCompleted = (challengeId: number) => {
    if (!completedChallenges) return false;
    return completedChallenges.some((completed: UserChallenge) => completed.challengeId === challengeId);
  };

  // Calculate completion percentage
  const calculateProgress = () => {
    if (!challenges || !completedChallenges) return 0;
    return (completedChallenges.length / challenges.length) * 100;
  };

  if (challengesLoading || completedLoading) {
    return <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Loading Daily Challenges...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 animate-pulse bg-muted rounded-md"></div>
      </CardContent>
    </Card>;
  }

  if (!challenges || challenges.length === 0) {
    return <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle>No challenges today</CardTitle>
        <CardDescription>Check back tomorrow for new challenges!</CardDescription>
      </CardHeader>
    </Card>;
  }

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Daily Challenges
        </CardTitle>
        <CardDescription>Complete challenges to earn XP and streaks</CardDescription>
        <Progress value={calculateProgress()} className="h-2 mt-2" />
        <div className="text-xs text-muted-foreground mt-1">
          {completedChallenges?.length || 0} of {challenges.length} completed
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge: DailyChallenge) => {
          const completed = isChallengeCompleted(challenge.id);
          
          return (
            <div 
              key={challenge.id} 
              className={`p-3 border rounded-lg flex items-center justify-between ${
                completed ? 'bg-green-50 border-green-200' : 'hover:bg-accent'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {challenge.title}
                  {completed && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">+{challenge.xpReward} XP</Badge>
                  <Badge variant="outline">{challenge.type}</Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant={completed ? "outline" : "default"}
                onClick={() => !completed && completeChallengeMutation.mutate(challenge.id)}
                disabled={completed || completeChallengeMutation.isPending}
              >
                {completed ? "Completed" : "Complete"}
              </Button>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <span>Difficulty scales with your level</span>
        <span>Refreshes daily</span>
      </CardFooter>
    </Card>
  );
}