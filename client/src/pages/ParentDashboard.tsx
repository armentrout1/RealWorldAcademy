import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  FileText,
  Gift,
  Home,
  Plus,
  PlusCircle,
  Save,
  Settings,
  Star,
  UserPlus,
  Users,
  BookOpen,
  BarChart,
  Calendar as CalendarIcon,
  CheckCircle2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Types
interface ChildProfile {
  id: number;
  name: string;
  avatar: string;
  age: number;
  ageGroup: '9-12' | '13-15' | '16-18';
  recentActivity: {
    modules: number;
    modulesTotal: number;
    projectsCompleted: number;
    lastActive: string;
  };
  progress: {
    selfDiscovery: {
      type: "Planner" | "Builder" | "Innovator" | "Helper";
      strengths: string[];
    };
    subjects: {
      name: string;
      id: string;
      progress: number;
    }[];
    recentProjects: {
      id: number;
      title: string;
      subject: string;
      completed: boolean;
      date: string;
    }[];
  };
  notes: string;
}

interface ScheduleDay {
  day: string;
  sessions: {
    id: number;
    subject: string;
    activity: string;
    duration: string;
    time: string;
    completed?: boolean;
  }[];
}

interface Reward {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
}

// Mock data for children profiles
const mockChildren: ChildProfile[] = [
  {
    id: 1,
    name: "Jamie Morgan",
    avatar: "https://images.unsplash.com/photo-1519098901909-b1553a1190af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    age: 14,
    ageGroup: "13-15",
    recentActivity: {
      modules: 23,
      modulesTotal: 45,
      projectsCompleted: 5,
      lastActive: "Today, 2:30 PM",
    },
    progress: {
      selfDiscovery: {
        type: "Innovator",
        strengths: ["Creative thinking", "Problem-solving", "Adaptability"],
      },
      subjects: [
        { name: "Mathematics", id: "math", progress: 65 },
        { name: "Science", id: "science", progress: 78 },
        { name: "Language Arts", id: "language", progress: 42 },
        { name: "History", id: "history", progress: 56 },
      ],
      recentProjects: [
        {
          id: 101,
          title: "Ecosystem in a Bottle",
          subject: "Science",
          completed: true,
          date: "Sep 12, 2023",
        },
        {
          id: 102,
          title: "Personal Budget Planning",
          subject: "Financial Literacy",
          completed: false,
          date: "Sep 20, 2023",
        },
      ],
    },
    notes: "Jamie has been showing strong interest in science experiments lately. Consider incorporating more hands-on activities.",
  },
  {
    id: 2,
    name: "Riley Morgan",
    avatar: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    age: 11,
    ageGroup: "9-12",
    recentActivity: {
      modules: 18,
      modulesTotal: 35,
      projectsCompleted: 3,
      lastActive: "Yesterday, 4:15 PM",
    },
    progress: {
      selfDiscovery: {
        type: "Helper",
        strengths: ["Cooperation", "Communication", "Empathy"],
      },
      subjects: [
        { name: "Mathematics", id: "math", progress: 45 },
        { name: "Science", id: "science", progress: 52 },
        { name: "Language Arts", id: "language", progress: 80 },
        { name: "History", id: "history", progress: 38 },
      ],
      recentProjects: [
        {
          id: 201,
          title: "Story Writing Challenge",
          subject: "Language Arts",
          completed: true,
          date: "Sep 10, 2023",
        },
        {
          id: 202,
          title: "Family Tree Research",
          subject: "History",
          completed: false,
          date: "Sep 25, 2023",
        },
      ],
    },
    notes: "Riley excels in creative writing and storytelling. Consider more reading comprehension activities to build on these strengths.",
  },
];

