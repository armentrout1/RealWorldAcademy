import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star, Flame, Award, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  username: string;
  fullName: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakCount: number;
}

interface UserXPProps {
  userId: number;
}

export function UserXP({ userId }: UserXPProps) {
  // Fetch user data
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/users', userId],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });

  // Calculate XP needed for next level (simplified formula)
  const getNextLevelXP = (level: number) => {
    return level * 500; // Each level requires 500 more XP than the previous
  };

  // Calculate XP progress as percentage
  const calculateXPProgress = (xp: number, level: number) => {
    const currentLevelXP = (level - 1) * 500;
    const nextLevelXP = level * 500;
    const levelProgress = xp - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    return Math.min(Math.floor((levelProgress / levelRange) * 100), 100);
  };

  // Format large numbers with k suffix
  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error || !user) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-4 text-center">
          <XCircle className="h-6 w-6 text-destructive" />
          <p className="mt-2 text-sm text-muted-foreground">Failed to load your progress</p>
        </CardContent>
      </Card>
    );
  }

  const xpProgress = calculateXPProgress(user.xp, user.level);
  const nextLevelXP = getNextLevelXP(user.level);
  const currentLevelXP = getNextLevelXP(user.level - 1);
  const xpForNextLevel = nextLevelXP - user.xp;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" /> 
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <span className="text-3xl font-bold text-primary">{formatNumber(user.xp)}</span>
            <p className="text-xs text-muted-foreground">XP Points</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold">{user.level}</span>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Flame className={cn("h-5 w-5", user.streakCount > 0 ? "text-orange-500" : "text-muted-foreground")} />
              <span className="text-3xl font-bold">{user.streakCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium">{user.levelTitle}</span>
            <Badge variant="secondary" className="font-normal">
              {xpForNextLevel} XP to Level {user.level + 1}
            </Badge>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-2.5" />
            <span className="absolute right-0 top-3 text-xs text-muted-foreground">
              {formatNumber(user.xp - currentLevelXP)}/{formatNumber(nextLevelXP - currentLevelXP)} XP
            </span>
          </div>
        </div>

        {user.streakCount > 0 && (
          <div className="flex items-center rounded-md border bg-muted/50 p-2 text-sm">
            <Flame className="mr-2 h-4 w-4 text-orange-500" />
            <span>
              {user.streakCount === 1
                ? "1 day streak! Keep going!"
                : user.streakCount >= 7
                ? `${user.streakCount} day streak! Amazing consistency!`
                : `${user.streakCount} day streak! Keep it up!`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}