import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Sparkles, FileText } from "lucide-react";

interface AIContentHelperProps {
  contentType: 'explanation' | 'example' | 'idea' | 'summary';
  topic: string;
  response: string;
  className?: string;
}

export function AIContentHelper({ contentType, topic, response, className }: AIContentHelperProps) {
  // Icons and titles based on content type
  const contentConfig = {
    explanation: {
      icon: <BookOpen className="h-4 w-4" />,
      title: `Explanation: ${topic}`,
      bgClass: 'bg-blue-50 border-blue-100',
      iconClass: 'text-blue-500',
    },
    example: {
      icon: <FileText className="h-4 w-4" />,
      title: `Example: ${topic}`,
      bgClass: 'bg-green-50 border-green-100',
      iconClass: 'text-green-500',
    },
    idea: {
      icon: <Lightbulb className="h-4 w-4" />,
      title: `Idea: ${topic}`,
      bgClass: 'bg-amber-50 border-amber-100',
      iconClass: 'text-amber-500',
    },
    summary: {
      icon: <Sparkles className="h-4 w-4" />,
      title: `Summary: ${topic}`,
      bgClass: 'bg-purple-50 border-purple-100',
      iconClass: 'text-purple-500',
    },
  };

  const config = contentConfig[contentType];

  return (
    <Card className={`shadow-sm border ${config.bgClass} ${className}`}>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className={`${config.iconClass}`}>
            {config.icon}
          </div>
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-3 text-sm">
        <div className="prose prose-sm max-w-none">
          <p>{response}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIContentHelper;