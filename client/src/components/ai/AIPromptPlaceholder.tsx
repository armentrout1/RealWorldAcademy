import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Lock } from "lucide-react";

interface AIPromptPlaceholderProps {
  title: string;
  description: string;
  promptLabel?: string;
  placeholderText?: string;
  buttonText?: string;
  featureDescription?: string;
  locked?: boolean;
  className?: string;
}

export function AIPromptPlaceholder({
  title,
  description,
  promptLabel = "Ask AI for help",
  placeholderText = "Type your question here...",
  buttonText = "Submit",
  featureDescription = "This AI feature will be available soon.",
  locked = true,
  className
}: AIPromptPlaceholderProps) {
  return (
    <Card className={className}>
      <CardHeader className="relative pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {locked && (
          <div className="absolute right-4 top-4">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <label className="text-sm font-medium mb-1 block">
              {promptLabel}
            </label>
            <div className="bg-muted rounded-md px-3 py-2 border cursor-not-allowed text-muted-foreground">
              <p className="text-sm">{placeholderText}</p>
            </div>
          </div>
          
          {locked && (
            <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-md text-sm">
              <Bot className="h-4 w-4 flex-shrink-0 text-primary" />
              <p>{featureDescription}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={locked} className="w-full">
          <Bot className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AIPromptPlaceholder;