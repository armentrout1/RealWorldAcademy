import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Smile, Sparkles, Settings, Edit, RefreshCw, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for messages and buddy profile
type MessageRole = 'user' | 'buddy';

interface Message {
  id: string;
  content: string;
  isFromBuddy: boolean;
  sentAt: Date;
}

interface BuddyProfile {
  id: number;
  userId: number;
  name: string;
  avatarType: string;
  avatarColor: string;
  personalityType: string;
  createdAt: Date;
  lastInteractionAt: Date | null;
}

interface Emotion {
  id: number;
  userId: number;
  emotion: string;
  intensity: number;
  note: string | null;
  loggedAt: Date;
}

// Avatar options
const avatarTypes = [
  { value: 'robot', label: 'Robot' },
  { value: 'animal', label: 'Animal' },
  { value: 'human', label: 'Human' },
  { value: 'fantasy', label: 'Fantasy' }
];

const avatarColors = [
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-100 border-indigo-500 text-indigo-700' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-100 border-rose-500 text-rose-700' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-100 border-emerald-500 text-emerald-700' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-100 border-amber-500 text-amber-700' },
  { value: 'sky', label: 'Sky', class: 'bg-sky-100 border-sky-500 text-sky-700' }
];

const personalityTypes = [
  { value: 'encouraging', label: 'Encouraging' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'creative', label: 'Creative' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'friendly', label: 'Friendly' }
];

// Emotion options
const emotions = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'curious', label: 'Curious', emoji: '🤔' },
  { value: 'confused', label: 'Confused', emoji: '😕' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😣' },
  { value: 'proud', label: 'Proud', emoji: '😌' },
  { value: 'bored', label: 'Bored', emoji: '😴' },
  { value: 'stressed', label: 'Stressed', emoji: '😰' }
];

// Buddy response patterns based on personality
const getBuddyResponse = (message: string, personalityType: string): string => {
  const normalizedMsg = message.toLowerCase().trim();
  
  // Generic responses based on personality type
  const personalityResponses: Record<string, string[]> = {
    encouraging: [
      "You're doing great! Keep going!",
      "I believe in you. You can tackle this challenge!",
      "Every step you take is progress. You should be proud!",
      "That's an interesting thought. What else are you thinking about?"
    ],
    analytical: [
      "Let's break this down step by step.",
      "Interesting. Have you considered looking at it from this angle?",
      "Let me analyze this situation for you.",
      "The data suggests a few different approaches we could take."
    ],
    creative: [
      "What if we try something completely new?",
      "Let's think outside the box on this one!",
      "Your ideas are so creative! Here's another perspective to consider.",
      "Imagination is the key to learning. Let's explore this together!"
    ],
    motivational: [
      "You've got this! Just focus on your next step.",
      "Remember why you started this journey. You're making real progress!",
      "Challenges help us grow. This is how you become even better!",
      "I'm here to support you every step of the way."
    ],
    friendly: [
      "Hey friend! That's a great question.",
      "I'm so glad you asked me about that!",
      "We make a great team, don't we?",
      "I'm enjoying our conversation! Tell me more about what you're learning."
    ]
  };
  
  // Content-specific responses
  if (normalizedMsg.includes("hello") || normalizedMsg.includes("hi ")) {
    return `Hello there! I'm your learning buddy. What would you like to chat about today?`;
  }
  
  if (normalizedMsg.includes("help") || normalizedMsg.includes("stuck") || normalizedMsg.includes("confused")) {
    if (personalityType === 'analytical') {
      return "I understand you're feeling stuck. Let's identify exactly what's confusing you so we can solve it step by step. What specific concept or task are you working on?";
    } else if (personalityType === 'encouraging') {
      return "It's completely normal to feel stuck sometimes! Everyone encounters challenges while learning. Tell me more about what you're struggling with, and we'll work through it together.";
    } else {
      return "I'm here to help! Let me know what you're finding difficult, and we can figure it out together.";
    }
  }
  
  if (normalizedMsg.includes("learn") || normalizedMsg.includes("study") || normalizedMsg.includes("course")) {
    if (personalityType === 'motivational') {
      return "Learning new things is an exciting journey! Your dedication to improving yourself is inspiring. What specific subject are you focusing on right now?";
    } else if (personalityType === 'creative') {
      return "The world of knowledge is like a playground for your mind! Let's explore this topic in a way that makes it come alive for you. What aspects interest you the most?";
    } else {
      return "I'm excited to help you with your learning journey! What specific area would you like to explore together?";
    }
  }
  
  if (normalizedMsg.includes("tired") || normalizedMsg.includes("break") || normalizedMsg.includes("rest")) {
    return "Taking breaks is an important part of effective learning! Your brain needs time to process information. Maybe try a 10-minute walk or some quick stretches before coming back to your studies.";
  }
  
  // Default: Return a random response based on personality
  const personalityResponseArray = personalityResponses[personalityType] || personalityResponses.friendly;
  const randomIndex = Math.floor(Math.random() * personalityResponseArray.length);
  return personalityResponseArray[randomIndex];
};

export function Buddy() {
  const { user } = useAuth();
  const userId = user?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [emotionNote, setEmotionNote] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Customization form state
  const [customName, setCustomName] = useState('');
  const [customAvatar, setCustomAvatar] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [customPersonality, setCustomPersonality] = useState('');
  
  // Fetch buddy profile
  const { data: buddyProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['/api/users', userId, 'buddy'],
    queryFn: () => userId ? apiRequest(`/api/users/${userId}/buddy`) : null,
    enabled: !!userId
  });
  
  // Fetch messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['/api/users', userId, 'buddy', 'messages'],
    queryFn: () => userId ? apiRequest(`/api/users/${userId}/buddy/messages`) : [],
    enabled: !!userId
  });
  
  // Fetch latest emotion
  const { data: latestEmotion, isLoading: isLoadingEmotion } = useQuery({
    queryKey: ['/api/users', userId, 'buddy', 'emotions', 'latest'],
    queryFn: () => userId ? apiRequest(`/api/users/${userId}/buddy/emotions/latest`) : null,
    enabled: !!userId
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updateData: any) => {
      return apiRequest(`/api/users/${userId}/buddy`, {
        method: 'PATCH',
        body: updateData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'buddy'] });
      toast({
        title: "Buddy updated!",
        description: "Your AI companion has been customized.",
      });
      setIsCustomizing(false);
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update your buddy settings.",
        variant: "destructive"
      });
    }
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageData: { content: string, isFromBuddy: boolean }) => {
      return apiRequest(`/api/users/${userId}/buddy/messages`, {
        method: 'POST',
        body: messageData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'buddy', 'messages'] });
    },
    onError: () => {
      toast({
        title: "Message failed",
        description: "Could not send your message.",
        variant: "destructive"
      });
    }
  });
  
  // Record emotion mutation
  const recordEmotionMutation = useMutation({
    mutationFn: (emotionData: { emotion: string, intensity: number, note: string | null }) => {
      return apiRequest(`/api/users/${userId}/buddy/emotions`, {
        method: 'POST',
        body: emotionData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'buddy', 'emotions', 'latest'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'buddy', 'emotions'] });
      toast({
        title: "Emotion logged",
        description: "Thanks for sharing how you feel!",
      });
      setIsCheckingIn(false);
      setSelectedEmotion('');
      setEmotionIntensity(5);
      setEmotionNote('');
    },
    onError: () => {
      toast({
        title: "Check-in failed",
        description: "Could not record your emotion.",
        variant: "destructive"
      });
    }
  });
  
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
  
  // Set form values when profile loads
  useEffect(() => {
    if (buddyProfile) {
      setCustomName(buddyProfile.name);
      setCustomAvatar(buddyProfile.avatarType);
      setCustomColor(buddyProfile.avatarColor);
      setCustomPersonality(buddyProfile.personalityType);
    }
  }, [buddyProfile]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !userId) return;
    
    // Send user message
    sendMessageMutation.mutate({
      content: input,
      isFromBuddy: false
    });
    
    setInput('');
    
    // Simulate buddy thinking with a small delay
    setTimeout(() => {
      // Get response based on personality
      const personalityType = buddyProfile?.personalityType || 'friendly';
      const response = getBuddyResponse(input, personalityType);
      
      // Send buddy response
      sendMessageMutation.mutate({
        content: response,
        isFromBuddy: true
      });
    }, 1500);
  };
  
  const handleUpdateProfile = () => {
    if (!userId) return;
    
    updateProfileMutation.mutate({
      name: customName,
      avatarType: customAvatar,
      avatarColor: customColor,
      personalityType: customPersonality
    });
  };
  
  const handleEmotionCheckIn = () => {
    if (!userId || !selectedEmotion) return;
    
    recordEmotionMutation.mutate({
      emotion: selectedEmotion,
      intensity: emotionIntensity,
      note: emotionNote || null
    });
  };
  
  // Get avatar display details
  const getAvatarDisplay = () => {
    const type = buddyProfile?.avatarType || 'robot';
    const color = buddyProfile?.avatarColor || 'indigo';
    
    // Find the class for the selected color
    const colorClass = avatarColors.find(c => c.value === color)?.class || avatarColors[0].class;
    
    // Emoji based on avatar type
    let emoji = '🤖';
    switch (type) {
      case 'animal':
        emoji = '🐼';
        break;
      case 'human':
        emoji = '👩‍🏫';
        break;
      case 'fantasy':
        emoji = '🧚';
        break;
      default:
        emoji = '🤖';
    }
    
    return { emoji, colorClass };
  };
  
  const avatarDisplay = getAvatarDisplay();
  
  // Check if we need to offer an emotion check-in
  const shouldOfferCheckIn = () => {
    if (!latestEmotion) return true;
    
    // Check if last emotion check-in was more than 4 hours ago
    const lastCheckIn = new Date(latestEmotion.loggedAt);
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    
    return lastCheckIn < fourHoursAgo;
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat toggle button */}
      <Button 
        onClick={toggleChat}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : `bg-${buddyProfile?.avatarColor || 'indigo'}-500 hover:bg-${buddyProfile?.avatarColor || 'indigo'}-600`
        )}
      >
        {isOpen ? <X size={24} /> : (
          <div className="flex items-center justify-center">
            <span role="img" aria-label="buddy avatar" className="text-xl">
              {avatarDisplay.emoji}
            </span>
          </div>
        )}
      </Button>
      
      {/* Chat window */}
      {isOpen && (
        <Card className="absolute bottom-16 left-0 w-80 md:w-96 shadow-xl border-2 border-primary/20">
          <CardHeader className={cn("py-3", avatarDisplay.colorClass)}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-md flex items-center gap-2">
                <span role="img" aria-label="buddy avatar" className="text-xl">
                  {avatarDisplay.emoji}
                </span>
                {buddyProfile?.name || 'Learning Buddy'}
              </CardTitle>
              <div className="flex space-x-1">
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => setIsCheckingIn(true)}
                >
                  <Smile size={15} />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => setIsCustomizing(true)}
                >
                  <Settings size={15} />
                </Button>
              </div>
            </div>
            <CardDescription>
              {buddyProfile?.personalityType === 'encouraging' && 'Your supportive learning companion'}
              {buddyProfile?.personalityType === 'analytical' && 'Your problem-solving assistant'}
              {buddyProfile?.personalityType === 'creative' && 'Your imaginative learning partner'}
              {buddyProfile?.personalityType === 'motivational' && 'Your motivational study coach'}
              {buddyProfile?.personalityType === 'friendly' && 'Your friendly learning companion'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            {shouldOfferCheckIn() && !isLoadingEmotion && !isLoadingProfile && (
              <div className="p-3 bg-primary/5 border-b">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-primary h-4 w-4" />
                  <p className="text-sm font-medium">How are you feeling today?</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Checking in on your emotions helps your buddy understand you better.
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setIsCheckingIn(true)}
                >
                  Quick Check-in
                </Button>
              </div>
            )}
            
            <ScrollArea className="h-72 p-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">Loading your conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="text-primary h-6 w-6 mb-2" />
                  <p className="text-muted-foreground text-sm mb-1">Welcome to your personal learning buddy!</p>
                  <p className="text-xs text-muted-foreground">
                    Ask questions, share your thoughts, or just chat about your learning journey.
                  </p>
                </div>
              ) : (
                messages.map((message: any) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "mb-4 max-w-[85%] rounded-lg p-3",
                      !message.isFromBuddy 
                        ? "ml-auto bg-primary text-primary-foreground" 
                        : `${avatarDisplay.colorClass} border`
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 pt-2">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Chat with your buddy..."
                className="flex-1"
                disabled={!userId}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-10 w-10"
                disabled={!input.trim() || !userId || sendMessageMutation.isPending}
              >
                <Send size={16} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      
      {/* Customization Dialog */}
      <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Your Buddy</DialogTitle>
            <DialogDescription>
              Make your learning companion uniquely yours!
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="buddy-name">Name</Label>
                  <Input
                    id="buddy-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Give your buddy a name"
                  />
                </div>
                
                <div>
                  <Label>Avatar Type</Label>
                  <RadioGroup
                    value={customAvatar}
                    onValueChange={setCustomAvatar}
                    className="grid grid-cols-2 gap-2 mt-2"
                  >
                    {avatarTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={`avatar-${type.value}`} />
                        <Label htmlFor={`avatar-${type.value}`} className="cursor-pointer">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div>
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {avatarColors.map((color) => (
                      <div 
                        key={color.value}
                        className={cn(
                          "h-8 rounded-full border-2 cursor-pointer flex items-center justify-center",
                          color.class,
                          customColor === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                        )}
                        onClick={() => setCustomColor(color.value)}
                      >
                        {customColor === color.value && <Check className="h-4 w-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="personality" className="space-y-4 mt-4">
              <div>
                <Label>Buddy's Personality</Label>
                <RadioGroup
                  value={customPersonality}
                  onValueChange={setCustomPersonality}
                  className="grid grid-cols-1 gap-2 mt-2"
                >
                  {personalityTypes.map((type) => (
                    <div 
                      key={type.value} 
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-md border",
                        customPersonality === type.value ? "bg-primary/10 border-primary" : ""
                      )}
                    >
                      <RadioGroupItem value={type.value} id={`personality-${type.value}`} />
                      <div>
                        <Label htmlFor={`personality-${type.value}`} className="cursor-pointer font-medium">
                          {type.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {type.value === 'encouraging' && 'Supportive and positive. Celebrates your wins and encourages during challenges.'}
                          {type.value === 'analytical' && 'Logical and detail-oriented. Helps break down complex problems step by step.'}
                          {type.value === 'creative' && 'Imaginative and inspirational. Offers unique perspectives and creative approaches.'}
                          {type.value === 'motivational' && 'Energetic and goal-focused. Keeps you motivated and on track with your objectives.'}
                          {type.value === 'friendly' && 'Warm and conversational. Makes learning feel like chatting with a friend.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCustomizing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Emotion Check-in Dialog */}
      <Dialog open={isCheckingIn} onOpenChange={setIsCheckingIn}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>
              Your buddy wants to understand your mood and emotions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-2 py-4">
            {emotions.map((emotion) => (
              <div 
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={cn(
                  "flex flex-col items-center p-2 rounded-md cursor-pointer transition-all",
                  selectedEmotion === emotion.value 
                    ? "bg-primary/20 border border-primary" 
                    : "border hover:bg-muted"
                )}
              >
                <span role="img" aria-label={emotion.label} className="text-2xl mb-1">
                  {emotion.emoji}
                </span>
                <span className="text-xs">{emotion.label}</span>
              </div>
            ))}
          </div>
          
          {selectedEmotion && (
            <>
              <div className="space-y-2">
                <Label>Intensity</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Mild</span>
                  <Slider
                    value={[emotionIntensity]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(values) => setEmotionIntensity(values[0])}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground">Strong</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emotion-note">Add a note (optional)</Label>
                <Input
                  id="emotion-note"
                  placeholder="What's making you feel this way?"
                  value={emotionNote}
                  onChange={(e) => setEmotionNote(e.target.value)}
                />
              </div>
            </>
          )}
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsCheckingIn(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEmotionCheckIn}
              disabled={!selectedEmotion || recordEmotionMutation.isPending}
            >
              {recordEmotionMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Smile className="h-4 w-4 mr-2" />
              )}
              Save Check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Buddy;