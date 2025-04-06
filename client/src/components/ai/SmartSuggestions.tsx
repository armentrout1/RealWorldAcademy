import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Lightbulb, Clock, AreaChart, Zap } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  href: string;
}

export function SmartSuggestions() {
  // These would normally come from an AI recommendation service
  // based on user behavior, progress, and learning patterns
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Continue Learning',
      description: 'Pick up where you left off in the Financial Literacy module',
      icon: <BookOpen className="h-4 w-4" />,
      action: 'Continue',
      href: '/financial-literacy'
    },
    {
      id: '2',
      title: 'Try This Project',
      description: 'Build a personal budget tracker to apply your new skills',
      icon: <Lightbulb className="h-4 w-4" />,
      action: 'Start Project',
      href: '/projects'
    },
    {
      id: '3',
      title: 'Set Your Goals',
      description: 'You haven\'t updated your career goals recently',
      icon: <AreaChart className="h-4 w-4" />,
      action: 'Update Goals',
      href: '/plan-your-future'
    },
    {
      id: '4',
      title: 'Weekly Challenge',
      description: 'Create a 30-day savings plan to boost your financial skills',
      icon: <Clock className="h-4 w-4" />,
      action: 'Accept Challenge',
      href: '/dashboard'
    },
  ];

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg border border-muted hover:bg-primary/5 transition-colors">
              <div className="mt-1 bg-primary/10 p-1.5 rounded-md text-primary">
                {suggestion.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-medium text-sm">{suggestion.title}</div>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                <Button variant="link" size="sm" className="h-6 px-0 text-xs text-primary font-medium">
                  {suggestion.action} <Zap className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SmartSuggestions;