// Mock data for weekly schedule
const mockSchedule: ScheduleDay[] = [
  {
    day: "Monday",
    sessions: [
      {
        id: 1,
        subject: "Mathematics",
        activity: "Algebra Practice",
        duration: "45 min",
        time: "9:00 AM",
        completed: true,
      },
      {
        id: 2,
        subject: "Language Arts",
        activity: "Reading Comprehension",
        duration: "45 min",
        time: "10:00 AM",
        completed: false,
      },
      {
        id: 3,
        subject: "Science",
        activity: "Chemistry Experiment",
        duration: "60 min",
        time: "1:00 PM",
        completed: false,
      },
    ],
  },
  {
    day: "Tuesday",
    sessions: [
      {
        id: 4,
        subject: "History",
        activity: "Ancient Civilizations",
        duration: "45 min",
        time: "9:00 AM",
      },
      {
        id: 5,
        subject: "Mathematics",
        activity: "Geometry",
        duration: "45 min",
        time: "10:00 AM",
      },
      {
        id: 6,
        subject: "Physical Education",
        activity: "Outdoor Activity",
        duration: "60 min",
        time: "1:00 PM",
      },
    ],
  },
  {
    day: "Wednesday",
    sessions: [
      {
        id: 7,
        subject: "Science",
        activity: "Biology Study",
        duration: "45 min",
        time: "9:00 AM",
      },
      {
        id: 8,
        subject: "Language Arts",
        activity: "Creative Writing",
        duration: "45 min",
        time: "10:00 AM",
      },
      {
        id: 9,
        subject: "Art",
        activity: "Drawing Techniques",
        duration: "60 min",
        time: "1:00 PM",
      },
    ],
  },
  {
    day: "Thursday",
    sessions: [
      {
        id: 10,
        subject: "Mathematics",
        activity: "Problem Solving",
        duration: "45 min",
        time: "9:00 AM",
      },
      {
        id: 11,
        subject: "History",
        activity: "Modern World",
        duration: "45 min",
        time: "10:00 AM",
      },
      {
        id: 12,
        subject: "Music",
        activity: "Music Theory",
        duration: "60 min",
        time: "1:00 PM",
      },
    ],
  },
  {
    day: "Friday",
    sessions: [
      {
        id: 13,
        subject: "Language Arts",
        activity: "Grammar & Vocabulary",
        duration: "45 min",
        time: "9:00 AM",
      },
      {
        id: 14,
        subject: "Science",
        activity: "Physics Concepts",
        duration: "45 min",
        time: "10:00 AM",
      },
      {
        id: 15,
        subject: "Real World Projects",
        activity: "Project Work",
        duration: "90 min",
        time: "1:00 PM",
      },
    ],
  },
];

// Mock data for rewards
const mockRewards: Reward[] = [
  {
    id: 1,
    name: "Museum Trip",
    icon: <Star className="h-5 w-5 text-amber-500" />,
    description: "Visit to the Science Museum for completing the science unit",
  },
  {
    id: 2,
    name: "Book of Choice",
    icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
    description: "New book for reaching reading comprehension goals",
  },
  {
    id: 3,
    name: "Game Night",
    icon: <Gift className="h-5 w-5 text-purple-500" />,
    description: "Family game night for completing 5 consecutive days of learning",
  },
];

