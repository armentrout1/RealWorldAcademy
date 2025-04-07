import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessagesSquare, 
  Send, 
  Sparkles, 
  ArrowRight, 
  FileQuestion, 
  Clock, 
  Loader2,
  GraduationCap,
  Lightbulb,
  ChevronRight,
  PenSquare,
  ArrowRightCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICoachProps {
  variant?: 'button' | 'card';
  subject?: string;
  className?: string;
}

/**
 * AI Learning Coach Component
 * 
 * Simulates an AI assistant that can answer questions, provide
 * guidance, and help students through challenging concepts.
 */
const AICoach: React.FC<AICoachProps> = ({
  variant = 'button',
  subject = 'Financial Literacy',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
  }[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI learning coach for ${subject}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions] = useState([
    "Can you explain what compound interest is?",
    "What's the difference between stocks and bonds?",
    "How should I create my first budget?",
    "What should I know about credit scores?"
  ]);
  
  // Simulated chat responses
  const getAIResponse = (question: string) => {
    // In a real implementation, this would call an AI service
    let response = '';
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('compound interest')) {
      response = `Compound interest is when you earn interest on both the money you initially invest (the principal) and on the interest you've already earned. It's often described as "interest on interest" and is a powerful concept in saving and investing.

For example, if you invest $1,000 at 5% annual compound interest:
- Year 1: $1,000 × 5% = $50 interest, giving you $1,050
- Year 2: $1,050 × 5% = $52.50 interest, giving you $1,102.50
- Year 3: $1,102.50 × 5% = $55.13 interest, giving you $1,157.63

Notice how the interest earned increases each year? That's the power of compound interest! Would you like me to show you how to calculate it using a formula?`;
    } else if (lowerQuestion.includes('stocks') && lowerQuestion.includes('bonds')) {
      response = `Stocks and bonds are both investment types, but they work quite differently:

**Stocks**
- Represent ownership in a company
- Potential for higher returns through price appreciation and dividends
- Higher risk and volatility
- No guaranteed returns

**Bonds**
- Represent lending money to a company or government
- Generally more stable returns through interest payments
- Lower risk than stocks (typically)
- Fixed income with predetermined interest rates

Think of stocks as becoming a part-owner in a business, while bonds are more like being a lender. A balanced portfolio often includes both, adjusted based on your risk tolerance and financial goals.`;
    } else if (lowerQuestion.includes('budget')) {
      response = `Creating your first budget is a great step toward financial literacy! Here's a simple approach:

1. **Track your income**: List all sources of money coming in each month
2. **List expenses**: Categorize your spending (essentials like rent, food, utilities, and non-essentials like entertainment)
3. **Calculate the difference**: Subtract expenses from income
4. **Set goals**: Allocate remaining money to savings and debt repayment
5. **Follow the 50/30/20 rule** as a starting point:
   - 50% to needs (housing, food, utilities)
   - 30% to wants (entertainment, dining out)
   - 20% to savings and debt repayment

Would you like me to help you create a personalized budget template?`;
    } else if (lowerQuestion.includes('credit score')) {
      response = `Credit scores are numerical representations of your creditworthiness, typically ranging from 300-850. They're important because they affect your ability to get loans, credit cards, and even housing.

Key factors that affect your credit score:
- Payment history (35%): Paying bills on time is the biggest factor
- Credit utilization (30%): How much of your available credit you're using
- Length of credit history (15%): How long you've had credit accounts
- New credit (10%): How many new accounts you've opened recently
- Credit mix (10%): The variety of credit accounts you have

To maintain a good credit score:
- Pay all bills on time
- Keep credit card balances low
- Don't close old accounts unless necessary
- Limit applications for new credit
- Check your credit report regularly for errors

Would you like tips on how to improve your credit score?`;
    } else {
      response = `That's a great question about ${question.split(' ').slice(0, 3).join(' ')}... 

In the realm of personal finance, understanding the fundamentals can help you make better decisions for your financial future. Learning about concepts like budgeting, saving strategies, investment options, and risk management provides you with the tools to achieve your financial goals.

Would you like me to go into more specific details about any aspect of this topic?`;
    }
    
    return response;
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate API delay for AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle clicking a suggested question
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
  };
  
  // Format message timestamp
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Button variant (default)
  if (variant === 'button') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className={cn("flex items-center", className)}
          >
            <Brain className="mr-2 h-4 w-4" />
            Ask AI Learning Coach
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-500" />
              AI Learning Coach
            </DialogTitle>
            <DialogDescription>
              Get personalized help with your learning
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-[400px]">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/ai-coach.png" alt="AI" />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "rounded-lg p-3 max-w-[85%]",
                    message.role === 'user' 
                      ? "bg-indigo-600 text-white" 
                      : "bg-gray-100 text-gray-800"
                  )}>
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                    <div className={cn(
                      "text-xs mt-1",
                      message.role === 'user' ? "text-indigo-100" : "text-gray-500"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src="/user-avatar.png" alt="User" />
                      <AvatarFallback className="bg-indigo-600 text-white">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-75"></div>
                      <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Suggested questions - show only at the beginning */}
            {messages.length <= 1 && (
              <div className="p-3 border-t">
                <div className="text-xs text-gray-500 mb-2 flex items-center">
                  <Lightbulb className="h-3 w-3 mr-1 text-indigo-400" />
                  Suggested questions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input area */}
            <div className="p-3 border-t flex items-center">
              <Input
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 mr-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} className="h-9 w-9 p-0" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <DialogFooter className="text-xs text-gray-500 flex justify-start">
            <div className="flex items-center">
              <Sparkles className="h-3 w-3 mr-1 text-indigo-400" />
              AI-powered learning assistance
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Card variant (for embedding in pages)
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Learning Coach
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Get personalized help with your learning
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <GraduationCap className="h-16 w-16 text-indigo-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your Personal AI Coach</h3>
          <p className="text-sm text-neutral-600 text-center mb-6 max-w-sm">
            Get instant answers to your questions, personalized explanations, and help with challenging concepts.
          </p>
          
          <div className="w-full space-y-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                <FileQuestion className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Ask Any Question</h4>
                <p className="text-xs text-neutral-500">Get instant, personalized answers</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">24/7 Support</h4>
                <p className="text-xs text-neutral-500">Learning assistance whenever you need it</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                <PenSquare className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Customized Explanations</h4>
                <p className="text-xs text-neutral-500">Tailored to your learning style</p>
              </div>
            </div>
          </div>
          
          <Alert className="mt-6 w-full bg-indigo-50 border-indigo-200">
            <Lightbulb className="h-4 w-4 text-indigo-500" />
            <AlertTitle className="text-sm font-medium text-indigo-700">Recently Asked</AlertTitle>
            <AlertDescription className="text-xs text-indigo-600">
              <div className="space-y-1 mt-1">
                <div className="flex items-center justify-between">
                  <span>What is compound interest?</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
                <div className="flex items-center justify-between">
                  <span>How to create a budget?</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </AlertDescription>
          </Alert>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6 w-full">
                <MessagesSquare className="mr-2 h-5 w-5" />
                Chat with AI Coach
              </Button>
            </DialogTrigger>
            
            {/* Dialog content - same as in button variant */}
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-indigo-500" />
                  AI Learning Coach
                </DialogTitle>
                <DialogDescription>
                  Get personalized help with your learning
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col h-[400px]">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/ai-coach.png" alt="AI" />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700">AI</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "rounded-lg p-3 max-w-[85%]",
                        message.role === 'user' 
                          ? "bg-indigo-600 text-white" 
                          : "bg-gray-100 text-gray-800"
                      )}>
                        <div className="whitespace-pre-line text-sm">
                          {message.content}
                        </div>
                        <div className={cn(
                          "text-xs mt-1",
                          message.role === 'user' ? "text-indigo-100" : "text-gray-500"
                        )}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 ml-2">
                          <AvatarImage src="/user-avatar.png" alt="User" />
                          <AvatarFallback className="bg-indigo-600 text-white">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"></div>
                          <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-75"></div>
                          <div className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-150"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Suggested questions - show only at the beginning */}
                {messages.length <= 1 && (
                  <div className="p-3 border-t">
                    <div className="text-xs text-gray-500 mb-2 flex items-center">
                      <Lightbulb className="h-3 w-3 mr-1 text-indigo-400" />
                      Suggested questions:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Input area */}
                <div className="p-3 border-t flex items-center">
                  <Input
                    placeholder="Ask a question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} className="h-9 w-9 p-0" disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="text-xs text-gray-500 flex justify-start">
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-indigo-400" />
                  AI-powered learning assistance
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      
      <CardFooter className="bg-neutral-50 border-t p-4">
        <div className="w-full flex justify-between items-center">
          <Badge variant="outline">
            <Brain className="h-3 w-3 mr-1 text-indigo-500" />
            AI-Powered
          </Badge>
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
            Learn More
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AICoach;