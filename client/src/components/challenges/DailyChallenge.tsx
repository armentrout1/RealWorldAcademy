import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, Medal, Star, Trophy, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
  const [hasRefreshError, setHasRefreshError] = useState(false);

  // Fetch active challenges
  const { data: challenges = [], isLoading: challengesLoading, error: challengesError } = useQuery<DailyChallenge[]>({
    queryKey: ['/api/challenges/daily'],
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Fetch completed challenges for today
  const { data: completedChallenges = [], isLoading: completedLoading } = useQuery<UserChallenge[]>({
    queryKey: ['/api/users', userId, 'challenges/today'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });

  // Complete challenge mutation
  const { mutate: completeChallenge, isPending: isCompleting } = useMutation({
    mutationFn: async (challengeId: number) => {
      return apiRequest('/api/users/' + userId + '/challenges/complete', {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'challenges/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
    },
  });

  // Check if challenge is already completed
  const isChallengeCompleted = (challengeId: number) => {
    return completedChallenges.some((completed: UserChallenge) => completed.challengeId === challengeId);
  };

  // Handle refresh
  const handleRefresh = () => {
    setHasRefreshError(false);
    queryClient.invalidateQueries({ queryKey: ['/api/challenges/daily'] });
    queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'challenges/today'] });
  };

  // Show error if needed
  if (challengesError && !hasRefreshError) {
    setHasRefreshError(true);
  }

  // Get challenge icon based on type
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-6 w-6 text-primary" />;
      case 'streak':
        return <Medal className="h-6 w-6 text-amber-500" />;
      case 'lesson':
        return <Star className="h-6 w-6 text-indigo-500" />;
      case 'quiz':
        return <Trophy className="h-6 w-6 text-emerald-500" />;
      default:
        return <Star className="h-6 w-6 text-primary" />;
    }
  };

  // Handle loading state
  if (challengesLoading || completedLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Challenges</CardTitle>
          <CardDescription>Complete challenges to earn XP</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (hasRefreshError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Challenges</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <XCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">Failed to load challenges</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Daily Challenges
        </CardTitle>
        <CardDescription>Complete challenges to earn XP</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No active challenges today</p>
          </div>
        ) : (
          challenges.map((challenge: DailyChallenge) => {
            const completed = isChallengeCompleted(challenge.id);
            
            return (
              <div 
                key={challenge.id} 
                className={cn(
                  "relative flex items-start gap-4 rounded-lg border p-4 transition-colors",
                  completed ? "bg-muted/50" : "hover:bg-accent"
                )}
              >
                <div className="mt-1 flex-shrink-0">
                  {getChallengeIcon(challenge.type)}
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge variant={completed ? "secondary" : "outline"} className="ml-2">
                      +{challenge.xpReward} XP
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  {challenge.difficultyLevel > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted-foreground">Difficulty:</span>
                      <Progress 
                        value={challenge.difficultyLevel * 20} 
                        className={cn(
                          "h-1.5 w-20", 
                          challenge.difficultyLevel <= 2 ? "text-emerald-500" : 
                          challenge.difficultyLevel <= 3 ? "text-amber-500" : 
                          "text-red-500"
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-auto flex-shrink-0">
                  {completed ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="ml-auto"
                      disabled={isCompleting}
                      onClick={() => completeChallenge(challenge.id)}
                    >
                      {isCompleting ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : null}
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="justify-end border-t pt-4">
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={challengesLoading}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}