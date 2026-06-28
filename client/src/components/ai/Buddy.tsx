import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Smile, Sparkles, Settings, Edit, RefreshCw, Check, ActivitySquare, Brain, Heart, Timer, ExternalLink, PenTool, Lightbulb, Briefcase, Globe, Shuffle, Star, GraduationCap, Rocket, Wand, BookOpen, TrendingUp, Zap, ArrowRight, Target, Award, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
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
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'sad', label: 'Sad', emoji: '😞' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😠' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'proud', label: 'Proud', emoji: '😌' }
];

// Support actions for emotional tools
const supportActions = [
  { value: 'breathe', label: 'Take a Breather', emoji: '💨', 
    description: 'A guided 1-minute deep breathing exercise' },
  { value: 'mood_lifter', label: 'Quick Mood Lifter', emoji: '🎵', 
    description: 'A suggestion to lift your mood like a song, fact, or joke' },
  { value: 'vent', label: 'Vent Journal', emoji: '📝', 
    description: 'A space to write out what\'s on your mind' },
  { value: 'grounding', label: 'Grounding Exercise', emoji: '🧘', 
    description: 'A calming visualization to help you feel centered' }
];

// Emotional support preference options
const supportPreferences = [
  { value: 'just_listen', label: 'Just listen' },
  { value: 'cheer_up', label: 'Cheer me up' },
  { value: 'help_focus', label: 'Help me focus' }
];

// Creative mode options
const creativeOptions = [
  { value: 'story', label: '✍️ Let\'s Write a Story', 
    icon: PenTool, description: 'Create interesting characters and plots together' },
  { value: 'invention', label: '🧠 Invent Something New', 
    icon: Lightbulb, description: 'Design a cool invention to solve a problem' },
  { value: 'business', label: '💼 Start a Business', 
    icon: Briefcase, description: 'Make a plan for your first mini-business' },
  { value: 'future', label: '🌎 Design Your Dream Future', 
    icon: Globe, description: 'Explore your ideal future in 10 years' },
  { value: 'surprise', label: '🔁 Surprise Me!', 
    icon: Shuffle, description: 'Get a random creative challenge' }
];

// Story type options
const storyTypes = [
  { value: 'adventure', label: 'Adventure', description: 'An exciting journey with challenges and discovery' },
  { value: 'funny', label: 'Funny', description: 'A humorous tale that will make people laugh' },
  { value: 'mystery', label: 'Mystery', description: 'An intriguing puzzle waiting to be solved' },
  { value: 'real_life', label: 'Real Life', description: 'A story based on everyday experiences' },
  { value: 'fantasy', label: 'Fantasy', description: 'A magical world of imagination and wonder' }
];

// Surprise creative prompts
const surprisePrompts = [
  "Design a new holiday that celebrates learning",
  "Create a superhero based on your favorite school subject",
  "Invent a game that teaches something important",
  "Design a treehouse with three amazing features",
  "Create a new animal by combining three existing ones",
  "Imagine a world where kids make all the rules",
  "Design a restaurant with the most unusual theme",
  "Create a new sport that anyone can play",
  "Invent a machine that solves an everyday problem",
  "Design a perfect day from morning to night"
];

// Student learning profile for personalized recommendations
const studentProgress = {
  name: "Alex",
  ageGroup: "13-15",
  completedModules: ["Self Discovery", "Intro to Money"],
  inProgressModules: ["Financial Literacy"],
  favoriteSubjects: ["Entrepreneurship", "Technology"],
  goals: ["Start a side hustle", "Learn to code"],
  strengths: ["Creative thinking", "Problem solving"],
  areasToImprove: ["Time management", "Long-term planning"],
  tone: "Motivational"
};

// Available modules data model
const availableModules = [
  { 
    id: 1, 
    title: "Financial Literacy: Advanced", 
    description: "Learn about budgeting, saving, and making financial decisions", 
    path: "/learn/financial-literacy-advanced",
    level: "intermediate",
    category: "Financial Literacy",
    matchesGoal: "Start a side hustle"
  },
  { 
    id: 2, 
    title: "How to Make a Budget", 
    description: "Step-by-step guide to creating and sticking to a budget", 
    path: "/learn/how-to-make-a-budget",
    level: "beginner",
    category: "Financial Literacy",
    matchesGoal: "Start a side hustle"
  },
  { 
    id: 3, 
    title: "Introduction to Web Development", 
    description: "Learn the basics of HTML, CSS, and JavaScript", 
    path: "/learn/intro-to-web-development",
    level: "beginner",
    category: "Technology",
    matchesGoal: "Learn to code"
  },
  { 
    id: 4, 
    title: "Entrepreneurship Fundamentals", 
    description: "Learn the basics of starting and running a business", 
    path: "/learn/entrepreneurship-fundamentals",
    level: "beginner",
    category: "Entrepreneurship",
    matchesGoal: "Start a side hustle"
  },
  { 
    id: 5, 
    title: "Self-Discovery: Goals & Dreams", 
    description: "Explore what matters to you and set meaningful life goals", 
    path: "/learn/self-discovery-goals",
    level: "intermediate",
    category: "Self Discovery",
    matchesGoal: "Start a side hustle"
  }
];

