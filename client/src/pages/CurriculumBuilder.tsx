import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PlusIcon,
  XIcon,
  SaveIcon,
  LinkIcon,
  EyeIcon,
  DownloadIcon,
  Clock,
  Users,
  GripVertical,
  Trash,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  BookOpen,
  Share2,
  UserCircle,
  Layout,
  ArrowUpDown,
  Pencil,
  MessageSquare,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Module type definition
interface Module {
  id: string;
  title: string;
  summary: string;
  category: string;
  estimatedTime: string;
  ageRange: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  icon: React.ReactNode;
}

// Color mapping for categories
const categoryColors: Record<string, { bg: string, text: string, border: string }> = {
  'Financial Literacy': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  'Real-World Math': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'Projects': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Wellness': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'Tech Skills': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'Communication': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  'Science': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  'History & Cultures': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  'Self-Discovery': { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
};

// Sample modules data
const availableModules: Module[] = [
  {
    id: 'fin-1',
    title: 'Personal Budget Basics',
    summary: 'Learn how to create and maintain a personal budget that works for your lifestyle.',
    category: 'Financial Literacy',
    estimatedTime: '3 hours',
    ageRange: '13-15',
    level: 'Beginner',
    color: 'green',
    icon: <BookOpen size={16} />
  },
  {
    id: 'fin-2',
    title: 'Investing 101',
    summary: 'Understand the basics of investing and how to grow your money over time.',
    category: 'Financial Literacy',
    estimatedTime: '4 hours',
    ageRange: '16-18',
    level: 'Intermediate',
    color: 'green',
    icon: <BookOpen size={16} />
  },
  {
    id: 'fin-3',
    title: 'Entrepreneurship Basics',
    summary: 'Explore what it takes to start and run your own business successfully.',
    category: 'Financial Literacy',
    estimatedTime: '5 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'green',
    icon: <BookOpen size={16} />
  },
  {
    id: 'math-1',
    title: 'Practical Geometry',
    summary: 'Apply geometry concepts to real-world problems and situations.',
    category: 'Real-World Math',
    estimatedTime: '3 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'blue',
    icon: <BookOpen size={16} />
  },
  {
    id: 'math-2',
    title: 'Statistics in Daily Life',
    summary: 'Learn how statistics are used in everyday situations and media.',
    category: 'Real-World Math',
    estimatedTime: '4 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'blue',
    icon: <BookOpen size={16} />
  },
  {
    id: 'proj-1',
    title: 'Community Service Project',
    summary: 'Plan and execute a project that positively impacts your local community.',
    category: 'Projects',
    estimatedTime: '8 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'indigo',
    icon: <Layout size={16} />
  },
  {
    id: 'proj-2',
    title: 'Digital Portfolio Creation',
    summary: 'Build a professional digital portfolio to showcase your work and skills.',
    category: 'Projects',
    estimatedTime: '6 hours',
    ageRange: '16-18',
    level: 'Intermediate',
    color: 'indigo',
    icon: <Layout size={16} />
  },
  {
    id: 'well-1',
    title: 'Mindfulness Practices',
    summary: 'Discover techniques to reduce stress and increase present-moment awareness.',
    category: 'Wellness',
    estimatedTime: '3 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'orange',
    icon: <UserCircle size={16} />
  },
  {
    id: 'well-2',
    title: 'Nutrition Fundamentals',
    summary: 'Learn the basics of nutrition and how to make healthy food choices.',
    category: 'Wellness',
    estimatedTime: '4 hours',
    ageRange: '13-15',
    level: 'Beginner',
    color: 'orange',
    icon: <UserCircle size={16} />
  },
  {
    id: 'tech-1',
    title: 'Intro to Coding',
    summary: 'Get started with programming basics and simple coding projects.',
    category: 'Tech Skills',
    estimatedTime: '6 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'purple',
    icon: <BookOpen size={16} />
  },
  {
    id: 'tech-2',
    title: 'Digital Citizenship',
    summary: 'Learn how to be responsible, ethical, and safe in the digital world.',
    category: 'Tech Skills',
    estimatedTime: '3 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'purple',
    icon: <BookOpen size={16} />
  },
  {
    id: 'comm-1',
    title: 'Public Speaking',
    summary: 'Develop confidence and skills for effective public speaking.',
    category: 'Communication',
    estimatedTime: '5 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'pink',
    icon: <BookOpen size={16} />
  },
  {
    id: 'comm-2',
    title: 'Effective Writing',
    summary: 'Improve your writing skills for academic and real-world contexts.',
    category: 'Communication',
    estimatedTime: '6 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'pink',
    icon: <BookOpen size={16} />
  },
  {
    id: 'sci-1',
    title: 'Environmental Science',
    summary: 'Explore how ecosystems work and how humans interact with the environment.',
    category: 'Science',
    estimatedTime: '5 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'teal',
    icon: <BookOpen size={16} />
  },
  {
    id: 'sci-2',
    title: 'Practical Physics',
    summary: 'Learn physics principles through hands-on experiments and real-world examples.',
    category: 'Science',
    estimatedTime: '6 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'teal',
    icon: <BookOpen size={16} />
  },
  {
    id: 'hist-1',
    title: 'World Cultures',
    summary: 'Explore diverse cultures and traditions from around the world.',
    category: 'History & Cultures',
    estimatedTime: '4 hours',
    ageRange: '9-12',
    level: 'Beginner',
    color: 'amber',
    icon: <BookOpen size={16} />
  },
  {
    id: 'hist-2',
    title: 'Local History Project',
    summary: 'Research and document the history of your community or region.',
    category: 'History & Cultures',
    estimatedTime: '7 hours',
    ageRange: '13-15',
    level: 'Intermediate',
    color: 'amber',
    icon: <BookOpen size={16} />
  },
  {
    id: 'self-1',
    title: 'Strengths Finder',
    summary: 'Discover your unique strengths and how to use them effectively.',
    category: 'Self-Discovery',
    estimatedTime: '3 hours',
    ageRange: '13-15',
    level: 'Beginner',
    color: 'violet',
    icon: <UserCircle size={16} />
  },
  {
    id: 'self-2',
    title: 'Goal Setting Workshop',
    summary: 'Learn effective strategies for setting and achieving meaningful goals.',
    category: 'Self-Discovery',
    estimatedTime: '4 hours',
    ageRange: '13-15',
    level: 'Beginner',
    color: 'violet',
    icon: <UserCircle size={16} />
  },
];