// ParentDashboard Component
const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(mockChildren[0]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddRewardDialog, setShowAddRewardDialog] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
  });
  const [addingChild, setAddingChild] = useState(false);
  const [newChildData, setNewChildData] = useState({
    name: "",
    age: "",
    ageGroup: "9-12" as "9-12" | "13-15" | "16-18",
  });
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [schedule, setSchedule] = useState(mockSchedule);
  const [rewards, setRewards] = useState(mockRewards);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const saveNote = () => {
    if (selectedChild && newNote.trim()) {
      setSelectedChild({
        ...selectedChild,
        notes: selectedChild.notes + "\n\n" + newNote.trim(),
      });
      setNewNote("");
      setShowAddNoteDialog(false);
      toast({
        title: "Note Added",
        description: "Your note has been added to the child's profile.",
      });
    }
  };

  const saveReward = () => {
    if (newReward.name && newReward.description) {
      const reward: Reward = {
        id: Date.now(),
        name: newReward.name,
        description: newReward.description,
        icon: <Gift className="h-5 w-5 text-indigo-500" />,
      };
      setRewards([...rewards, reward]);
      setNewReward({ name: "", description: "" });
      setShowAddRewardDialog(false);
      toast({
        title: "Reward Added",
        description: `The reward "${newReward.name}" has been added to your list.`,
      });
    }
  };

  const addChild = () => {
    if (newChildData.name && newChildData.age) {
      toast({
        title: "Child Profile Created",
        description: `Profile for ${newChildData.name} has been created successfully.`,
      });
      setAddingChild(false);
      setNewChildData({
        name: "",
        age: "",
        ageGroup: "9-12",
      });
    }
  };

  const toggleSessionCompletion = (dayIndex: number, sessionId: number) => {
    const newSchedule = [...schedule];
    const session = newSchedule[dayIndex].sessions.find(s => s.id === sessionId);
    if (session) {
      session.completed = !session.completed;
      setSchedule(newSchedule);
      toast({
        title: session.completed ? "Session Completed" : "Session Marked Incomplete",
        description: `${session.subject}: ${session.activity} has been ${session.completed ? "marked as complete" : "unmarked"}.`,
      });
    }
  };

  const handleViewProgress = (child: ChildProfile) => {
    setSelectedChild(child);
    setActiveTab("progress");
  };

  const getProgressColor = (progress: number) => {
    if (progress < 40) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getCurrentDay = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
              <Home className="mr-2 h-6 w-6 text-amber-600" />
              Homeschool Hub
            </CardTitle>
            <CardDescription className="text-amber-700">
              Your central dashboard for managing your family's educational journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-amber-900">
                  Welcome to your Homeschool Dashboard
                </h2>
                <p className="text-amber-700">
                  Track progress, plan lessons, and stay connected with your family's learning
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-amber-200 text-amber-700 hover:bg-amber-100"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Homeschool Settings
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-amber-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    Children
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">{mockChildren.length}</div>
                  <p className="text-xs text-amber-700">Active learners in your family</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-amber-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    Today's Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">
                    {schedule.find(day => day.day === getCurrentDay())?.sessions.length || 0}
                  </div>
                  <p className="text-xs text-amber-700">Scheduled learning activities</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-amber-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800">
                    Upcoming Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">3</div>
                  <p className="text-xs text-amber-700">Projects due this week</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar - Child Profiles */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-neutral-500" />
                Your Family
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockChildren.map((child) => (
                <div
                  key={child.id}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    selectedChild?.id === child.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-neutral-50 border border-transparent"
                  }`}
                  onClick={() => setSelectedChild(child)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={child.avatar} alt={child.name} />
                      <AvatarFallback>
                        {child.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {child.name}
                      </h3>
                      <div className="flex items-center text-xs text-neutral-500">
                        <span>{child.age} years old</span>
                        <span className="mx-1">•</span>
                        <span>
                          {child.recentActivity.modules} of{" "}
                          {child.recentActivity.modulesTotal} modules
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary hover:text-primary w-full justify-start p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProgress(child);
                      }}
                    >
                      <BarChart className="mr-1 h-3 w-3" />
                      View Progress
                    </Button>
                  </div>
                </div>
              ))}
              
              {addingChild ? (
                <Card className="border-dashed border-primary/50 bg-primary/5">
                  <CardContent className="pt-4 space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="childName">Child's Name</Label>
                      <Input 
                        id="childName" 
                        value={newChildData.name}
                        onChange={(e) => setNewChildData({...newChildData, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="childAge">Age</Label>
                      <Input 
                        id="childAge" 
                        type="number"
                        min="5"
                        max="18"
                        value={newChildData.age}
                        onChange={(e) => setNewChildData({...newChildData, age: e.target.value})}
                        placeholder="Enter age"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ageGroup">Age Group</Label>
                      <Select
                        value={newChildData.ageGroup}
                        onValueChange={(value: "9-12" | "13-15" | "16-18") => 
                          setNewChildData({...newChildData, ageGroup: value})
                        }
                      >
                        <SelectTrigger id="ageGroup">
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9-12">9-12 years</SelectItem>
                          <SelectItem value="13-15">13-15 years</SelectItem>
                          <SelectItem value="16-18">16-18 years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={addChild}
                      >
                        <Save className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => setAddingChild(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed border-neutral-300"
                  onClick={() => setAddingChild(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Child
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-neutral-500" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("schedule")}>
                <Calendar className="mr-2 h-4 w-4" />
                Weekly Schedule
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("resources")}>
                <FileText className="mr-2 h-4 w-4" />
                Learning Resources
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab("rewards")}>
                <Gift className="mr-2 h-4 w-4" />
                Rewards & Incentives
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/learn"}>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Curriculum
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="md:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 h-auto p-1">
              <TabsTrigger value="overview" className="py-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="progress" className="py-2">
                Progress Tracking
              </TabsTrigger>
              <TabsTrigger value="schedule" className="py-2">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="rewards" className="py-2">
                Rewards
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {selectedChild && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">
                        {selectedChild.name}'s Overview
                      </CardTitle>
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        Age Group: {selectedChild.ageGroup}
                      </Badge>
                    </div>
                    <CardDescription>
                      Most recent activity on {selectedChild.recentActivity.lastActive}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-neutral-600 mb-1">
                          Learning Type
                        </h3>
                        <div className="flex items-center">
                          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0">
                            {selectedChild.progress.selfDiscovery.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Based on self-discovery assessment
                        </p>
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-neutral-600 mb-1">
                          Modules Completed
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">
                            {selectedChild.recentActivity.modules}
                          </span>
                          <span className="text-neutral-400">
                            / {selectedChild.recentActivity.modulesTotal}
                          </span>
                          <span className="text-emerald-600 text-xs">
                            {Math.round(
                              (selectedChild.recentActivity.modules /
                                selectedChild.recentActivity.modulesTotal) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (selectedChild.recentActivity.modules /
                              selectedChild.recentActivity.modulesTotal) *
                            100
                          }
                          className="h-2 mt-2"
                        />
                      </div>
                      
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-neutral-600 mb-1">
                          Projects Completed
                        </h3>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">
                            {selectedChild.recentActivity.projectsCompleted}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Across all subjects
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 text-neutral-800">
                        Parent Notes
                      </h3>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800 text-sm relative">
                        <pre className="font-sans whitespace-pre-wrap">
                          {selectedChild.notes}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-amber-600"
                          onClick={() => setShowAddNoteDialog(true)}
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="sr-only">Add Note</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 text-neutral-800">
                        Key Strengths
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedChild.progress.selfDiscovery.strengths.map(
                          (strength, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-neutral-100"
                            >
                              {strength}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 text-neutral-800 flex items-center justify-between">
                        <span>Recent Projects</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:text-primary"
                          onClick={() => navigate("/projects")}
                        >
                          View All
                        </Button>
                      </h3>
                      <div className="space-y-3">
                        {selectedChild.progress.recentProjects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
                          >
                            <div>
                              <h4 className="font-medium text-sm">
                                {project.title}
                              </h4>
                              <div className="flex items-center text-xs text-neutral-500 mt-1">
                                <span>{project.subject}</span>
                                <span className="mx-1">•</span>
                                <span>{project.date}</span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                project.completed ? "default" : "secondary"
                              }
                              className={
                                project.completed
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                              }
                            >
                              {project.completed ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>
                    {getCurrentDay()}'s learning activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedule
                      .find((day) => day.day === getCurrentDay())
                      ?.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
                        >
                          <div className="flex items-center">
                            <div className="bg-neutral-100 p-2 rounded-md mr-3">
                              <Clock className="h-5 w-5 text-neutral-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {session.subject}
                              </h4>
                              <div className="flex items-center text-xs text-neutral-500 mt-1">
                                <span>{session.activity}</span>
                                <span className="mx-1">•</span>
                                <span>{session.time}</span>
                                <span className="mx-1">•</span>
                                <span>{session.duration}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={
                              session.completed ? "default" : "outline"
                            }
                            size="sm"
                            className={
                              session.completed
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                                : ""
                            }
                            onClick={() =>
                              toggleSessionCompletion(
                                schedule.findIndex(
                                  (day) => day.day === getCurrentDay()
                                ),
                                session.id
                              )
                            }
                          >
                            {session.completed ? (
                              <>
                                <CheckSquare className="mr-1 h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              "Mark Complete"
                            )}
                          </Button>
                        </div>
                      ))}
                    
                    {(!schedule.find((day) => day.day === getCurrentDay()) ||
                      schedule.find((day) => day.day === getCurrentDay())
                        ?.sessions.length === 0) && (
                      <div className="text-center py-6 text-neutral-500">
                        <Calendar className="h-12 w-12 mx-auto text-neutral-300 mb-2" />
                        <h3 className="font-medium text-lg text-neutral-600">
                          No Sessions Today
                        </h3>
                        <p className="mt-1 text-sm">
                          There are no scheduled activities for today. Use this time 
                          for self-directed learning or add sessions to your schedule.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setActiveTab("schedule");
                            setEditingSchedule(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Progress Tracking Tab */}
            <TabsContent value="progress" className="space-y-4">
              {selectedChild && (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">
                          {selectedChild.name}'s Learning Progress
                        </CardTitle>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-3 text-neutral-800">
                            Subject Progress
                          </h3>
                          <div className="space-y-4">
                            {selectedChild.progress.subjects.map((subject) => (
                              <div key={subject.id} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">
                                    {subject.name}
                                  </span>
                                  <span className="text-sm">
                                    {subject.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={subject.progress}
                                  className={`h-2 ${getProgressColor(
                                    subject.progress
                                  )}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-neutral-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-neutral-600 mb-3">
                              Learning Style
                            </h3>
                            <div className="text-center py-4">
                              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 border-0 text-base px-4 py-2">
                                {selectedChild.progress.selfDiscovery.type}
                              </Badge>
                              <p className="text-xs text-neutral-500 mt-3">
                                {selectedChild.progress.selfDiscovery.type === "Innovator" && 
                                  "Your child thrives on creative solutions and thinking outside the box."}
                                {selectedChild.progress.selfDiscovery.type === "Planner" && 
                                  "Your child excels with organization and systematic approaches."}
                                {selectedChild.progress.selfDiscovery.type === "Builder" && 
                                  "Your child learns best through hands-on, practical activities."}
                                {selectedChild.progress.selfDiscovery.type === "Helper" && 
                                  "Your child thrives in collaborative settings and helping others."}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-neutral-600 mb-3">
                              Learning Recommendations
                            </h3>
                            <ul className="space-y-2 text-sm">
                              {selectedChild.progress.selfDiscovery.type === "Innovator" && (
                                <>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Encourage open-ended projects with multiple solution paths</span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Provide opportunities for experimental learning</span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Support imagination and novel approaches to problems</span>
                                  </li>
                                </>
                              )}
                              {selectedChild.progress.selfDiscovery.type === "Helper" && (
                                <>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Incorporate group learning and peer teaching</span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Connect learning to real-world helping scenarios</span>
                                  </li>
                                  <li className="flex items-start">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                    <span>Focus on communication skills and emotional intelligence</span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">
                        Upcoming Milestones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-md mr-3">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Complete Science Unit</h4>
                              <p className="text-sm text-neutral-500">
                                3 modules remaining
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            In Progress
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200">
                          <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-md mr-3">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Research Project</h4>
                              <p className="text-sm text-neutral-500">
                                Due in 2 weeks
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-700">
                            Not Started
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200">
                          <div className="flex items-center">
                            <div className="bg-emerald-100 p-2 rounded-md mr-3">
                              <Star className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Self-Discovery Assessment</h4>
                              <p className="text-sm text-neutral-500">
                                Skills and interests evaluation
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            Completed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-neutral-50 py-3">
                      <Button 
                        variant="outline" 
                        className="text-neutral-700"
                        onClick={() => window.location.href = "/plan-your-future"}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Learning Goal
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      Weekly Schedule
                    </CardTitle>
                    <Button 
                      variant={editingSchedule ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditingSchedule(!editingSchedule)}
                    >
                      {editingSchedule ? (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription>
                    Plan and track your family's learning activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {schedule.map((day, dayIndex) => (
                      <div key={day.day} className="space-y-2">
                        <h3 className="font-medium flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full mr-2 ${
                              day.day === getCurrentDay() ? "bg-primary" : "bg-neutral-200"
                            }`}
                          />
                          {day.day}
                          {day.day === getCurrentDay() && (
                            <Badge 
                              variant="outline" 
                              className="ml-2 text-xs border-primary/30 text-primary"
                            >
                              Today
                            </Badge>
                          )}
                        </h3>
                        
                        <div className="space-y-2">
                          {day.sessions.map((session) => (
                            <div
                              key={session.id}
                              className={`p-3 rounded-lg border ${
                                session.completed 
                                ? "bg-emerald-50 border-emerald-100" 
                                : "border-neutral-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="text-neutral-400 mr-2 min-w-[60px] text-sm">
                                    {session.time}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{session.subject}</h4>
                                    <p className="text-sm text-neutral-500">
                                      {session.activity} • {session.duration}
                                    </p>
                                  </div>
                                </div>
                                
                                {!editingSchedule && day.day === getCurrentDay() && (
                                  <Button
                                    variant={session.completed ? "default" : "outline"}
                                    size="sm"
                                    className={
                                      session.completed
                                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
                                        : ""
                                    }
                                    onClick={() => toggleSessionCompletion(dayIndex, session.id)}
                                  >
                                    {session.completed ? (
                                      <>
                                        <CheckSquare className="mr-1 h-4 w-4" />
                                        Completed
                                      </>
                                    ) : (
                                      "Mark Complete"
                                    )}
                                  </Button>
                                )}
                                
                                {editingSchedule && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-neutral-500 h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {editingSchedule && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full border border-dashed border-neutral-300 text-neutral-500"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Session
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-neutral-50 py-3 flex justify-between">
                  <Button variant="outline">
                    Print Schedule
                  </Button>
                  <Button variant="default">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Month
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Gift className="mr-2 h-5 w-5 text-neutral-500" />
                      Rewards & Incentives
                    </CardTitle>
                    <Button 
                      variant="outline"
                      onClick={() => setShowAddRewardDialog(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Reward
                    </Button>
                  </div>
                  <CardDescription>
                    Manage rewards for learning achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white"
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-neutral-100 mr-3">
                            {reward.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-sm text-neutral-500">
                              {reward.description}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-neutral-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2 text-neutral-800">
                      Reward Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        <span>Focus on experience-based rewards over material items</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        <span>Tie rewards to effort and progress, not just achievement</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                        <span>Involve children in choosing rewards that are meaningful to them</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {selectedChild?.name}</DialogTitle>
            <DialogDescription>
              Add observations, reminders, or important notes about your child's learning.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter your note here..."
                className="min-h-[120px]"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddNoteDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Reward Dialog */}
      <Dialog open={showAddRewardDialog} onOpenChange={setShowAddRewardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reward</DialogTitle>
            <DialogDescription>
              Create a new reward or incentive for learning achievements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rewardName">Reward Name</Label>
              <Input
                id="rewardName"
                placeholder="e.g., Museum Trip"
                value={newReward.name}
                onChange={(e) => setNewReward({...newReward, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rewardDescription">Description</Label>
              <Textarea
                id="rewardDescription"
                placeholder="Describe what the reward is for..."
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddRewardDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveReward}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;