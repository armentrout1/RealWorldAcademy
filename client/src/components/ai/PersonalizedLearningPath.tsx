import React, { useState } from 'react';
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
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Loader2, 
  Route, 
  ChevronRight, 
  BookOpen, 
  Lightbulb, 
  PlusCircle,
  GraduationCap,
  UserCircle,
  DownloadIcon,
  CheckIcon,
  ArrowRightCircleIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Learning module type
interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  icon: React.ReactNode;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites?: string[];
}

// Learning path type
interface LearningPath {
  title: string;
  description: string;
  forUserType: string;
  modules: LearningModule[];
  estimatedTimeTotal: string;
}

// Props for component
interface PersonalizedLearningPathProps {
  studentProfile?: {
    learningStyle?: 'Builder' | 'Innovator' | 'Planner' | 'Helper';
    interests?: string[];
    completedModules?: string[];
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
    ageGroup?: '9-12' | '13-15' | '16-18' | '18+';
  };
  variant?: 'button' | 'card';
  onPathSelected?: (path: LearningPath) => void;
  className?: string;
}

/**
 * Personalized Learning Path Component
 * 
 * Simulates AI-generated custom learning paths based on student profiles,
 * interests, and learning styles.
 */
const PersonalizedLearningPath: React.FC<PersonalizedLearningPathProps> = ({
  studentProfile = {
    learningStyle: 'Builder',
    interests: ['Business', 'Technology'],
    completedModules: [],
    skillLevel: 'Beginner',
    ageGroup: '13-15'
  },
  variant = 'button',
  onPathSelected,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaths, setGeneratedPaths] = useState<LearningPath[]>([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
  const [preferences, setPreferences] = useState({
    includeMath: true,
    includeFinancial: true,
    includeTech: true,
    includeProjects: true
  });
  
  // Simulate generating AI paths
  const generatePaths = () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock module data
      const allModules: Record<string, LearningModule[]> = {
        financial: [
          {
            id: 'fin-1',
            title: 'Personal Budget Basics',
            description: 'Learn how to create and maintain a personal budget',
            category: 'Financial Literacy',
            color: 'green',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '3 hours',
            difficulty: 'Beginner'
          },
          {
            id: 'fin-2',
            title: 'Investing Fundamentals',
            description: 'Understand the basics of investing and growing your money',
            category: 'Financial Literacy',
            color: 'green',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '4 hours',
            difficulty: 'Intermediate',
            prerequisites: ['fin-1']
          },
          {
            id: 'fin-3',
            title: 'Entrepreneurship Basics',
            description: 'Learn what it takes to start and run a small business',
            category: 'Financial Literacy',
            color: 'green',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '5 hours',
            difficulty: 'Intermediate'
          }
        ],
        tech: [
          {
            id: 'tech-1',
            title: 'Digital Skills Fundamentals',
            description: 'Essential technology skills for the modern world',
            category: 'Tech Skills',
            color: 'purple',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '3 hours',
            difficulty: 'Beginner'
          },
          {
            id: 'tech-2',
            title: 'Intro to Coding',
            description: 'Begin your coding journey with simple programming concepts',
            category: 'Tech Skills',
            color: 'purple',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '6 hours',
            difficulty: 'Beginner'
          },
          {
            id: 'tech-3',
            title: 'Web Development Basics',
            description: 'Create your first web pages with HTML and CSS',
            category: 'Tech Skills',
            color: 'purple',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '8 hours',
            difficulty: 'Intermediate',
            prerequisites: ['tech-2']
          }
        ],
        projects: [
          {
            id: 'proj-1',
            title: 'Personal Portfolio Project',
            description: 'Create a digital showcase of your work and skills',
            category: 'Projects',
            color: 'indigo',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '6 hours',
            difficulty: 'Intermediate'
          },
          {
            id: 'proj-2',
            title: 'Business Plan Creation',
            description: 'Develop a complete business plan for a product or service',
            category: 'Projects',
            color: 'indigo',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '10 hours',
            difficulty: 'Advanced',
            prerequisites: ['fin-3']
          }
        ],
        math: [
          {
            id: 'math-1',
            title: 'Real-World Math Applications',
            description: 'Practical math skills used in everyday life',
            category: 'Mathematics',
            color: 'blue',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '4 hours',
            difficulty: 'Beginner'
          },
          {
            id: 'math-2',
            title: 'Data Analysis Fundamentals',
            description: 'Learn to collect, analyze and interpret data',
            category: 'Mathematics',
            color: 'blue',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '5 hours',
            difficulty: 'Intermediate',
            prerequisites: ['math-1']
          }
        ],
        core: [
          {
            id: 'self-1',
            title: 'Discovering Your Strengths',
            description: 'Identify and leverage your unique talents and abilities',
            category: 'Self-Discovery',
            color: 'violet',
            icon: <UserCircle className="h-4 w-4" />,
            estimatedTime: '2 hours',
            difficulty: 'Beginner'
          },
          {
            id: 'comm-1',
            title: 'Effective Communication',
            description: 'Master the art of clear communication in different settings',
            category: 'Communication',
            color: 'pink',
            icon: <BookOpen className="h-4 w-4" />,
            estimatedTime: '3 hours',
            difficulty: 'Beginner'
          }
        ]
      };
      
      // Generate paths based on profile and preferences
      const paths: LearningPath[] = [];
      
      // Business & Tech Path
      if (studentProfile.interests?.includes('Business') && preferences.includeFinancial) {
        const businessModules: LearningModule[] = [];
        
        // Always start with self-discovery
        businessModules.push(allModules.core[0]);
        
        // Add financial modules
        businessModules.push(allModules.financial[0]);
        businessModules.push(allModules.financial[2]);
        
        // Add tech if preferred
        if (preferences.includeTech) {
          businessModules.push(allModules.tech[0]);
        }
        
        // Add project if preferred
        if (preferences.includeProjects) {
          businessModules.push(allModules.projects[1]);
        }
        
        // Calculate total time
        const totalHours = businessModules.reduce((sum, module) => {
          const hours = parseInt(module.estimatedTime.split(' ')[0]);
          return sum + hours;
        }, 0);
        
        paths.push({
          title: 'Entrepreneurship Pathway',
          description: 'Build your business skills with this entrepreneurship-focused learning path',
          forUserType: 'Builder interested in Business',
          modules: businessModules,
          estimatedTimeTotal: `${totalHours} hours`
        });
      }
      
      // Tech Focus Path
      if (studentProfile.interests?.includes('Technology') && preferences.includeTech) {
        const techModules: LearningModule[] = [];
        
        // Core modules
        techModules.push(allModules.tech[0]);
        techModules.push(allModules.tech[1]);
        
        // Add math if preferred  
        if (preferences.includeMath) {
          techModules.push(allModules.math[0]);
        }
        
        // Add project
        if (preferences.includeProjects) {
          techModules.push(allModules.tech[2]);
          techModules.push(allModules.projects[0]);
        }
        
        // Calculate total time
        const totalHours = techModules.reduce((sum, module) => {
          const hours = parseInt(module.estimatedTime.split(' ')[0]);
          return sum + hours;
        }, 0);
        
        paths.push({
          title: 'Tech Skills Pathway',
          description: 'Develop technical skills with this technology-focused learning path',
          forUserType: 'Builder interested in Technology',
          modules: techModules,
          estimatedTimeTotal: `${totalHours} hours`
        });
      }
      
      // Balanced Path
      const balancedModules: LearningModule[] = [];
      
      // Core self-discovery
      balancedModules.push(allModules.core[0]);
      
      // Add one from each category based on preferences
      if (preferences.includeFinancial) {
        balancedModules.push(allModules.financial[0]);
      }
      
      if (preferences.includeTech) {
        balancedModules.push(allModules.tech[0]);
      }
      
      if (preferences.includeMath) {
        balancedModules.push(allModules.math[0]);
      }
      
      // Communication for all paths
      balancedModules.push(allModules.core[1]);
      
      // Add project if preferred
      if (preferences.includeProjects) {
        balancedModules.push(allModules.projects[0]);
      }
      
      // Calculate total time
      const totalHours = balancedModules.reduce((sum, module) => {
        const hours = parseInt(module.estimatedTime.split(' ')[0]);
        return sum + hours;
      }, 0);
      
      paths.push({
        title: 'Balanced Learning Pathway',
        description: 'A well-rounded learning experience covering multiple skill areas',
        forUserType: `${studentProfile.learningStyle} with diverse interests`,
        modules: balancedModules,
        estimatedTimeTotal: `${totalHours} hours`
      });
      
      // Update state with generated paths
      setGeneratedPaths(paths);
      setIsGenerating(false);
    }, 2000); // Simulate 2 second delay
  };
  
  // Handle selecting a path
  const handleSelectPath = (index: number) => {
    setSelectedPathIndex(index);
    
    if (onPathSelected && generatedPaths[index]) {
      onPathSelected(generatedPaths[index]);
    }
  };
  
  // Handle adding a path to curriculum
  const handleAddToCurriculum = () => {
    if (selectedPathIndex !== null && generatedPaths[selectedPathIndex]) {
      // In a real implementation, this would add the path to the user's curriculum
      setOpen(false);
    }
  };
  
  // Get color class based on category
  const getCategoryColorClass = (category: string) => {
    const colorMap: Record<string, string> = {
      'Financial Literacy': 'bg-green-100 text-green-800 border-green-200',
      'Tech Skills': 'bg-purple-100 text-purple-800 border-purple-200',
      'Projects': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Self-Discovery': 'bg-violet-100 text-violet-800 border-violet-200',
      'Communication': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    
    return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  // Card variant
  if (variant === 'card') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            AI Learning Path Suggestions
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Get personalized learning recommendations based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <GraduationCap className="h-12 w-12 text-indigo-500 mb-3" />
            <h3 className="text-lg font-medium mb-2">Personalized Learning</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Our AI can analyze your strengths, interests, and goals to create
              a customized learning path just for you.
            </p>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Brain className="mr-2 h-5 w-5" />
                  Generate Learning Paths
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>AI-Suggested Learning Paths</DialogTitle>
                  <DialogDescription>
                    Personalized learning recommendations based on your profile
                  </DialogDescription>
                </DialogHeader>
                
                {/* Path generation controls */}
                {generatedPaths.length === 0 && !isGenerating && (
                  <div className="space-y-4">
                    <div className="rounded-md border p-4 bg-neutral-50">
                      <div className="flex items-start">
                        <UserCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium mb-1">Your Learning Profile</h3>
                          <div className="text-sm text-neutral-600">
                            <p>Learning Style: <span className="font-medium">{studentProfile.learningStyle}</span></p>
                            <p>Interests: <span className="font-medium">{studentProfile.interests?.join(', ')}</span></p>
                            <p>Level: <span className="font-medium">{studentProfile.skillLevel}</span></p>
                            <p>Age Group: <span className="font-medium">{studentProfile.ageGroup}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Learning Preferences</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeMath" 
                            checked={preferences.includeMath} 
                            onCheckedChange={(checked) => setPreferences({...preferences, includeMath: !!checked})}
                          />
                          <Label htmlFor="includeMath">Include Math</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeFinancial" 
                            checked={preferences.includeFinancial}
                            onCheckedChange={(checked) => setPreferences({...preferences, includeFinancial: !!checked})}
                          />
                          <Label htmlFor="includeFinancial">Include Financial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeTech" 
                            checked={preferences.includeTech}
                            onCheckedChange={(checked) => setPreferences({...preferences, includeTech: !!checked})}
                          />
                          <Label htmlFor="includeTech">Include Tech</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeProjects" 
                            checked={preferences.includeProjects}
                            onCheckedChange={(checked) => setPreferences({...preferences, includeProjects: !!checked})}
                          />
                          <Label htmlFor="includeProjects">Include Projects</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={generatePaths} className="w-full">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generate Suggested Paths
                    </Button>
                  </div>
                )}
                
                {/* Loading state */}
                {isGenerating && (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                    <p className="text-neutral-600">
                      Analyzing your profile and generating personalized paths...
                    </p>
                  </div>
                )}
                
                {/* Generated paths */}
                {generatedPaths.length > 0 && !isGenerating && (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {generatedPaths.map((path, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "rounded-lg border p-4 cursor-pointer transition-all",
                            selectedPathIndex === index 
                              ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200" 
                              : "hover:border-indigo-200 hover:bg-indigo-50/50"
                          )}
                          onClick={() => handleSelectPath(index)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{path.title}</h3>
                              <p className="text-sm text-neutral-600 mt-1">{path.description}</p>
                              <div className="flex items-center mt-2 text-xs text-neutral-500">
                                <Route className="h-3.5 w-3.5 mr-1" />
                                <span>{path.modules.length} modules</span>
                                <span className="mx-1.5">•</span>
                                <span>{path.estimatedTimeTotal}</span>
                                <span className="mx-1.5">•</span>
                                <span>Optimized for {path.forUserType}</span>
                              </div>
                            </div>
                            {selectedPathIndex === index && (
                              <CheckIcon className="h-5 w-5 text-indigo-500" />
                            )}
                          </div>
                          
                          {selectedPathIndex === index && (
                            <div className="mt-4 pt-4 border-t">
                              <h4 className="text-xs font-medium uppercase text-neutral-500 mb-2">Modules in this path:</h4>
                              <div className="space-y-3">
                                {path.modules.map((module, moduleIndex) => (
                                  <div key={moduleIndex} className="flex items-center">
                                    <div className="mr-2 text-neutral-400">
                                      {moduleIndex + 1}.
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{module.title}</div>
                                      <div className="flex items-center mt-0.5">
                                        <Badge variant="outline" className={getCategoryColorClass(module.category)}>
                                          {module.category}
                                        </Badge>
                                        <span className="mx-1.5 text-xs text-neutral-500">•</span>
                                        <span className="text-xs text-neutral-500">{module.estimatedTime}</span>
                                      </div>
                                    </div>
                                    {moduleIndex < path.modules.length - 1 && (
                                      <ChevronRight className="h-4 w-4 text-neutral-400 mx-1" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setGeneratedPaths([])}>
                        Generate New Paths
                      </Button>
                      <Button 
                        disabled={selectedPathIndex === null}
                        onClick={handleAddToCurriculum}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to My Curriculum
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Placeholder for actual AI integration */}
                {/* <!-- TODO: Replace static learning suggestions with dynamic API results --> */}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 border-t p-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs text-neutral-500">
              Powered by AI learning analysis
            </span>
            <Button variant="ghost" size="sm" className="text-xs">
              <ArrowRightCircleIcon className="h-3.5 w-3.5 mr-1" />
              Learn More
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  // Button variant (default)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("flex items-center", className)}
        >
          <Brain className="mr-2 h-4 w-4" />
          Let AI Suggest a Learning Path
        </Button>
      </DialogTrigger>
      
      {/* Dialog content - same as in card variant */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI-Suggested Learning Paths</DialogTitle>
          <DialogDescription>
            Personalized learning recommendations based on your profile
          </DialogDescription>
        </DialogHeader>
        
        {/* Path generation controls */}
        {generatedPaths.length === 0 && !isGenerating && (
          <div className="space-y-4">
            <div className="rounded-md border p-4 bg-neutral-50">
              <div className="flex items-start">
                <UserCircle className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Your Learning Profile</h3>
                  <div className="text-sm text-neutral-600">
                    <p>Learning Style: <span className="font-medium">{studentProfile.learningStyle}</span></p>
                    <p>Interests: <span className="font-medium">{studentProfile.interests?.join(', ')}</span></p>
                    <p>Level: <span className="font-medium">{studentProfile.skillLevel}</span></p>
                    <p>Age Group: <span className="font-medium">{studentProfile.ageGroup}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Learning Preferences</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeMath" 
                    checked={preferences.includeMath} 
                    onCheckedChange={(checked) => setPreferences({...preferences, includeMath: !!checked})}
                  />
                  <Label htmlFor="includeMath">Include Math</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeFinancial" 
                    checked={preferences.includeFinancial}
                    onCheckedChange={(checked) => setPreferences({...preferences, includeFinancial: !!checked})}
                  />
                  <Label htmlFor="includeFinancial">Include Financial</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeTech" 
                    checked={preferences.includeTech}
                    onCheckedChange={(checked) => setPreferences({...preferences, includeTech: !!checked})}
                  />
                  <Label htmlFor="includeTech">Include Tech</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeProjects" 
                    checked={preferences.includeProjects}
                    onCheckedChange={(checked) => setPreferences({...preferences, includeProjects: !!checked})}
                  />
                  <Label htmlFor="includeProjects">Include Projects</Label>
                </div>
              </div>
            </div>
            
            <Button onClick={generatePaths} className="w-full">
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Suggested Paths
            </Button>
          </div>
        )}
        
        {/* Loading state */}
        {isGenerating && (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-neutral-600">
              Analyzing your profile and generating personalized paths...
            </p>
          </div>
        )}
        
        {/* Generated paths */}
        {generatedPaths.length > 0 && !isGenerating && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {generatedPaths.map((path, index) => (
                <div 
                  key={index}
                  className={cn(
                    "rounded-lg border p-4 cursor-pointer transition-all",
                    selectedPathIndex === index 
                      ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200" 
                      : "hover:border-indigo-200 hover:bg-indigo-50/50"
                  )}
                  onClick={() => handleSelectPath(index)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{path.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{path.description}</p>
                      <div className="flex items-center mt-2 text-xs text-neutral-500">
                        <Route className="h-3.5 w-3.5 mr-1" />
                        <span>{path.modules.length} modules</span>
                        <span className="mx-1.5">•</span>
                        <span>{path.estimatedTimeTotal}</span>
                        <span className="mx-1.5">•</span>
                        <span>Optimized for {path.forUserType}</span>
                      </div>
                    </div>
                    {selectedPathIndex === index && (
                      <CheckIcon className="h-5 w-5 text-indigo-500" />
                    )}
                  </div>
                  
                  {selectedPathIndex === index && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-xs font-medium uppercase text-neutral-500 mb-2">Modules in this path:</h4>
                      <div className="space-y-3">
                        {path.modules.map((module, moduleIndex) => (
                          <div key={moduleIndex} className="flex items-center">
                            <div className="mr-2 text-neutral-400">
                              {moduleIndex + 1}.
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{module.title}</div>
                              <div className="flex items-center mt-0.5">
                                <Badge variant="outline" className={getCategoryColorClass(module.category)}>
                                  {module.category}
                                </Badge>
                                <span className="mx-1.5 text-xs text-neutral-500">•</span>
                                <span className="text-xs text-neutral-500">{module.estimatedTime}</span>
                              </div>
                            </div>
                            {moduleIndex < path.modules.length - 1 && (
                              <ChevronRight className="h-4 w-4 text-neutral-400 mx-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setGeneratedPaths([])}>
                Generate New Paths
              </Button>
              <Button 
                disabled={selectedPathIndex === null}
                onClick={handleAddToCurriculum}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to My Curriculum
              </Button>
            </div>
          </div>
        )}
        
        {/* Placeholder for actual AI integration */}
        {/* <!-- TODO: Replace static learning suggestions with dynamic API results --> */}
        {/* <!-- TODO: Use OpenAI to analyze student profile and generate personalized recommendations --> */}
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizedLearningPath;