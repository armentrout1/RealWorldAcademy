import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  BookOpen,
  Wrench,
  Heart,
  Code,
  TargetIcon,
  Check,
  PlusCircle,
  Image,
  BookMarked,
  ArrowRight,
  Edit,
  Save,
  Trash2,
  BarChart,
  Megaphone,
  Landmark,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Career path definitions
interface CareerPath {
  id: number;
  title: string;
  description: string;
  iconName: string;
  color: string;
  whyLoveIt: string;
  tasks: string[];
  education: string;
  skills: { name: string; level: number }[];
}

// Icon mapping for career paths
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Code': <Code className="h-8 w-8" />,
    'BarChart': <BarChart className="h-8 w-8" />,
    'Megaphone': <Megaphone className="h-8 w-8" />,
    'Heart': <Heart className="h-8 w-8" />,
    'Landmark': <Landmark className="h-8 w-8" />,
    'Lightbulb': <Lightbulb className="h-8 w-8" />,
    'BookOpen': <BookOpen className="h-8 w-8" />,
    'Wrench': <Wrench className="h-8 w-8" />,
    'Target': <TargetIcon className="h-8 w-8" />
  };
  
  return iconMap[iconName] || <Lightbulb className="h-8 w-8" />;
};

// Get color style based on color name
const getColorStyle = (color: string) => {
  const colorMap: Record<string, string> = {
    'blue': 'bg-blue-100 text-blue-700 border-blue-200',
    'purple': 'bg-purple-100 text-purple-700 border-purple-200',
    'green': 'bg-green-100 text-green-700 border-green-200',
    'red': 'bg-rose-100 text-rose-700 border-rose-200',
    'amber': 'bg-amber-100 text-amber-700 border-amber-200',
    'indigo': 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };
  
  return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200';
};

// Goal definitions
interface Goal {
  id: string;
  text: string;
  type: 'short-term' | 'mid-term' | 'long-term';
  isEditing?: boolean;
}

interface VisionBoardItem {
  id: string;
  type: 'quote' | 'image' | 'goal';
  content: string;
  position?: { x: number; y: number };
}

const PlanYourFuture: React.FC = () => {
  const { progress, updateCategoryProgress, unlockBadge, addTimelineEvent } = useProgress();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for temporary form values
  const [newShortTermGoal, setNewShortTermGoal] = useState("");
  const [newMidTermGoal, setNewMidTermGoal] = useState("");
  const [newLongTermGoal, setNewLongTermGoal] = useState("");
  const [newQuote, setNewQuote] = useState("");
  
  // API Calls for Career Paths
  const { data: careerPaths = [], isLoading: isLoadingCareerPaths } = useQuery({
    queryKey: ['/api/career-paths'],
    queryFn: async () => {
      const response = await apiRequest<CareerPath[]>('/api/career-paths');
      // Parse tasks and skills which are stored as JSON strings
      return response.map(path => ({
        ...path,
        tasks: typeof path.tasks === 'string' ? JSON.parse(path.tasks) : path.tasks,
        skills: typeof path.skills === 'string' ? JSON.parse(path.skills) : path.skills
      }));
    }
  });
  
  // Goals API calls
  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ['/api/users', user?.id, 'goals'],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const response = await apiRequest<Goal[]>(`/api/users/${user?.id}/goals`);
      return response || [];
    }
  });
  
  // Track editing state for goals
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Organize goals by type
  const shortTermGoals = goals.filter(goal => goal.type === 'short-term');
  const midTermGoals = goals.filter(goal => goal.type === 'mid-term');
  const longTermGoals = goals.filter(goal => goal.type === 'long-term');
  
  // Vision Board API calls
  const { data: visionBoardItems = [], isLoading: isLoadingVisionBoard } = useQuery({
    queryKey: ['/api/users', user?.id, 'vision-board'],
    enabled: isAuthenticated && !!user?.id,
    queryFn: async () => {
      const response = await apiRequest<VisionBoardItem[]>(`/api/users/${user?.id}/vision-board`);
      return response || [];
    }
  });
  
  // Goal mutations
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: { text: string, type: string }) => {
      return await apiRequest(`/api/users/${user?.id}/goals`, {
        method: 'POST',
        body: JSON.stringify(goalData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'goals'] });
      toast({
        title: "Goal added!",
        description: "Your goal has been saved."
      });
    },
    onError: () => {
      toast({
        title: "Couldn't add goal",
        description: "There was a problem saving your goal. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, text }: { id: number, text: string }) => {
      return await apiRequest(`/api/users/${user?.id}/goals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'goals'] });
      toast({
        title: "Goal updated!",
        description: "Your goal has been updated."
      });
    }
  });
  
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/users/${user?.id}/goals/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'goals'] });
      toast({
        title: "Goal deleted!",
        description: "Your goal has been removed."
      });
    }
  });
  
  // Vision Board mutations
  const createVisionBoardItemMutation = useMutation({
    mutationFn: async (itemData: { content: string, type: 'quote' | 'image' | 'goal' }) => {
      return await apiRequest(`/api/users/${user?.id}/vision-board`, {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'vision-board'] });
      toast({
        title: "Item added!",
        description: "Your vision board has been updated."
      });
    }
  });
  
  const deleteVisionBoardItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/users/${user?.id}/vision-board/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'vision-board'] });
    }
  });

  // Handle adding new goals
  const addShortTermGoal = () => {
    if (newShortTermGoal.trim() && isAuthenticated) {
      createGoalMutation.mutate({
        text: newShortTermGoal,
        type: 'short-term'
      });
      setNewShortTermGoal("");
      
      // Update progress after adding a goal
      updateCategoryProgress("personal-development", 1, 3);
      addTimelineEvent({
        title: "Added a short-term goal",
        completed: true,
        category: "planning",
        date: new Date().toISOString()
      });
    } else if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to save your goals.",
        variant: "destructive"
      });
    }
  };
  
  const addMidTermGoal = () => {
    if (newMidTermGoal.trim() && isAuthenticated) {
      createGoalMutation.mutate({
        text: newMidTermGoal,
        type: 'mid-term'
      });
      setNewMidTermGoal("");
      
      // Update progress after adding a goal
      updateCategoryProgress("personal-development", 2, 3);
    } else if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to save your goals.",
        variant: "destructive"
      });
    }
  };
  
  const addLongTermGoal = () => {
    if (newLongTermGoal.trim() && isAuthenticated) {
      createGoalMutation.mutate({
        text: newLongTermGoal,
        type: 'long-term'
      });
      setNewLongTermGoal("");
      
      // Update progress and unlock a badge
      updateCategoryProgress("personal-development", 3, 3);
      unlockBadge("future-planner");
      addTimelineEvent({
        title: "Created a complete career plan",
        completed: true,
        category: "planning",
        date: new Date().toISOString()
      });
    } else if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to save your goals.",
        variant: "destructive"
      });
    }
  };
  
  // Handle editing goals
  const startEditGoal = (goalId: string) => {
    // Find the goal and set its text to be edited
    const goal = goals.find(g => g.id.toString() === goalId);
    if (goal) {
      setEditingGoalId(goalId);
      setEditingText(goal.text);
    }
  };
  
  const saveEditedGoal = (goalId: string) => {
    if (editingText.trim() && isAuthenticated) {
      const goalIdNum = parseInt(goalId, 10);
      if (!isNaN(goalIdNum)) {
        updateGoalMutation.mutate({
          id: goalIdNum,
          text: editingText
        });
        setEditingGoalId(null);
        setEditingText('');
      }
    }
  };
  
  const cancelEditGoal = () => {
    setEditingGoalId(null);
    setEditingText('');
  };
  
  const deleteGoal = (goalId: string) => {
    if (isAuthenticated) {
      const goalIdNum = parseInt(goalId, 10);
      if (!isNaN(goalIdNum)) {
        deleteGoalMutation.mutate(goalIdNum);
      }
    }
  };
  
  // Handle vision board
  const addQuoteToVisionBoard = () => {
    if (newQuote.trim() && isAuthenticated) {
      createVisionBoardItemMutation.mutate({
        type: "quote",
        content: newQuote
      });
      setNewQuote("");
    } else if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to save items to your vision board.",
        variant: "destructive"
      });
    }
  };
  
  const removeFromVisionBoard = (id: string) => {
    if (isAuthenticated) {
      const idNum = parseInt(id, 10);
      if (!isNaN(idNum)) {
        deleteVisionBoardItemMutation.mutate(idNum);
      }
    }
  };

  // Render skill level indicators
  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i <= level ? 'bg-primary' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
          Plan Your Future
        </h1>
        <p className="text-lg text-neutral-600">
          Explore careers, set goals, and visualize your journey toward success.
        </p>
      </div>

      {/* Intro Section */}
      <Card className="mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What Could Your Future Look Like?</h2>
          <p className="text-lg opacity-90">
            Based on your strengths and interests, here are some paths you might love. 
            Explore careers, skills, and goals that match you.
          </p>
        </div>
      </Card>

      {/* Career Cards Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Suggested Career Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((career) => (
            <Card key={career.id} className="hover:shadow-md transition-all border border-neutral-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className={`p-3 rounded-lg ${getColorStyle(career.color)} mb-3`}>
                    {getIconComponent(career.iconName)}
                  </div>
                  <Badge variant="outline" className="h-fit">
                    {career.education}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{career.title}</CardTitle>
                <CardDescription className="text-neutral-600">
                  {career.whyLoveIt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-neutral-700">Example Tasks:</h4>
                  <ul className="space-y-1">
                    {career.tasks.map((task: string, index: number) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-neutral-600">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 text-neutral-700">Skills You'll Need:</h4>
                  <div className="space-y-2">
                    {career.skills.map((skill: {name: string, level: number}, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">{skill.name}</span>
                        {renderSkillLevel(skill.level)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Personal Goals Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Personal Goals</h2>
        <Card>
          <CardHeader>
            <CardTitle>What are you working toward?</CardTitle>
            <CardDescription>
              Setting clear goals helps you stay focused and motivated on your journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="short-term" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="short-term">Short-Term</TabsTrigger>
                <TabsTrigger value="mid-term">Mid-Term</TabsTrigger>
                <TabsTrigger value="long-term">Long-Term</TabsTrigger>
              </TabsList>
              
              <TabsContent value="short-term" className="space-y-4">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="short-term-goal">What do you want to learn this year?</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="short-term-goal" 
                      placeholder="Enter a short-term goal..." 
                      value={newShortTermGoal}
                      onChange={(e) => setNewShortTermGoal(e.target.value)}
                    />
                    <Button onClick={addShortTermGoal}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {shortTermGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                      {editingGoalId === goal.id.toString() ? (
                        <Input 
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {editingGoalId === goal.id.toString() ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => saveEditedGoal(goal.id.toString())}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={cancelEditGoal}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id.toString())}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="mid-term" className="space-y-4">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="mid-term-goal">What career would you like to explore?</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="mid-term-goal" 
                      placeholder="Enter a mid-term goal..." 
                      value={newMidTermGoal}
                      onChange={(e) => setNewMidTermGoal(e.target.value)}
                    />
                    <Button onClick={addMidTermGoal}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {midTermGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                      {editingGoalId === goal.id.toString() ? (
                        <Input 
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {editingGoalId === goal.id.toString() ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => saveEditedGoal(goal.id.toString())}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={cancelEditGoal}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id.toString())}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="long-term" className="space-y-4">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="long-term-goal">Where do you see yourself in 10 years?</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="long-term-goal" 
                      placeholder="Enter a long-term goal..." 
                      value={newLongTermGoal}
                      onChange={(e) => setNewLongTermGoal(e.target.value)}
                    />
                    <Button onClick={addLongTermGoal}>Add</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {longTermGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                      {editingGoalId === goal.id.toString() ? (
                        <Input 
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {editingGoalId === goal.id.toString() ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => saveEditedGoal(goal.id.toString())}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={cancelEditGoal}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id.toString())}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id.toString())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Vision Board Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Vision Board</h2>
        <Card>
          <CardHeader>
            <CardTitle>Visualize Your Dreams</CardTitle>
            <CardDescription>
              Add motivational quotes, images, and goals to create your personal vision board.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Add a motivational quote..." 
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                />
                <Button variant="outline" onClick={addQuoteToVisionBoard}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                <Button variant="outline" disabled>
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </div>
              <p className="text-sm text-neutral-500">
                * Image upload feature will be available in a future update.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-neutral-50 min-h-[300px] rounded-md">
              {visionBoardItems.map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "p-4 rounded-md relative group",
                    item.type === 'quote' ? "bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200" : "bg-white border border-neutral-200"
                  )}
                >
                  {item.type === 'quote' ? (
                    <div className="flex flex-col h-full">
                      <div className="text-sm italic text-indigo-800 flex-1">"{item.content}"</div>
                    </div>
                  ) : item.type === 'image' ? (
                    <img src={item.content} alt="Vision" className="rounded-md w-full h-32 object-cover" />
                  ) : (
                    <div className="bg-white p-2 rounded-md border border-neutral-200">
                      <BookMarked className="h-4 w-4 text-primary mb-1" />
                      <div className="text-sm">{item.content}</div>
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 h-auto" 
                    onClick={() => removeFromVisionBoard(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reflection Prompt */}
      <Card className="mb-6 border-none shadow-none bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
        <CardHeader>
          <CardTitle className="text-amber-800">Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium text-amber-900 mb-3">
            How are you growing toward the future you want?
          </h3>
          <Textarea 
            placeholder="Write your thoughts here..." 
            className="bg-white border-amber-200"
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Save Reflection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlanYourFuture;