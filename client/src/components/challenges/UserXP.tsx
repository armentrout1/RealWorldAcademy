import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Progress } from "@/components/ui/progress";
import { Award, Zap, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  // XP thresholds for each level
  const calculateXpToNextLevel = (level: number) => {
    return level * 500; // Simple calculation: 500 XP per level
  };

  const calculateProgress = (xp: number, level: number) => {
    const nextLevelXp = calculateXpToNextLevel(level);
    const previousLevelXp = calculateXpToNextLevel(level - 1);
    const levelProgress = xp - previousLevelXp;
    const totalLevelXp = nextLevelXp - previousLevelXp;
    return Math.min(100, Math.max(0, (levelProgress / totalLevelXp) * 100));
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center space-x-2 animate-pulse">
        <div className="h-6 w-6 rounded-full bg-muted"></div>
        <div className="h-4 w-20 bg-muted rounded"></div>
      </div>
    );
  }

  const progress = calculateProgress(user.xp, user.level);
  const nextLevelXp = calculateXpToNextLevel(user.level);
  const previousLevelXp = calculateXpToNextLevel(user.level - 1);
  const xpToNextLevel = nextLevelXp - user.xp;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-primary mr-1.5" />
                  <span className="font-medium text-sm">Level {user.level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Your current level: {user.levelTitle}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-amber-500 mr-1" />
                  <span className="text-xs text-neutral-600">{user.xp} XP</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{xpToNextLevel} XP to next level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {user.streakCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-orange-500 mr-1" />
                    <span className="text-xs text-neutral-600">{user.streakCount} day streak</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>You've been learning for {user.streakCount} days in a row!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Progress value={progress} className="h-1.5 w-full" />
    </div>
  );
}