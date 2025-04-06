import React, { useState } from "react";
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
  Trash2
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

// Career path definitions
interface CareerPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  whyLoveIt: string;
  tasks: string[];
  education: string;
  skills: { name: string; level: number }[];
}

const careerPaths: CareerPath[] = [
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    icon: <Lightbulb className="h-8 w-8" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    whyLoveIt: "You'll combine your artistic skills with technology to communicate messages visually.",
    tasks: [
      "Create visual concepts for websites, ads, and publications",
      "Design brand identities and logos",
      "Work with color, typography, and layout",
      "Use digital design tools to bring ideas to life"
    ],
    education: "Associate's degree + portfolio",
    skills: [
      { name: "Creative thinking", level: 4 },
      { name: "Visual communication", level: 5 },
      { name: "Digital design tools", level: 4 },
      { name: "Attention to detail", level: 3 }
    ]
  },
  {
    id: "teacher",
    title: "Teacher",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    whyLoveIt: "You'll shape young minds and make a lasting impact on students' lives.",
    tasks: [
      "Create engaging lesson plans",
      "Present information in multiple formats",
      "Provide feedback and guidance",
      "Track student progress and adapt teaching methods"
    ],
    education: "Bachelor's degree + certification",
    skills: [
      { name: "Communication", level: 5 },
      { name: "Organization", level: 4 },
      { name: "Empathy", level: 5 },
      { name: "Subject expertise", level: 4 }
    ]
  },
  {
    id: "engineer",
    title: "Engineer",
    icon: <Wrench className="h-8 w-8" />,
    color: "bg-green-100 text-green-700 border-green-200",
    whyLoveIt: "You'll solve complex problems and build solutions that transform our world.",
    tasks: [
      "Design and test new systems or structures",
      "Analyze data and performance metrics",
      "Improve efficiency of processes",
      "Collaborate with cross-functional teams"
    ],
    education: "Bachelor's degree in Engineering",
    skills: [
      { name: "Analytical thinking", level: 5 },
      { name: "Math & physics", level: 4 },
      { name: "Problem-solving", level: 5 },
      { name: "Technical knowledge", level: 4 }
    ]
  },
  {
    id: "social-worker",
    title: "Social Worker",
    icon: <Heart className="h-8 w-8" />,
    color: "bg-rose-100 text-rose-700 border-rose-200",
    whyLoveIt: "You'll directly help people navigate challenges and improve their lives.",
    tasks: [
      "Assess client needs and situations",
      "Connect people with resources and support",
      "Advocate for vulnerable populations",
      "Create intervention plans for clients"
    ],
    education: "Bachelor's or Master's in Social Work",
    skills: [
      { name: "Empathy", level: 5 },
      { name: "Active listening", level: 5 },
      { name: "Problem-solving", level: 4 },
      { name: "Emotional resilience", level: 4 }
    ]
  },
  {
    id: "web-developer",
    title: "Web Developer",
    icon: <Code className="h-8 w-8" />,
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    whyLoveIt: "You'll create interactive websites and apps that people use every day.",
    tasks: [
      "Write clean, functional code",
      "Build and maintain websites",
      "Collaborate with designers and clients",
      "Test and debug across browsers/devices"
    ],
    education: "Bachelor's degree or bootcamp certification",
    skills: [
      { name: "HTML/CSS/JavaScript", level: 5 },
      { name: "Logical thinking", level: 4 },
      { name: "Problem-solving", level: 5 },
      { name: "Attention to detail", level: 4 }
    ]
  },
  {
    id: "project-manager",
    title: "Project Manager",
    icon: <TargetIcon className="h-8 w-8" />,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    whyLoveIt: "You'll lead teams to achieve goals and bring complex projects to completion.",
    tasks: [
      "Plan project scope, timeline, and resources",
      "Coordinate team members and track progress",
      "Manage budgets and stakeholder expectations",
      "Identify and mitigate risks"
    ],
    education: "Bachelor's degree + certification",
    skills: [
      { name: "Organization", level: 5 },
      { name: "Communication", level: 5 },
      { name: "Leadership", level: 4 },
      { name: "Problem-solving", level: 4 }
    ]
  }
];

// Goal definitions
interface Goal {
  id: string;
  text: string;
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
  
  const [shortTermGoals, setShortTermGoals] = useState<Goal[]>([
    { id: "stg-1", text: "Learn basic coding skills" }
  ]);
  const [midTermGoals, setMidTermGoals] = useState<Goal[]>([
    { id: "mtg-1", text: "Complete a web development course" }
  ]);
  const [longTermGoals, setLongTermGoals] = useState<Goal[]>([
    { id: "ltg-1", text: "Start a career in tech" }
  ]);
  
  const [newShortTermGoal, setNewShortTermGoal] = useState("");
  const [newMidTermGoal, setNewMidTermGoal] = useState("");
  const [newLongTermGoal, setNewLongTermGoal] = useState("");
  
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([
    { id: "vb-1", type: "quote", content: "The future belongs to those who believe in the beauty of their dreams." },
    { id: "vb-2", type: "quote", content: "Your time is limited, don't waste it living someone else's life." },
    { id: "vb-3", type: "image", content: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop" }
  ]);
  
  const [newQuote, setNewQuote] = useState("");

  // Handle adding new goals
  const addShortTermGoal = () => {
    if (newShortTermGoal.trim()) {
      setShortTermGoals([...shortTermGoals, { id: `stg-${Date.now()}`, text: newShortTermGoal }]);
      setNewShortTermGoal("");
      
      // Update progress after adding a goal
      updateCategoryProgress("personal-development", 1, 3);
      addTimelineEvent({
        title: "Added a short-term goal",
        completed: true,
        category: "planning",
        date: new Date().toISOString()
      });
    }
  };
  
  const addMidTermGoal = () => {
    if (newMidTermGoal.trim()) {
      setMidTermGoals([...midTermGoals, { id: `mtg-${Date.now()}`, text: newMidTermGoal }]);
      setNewMidTermGoal("");
      
      // Update progress after adding a goal
      updateCategoryProgress("personal-development", 2, 3);
    }
  };
  
  const addLongTermGoal = () => {
    if (newLongTermGoal.trim()) {
      setLongTermGoals([...longTermGoals, { id: `ltg-${Date.now()}`, text: newLongTermGoal }]);
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
    }
  };
  
  // Handle editing goals
  const startEditGoal = (id: string, type: 'short' | 'mid' | 'long') => {
    const setGoals = type === 'short' ? setShortTermGoals : type === 'mid' ? setMidTermGoals : setLongTermGoals;
    const goals = type === 'short' ? shortTermGoals : type === 'mid' ? midTermGoals : longTermGoals;
    
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, isEditing: true } : goal
    ));
  };
  
  const saveGoal = (id: string, text: string, type: 'short' | 'mid' | 'long') => {
    const setGoals = type === 'short' ? setShortTermGoals : type === 'mid' ? setMidTermGoals : setLongTermGoals;
    const goals = type === 'short' ? shortTermGoals : type === 'mid' ? midTermGoals : longTermGoals;
    
    setGoals(goals.map(goal => 
      goal.id === id ? { id, text, isEditing: false } : goal
    ));
  };
  
  const deleteGoal = (id: string, type: 'short' | 'mid' | 'long') => {
    const setGoals = type === 'short' ? setShortTermGoals : type === 'mid' ? setMidTermGoals : setLongTermGoals;
    const goals = type === 'short' ? shortTermGoals : type === 'mid' ? midTermGoals : longTermGoals;
    
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  // Handle vision board
  const addQuoteToVisionBoard = () => {
    if (newQuote.trim()) {
      setVisionBoardItems([...visionBoardItems, { 
        id: `vb-${Date.now()}`, 
        type: "quote", 
        content: newQuote 
      }]);
      setNewQuote("");
    }
  };
  
  const removeFromVisionBoard = (id: string) => {
    setVisionBoardItems(visionBoardItems.filter(item => item.id !== id));
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
                  <div className={`p-3 rounded-lg ${career.color} mb-3`}>
                    {career.icon}
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
                    {career.tasks.map((task, index) => (
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
                    {career.skills.map((skill, index) => (
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
                      {goal.isEditing ? (
                        <Input 
                          value={goal.text}
                          onChange={(e) => {
                            setShortTermGoals(shortTermGoals.map(g => 
                              g.id === goal.id ? { ...g, text: e.target.value } : g
                            ));
                          }}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {goal.isEditing ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => saveGoal(goal.id, goal.text, 'short')}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id, 'short')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id, 'short')}
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
                      {goal.isEditing ? (
                        <Input 
                          value={goal.text}
                          onChange={(e) => {
                            setMidTermGoals(midTermGoals.map(g => 
                              g.id === goal.id ? { ...g, text: e.target.value } : g
                            ));
                          }}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {goal.isEditing ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => saveGoal(goal.id, goal.text, 'mid')}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id, 'mid')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id, 'mid')}
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
                      {goal.isEditing ? (
                        <Input 
                          value={goal.text}
                          onChange={(e) => {
                            setLongTermGoals(longTermGoals.map(g => 
                              g.id === goal.id ? { ...g, text: e.target.value } : g
                            ));
                          }}
                          className="flex-1 mr-2"
                        />
                      ) : (
                        <span className="flex-1">{goal.text}</span>
                      )}
                      <div className="flex space-x-1">
                        {goal.isEditing ? (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => saveGoal(goal.id, goal.text, 'long')}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditGoal(goal.id, 'long')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => deleteGoal(goal.id, 'long')}
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