// Projects data model
const availableProjects = [
  {
    id: 1,
    title: "Plan a Party on a Budget",
    description: "Apply financial planning skills to organize an event within budget constraints",
    path: "/projects/party-budget",
    category: "Financial Literacy",
    skills: ["Budgeting", "Planning"],
    timeNeeded: "3-5 hours",
    difficulty: "Medium"
  },
  {
    id: 2,
    title: "Create Your First Webpage",
    description: "Build a personal webpage using HTML and CSS",
    path: "/projects/first-webpage",
    category: "Technology",
    skills: ["Coding", "Design"],
    timeNeeded: "2-3 hours",
    difficulty: "Easy"
  },
  {
    id: 3,
    title: "Design a Mini Business Plan",
    description: "Create a business plan for a simple product or service",
    path: "/projects/mini-business-plan",
    category: "Entrepreneurship",
    skills: ["Planning", "Research"],
    timeNeeded: "4-6 hours",
    difficulty: "Medium"
  }
];

// Quick challenges data model
const quickChallenges = [
  {
    id: 1,
    title: "Track your spending for 2 days",
    description: "Write down everything you spend money on for two days",
    category: "Financial Literacy",
    timeNeeded: "10 minutes",
    requirement: "Financial Literacy"
  },
  {
    id: 2,
    title: "Identify three ways to earn money with your skills",
    description: "Brainstorm three ways you could use your current skills to earn money",
    category: "Entrepreneurship",
    timeNeeded: "15 minutes",
    requirement: "Entrepreneurship"
  },
  {
    id: 3,
    title: "Find and fix one bug in some code",
    description: "Find a simple bug in provided code and fix it",
    category: "Technology",
    timeNeeded: "20 minutes",
    requirement: "Technology"
  }
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
  const [selectedSupportAction, setSelectedSupportAction] = useState<string | null>(null);
  const [showFeelingTools, setShowFeelingTools] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [supportPreference, setSupportPreference] = useState<string>('none');
  
  // Creative mode states
  const [isCreativeMode, setIsCreativeMode] = useState(false);
  const [selectedCreativeOption, setSelectedCreativeOption] = useState<string | null>(null);
  const [creativePrompt, setCreativePrompt] = useState('');
  const [creativeResponse, setCreativeResponse] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [storyType, setStoryType] = useState('');
  const [mainCharacter, setMainCharacter] = useState('');
  const [storyLocation, setStoryLocation] = useState('');
  const [storyTwist, setStoryTwist] = useState('');
  const [problemToSolve, setProblemToSolve] = useState('');
  const [businessIdea, setBusinessIdea] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [futureLocation, setFutureLocation] = useState('');
  const [futureDreamJob, setFutureDreamJob] = useState('');
  const [selectedSurprisePrompt, setSelectedSurprisePrompt] = useState('');
  
  // Recommendation feature states
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendationType, setRecommendationType] = useState<'all' | 'lesson' | 'project' | 'challenge'>('all');
  const [recommendedLesson, setRecommendedLesson] = useState<any | null>(null);
  const [recommendedProject, setRecommendedProject] = useState<any | null>(null);
  const [recommendedChallenge, setRecommendedChallenge] = useState<any | null>(null);
  const [recommendationReason, setRecommendationReason] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [showWeeklyChallenge, setShowWeeklyChallenge] = useState(false);
  
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
    mutationFn: (emotionData: { 
      emotion: string, 
      intensity: number, 
      note: string | null,
      supportAction?: string | null,
      reflectionText?: string | null
    }) => {
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
      note: emotionNote || null,
      supportAction: selectedSupportAction,
      reflectionText: reflectionText || null
    });
    
    // If it's a challenging emotion, suggest a support tool or reflection
    if (['sad', 'frustrated', 'anxious', 'tired'].includes(selectedEmotion)) {
      setTimeout(() => {
        // Send buddy message with supportive response
        const personalityType = buddyProfile?.personalityType || 'friendly_supportive';
        let message = "";
        
        switch(personalityType) {
          case 'friendly_supportive':
            message = `I notice you're feeling ${selectedEmotion}. That's completely okay. Would you like to try one of my feeling tools to help with that?`;
            break;
          case 'chill_funny':
            message = `Feeling ${selectedEmotion}, huh? No worries - we all have those days! Want to check out some quick tools that might help?`;
            break;
          case 'focused_motivational':
            message = `I see you're feeling ${selectedEmotion}. Let's tackle this head-on. I have some tools that might help shift your energy. Want to try?`;
            break;
          case 'curious_reflective':
            message = `Interesting that you're feeling ${selectedEmotion} today. Would you like to explore that a bit with some tools I have, or perhaps reflect on it together?`;
            break;
          default:
            message = `Thanks for sharing that you're feeling ${selectedEmotion}. Would you like to try a feeling tool?`;
        }
        
        sendMessageMutation.mutate({
          content: message,
          isFromBuddy: true
        });
        
        // Show feeling tools after a short delay
        setTimeout(() => {
          setShowFeelingTools(true);
        }, 500);
      }, 1000);
    }
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
                  onClick={() => setIsCreativeMode(true)}
                  title="Create with me"
                >
                  <Wand size={15} />
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
                      onClick={() => setIsRecommending(true)}
                    >
                      <BookOpen size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Suggest Something to Learn</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsCreativeMode(true)}
                    >
                      <Wand size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Create with Buddy</p>
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
              
              {/* Support tools for challenging emotions */}
              {['sad', 'frustrated', 'anxious', 'tired'].includes(selectedEmotion) && (
                <div className="space-y-3 mt-3 pt-3 border-t">
                  <Label>Would you like support with this feeling?</Label>
                  <RadioGroup value={supportPreference} onValueChange={setSupportPreference} className="gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="support-none" />
                      <Label htmlFor="support-none" className="text-sm font-normal">Just note it, thanks!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tools" id="support-tools" />
                      <Label htmlFor="support-tools" className="text-sm font-normal">Show me support tools</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reflection" id="support-reflection" />
                      <Label htmlFor="support-reflection" className="text-sm font-normal">Guide me through reflection</Label>
                    </div>
                  </RadioGroup>
                  
                  {supportPreference === 'tools' && (
                    <div className="space-y-2 pt-2">
                      <Label>Select a support action</Label>
                      <Select value={selectedSupportAction || ''} onValueChange={setSelectedSupportAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a support tool" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breathing">Guided breathing</SelectItem>
                          <SelectItem value="gratitude">Gratitude practice</SelectItem>
                          <SelectItem value="reframe">Thought reframing</SelectItem>
                          <SelectItem value="timeout">Take a mindful pause</SelectItem>
                          <SelectItem value="affirmations">Positive affirmations</SelectItem>
                          <SelectItem value="visualization">Peaceful visualization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {supportPreference === 'reflection' && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="reflection-text">Quick reflection</Label>
                      <Textarea
                        id="reflection-text"
                        placeholder={
                          selectedEmotion === 'sad' ? "What's one small thing that might help shift this feeling?" :
                          selectedEmotion === 'anxious' ? "What's a worry you could let go of right now?" :
                          selectedEmotion === 'frustrated' ? "What could you focus on that's within your control?" :
                          "What's one thing your body or mind needs right now?"
                        }
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
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
      
      {/* Emotional Support Tools Dialog */}
      <Dialog open={showFeelingTools} onOpenChange={setShowFeelingTools}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Feeling Tools</DialogTitle>
            <DialogDescription>
              These tools can help you process and shift your emotions
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="tools">Quick Tools</TabsTrigger>
              <TabsTrigger value="breathe">Breathing</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 cursor-pointer hover:border-primary" onClick={() => setIsReflecting(true)}>
                  <div className="flex flex-col items-center text-center">
                    <Brain className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="text-sm font-medium">Thought Reframing</h4>
                    <p className="text-xs text-muted-foreground mt-1">Transform negative thoughts</p>
                  </div>
                </Card>
                
                <Card className="p-3 cursor-pointer hover:border-primary">
                  <div className="flex flex-col items-center text-center">
                    <Heart className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="text-sm font-medium">Gratitude</h4>
                    <p className="text-xs text-muted-foreground mt-1">Find things to appreciate</p>
                  </div>
                </Card>
                
                <Card className="p-3 cursor-pointer hover:border-primary">
                  <div className="flex flex-col items-center text-center">
                    <Sparkles className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="text-sm font-medium">Affirmations</h4>
                    <p className="text-xs text-muted-foreground mt-1">Positive self-talk</p>
                  </div>
                </Card>
                
                <Card className="p-3 cursor-pointer hover:border-primary">
                  <div className="flex flex-col items-center text-center">
                    <Timer className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="text-sm font-medium">Break Timer</h4>
                    <p className="text-xs text-muted-foreground mt-1">Mindful timeout</p>
                  </div>
                </Card>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowFeelingTools(false)}
              >
                I'll try these later
              </Button>
            </TabsContent>
            
            <TabsContent value="breathe" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute animate-ping rounded-full h-32 w-32 bg-primary/10"></div>
                  <div className="absolute animate-pulse rounded-full h-24 w-24 bg-primary/20"></div>
                  <div className="rounded-full h-16 w-16 bg-primary/30 flex items-center justify-center text-white font-medium">
                    Breathe
                  </div>
                </div>
                <p className="text-sm mt-6 text-center text-muted-foreground">
                  Breathe in for 4 counts<br />
                  Hold for 4 counts<br />
                  Exhale for 6 counts
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowFeelingTools(false)}
              >
                I feel calmer now
              </Button>
            </TabsContent>
            
            <TabsContent value="journal" className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Writing about your feelings can help process them. Try one of these prompts:
                </p>
                
                <div className="space-y-2">
                  <div className="p-2 rounded-md bg-muted cursor-pointer hover:bg-muted/80">
                    <p className="text-sm">I'm feeling this way because...</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted cursor-pointer hover:bg-muted/80">
                    <p className="text-sm">One small step I could take is...</p>
                  </div>
                  <div className="p-2 rounded-md bg-muted cursor-pointer hover:bg-muted/80">
                    <p className="text-sm">Something that always helps me feel better is...</p>
                  </div>
                </div>
                
                <div onClick={() => {
                  setShowFeelingTools(false);
                  window.location.href = '/journal';
                }} className="text-sm text-primary flex items-center cursor-pointer">
                  <ExternalLink size={12} className="mr-1" /> Open full journal
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowFeelingTools(false)}
              >
                Close
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Reflection Dialog */}
      <Dialog open={isReflecting} onOpenChange={setIsReflecting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thought Reframing</DialogTitle>
            <DialogDescription>
              Transform challenging thoughts into more balanced perspectives
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Challenging thought</Label>
              <Textarea
                placeholder="What thought is troubling you? For example: 'I'll never understand this math concept'"
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>How true is this thought? (0-100%)</Label>
              <Slider
                min={0}
                max={100}
                step={10}
                defaultValue={[70]}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Evidence that supports this thought</Label>
              <Textarea
                placeholder="What makes you believe this thought is true?"
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Evidence that doesn't support this thought</Label>
              <Textarea
                placeholder="What facts suggest this thought might not be completely true?"
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label>More balanced thought</Label>
              <Textarea
                placeholder="How could you rephrase this thought to be more accurate and helpful?"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReflecting(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsReflecting(false);
              toast({
                title: "Reflection saved",
                description: "Your reframed thought has been saved to your journal"
              });
            }}>
              Save to Journal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Creative Mode Dialog */}
      <Dialog open={isCreativeMode} onOpenChange={setIsCreativeMode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand className="h-5 w-5 text-primary" />
              Create with {buddyProfile?.name || 'Buddy'}
            </DialogTitle>
            <DialogDescription>
              Let's make something amazing together! What would you like to create?
            </DialogDescription>
          </DialogHeader>
          
          {!selectedCreativeOption ? (
            <div className="grid grid-cols-1 gap-3 py-4">
              {creativeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="flex justify-start items-center p-3 h-auto"
                  onClick={() => {
                    setSelectedCreativeOption(option.value);
                    if (option.value === 'surprise') {
                      // Select a random surprise prompt
                      const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
                      setSelectedSurprisePrompt(randomPrompt);
                    }
                  }}
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <option.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <>
              {/* Story Builder */}
              {selectedCreativeOption === 'story' && (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-3 rounded-md border">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <PenTool className="h-4 w-4 text-primary" />
                      Let's Write a Story
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll create a fun story together, step-by-step.
                    </p>
                  </div>
                  
                  {!storyType ? (
                    <div className="space-y-3">
                      <Label>What kind of story would you like to write?</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {storyTypes.map((type) => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="justify-start h-auto p-2"
                            onClick={() => setStoryType(type.value)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : !mainCharacter ? (
                    <div className="space-y-3">
                      <Label>Who's your main character?</Label>
                      <Textarea 
                        placeholder="Describe your main character (name, age, what they're like)"
                        value={mainCharacter}
                        onChange={(e) => setMainCharacter(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!mainCharacter.trim()}
                        onClick={() => {
                          // Proceed to next step
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  ) : !storyLocation ? (
                    <div className="space-y-3">
                      <Label>Where does the story take place?</Label>
                      <Textarea 
                        placeholder="Describe the setting (location, time, weather, etc.)"
                        value={storyLocation}
                        onChange={(e) => setStoryLocation(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!storyLocation.trim()}
                        onClick={() => {
                          // Proceed to next step
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  ) : !storyTwist ? (
                    <div className="space-y-3">
                      <Label>What's the twist or challenge?</Label>
                      <Textarea 
                        placeholder="What unexpected thing happens? What problem must be solved?"
                        value={storyTwist}
                        onChange={(e) => setStoryTwist(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!storyTwist.trim()}
                        onClick={() => {
                          // Generate story
                          const storyParts = [
                            `Once upon a time, there was ${mainCharacter}.`,
                            `They lived in ${storyLocation}.`,
                            `One day, something unexpected happened: ${storyTwist}.`,
                            `This led to an amazing adventure...`
                          ];
                          setCreativeResponse(storyParts.join('\n\n'));
                        }}
                      >
                        Create Our Story!
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label>Our Story</Label>
                      <div className="bg-muted/50 p-3 rounded-md border text-sm">
                        {creativeResponse.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Save to journal
                          // For now, just show a toast message
                          toast({
                            title: "Story saved to journal",
                            description: "You can find your story in your journal anytime!"
                          });
                          
                          // Reset creative mode
                          setIsCreativeMode(false);
                          setSelectedCreativeOption(null);
                          setStoryType('');
                          setMainCharacter('');
                          setStoryLocation('');
                          setStoryTwist('');
                          setCreativeResponse('');
                        }}
                      >
                        Save to Journal
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Invention Generator */}
              {selectedCreativeOption === 'invention' && (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-3 rounded-md border">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Invent Something New
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Let's design a cool invention to solve a problem.
                    </p>
                  </div>
                  
                  {!problemToSolve ? (
                    <div className="space-y-3">
                      <Label>What problem would you like to solve?</Label>
                      <Textarea 
                        placeholder="Describe a problem that needs solving (e.g., 'forgetting to water plants')"
                        value={problemToSolve}
                        onChange={(e) => setProblemToSolve(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!problemToSolve.trim()}
                        onClick={() => {
                          // Generate invention idea
                          const inventionDescription = `Here's an invention to solve "${problemToSolve}":\n\n` +
                            `The Amazing Problem-Solver 3000!\n\n` +
                            `This clever device works by using special sensors to detect when the problem is about to happen, ` +
                            `and then uses its built-in technology to provide a solution automatically!\n\n` +
                            `Features:\n` +
                            `- Smart detection system\n` +
                            `- Eco-friendly power source\n` +
                            `- Fits in your pocket\n` +
                            `- Simple one-button operation`;
                          
                          setCreativeResponse(inventionDescription);
                        }}
                      >
                        Generate Invention
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label>Your Invention</Label>
                      <div className="bg-muted/50 p-3 rounded-md border text-sm">
                        {creativeResponse.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Save to journal
                          toast({
                            title: "Invention saved to journal",
                            description: "Your invention blueprint has been saved!"
                          });
                          
                          // Reset creative mode
                          setIsCreativeMode(false);
                          setSelectedCreativeOption(null);
                          setProblemToSolve('');
                          setCreativeResponse('');
                        }}
                      >
                        Save to Journal
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Mini Business Builder */}
              {selectedCreativeOption === 'business' && (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-3 rounded-md border">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Start a Business
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Let's create a plan for your first mini-business.
                    </p>
                  </div>
                  
                  {!businessIdea ? (
                    <div className="space-y-3">
                      <Label>What would you love to sell or offer?</Label>
                      <Textarea 
                        placeholder="Describe your business idea (product or service)"
                        value={businessIdea}
                        onChange={(e) => setBusinessIdea(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!businessIdea.trim()}
                        onClick={() => {
                          // Continue to next step
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  ) : !targetCustomer ? (
                    <div className="space-y-3">
                      <Label>Who would buy or use your {businessIdea}?</Label>
                      <Textarea 
                        placeholder="Describe your target customers"
                        value={targetCustomer}
                        onChange={(e) => setTargetCustomer(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!targetCustomer.trim()}
                        onClick={() => {
                          // Continue to next step
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  ) : !businessName ? (
                    <div className="space-y-3">
                      <Label>What will you call your business?</Label>
                      <Input
                        placeholder="Enter a catchy business name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!businessName.trim()}
                        onClick={() => {
                          // Generate business plan
                          const businessPlan = `## ${businessName}\n\n` +
                            `**Business Idea:** ${businessIdea}\n\n` +
                            `**Target Customers:** ${targetCustomer}\n\n` +
                            `**Marketing Strategy:**\n` +
                            `- Create eye-catching flyers\n` +
                            `- Tell friends and family\n` +
                            `- Set up a social media page\n\n` +
                            `**Startup Costs:**\n` +
                            `- Materials: $XX\n` +
                            `- Marketing: $XX\n` +
                            `- Other expenses: $XX\n\n` +
                            `**Pricing Strategy:**\n` +
                            `Consider charging $XX per item/service based on your costs and what customers might pay.\n\n` +
                            `**Next Steps:**\n` +
                            `1. Make a prototype or practice your service\n` +
                            `2. Ask for feedback from potential customers\n` +
                            `3. Make improvements based on feedback\n` +
                            `4. Start small and grow!`;
                          
                          setCreativeResponse(businessPlan);
                        }}
                      >
                        Create Business Plan
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label>Your Business Plan</Label>
                      <div className="bg-muted/50 p-3 rounded-md border text-sm">
                        {creativeResponse.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Save to journal
                          toast({
                            title: "Business plan saved to journal",
                            description: "Your business plan has been saved!"
                          });
                          
                          // Reset creative mode
                          setIsCreativeMode(false);
                          setSelectedCreativeOption(null);
                          setBusinessIdea('');
                          setTargetCustomer('');
                          setBusinessName('');
                          setCreativeResponse('');
                        }}
                      >
                        Save to Journal
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Future You Dreamer */}
              {selectedCreativeOption === 'future' && (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-3 rounded-md border">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Design Your Dream Future
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Let's imagine your ideal life in 10 years!
                    </p>
                  </div>
                  
                  {!futureLocation ? (
                    <div className="space-y-3">
                      <Label>Where would you like to be living in 10 years?</Label>
                      <Textarea 
                        placeholder="Describe your ideal home and location"
                        value={futureLocation}
                        onChange={(e) => setFutureLocation(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!futureLocation.trim()}
                        onClick={() => {
                          // Continue to next step
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  ) : !futureDreamJob ? (
                    <div className="space-y-3">
                      <Label>What would your dream job or activity be?</Label>
                      <Textarea 
                        placeholder="Describe what you'd love to do every day"
                        value={futureDreamJob}
                        onChange={(e) => setFutureDreamJob(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        className="w-full" 
                        disabled={!futureDreamJob.trim()}
                        onClick={() => {
                          // Generate future vision
                          const futureVision = `# Your Future in 10 Years\n\n` +
                            `Imagine yourself 10 years from now...\n\n` +
                            `You wake up in ${futureLocation}. The morning sun gently fills your room as you prepare for another exciting day.\n\n` +
                            `Your typical day involves ${futureDreamJob}. You're excellent at what you do, and it brings you joy and fulfillment.\n\n` +
                            `Your life is balanced with:\n` +
                            `- Meaningful work that challenges you\n` +
                            `- Close relationships with friends and family\n` +
                            `- Time for your favorite hobbies and interests\n` +
                            `- Good health and energy\n\n` +
                            `The path to this future might include:\n` +
                            `1. Learning the skills needed for your dream activities\n` +
                            `2. Making connections with people in your desired field\n` +
                            `3. Taking small steps each day towards your goals\n` +
                            `4. Being adaptable as opportunities arise\n\n` +
                            `Remember: This vision can change and grow as you do. The future is yours to create!`;
                          
                          setCreativeResponse(futureVision);
                        }}
                      >
                        Create Future Vision
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label>Your Future Vision</Label>
                      <div className="bg-muted/50 p-3 rounded-md border text-sm">
                        {creativeResponse.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Save to journal
                          toast({
                            title: "Future vision saved to journal",
                            description: "Your dream future has been saved to your journal!"
                          });
                          
                          // Reset creative mode
                          setIsCreativeMode(false);
                          setSelectedCreativeOption(null);
                          setFutureLocation('');
                          setFutureDreamJob('');
                          setCreativeResponse('');
                        }}
                      >
                        Save to Journal
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Surprise Me */}
              {selectedCreativeOption === 'surprise' && (
                <div className="space-y-4 py-4">
                  <div className="bg-primary/5 p-3 rounded-md border">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <Shuffle className="h-4 w-4 text-primary" />
                      Surprise Creative Challenge
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Here's a fun random creative prompt to spark your imagination!
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Your Surprise Challenge</Label>
                    <div className="bg-muted p-3 rounded-md border text-sm font-medium">
                      {selectedSurprisePrompt}
                    </div>
                    
                    {!creativeResponse ? (
                      <>
                        <Textarea 
                          placeholder="Write your response to the challenge here..."
                          value={creativeResponse}
                          onChange={(e) => setCreativeResponse(e.target.value)}
                          rows={5}
                        />
                        <Button 
                          className="w-full" 
                          disabled={!creativeResponse.trim()}
                          onClick={() => {
                            // Process response
                          }}
                        >
                          Save My Creation
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          // Save to journal
                          toast({
                            title: "Creation saved to journal",
                            description: "Your creative response has been saved!"
                          });
                          
                          // Reset creative mode
                          setIsCreativeMode(false);
                          setSelectedCreativeOption(null);
                          setSelectedSurprisePrompt('');
                          setCreativeResponse('');
                        }}
                      >
                        Save to Journal
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          {selectedCreativeOption && (
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                if (selectedCreativeOption && !creativeResponse) {
                  setSelectedCreativeOption(null);
                  setStoryType('');
                  setMainCharacter('');
                  setStoryLocation('');
                  setStoryTwist('');
                  setProblemToSolve('');
                  setBusinessIdea('');
                  setTargetCustomer('');
                  setBusinessName('');
                  setFutureLocation('');
                  setFutureDreamJob('');
                  setSelectedSurprisePrompt('');
                } else {
                  setIsCreativeMode(false);
                  setSelectedCreativeOption(null);
                  setStoryType('');
                  setMainCharacter('');
                  setStoryLocation('');
                  setStoryTwist('');
                  setProblemToSolve('');
                  setBusinessIdea('');
                  setTargetCustomer('');
                  setBusinessName('');
                  setFutureLocation('');
                  setFutureDreamJob('');
                  setSelectedSurprisePrompt('');
                  setCreativeResponse('');
                }
              }}>
                {selectedCreativeOption && !creativeResponse ? "Back to Options" : "Close"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Recommendation Dialog */}
      <Dialog open={isRecommending} onOpenChange={setIsRecommending}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              What Should I Do Next?
            </DialogTitle>
            <DialogDescription>
              Let me suggest some learning activities based on your progress and interests.
            </DialogDescription>
          </DialogHeader>
          
          {!recommendedLesson && !recommendedProject && !recommendedChallenge ? (
            <div className="space-y-4 py-4">
              <div className="bg-primary/5 p-3 rounded-md border">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Personalized Recommendations
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  I'll find the perfect next step in your learning journey based on what you've been working on.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label>What type of activity would you like me to suggest?</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={cn("justify-start h-auto p-3", recommendationType === 'all' && "border-primary bg-primary/5")}
                    onClick={() => setRecommendationType('all')}
                  >
                    <div className="flex flex-col items-center justify-center mr-3">
                      <GraduationCap className="h-5 w-5 text-primary mb-1" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Show Me Everything</div>
                      <div className="text-xs text-muted-foreground">Lesson, project & challenge</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={cn("justify-start h-auto p-3", recommendationType === 'lesson' && "border-primary bg-primary/5")}
                    onClick={() => setRecommendationType('lesson')}
                  >
                    <div className="flex flex-col items-center justify-center mr-3">
                      <BookOpen className="h-5 w-5 text-primary mb-1" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Suggest a Lesson</div>
                      <div className="text-xs text-muted-foreground">Learn something new</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={cn("justify-start h-auto p-3", recommendationType === 'project' && "border-primary bg-primary/5")}
                    onClick={() => setRecommendationType('project')}
                  >
                    <div className="flex flex-col items-center justify-center mr-3">
                      <Rocket className="h-5 w-5 text-primary mb-1" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Suggest a Project</div>
                      <div className="text-xs text-muted-foreground">Apply what you've learned</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={cn("justify-start h-auto p-3", recommendationType === 'challenge' && "border-primary bg-primary/5")}
                    onClick={() => setRecommendationType('challenge')}
                  >
                    <div className="flex flex-col items-center justify-center mr-3">
                      <Zap className="h-5 w-5 text-primary mb-1" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Quick Challenge</div>
                      <div className="text-xs text-muted-foreground">Something brief but helpful</div>
                    </div>
                  </Button>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={() => {
                      // Select recommendations based on student profile
                      // This would normally come from a database but we're simulating here
                      
                      // Determine day of week for weekly challenge
                      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const today = new Date();
                      setDayOfWeek(days[today.getDay()]);
                      setShowWeeklyChallenge(today.getDay() === 1); // Show special challenge on Mondays
                      
                      // Find a lesson that matches student interests or goals
                      let lesson = null;
                      if (recommendationType === 'all' || recommendationType === 'lesson') {
                        // Get modules that match favorite subjects or goals
                        const relevantModules = availableModules.filter(module => 
                          studentProgress.favoriteSubjects.includes(module.category) || 
                          studentProgress.goals.some(goal => module.matchesGoal === goal)
                        );
                        
                        if (relevantModules.length > 0) {
                          // Pick one based on personalized criteria
                          const inProgressModuleNames = studentProgress.inProgressModules || [];
                          
                          // First try to find a module related to in-progress modules
                          const relatedModules = relevantModules.filter(module => 
                            inProgressModuleNames.some(name => module.category.includes(name))
                          );
                          
                          if (relatedModules.length > 0) {
                            lesson = relatedModules[0];
                            setRecommendationReason(`You've been working on ${inProgressModuleNames[0]}, and this lesson builds on that knowledge!`);
                          } else {
                            // Otherwise choose based on goals
                            const goalRelatedModules = relevantModules.filter(module => 
                              studentProgress.goals.some(goal => module.matchesGoal === goal)
                            );
                            
                            if (goalRelatedModules.length > 0) {
                              lesson = goalRelatedModules[0];
                              setRecommendationReason(`This aligns perfectly with your goal to ${lesson.matchesGoal}!`);
                            } else {
                              // Fallback to a favorite subject
                              lesson = relevantModules[0];
                              setRecommendationReason(`Since you enjoy ${lesson.category}, I thought you might like this!`);
                            }
                          }
                        } else {
                          // If no matching modules, pick the first beginner one as default
                          lesson = availableModules.find(m => m.level === "beginner") || availableModules[0];
                          setRecommendationReason("I think this would be a great next step in your learning journey!");
                        }
                      }
                      
                      // Find a project that matches student interests or completed modules
                      let project = null;
                      if (recommendationType === 'all' || recommendationType === 'project') {
                        const relevantProjects = availableProjects.filter(project => 
                          studentProgress.favoriteSubjects.includes(project.category) || 
                          studentProgress.completedModules.some(module => project.category.includes(module))
                        );
                        
                        if (relevantProjects.length > 0) {
                          project = relevantProjects[0];
                        } else {
                          // Default project
                          project = availableProjects[0];
                        }
                      }
                      
                      // Find a quick challenge that matches student profile
                      let challenge = null;
                      if (recommendationType === 'all' || recommendationType === 'challenge') {
                        // Check if there's a challenge that matches the student's favorite subjects
                        const relevantChallenges = quickChallenges.filter(challenge => 
                          studentProgress.favoriteSubjects.includes(challenge.category)
                        );
                        
                        if (relevantChallenges.length > 0) {
                          challenge = relevantChallenges[0];
                        } else {
                          // Default challenge
                          challenge = quickChallenges[0];
                        }
                      }
                      
                      // Set the recommendations based on the selected type
                      setRecommendedLesson(lesson);
                      setRecommendedProject(project);
                      setRecommendedChallenge(challenge);
                    }}
                  >
                    Get Recommendations
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-4">
              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex items-start">
                  <span role="img" aria-label="buddy avatar" className="text-xl mr-2">
                    {avatarDisplay.emoji}
                  </span>
                  <div>
                    <p className="text-sm">
                      {(() => {
                        const personalityType = buddyProfile?.personalityType || 'friendly_supportive';
                        let message = '';
                        
                        switch(personalityType) {
                          case 'friendly_supportive':
                            message = `You've been doing so well with your learning journey! Here are some suggestions I think you'll enjoy.`;
                            break;
                          case 'chill_funny':
                            message = `Hey, look at you crushing it! No pressure, but here are some cool options if you're in the mood to level up.`;
                            break;
                          case 'focused_motivational':
                            message = `Time to push your skills to the next level! I've identified these high-impact activities to help you reach your goals faster.`;
                            break;
                          case 'curious_reflective':
                            message = `I've been thinking about your learning path... these activities might help you explore some interesting new areas.`;
                            break;
                          default:
                            message = `Based on your progress, here are some personalized recommendations for your next learning activities!`;
                        }
                        
                        return message;
                      })()}
                    </p>
                    {recommendationReason && (
                      <p className="text-xs text-muted-foreground mt-1">{recommendationReason}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Display Weekly Challenge on Mondays */}
              {showWeeklyChallenge && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-sm">Challenge of the Week</h3>
                  </div>
                  <p className="text-sm">It's a new week — your mission, if you choose to accept it:</p>
                  <p className="text-sm font-medium">Design a 3-day budget for a school trip. 💼🎒</p>
                  <p className="text-xs text-muted-foreground">This special weekly challenge refreshes every Monday!</p>
                </div>
              )}
              
              {/* Lesson Recommendation */}
              {recommendedLesson && (recommendationType === 'all' || recommendationType === 'lesson') && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-100 dark:border-amber-900 p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="font-medium text-sm">Suggested Lesson</h3>
                    </div>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-black">
                      {recommendedLesson.level}
                    </Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="font-medium">{recommendedLesson.title}</h4>
                    <p className="text-sm text-muted-foreground">{recommendedLesson.description}</p>
                    
                    <div className="pt-2 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1"
                        asChild
                      >
                        <Link href={recommendedLesson.path}>
                          <BookOpen className="h-3 w-3" />
                          Start Lesson
                        </Link>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => {
                          // Send a message with this recommendation
                          sendMessageMutation.mutate({
                            content: `I recommend checking out the "${recommendedLesson.title}" lesson! It's about ${recommendedLesson.description.toLowerCase()}`,
                            isFromBuddy: true
                          });
                          setIsRecommending(false);
                        }}
                      >
                        Save to Chat
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Project Recommendation */}
              {recommendedProject && (recommendationType === 'all' || recommendationType === 'project') && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-emerald-50 dark:bg-emerald-950 border-b border-emerald-100 dark:border-emerald-900 p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <Rocket className="h-5 w-5 text-emerald-500 mr-2" />
                      <h3 className="font-medium text-sm">Suggested Project</h3>
                    </div>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-black">
                      {recommendedProject.difficulty}
                    </Badge>
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="font-medium">{recommendedProject.title}</h4>
                    <p className="text-sm text-muted-foreground">{recommendedProject.description}</p>
                    
                    <div className="flex flex-wrap gap-1 pt-1">
                      {recommendedProject.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <Timer className="h-3 w-3 inline mr-1" />
                      Estimated time: {recommendedProject.timeNeeded}
                    </div>
                    
                    <div className="pt-2 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1"
                        asChild
                      >
                        <Link href={recommendedProject.path}>
                          <Rocket className="h-3 w-3" />
                          Start Project
                        </Link>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => {
                          // Send a message with this recommendation
                          sendMessageMutation.mutate({
                            content: `I suggest working on the "${recommendedProject.title}" project! This hands-on project will help you apply what you've learned about ${recommendedProject.category.toLowerCase()}.`,
                            isFromBuddy: true
                          });
                          setIsRecommending(false);
                        }}
                      >
                        Save to Chat
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Challenge Recommendation */}
              {recommendedChallenge && (recommendationType === 'all' || recommendationType === 'challenge') && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-purple-50 dark:bg-purple-950 border-b border-purple-100 dark:border-purple-900 p-3">
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium text-sm">Quick Challenge</h3>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="font-medium">{recommendedChallenge.title}</h4>
                    <p className="text-sm text-muted-foreground">{recommendedChallenge.description}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      <Timer className="h-3 w-3 inline mr-1" />
                      Estimated time: {recommendedChallenge.timeNeeded}
                    </div>
                    
                    <div className="pt-2 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 gap-1"
                        onClick={() => {
                          sendMessageMutation.mutate({
                            content: `Here's a quick challenge for you: ${recommendedChallenge.title}. ${recommendedChallenge.description}`,
                            isFromBuddy: true
                          });
                          setIsRecommending(false);
                        }}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Accept Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRecommendedLesson(null);
                    setRecommendedProject(null);
                    setRecommendedChallenge(null);
                    setRecommendationType('all');
                  }}
                >
                  <ArrowRight className="h-4 w-4 rotate-180 mr-1" />
                  Different Recommendations
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsRecommending(false);
                    setRecommendedLesson(null);
                    setRecommendedProject(null);
                    setRecommendedChallenge(null);
                    setRecommendationType('all');
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  );
}