type UserRole = 'Student' | 'Parent' | 'Teacher' | 'Contributor' | 'Buddy';

const CurriculumBuilder: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeAgeGroup, setActiveAgeGroup] = useState<string>('all');
  const [activeSkill, setActiveSkill] = useState<string>('all');
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const [curriculumTitle, setCurriculumTitle] = useState('');
  const [curriculumGoal, setCurriculumGoal] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Student');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Get unique categories, age groups, and skill levels for filtering
  const categories = ['all', ...Array.from(new Set(availableModules.map(m => m.category)))];
  const ageGroups = ['all', ...Array.from(new Set(availableModules.map(m => m.ageRange)))];
  const skillLevels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter modules based on selected filters
  const filteredModules = availableModules.filter(module => {
    const matchesCategory = activeCategory === 'all' || module.category === activeCategory;
    const matchesAgeGroup = activeAgeGroup === 'all' || module.ageRange === activeAgeGroup;
    const matchesSkill = activeSkill === 'all' || module.level === activeSkill;
    
    return matchesCategory && matchesAgeGroup && matchesSkill;
  });

  // Add module to curriculum
  const addModule = (module: Module) => {
    if (selectedModules.find(m => m.id === module.id)) {
      toast({
        title: "Module already added",
        description: `"${module.title}" is already in your curriculum.`,
      });
      return;
    }
    
    setSelectedModules([...selectedModules, module]);
    toast({
      title: "Module added",
      description: `"${module.title}" has been added to your curriculum.`,
    });
  };

  // Remove module from curriculum
  const removeModule = (moduleId: string) => {
    setSelectedModules(selectedModules.filter(m => m.id !== moduleId));
    toast({
      title: "Module removed",
      description: "The module has been removed from your curriculum.",
    });
  };

  // Handle module reordering via drag and drop
  const handleDragStart = (position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newModules = [...selectedModules];
      const draggedItemContent = newModules[dragItem.current];
      newModules.splice(dragItem.current, 1);
      newModules.splice(dragOverItem.current, 0, draggedItemContent);
      
      dragItem.current = null;
      dragOverItem.current = null;
      setSelectedModules(newModules);
      
      toast({
        title: "Order updated",
        description: "Your curriculum order has been updated.",
      });
    }
  };

  // Handle curriculum save (placeholder)
  const saveCurriculum = () => {
    if (!curriculumTitle) {
      toast({
        title: "Name required",
        description: "Please give your curriculum a name before saving.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedModules.length === 0) {
      toast({
        title: "No modules selected",
        description: "Please add at least one module to your curriculum.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Curriculum saved",
      description: `"${curriculumTitle}" has been saved successfully.`,
    });
  };

  // Calculate total time for selected modules
  const totalTime = selectedModules.reduce((acc, module) => {
    const hours = parseInt(module.estimatedTime.split(' ')[0]);
    return acc + hours;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Create Your Own Learning Path</h1>
        <p className="text-lg text-neutral-600">
          Pick topics that matter to you and build a journey that fits your goals. Save it, share it, or assign it.
        </p>
      </div>
      
      {/* User Role Toggle */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-2">I am a:</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={userRole === 'Student' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setUserRole('Student')}
          >
            <Users className="h-4 w-4 mr-1" />
            Student
          </Button>
          <Button 
            variant={userRole === 'Parent' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setUserRole('Parent')}
          >
            <UserCircle className="h-4 w-4 mr-1" />
            Parent
          </Button>
          <Button 
            variant={userRole === 'Teacher' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setUserRole('Teacher')}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Teacher
          </Button>
          <Button 
            variant={userRole === 'Contributor' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setUserRole('Contributor')}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Contributor
          </Button>
          <Button 
            variant={userRole === 'Buddy' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setUserRole('Buddy')}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Buddy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Module Picker */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Library</CardTitle>
              <CardDescription>
                Browse and select modules to add to your custom curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center mb-2">
                  <Filter className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-medium">Filter by:</h3>
                </div>
                
                {/* Category Filter */}
                <div>
                  <Label className="text-xs mb-1 block">Subject</Label>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                    <div className="flex p-2">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={activeCategory === category ? "default" : "outline"}
                          className="mr-2 whitespace-nowrap"
                          size="sm"
                          onClick={() => setActiveCategory(category)}
                        >
                          {category === 'all' ? 'All Subjects' : category}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Age Group Filter */}
                <div>
                  <Label className="text-xs mb-1 block">Age Group</Label>
                  <div className="flex flex-wrap gap-2">
                    {ageGroups.map(ageGroup => (
                      <Button
                        key={ageGroup}
                        variant={activeAgeGroup === ageGroup ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveAgeGroup(ageGroup)}
                      >
                        {ageGroup === 'all' ? 'All Ages' : `Ages ${ageGroup}`}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Skill Level Filter */}
                <div>
                  <Label className="text-xs mb-1 block">Skill Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {skillLevels.map(skill => (
                      <Button
                        key={skill}
                        variant={activeSkill === skill ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveSkill(skill)}
                      >
                        {skill === 'all' ? 'All Levels' : skill}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
              </div>

              {/* Module Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredModules.map(module => {
                  const colorClass = categoryColors[module.category];
                  
                  return (
                    <Card 
                      key={module.id} 
                      className={`border-l-4 ${colorClass.border} hover:shadow-md transition-shadow`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge 
                              variant="outline" 
                              className={`${colorClass.bg} ${colorClass.text} border-none mb-2`}
                            >
                              {module.category}
                            </Badge>
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-neutral-600 mb-4">{module.summary}</p>
                        <div className="flex items-center text-xs text-neutral-500 space-x-4">
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            <span>{module.estimatedTime}</span>
                          </div>
                          <div className="flex items-center">
                            <Users size={12} className="mr-1" />
                            <span>Ages {module.ageRange}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs font-normal">
                            {module.level}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => addModule(module)}
                        >
                          <PlusIcon size={16} className="mr-1" />
                          Add to Path
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Curriculum Builder */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Custom Curriculum</CardTitle>
              <CardDescription>
                {selectedModules.length} modules • {totalTime} hours total
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Curriculum Details */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Curriculum Name</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Summer Learning Path"
                    value={curriculumTitle}
                    onChange={(e) => setCurriculumTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="goal">What is this learning path for?</Label>
                  <Textarea 
                    id="goal" 
                    placeholder="e.g., Summer learning for 12-year-old interested in business"
                    className="resize-none"
                    value={curriculumGoal}
                    onChange={(e) => setCurriculumGoal(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Selected Modules */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Modules in This Path</h3>
                <p className="text-xs text-neutral-500 mb-2">Drag to reorder</p>
                
                {selectedModules.length === 0 ? (
                  <div className="border-2 border-dashed rounded-md p-8 text-center text-neutral-400">
                    <p>Add modules from the library to build your curriculum</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {selectedModules.map((module, index) => {
                        const colorClass = categoryColors[module.category];
                        
                        return (
                          <div 
                            key={module.id}
                            className={`flex items-center p-2 rounded-md border ${colorClass.border} bg-white`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <div className="p-1 cursor-move">
                              <GripVertical size={16} className="text-neutral-400" />
                            </div>
                            <div className="flex-1 ml-2">
                              <div className="font-medium text-sm">{module.title}</div>
                              <div className="flex items-center text-xs text-neutral-500">
                                <span>{module.estimatedTime}</span>
                                <span className="mx-1">•</span>
                                <span>Ages {module.ageRange}</span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-neutral-500 hover:text-red-500"
                              onClick={() => removeModule(module.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPreview(true)}
                >
                  <EyeIcon size={16} className="mr-2" />
                  Preview Curriculum
                </Button>
                <Button 
                  className="flex-1"
                  onClick={saveCurriculum}
                >
                  <SaveIcon size={16} className="mr-2" />
                  {userRole === 'Student' ? 'Save for Myself' : 
                   userRole === 'Parent' ? 'Save for Child' :
                   userRole === 'Teacher' ? 'Save for Class' : 
                   userRole === 'Contributor' ? 'Save as Template' : 'Save Path'}
                </Button>
              </div>
              <div className="flex space-x-2 w-full">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  disabled={selectedModules.length === 0}
                >
                  <Share2 size={16} className="mr-2" />
                  {userRole === 'Contributor' ? 'Submit to RWA' : 'Generate Printable View'}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  disabled={selectedModules.length === 0}
                >
                  <UserCircle size={16} className="mr-2" />
                  {userRole === 'Student' ? 'Share Path' : 
                   userRole === 'Parent' ? 'Assign to Child' :
                   userRole === 'Teacher' ? 'Assign to Students' : 
                   userRole === 'Contributor' ? 'Save as Draft' : 'Recommend to Students'}
                </Button>
              </div>
              
              {/* Hidden Future Hooks */}
              {/* <!-- TODO: Save path to user profile --> */}
              {/* <!-- TODO: Add API for sharing curriculum --> */}
              {/* <!-- TODO: Buddy can generate curriculum suggestions from student goals --> */}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {curriculumTitle || "Untitled Curriculum"}
            </DialogTitle>
            <DialogDescription>
              {curriculumGoal || "Custom learning path"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Curriculum Overview</h3>
                <p className="text-sm text-neutral-500">
                  {selectedModules.length} modules • Approximately {totalTime} hours to complete
                </p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon size={16} className="mr-2" />
                Export as PDF
              </Button>
            </div>
            
            <Separator />
            
            {selectedModules.length > 0 ? (
              <div className="space-y-6">
                {selectedModules.map((module, index) => {
                  const colorClass = categoryColors[module.category];
                  
                  return (
                    <div key={module.id} className="space-y-2">
                      <div className="flex items-start">
                        <div 
                          className={`w-6 h-6 rounded-full ${colorClass.bg} flex items-center justify-center mr-3 mt-1`}
                        >
                          <span className="font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{module.summary}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`${colorClass.bg} ${colorClass.text} border-none`}
                            >
                              {module.category}
                            </Badge>
                            <Badge variant="outline" className="bg-neutral-100">
                              {module.estimatedTime}
                            </Badge>
                            <Badge variant="outline" className="bg-neutral-100">
                              Ages {module.ageRange}
                            </Badge>
                            <Badge variant="outline" className="bg-neutral-100">
                              {module.level}
                            </Badge>
                          </div>
                          
                          <div className="mt-3">
                            <h5 className="text-sm font-medium">Learning Objectives:</h5>
                            <ul className="list-disc list-inside text-sm text-neutral-600 mt-1">
                              <li>
                                Understand key concepts related to {module.title.toLowerCase()}
                              </li>
                              <li>
                                Apply knowledge through hands-on activities and exercises
                              </li>
                              <li>
                                Develop practical skills in {module.category.toLowerCase()}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {index < selectedModules.length - 1 && (
                        <div className="pl-3 ml-3 border-l border-dashed h-6 border-neutral-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <p className="mb-2">No modules added to this curriculum yet</p>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                  Add Modules
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumBuilder;