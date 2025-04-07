import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Smile, Sparkles, Settings, Edit, RefreshCw, Check, ActivitySquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  { value: 'friendly_supportive', label: '💛 Friendly & Supportive', 
    description: 'Encouraging, soft, always on your side. Warm, nurturing, and guides your growth with gentle positive reinforcement.' },
  { value: 'chill_funny', label: '😎 Chill & Funny', 
    description: 'Relaxed, humorous, easygoing. Uses humor to make learning fun, and keeps the mood light while still being helpful.' },
  { value: 'focused_motivational', label: '🔥 Motivational & Focused', 
    description: 'Pushes you to grow and level up. Goal-oriented, energetic, and helps you achieve your full potential.' },
  { value: 'curious_reflective', label: '🧠 Curious & Reflective', 
    description: 'Thoughtful, loves to explore deep topics with you. Asks deep questions and helps you reflect on ideas and feelings.' }
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
    // Legacy type handling for backward compatibility
    friendly: [
      "Hey friend! That's a great question.",
      "I'm so glad you asked me about that!",
      "We make a great team, don't we?",
      "I'm enjoying our conversation! Tell me more about what you're learning."
    ],
    
    // New personality types
    friendly_supportive: [
      "I'm really proud of how you're tackling this! What can I help with next?",
      "You're making wonderful progress. Remember, it's okay to take your time with difficult concepts.",
      "I believe in you! Every question you ask shows your commitment to learning.",
      "Learning together is so rewarding. I'm here to support you every step of the way!"
    ],
    chill_funny: [
      "No stress, we've got this! Learning is a marathon, not a sprint.",
      "Hmm, that's an interesting challenge. Let's tackle it with a smile!",
      "Knowledge is power... and also pretty fun when you get the hang of it!",
      "Think of this as a puzzle we're solving together. No pressure, just exploration."
    ],
    focused_motivational: [
      "Let's set a clear goal for today's session. What specific skill do you want to master?",
      "I see your potential! Let's channel that energy into mastering this concept.",
      "Every minute of focused practice brings you closer to your goals. Let's make this count!",
      "You're developing skills that will serve you for a lifetime. Let's keep building your momentum!"
    ],
    curious_reflective: [
      "That's fascinating... I wonder how this connects to what you learned earlier?",
      "What aspects of this topic intrigue you the most? Let's explore those deeper questions.",
      "Sometimes the best learning happens when we pause to reflect. What patterns are you noticing?",
      "The questions you're asking show real depth of thought. Let's unpack this together."
    ]
  };
  
  // Content-specific responses - greeting messages
  if (normalizedMsg.includes("hello") || normalizedMsg.includes("hi ")) {
    switch(personalityType) {
      case 'friendly_supportive':
        return "Hello there! I'm so happy to see you! How can I support your learning journey today?";
      case 'chill_funny':
        return "Hey there! Good to see you! Ready to make some progress today? No pressure, we'll take it at your pace.";
      case 'focused_motivational':
        return "Hi there! Ready to make today count? What learning goals are we conquering today?";
      case 'curious_reflective':
        return "Hello! I was just wondering what interesting questions might be on your mind today. What would you like to explore?";
      default:
        return "Hello there! I'm your learning buddy. What would you like to chat about today?";
    }
  }
  
  // Help, stuck, or confused
  if (normalizedMsg.includes("help") || normalizedMsg.includes("stuck") || normalizedMsg.includes("confused")) {
    switch(personalityType) {
      case 'friendly_supportive':
        return "It's completely normal to feel stuck sometimes! Everyone encounters challenges while learning. Tell me more about what you're struggling with, and we'll work through it together with patience.";
      case 'chill_funny':
        return "Hitting a wall? No worries—even Einstein got stumped sometimes! Let's break this down into bite-sized pieces that are easier to digest. What part has you scratching your head?";
      case 'focused_motivational':
        return "This is just a temporary roadblock, not a dead end! Let's identify exactly what's challenging you, create a clear plan to overcome it, and get you back on track toward your goals.";
      case 'curious_reflective':
        return "Interesting... confusion often signals we're at the edge of our understanding. What specifically feels unclear? And what insights have you gained so far that might help us explore this puzzle?";
      default:
        return "I'm here to help! Let me know what you're finding difficult, and we can figure it out together.";
    }
  }
  
  // Learning and studying
  if (normalizedMsg.includes("learn") || normalizedMsg.includes("study") || normalizedMsg.includes("course")) {
    switch(personalityType) {
      case 'friendly_supportive':
        return "I'm really proud of you for focusing on your education! Learning takes courage and persistence. What subject are you exploring, and how can I support you with it?";
      case 'chill_funny':
        return "Cool! Let's make this study session actually enjoyable—I know, shocking concept, right? What are we diving into today? I promise we'll find the interesting parts!";
      case 'focused_motivational':
        return "Excellent choice to invest in your education! Each study session builds your knowledge foundation and brings you closer to your goals. What specific subject are you tackling today?";
      case 'curious_reflective':
        return "The pursuit of knowledge is such a fascinating journey. What aspects of this subject spark your curiosity the most? What questions are you hoping to answer?";
      default:
        return "I'm excited to help you with your learning journey! What specific area would you like to explore together?";
    }
  }
  
  // Tired or needing a break
  if (normalizedMsg.includes("tired") || normalizedMsg.includes("break") || normalizedMsg.includes("rest")) {
    switch(personalityType) {
      case 'friendly_supportive':
        return "I completely understand that feeling! Listening to your body and mind is so important. Taking restful breaks actually helps your brain process what you've learned. Maybe try a short walk or some deep breathing?";
      case 'chill_funny':
        return "Brain asking for a timeout? Totally fair! Even computers need to restart sometimes. Grab a snack, do a quick dance party, or just stare at a wall for a bit—whatever recharges your battery!";
      case 'focused_motivational':
        return "Strategic breaks are part of peak performance! Try a 10-minute active break—a quick walk or stretch session will increase your blood flow and help you return with renewed focus and energy.";
      case 'curious_reflective':
        return "Interesting how our minds signal when they need rest. Have you noticed patterns in when you feel tired while learning? A short break doing something completely different might give your mind the space it needs to process.";
      default:
        return "Taking breaks is an important part of effective learning! Your brain needs time to process information. Maybe try a 10-minute walk or some quick stretches before coming back to your studies.";
    }
  }
  
  // Creative ideas or inspiration
  if (normalizedMsg.includes("idea") || normalizedMsg.includes("creative") || normalizedMsg.includes("inspiration")) {
    switch(personalityType) {
      case 'friendly_supportive':
        return "Your creative thinking is one of your greatest strengths! What if you try connecting different concepts you've learned? Sometimes the most insightful ideas come from unexpected connections.";
      case 'chill_funny':
        return "Need a creativity boost? Try the 'worst idea' technique—think of the most ridiculous solutions possible, then work backward to something practical. Plus, it's pretty entertaining!";
      case 'focused_motivational':
        return "Creative challenges are opportunities to distinguish yourself! Try setting a timer for 10 minutes and rapidly generate as many ideas as possible without judgment. Quantity often leads to quality!";
      case 'curious_reflective':
        return "I wonder what would happen if you looked at this from a completely different perspective? Perhaps consider how someone from a different field might approach this challenge. What patterns or principles might transfer?";
      default:
        return "Let's spark some creativity! Try looking at the problem from a different angle, or take a short break to let your mind wander. Sometimes our best ideas come when we're not actively searching for them.";
    }
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
  
  // Listen for events from dashboard to open the buddy panel
  useEffect(() => {
    const handleBuddyToggle = (e: CustomEvent) => {
      if (e.detail.action === 'open') {
        setIsOpen(true);
      } else if (e.detail.action === 'customize') {
        setIsOpen(true);
        setIsCustomizing(true);
      }
    };
    
    window.addEventListener('buddyToggle', handleBuddyToggle as EventListener);
    
    return () => {
      window.removeEventListener('buddyToggle', handleBuddyToggle as EventListener);
    };
  }, []);
  
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
  
  // Function to send creative prompts based on personality type
  const handleCreativePrompt = () => {
    if (!userId) return;
    
    // Get personality-specific creative prompt
    let prompt = "";
    const personalityType = buddyProfile?.personalityType || 'friendly_supportive';
    
    switch(personalityType) {
      case 'friendly_supportive':
        prompt = "Wanna dream up something together? Maybe a cool future house?";
        break;
      case 'chill_funny':
        prompt = "You draw? Let's make something wild.";
        break;
      case 'focused_motivational':
        prompt = "Let's build something that proves you're leveling up.";
        break;
      case 'curious_reflective':
        prompt = "What would a story look like if it was *your* life in 10 years?";
        break;
      default:
        prompt = "Let's create something together! What would you like to explore?";
    }
    
    // Send buddy message with creative prompt
    sendMessageMutation.mutate({
      content: prompt,
      isFromBuddy: true
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
    <TooltipProvider>
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
              <div className="flex space-x-2">
                {/* Quick personality selector */}
                <Select 
                  value={buddyProfile?.personalityType || 'friendly_supportive'} 
                  onValueChange={(value) => {
                    if (userId) {
                      updateProfileMutation.mutate({
                        personalityType: value
                      });
                    }
                  }}
                >
                  <SelectTrigger className="h-7 w-[130px] text-xs">
                    <SelectValue placeholder="Buddy's Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-xs">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => setIsCheckingIn(true)}
                  title="How are you feeling?"
                >
                  <Smile size={15} />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={() => setIsCustomizing(true)}
                  title="Settings"
                >
                  <Settings size={15} />
                </Button>
              </div>
            </div>
            <CardDescription>
              {buddyProfile?.personalityType === 'friendly_supportive' && 'Your warm and encouraging learning companion'}
              {buddyProfile?.personalityType === 'chill_funny' && 'Your laid-back, fun-loving study partner'}
              {buddyProfile?.personalityType === 'focused_motivational' && 'Your goal-oriented achievement coach'}
              {buddyProfile?.personalityType === 'curious_reflective' && 'Your thoughtful, questioning guide'}
              {/* Legacy types for backward compatibility */}
              {buddyProfile?.personalityType === 'encouraging' && 'Your supportive learning companion'}
              {buddyProfile?.personalityType === 'analytical' && 'Your problem-solving assistant'}
              {buddyProfile?.personalityType === 'creative' && 'Your imaginative learning partner'}
              {buddyProfile?.personalityType === 'motivational' && 'Your motivational study coach'}
              {buddyProfile?.personalityType === 'friendly' && 'Your friendly learning companion'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Welcome message for student when opening the chat */}
            {messages.length === 0 && !isLoadingMessages && (
              <div className="p-4 bg-primary/5 border-b">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  <p className="text-sm font-medium">
                    {buddyProfile?.personalityType === 'friendly_supportive' && 
                      `Hiya, ${user?.firstName || 'there'}! You ready to grow today? 💪`}
                    {buddyProfile?.personalityType === 'chill_funny' && 
                      `Heyyo ${user?.firstName || 'there'} 😎 What's up?`}
                    {buddyProfile?.personalityType === 'focused_motivational' && 
                      `Let's get it, ${user?.firstName || 'there'}! Another step forward starts now.`}
                    {buddyProfile?.personalityType === 'curious_reflective' && 
                      `Welcome back, ${user?.firstName || 'there'}. Let's explore something meaningful today.`}
                    {!buddyProfile?.personalityType && 
                      `Hey ${user?.firstName || 'there'}! Ready to learn and grow?`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-7">
                  I'm here to help you with your studies, track your progress, and celebrate your wins!
                </p>
              </div>
            )}
            
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
          
          <CardFooter className="flex-col gap-2 p-3 pt-2">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCreativePrompt}
                    >
                      <Sparkles size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Get a creative prompt</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsCheckingIn(true)}
                    >
                      <ActivitySquare size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Check in with your emotions</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsCustomizing(true)}
                  >
                    <Settings size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Customize your buddy</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customize Your Buddy</DialogTitle>
            <DialogDescription>
              Make your learning companion uniquely yours!
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appearance">Avatar</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="history">Chat History</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Chat History</h4>
                  <Button variant="outline" size="sm" className="h-8">
                    Export Chat
                  </Button>
                </div>

                <div className="border rounded-md">
                  <div className="p-3 bg-muted flex items-center justify-between border-b">
                    <span className="text-xs font-medium">Conversation History</span>
                    <span className="text-xs text-muted-foreground">{messages.length} messages</span>
                  </div>
                  <ScrollArea className="h-[200px] p-3">
                    {messages.length > 0 ? (
                      messages.map((message: any, i: number) => (
                        <div key={i} className="pb-2 mb-2 border-b border-dashed last:border-0 last:mb-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium">
                              {message.isFromBuddy ? buddyProfile?.name || 'Buddy' : 'You'}
                            </span>
                            <time className="text-xs text-muted-foreground">
                              {new Date(message.sentAt).toLocaleString()}
                            </time>
                          </div>
                          <p className="text-xs">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        No conversation history yet
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <div className="flex">
                  <Button variant="outline" size="sm" className="w-full flex items-center">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Clear Conversation History
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Privacy Settings</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Control how your buddy uses and stores your information.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="save-chat" defaultChecked />
                    <div>
                      <Label htmlFor="save-chat" className="text-sm font-medium">Save Chat History</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow Buddy to remember your conversations for more personalized responses.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox id="emotion-tracking" defaultChecked />
                    <div>
                      <Label htmlFor="emotion-tracking" className="text-sm font-medium">Emotion Tracking</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow Buddy to track and respond to your emotional patterns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox id="learning-patterns" defaultChecked />
                    <div>
                      <Label htmlFor="learning-patterns" className="text-sm font-medium">Learning Pattern Analysis</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow Buddy to analyze your learning patterns to provide better recommendations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox id="data-sharing" />
                    <div>
                      <Label htmlFor="data-sharing" className="text-sm font-medium">Data Sharing with Teachers</Label>
                      <p className="text-xs text-muted-foreground">
                        Share your learning insights with teachers and mentors to help with guidance.
                      </p>
                    </div>
                  </div>
                </div>
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
            <DialogTitle>
              {buddyProfile?.personalityType === 'friendly_supportive' && "How are you feeling today? I'm all ears."}
              {buddyProfile?.personalityType === 'chill_funny' && "Feeling good, meh, or need a snack and a nap? 😂"}
              {buddyProfile?.personalityType === 'focused_motivational' && "What's your vibe today — fire, focus, or figuring it out?"}
              {buddyProfile?.personalityType === 'curious_reflective' && "Where's your heart today? Calm, cloudy, excited?"}
              {!buddyProfile?.personalityType && "How are you feeling?"}
            </DialogTitle>
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
    </TooltipProvider>
  );
}



