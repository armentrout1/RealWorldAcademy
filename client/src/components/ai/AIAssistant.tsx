import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

// Types for messages
type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Mock responses for common questions
// TODO: Replace static responses with OpenAI API call
const mockResponses: Record<string, string> = {
  "what should i work on next": "Based on your progress, I recommend focusing on your financial literacy skills. The budgeting module would be a great next step!",
  "what's a budget": "A budget is a financial plan that tracks your income and expenses. It helps you manage your money effectively by allocating specific amounts to different categories like food, housing, and entertainment.",
  "help me understand credit scores": "A credit score is a number (usually between 300-850) that represents your creditworthiness. It's calculated based on your credit history, including payment history, amounts owed, length of credit history, new credit, and types of credit used. Higher scores indicate to lenders that you're likely to repay borrowed money.",
  "how do i start a project": "To start a project, go to the Projects page and browse available options. Choose one that interests you, then click 'Start Project'. You'll be guided through steps to complete it at your own pace.",
  "what are soft skills": "Soft skills are personal attributes that enable you to interact effectively with others. These include communication, teamwork, problem-solving, time management, adaptability, and leadership. They're highly valued by employers alongside technical abilities.",
  "how can i improve my resume": "To improve your resume, highlight relevant experiences and skills, use action verbs, quantify achievements when possible, tailor it to each job application, and keep it concise (1-2 pages). Don't forget to proofread for errors!",
};

// Find response or generate a fallback
const getResponse = (query: string): string => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Look for exact matches
  if (mockResponses[normalizedQuery]) {
    return mockResponses[normalizedQuery];
  }
  
  // Look for partial matches
  for (const key in mockResponses) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
      return mockResponses[key];
    }
  }
  
  // Fallback response
  return "I don't have specific information about that yet, but I'll be able to help with more topics soon! In the meantime, you might find relevant resources in the Learn section.";
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm your Real World Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI thinking with a small delay
    setTimeout(() => {
      const response = getResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <Button 
        onClick={toggleChat}
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 md:w-96 shadow-xl border border-primary/20">
          <CardHeader className="bg-primary/5 py-3">
            <CardTitle className="text-md flex items-center gap-2">
              <Zap size={18} className="text-primary" />
              Real World Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 p-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "mb-4 max-w-[85%] rounded-lg p-3",
                    message.role === 'user' 
                      ? "ml-auto bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 pt-2">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon" className="h-10 w-10">
                <Send size={16} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default AIAssistant;