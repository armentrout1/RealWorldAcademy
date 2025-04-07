import React, { useState, useEffect } from 'react';
import { Link } from "wouter";
import { 
  Book, 
  Filter, 
  Search, 
  ChevronDown, 
  BookOpen, 
  Plus, 
  CheckCircle, 
  Star, 
  Clock, 
  Users,
  Shuffle,
  PenTool,
  Target,
  Brain,
  Lightbulb,
  Briefcase,
  MessageCircle
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Lesson type
interface Lesson {
  id: string;
  title: string;
  subject: string;
  ageGroup: string;
  type: 'Core' | 'Challenge' | 'Creative' | 'Quiz' | 'Project';
  description: string;
  objective: string;
  warmUp: string;
  content: string;
  scenario: string;
  activity: string;
  reflection: string;
  badge?: string;
  estimatedTime: string;
  createdBy?: string;
  popularity?: number;
}

// Tags mapping for lesson types
const typeTags: Record<string, { icon: React.ReactNode, label: string }> = {
  'Core': { icon: <BookOpen size={14} />, label: 'Core Lesson' },
  'Challenge': { icon: <Target size={14} />, label: 'Challenge' },
  'Creative': { icon: <PenTool size={14} />, label: 'Creative' },
  'Quiz': { icon: <MessageCircle size={14} />, label: 'Quiz' },
  'Project': { icon: <Briefcase size={14} />, label: 'Project' }
};

// Subject color mapping
const subjectColors: Record<string, { bg: string, text: string, border: string, icon: React.ReactNode }> = {
  'Financial Literacy': { 
    bg: 'bg-green-100', 
    text: 'text-green-700', 
    border: 'border-green-200',
    icon: <Briefcase size={16} />
  },
  'Entrepreneurship': { 
    bg: 'bg-amber-100', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    icon: <Star size={16} />
  },
  'Technology': { 
    bg: 'bg-purple-100', 
    text: 'text-purple-700', 
    border: 'border-purple-200',
    icon: <PenTool size={16} />
  },
  'Communication': { 
    bg: 'bg-pink-100', 
    text: 'text-pink-700', 
    border: 'border-pink-200',
    icon: <MessageCircle size={16} />
  },
  'Critical Thinking': { 
    bg: 'bg-blue-100', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    icon: <Brain size={16} />
  },
  'Wellness': { 
    bg: 'bg-orange-100', 
    text: 'text-orange-700', 
    border: 'border-orange-200',
    icon: <Lightbulb size={16} />
  }
};

// Mock lesson data
const mockLessons: Lesson[] = [
  {
    id: 'fin-1',
    title: 'Smart Money Challenge: Saving vs. Spending',
    subject: 'Financial Literacy',
    ageGroup: '13-15',
    type: 'Core',
    description: 'Learn how to make strategic decisions about when to save and when to spend your money.',
    objective: 'By the end of this lesson, you\'ll be able to create a simple savings plan for a goal, make smarter decisions about when to spend and when to save, and apply the 24-hour rule to avoid impulse purchases.',
    warmUp: 'Imagine you just received $100 for your birthday. What would you do with it? Would you spend it all, save it all, or a combination?',
    content: 'Money represents choices. Every dollar you have can either be spent now or saved for later, and both options have their place in a healthy financial life. The key to financial success isn\'t about always saving or always spending—it\'s about making intentional choices based on your priorities.',
    scenario: 'Mia has been saving $10 a week from her allowance. After two months, she has $80 saved. She just found out her favorite band is coming to town, and tickets cost $50. She also knows that in three months, she wants to buy a new bike that costs $200.',
    activity: 'Create a simple savings plan for something you want that costs between $50-$200. Calculate how long it will take to reach your goal based on your weekly or monthly savings.',
    reflection: 'What\'s one situation in your life right now where you\'re trying to decide between saving or spending? How can you apply what you\'ve learned to make a better decision?',
    badge: 'Money Mastermind',
    estimatedTime: '45 minutes'
  },
  {
    id: 'ent-1',
    title: 'Mini Business Builder',
    subject: 'Entrepreneurship',
    ageGroup: '13-15',
    type: 'Project',
    description: 'Design a simple business idea and create a one-page business plan to bring it to life.',
    objective: 'By the end of this project, you\'ll understand the key components of a business plan and be able to identify potential customers and revenue streams for a simple business idea.',
    warmUp: 'What problem or need do you see around you that could be turned into a business opportunity?',
    content: 'Entrepreneurs identify needs and create solutions that people are willing to pay for. A good business plan considers who your customers are, what they need, how you\'ll provide value, and how you\'ll make money.',
    scenario: 'Jamal noticed that many people in his neighborhood struggle to find time to walk their dogs during the workday. He decides to start a dog-walking service for busy professionals.',
    activity: 'Create a one-page business plan for your mini business idea. Include target customers, value proposition, pricing, and basic marketing ideas.',
    reflection: 'What was the most challenging part of designing your business? What did you learn about what it takes to turn an idea into a viable business concept?',
    badge: 'Young Entrepreneur',
    estimatedTime: '90 minutes',
    popularity: 95
  },
  {
    id: 'tech-1',
    title: 'Digital Citizenship 101',
    subject: 'Technology',
    ageGroup: '9-12',
    type: 'Core',
    description: 'Learn how to be responsible, ethical, and safe in the digital world.',
    objective: 'By the end of this lesson, you\'ll understand online privacy basics, recognize common internet risks, and know strategies for maintaining a positive digital footprint.',
    warmUp: 'What does it mean to be a "good citizen" in the real world? How might that be similar or different online?',
    content: 'Digital citizenship refers to the responsible use of technology and behaving appropriately and ethically online. This includes protecting your privacy, respecting others, and understanding the permanence of what you post online.',
    scenario: 'Maya received a friend request from someone she doesn\'t know who claims to go to a nearby school. The profile has very few posts and was created last week.',
    activity: 'Create a "Digital Citizenship Code" with 5 rules you think everyone should follow online. Explain why each rule is important.',
    reflection: 'Think about your current online presence. Is there anything you might want to change about how you interact online after this lesson?',
    badge: 'Digital Citizen',
    estimatedTime: '60 minutes'
  },
  {
    id: 'comm-1',
    title: 'The Art of Persuasion',
    subject: 'Communication',
    ageGroup: '13-15',
    type: 'Challenge',
    description: 'Learn and practice techniques to make your arguments more convincing and persuasive.',
    objective: 'By the end of this challenge, you\'ll understand the three appeals of persuasion (ethos, pathos, logos) and be able to construct a persuasive argument using evidence and emotional appeals.',
    warmUp: 'Think of a time when you successfully convinced someone to agree with you or do something. What techniques did you use?',
    content: 'Persuasion is the art of changing someone\'s mind or encouraging them to take action. Effective persuasion uses a combination of credibility (ethos), emotional connection (pathos), and logical reasoning (logos).',
    scenario: 'The local community center is closing due to budget cuts. You believe this will negatively impact many youth in your area who rely on its programs.',
    activity: 'Write a short persuasive speech or letter to local officials arguing why the community center should remain open. Include at least one example of ethos, pathos, and logos.',
    reflection: 'Which type of appeal (ethos, pathos, or logos) do you find most convincing when others are trying to persuade you? Which do you naturally use most often?',
    badge: 'Master Persuader',
    estimatedTime: '75 minutes',
    createdBy: 'Maria Rodriguez'
  },
  {
    id: 'ct-1',
    title: 'Spotting Logical Fallacies',
    subject: 'Critical Thinking',
    ageGroup: '16-18',
    type: 'Quiz',
    description: 'Learn to identify common errors in reasoning that can lead to flawed conclusions.',
    objective: 'By the end of this quiz, you\'ll be able to identify and explain at least five common logical fallacies and recognize them in everyday arguments.',
    warmUp: 'Have you ever heard an argument that seemed to make sense at first, but then realized it wasn\'t actually logical? What gave it away?',
    content: 'Logical fallacies are errors in reasoning that undermine the validity of an argument. Common fallacies include ad hominem (attacking the person instead of their argument), false dichotomy (presenting only two options when more exist), and appeal to popularity (assuming something is true because many people believe it).',
    scenario: 'You\'re reading comments on a news article about climate change and notice several different types of flawed reasoning being used in the debate.',
    activity: 'Review 10 example statements and identify which logical fallacy is being used in each one. Then, rewrite each statement to make it logically sound.',
    reflection: 'Why do you think logical fallacies are so common in everyday discourse? How can improving your ability to spot them help you make better decisions?',
    badge: 'Logic Detective',
    estimatedTime: '50 minutes'
  },
  {
    id: 'well-1',
    title: 'Stress Management Toolkit',
    subject: 'Wellness',
    ageGroup: '13-15',
    type: 'Creative',
    description: 'Discover and practice creative techniques to manage stress and improve your mental well-being.',
    objective: 'By the end of this creative activity, you\'ll have a personalized toolkit of at least five stress management techniques and understand when to apply each one.',
    warmUp: 'What situations typically cause you to feel stressed? How does your body feel when you\'re experiencing stress?',
    content: 'Stress is a natural response to challenging situations, but chronic stress can impact your physical and mental health. Different stress management techniques work for different people and situations, so having a variety of tools at your disposal is valuable.',
    scenario: 'Exam season is approaching, and you\'re feeling overwhelmed by the amount of studying you need to do, plus other commitments like extracurricular activities.',
    activity: 'Create a personalized "Stress Toolkit" with at least five different techniques you can use in stressful situations. Include quick techniques (under 2 minutes), medium techniques (5-15 minutes), and deeper practices (30+ minutes).',
    reflection: 'Which stress management technique was most effective for you? Why do you think it worked? How might you incorporate it into your regular routine?',
    badge: 'Calm Creator',
    estimatedTime: '60 minutes',
    popularity: 88
  },
];

const LessonLibrary: React.FC = () => {
  const { toast } = useToast();
  
  // State for filtered and displayed lessons
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(mockLessons);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Get unique subjects, age groups, and types for filters
  const subjects = ['all', ...Array.from(new Set(mockLessons.map(l => l.subject)))];
  const ageGroups = ['all', ...Array.from(new Set(mockLessons.map(l => l.ageGroup)))];
  const types = ['all', ...Array.from(new Set(mockLessons.map(l => l.type)))];
  
  // Update filtered lessons when filters change
  useEffect(() => {
    let results = mockLessons;
    
    // Apply subject filter
    if (subjectFilter !== 'all') {
      results = results.filter(lesson => lesson.subject === subjectFilter);
    }
    
    // Apply age group filter
    if (ageGroupFilter !== 'all') {
      results = results.filter(lesson => lesson.ageGroup === ageGroupFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(lesson => lesson.type === typeFilter);
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(lesson => 
        lesson.title.toLowerCase().includes(query) || 
        lesson.description.toLowerCase().includes(query) ||
        lesson.subject.toLowerCase().includes(query)
      );
    }
    
    setFilteredLessons(results);
  }, [searchQuery, subjectFilter, ageGroupFilter, typeFilter]);
  
  // View lesson details
  const handleViewLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };
  
  // Add lesson to path (placeholder functionality)
  const handleAddToPath = (lesson: Lesson) => {
    toast({
      title: "Added to Learning Path",
      description: `"${lesson.title}" has been added to your custom curriculum.`,
    });
  };
  
  // Mark lesson as complete (placeholder functionality)
  const handleMarkComplete = (lesson: Lesson) => {
    toast({
      title: "Progress Updated",
      description: `You've completed "${lesson.title}"!`,
    });
    setIsLessonModalOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Intro Section */}
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Lesson Library</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Browse all available lessons by subject, skill, and age group. Add them to a custom learning path or just explore!
        </p>
      </div>
      
      {/* Filter Bar */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Filter Lessons</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search box */}
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons by keyword..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Subject filter */}
            <div>
              <Label htmlFor="subject-filter" className="text-sm font-medium">Subject</Label>
              <Select 
                value={subjectFilter}
                onValueChange={setSubjectFilter}
              >
                <SelectTrigger id="subject-filter" className="w-full">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Age group filter */}
            <div>
              <Label htmlFor="age-filter" className="text-sm font-medium">Age Group</Label>
              <Select 
                value={ageGroupFilter}
                onValueChange={setAgeGroupFilter}
              >
                <SelectTrigger id="age-filter" className="w-full">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map(age => (
                    <SelectItem key={age} value={age}>
                      {age === 'all' ? 'All Ages' : `Ages ${age}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Type filter */}
            <div>
              <Label htmlFor="type-filter" className="text-sm font-medium">Lesson Type</Label>
              <Select 
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger id="type-filter" className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear filters button */}
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setSubjectFilter('all');
                  setAgeGroupFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Lesson Cards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredLessons.length} {filteredLessons.length === 1 ? 'Lesson' : 'Lessons'} Available
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="shortest">Shortest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredLessons.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-lg text-muted-foreground">No lessons match your current filters</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSubjectFilter('all');
                setAgeGroupFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map(lesson => {
              const subjectColor = subjectColors[lesson.subject] || {
                bg: 'bg-gray-100', 
                text: 'text-gray-700', 
                border: 'border-gray-200',
                icon: <Book size={16} />
              };
              const typeTag = typeTags[lesson.type] || { icon: <Book size={14} />, label: lesson.type };
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`border-l-4 ${subjectColor.border} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`${subjectColor.bg} ${subjectColor.text} border-none mb-2 flex items-center gap-1`}
                        >
                          {subjectColor.icon}
                          <span>{lesson.subject}</span>
                        </Badge>
                        <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs font-normal">
                        {typeTag.icon}
                        <span>{typeTag.label}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal flex items-center gap-1">
                        <Users size={12} />
                        <span>Ages {lesson.ageGroup}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs font-normal flex items-center gap-1">
                        <Clock size={12} />
                        <span>{lesson.estimatedTime}</span>
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewLesson(lesson)}
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      View Lesson
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => handleAddToPath(lesson)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add to Path
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Lesson View Modal */}
      {selectedLesson && (
        <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={`${subjectColors[selectedLesson.subject]?.bg || 'bg-gray-100'} 
                               ${subjectColors[selectedLesson.subject]?.text || 'text-gray-700'} 
                               border-none`}
                >
                  {selectedLesson.subject}
                </Badge>
                <Badge variant="outline">
                  Ages {selectedLesson.ageGroup}
                </Badge>
                <Badge variant="outline">
                  {selectedLesson.estimatedTime}
                </Badge>
                {selectedLesson.createdBy && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Created by {selectedLesson.createdBy}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl">{selectedLesson.title}</DialogTitle>
              <DialogDescription className="text-base">
                {selectedLesson.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-4">
              {/* Objective */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Lesson Objective</h3>
                </div>
                <p className="text-muted-foreground">{selectedLesson.objective}</p>
              </div>
              
              <Separator />
              
              {/* Warm-Up */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold">Warm-Up</h3>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-100 dark:border-amber-900">
                  <p className="text-muted-foreground">{selectedLesson.warmUp}</p>
                </div>
              </div>
              
              {/* Core Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Core Content</h3>
                </div>
                <p className="text-muted-foreground">{selectedLesson.content}</p>
              </div>
              
              {/* Real-World Scenario */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                  <h3 className="text-lg font-semibold">Real-World Scenario</h3>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950 p-4 rounded-md border border-violet-100 dark:border-violet-900">
                  <p className="text-muted-foreground">{selectedLesson.scenario}</p>
                </div>
              </div>
              
              {/* Activity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Activity</h3>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md border border-green-100 dark:border-green-900">
                  <p className="text-muted-foreground">{selectedLesson.activity}</p>
                </div>
              </div>
              
              {/* Reflection */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">Reflection</h3>
                </div>
                <p className="text-muted-foreground">{selectedLesson.reflection}</p>
              </div>
              
              {/* Badge (if available) */}
              {selectedLesson.badge && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md flex items-center gap-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Complete this lesson to earn:</h3>
                    <p className="text-sm"><strong>{selectedLesson.badge}</strong> badge</p>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsLessonModalOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => handleAddToPath(selectedLesson)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add to Path
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleMarkComplete(selectedLesson)}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Mark as Complete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Future Hook Comments */}
      {/* <!-- TODO: Connect to dynamic content API --> */}
      {/* <!-- TODO: Allow sorting by popularity or rating --> */}
      {/* <!-- TODO: Show "Created By" tag for contributor-submitted lessons --> */}
    </div>
  );
};

export default LessonLibrary;