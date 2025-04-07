import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Brain, 
  Star, 
  Award, 
  ChevronRight, 
  ArrowUpRight,
  BarChart2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for the component
interface Strength {
  name: string;
  score: number; // 0-100
  improvement?: number; // percentage improvement
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number; // 0-100
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  category: string;
}

interface GrowthSnapshotProps {
  strengths: Strength[];
  skills: Skill[];
  nextChallenges: Challenge[];
  recentAchievements?: string[];
  overallProgress?: number;
  className?: string;
  variant?: 'default' | 'compact';
  onChallengeSelect?: (challenge: Challenge) => void;
}

/**
 * Growth Snapshot Component
 * 
 * Displays a student's strengths, skills, and suggested next challenges
 * in an infographic-style card component.
 */
const GrowthSnapshot: React.FC<GrowthSnapshotProps> = ({
  strengths = [],
  skills = [],
  nextChallenges = [],
  recentAchievements = [],
  overallProgress = 65,
  className,
  variant = 'default',
  onChallengeSelect
}) => {
  
  // Get color for progress bars
  const getProgressColor = (value: number) => {
    if (value < 30) return 'bg-red-500';
    if (value < 60) return 'bg-amber-500';
    if (value < 80) return 'bg-green-500';
    return 'bg-emerald-500';
  };
  
  // Get label for skill level
  const getSkillLevelLabel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    switch (level) {
      case 'beginner':
        return 'Getting Started';
      case 'intermediate':
        return 'Building Skills';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };
  
  // Get color for skill level
  const getSkillLevelColor = (level: 'beginner' | 'intermediate' | 'advanced') => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'advanced':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };
  
  // Get color for challenge difficulty
  const getChallengeDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };
  
  // Compact variant (for smaller spaces)
  if (variant === 'compact') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <CardTitle className="flex items-center text-lg">
            <Brain className="mr-2 h-5 w-5" />
            My Growth Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className={getProgressColor(overallProgress)} />
          </div>
          
          {/* Top Strengths */}
          <div className="mb-4">
            <h3 className="text-sm font-medium flex items-center mb-2">
              <Award className="h-4 w-4 mr-1.5 text-amber-500" />
              Top Strengths
            </h3>
            <div className="space-y-1.5">
              {strengths.slice(0, 2).map((strength, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{strength.name}</span>
                  <Badge variant="outline" className="font-normal">
                    {strength.improvement && strength.improvement > 0 ? (
                      <span className="flex items-center text-emerald-600">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        {strength.improvement}%
                      </span>
                    ) : (
                      <span>{strength.score}%</span>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Next Challenge */}
          {nextChallenges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <Zap className="h-4 w-4 mr-1.5 text-indigo-500" />
                Recommended Challenge
              </h3>
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => onChallengeSelect && onChallengeSelect(nextChallenges[0])}
              >
                <span>{nextChallenges[0].title}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Default full variant
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-6 w-6" />
            My Growth Snapshot
          </CardTitle>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            <BarChart2 className="h-3 w-3 mr-1" />
            AI-Generated
          </Badge>
        </div>
        <CardDescription className="text-indigo-100">
          Your personal learning profile based on your activities and assessments
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column - Strengths and Achievements */}
          <div className="space-y-6">
            {/* Top Strengths */}
            <div>
              <h3 className="font-medium flex items-center mb-3">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Your Strengths
              </h3>
              <div className="space-y-3">
                {strengths.map((strength, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{strength.name}</span>
                      <div className="flex items-center">
                        {strength.improvement && strength.improvement > 0 && (
                          <Badge className="mr-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {strength.improvement}%
                          </Badge>
                        )}
                        <span className="text-sm">{strength.score}%</span>
                      </div>
                    </div>
                    <Progress value={strength.score} className={getProgressColor(strength.score)} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Achievements */}
            {recentAchievements && recentAchievements.length > 0 && (
              <div>
                <h3 className="font-medium flex items-center mb-3">
                  <Award className="h-5 w-5 mr-2 text-indigo-500" />
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  {recentAchievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-2 rounded-md border border-neutral-200 bg-neutral-50"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <Award className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-sm">{achievement}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Skills and Challenges */}
          <div className="space-y-6">
            {/* Skills Improved */}
            <div>
              <h3 className="font-medium flex items-center mb-3">
                <Zap className="h-5 w-5 mr-2 text-violet-500" />
                Skills Improved
              </h3>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <Progress 
                        value={skill.progress} 
                        className={`flex-1 h-2 ${getProgressColor(skill.progress)}`}
                      />
                      <Badge 
                        variant="outline" 
                        className={`ml-3 text-xs font-normal ${getSkillLevelColor(skill.level)}`}
                      >
                        {getSkillLevelLabel(skill.level)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Suggested Next Challenge */}
            <div>
              <h3 className="font-medium flex items-center mb-3">
                <ArrowUpRight className="h-5 w-5 mr-2 text-emerald-500" />
                Suggested Next Challenges
              </h3>
              <div className="space-y-3">
                {nextChallenges.map((challenge, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md border border-neutral-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                    onClick={() => onChallengeSelect && onChallengeSelect(challenge)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={getChallengeDifficultyColor(challenge.difficulty)}
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      {challenge.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-neutral-500">
                      <span>{challenge.category}</span>
                      <span className="mx-1.5">•</span>
                      <span>{challenge.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-neutral-50 border-t px-6 py-3">
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {/* <!-- TODO: Use AI to analyze student activities and generate realistic growth data --> */}
            Last updated: Today
          </span>
          <Button variant="link" size="sm" className="text-xs p-0">
            View Full Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GrowthSnapshot;