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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  GraduationCap, 
  CheckCircle,
  Lightbulb,
  ArrowRightCircle,
  Blocks,
  Video,
  FileText,
  BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartLessonGeneratorProps {
  variant?: 'button' | 'card';
  className?: string;
}

/**
 * Smart Lesson Generator Component
 * 
 * Simulates an AI-powered interface for creating customized lessons
 * based on topic, student needs, and learning preferences.
 */
const SmartLessonGenerator: React.FC<SmartLessonGeneratorProps> = ({
  variant = 'button',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState('13-15');
  const [difficultyLevel, setDifficultyLevel] = useState('Intermediate');
  const [duration, setDuration] = useState('30-45 minutes');
  const [learningPreferences, setLearningPreferences] = useState({
    visual: true,
    handson: true,
    discussion: false,
    reading: false,
    video: false
  });
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Generated lesson state
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);
  
  // Handle generating a lesson
  const handleGenerateLesson = () => {
    if (!topic) return;
    
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Construct a lesson based on inputs
      // This is just a simulation - would be replaced with actual AI-generated content
      
      // Determine what learning elements to include based on preferences
      const elements = [];
      
      if (learningPreferences.visual) {
        elements.push({
          type: 'image',
          title: 'Visual Concept Map',
          description: `A visual representation of key concepts related to ${topic}`,
          icon: <Blocks className="h-4 w-4" />
        });
      }
      
      if (learningPreferences.handson) {
        elements.push({
          type: 'activity',
          title: 'Hands-on Exercise',
          description: `Interactive activity to apply concepts related to ${topic}`,
          icon: <Lightbulb className="h-4 w-4" />
        });
      }
      
      if (learningPreferences.video) {
        elements.push({
          type: 'video',
          title: 'Video Explanation',
          description: `Engaging video introduction to ${topic}`,
          icon: <Video className="h-4 w-4" />
        });
      }
      
      if (learningPreferences.reading) {
        elements.push({
          type: 'reading',
          title: 'Reading Material',
          description: `Curated articles and text about ${topic}`,
          icon: <FileText className="h-4 w-4" />
        });
      }
      
      if (learningPreferences.discussion) {
        elements.push({
          type: 'discussion',
          title: 'Discussion Questions',
          description: `Thought-provoking questions about ${topic} to enhance understanding`,
          icon: <BookMarked className="h-4 w-4" />
        });
      }
      
      // Always include assessment
      elements.push({
        type: 'assessment',
        title: 'Knowledge Check',
        description: `Brief assessment to gauge understanding of ${topic}`,
        icon: <CheckCircle className="h-4 w-4" />
      });
      
      // Create a lesson structure
      const lesson = {
        title: `Understanding ${topic}`,
        ageGroup,
        difficulty: difficultyLevel,
        duration,
        learningObjectives: [
          `Understand key concepts related to ${topic}`,
          `Apply knowledge of ${topic} to solve problems`,
          `Analyze different perspectives on ${topic}`
        ],
        elements,
        additionalNotes: additionalInfo 
          ? `Customized with additional context: ${additionalInfo}`
          : 'Standard lesson structure'
      };
      
      setGeneratedLesson(lesson);
      setIsGenerating(false);
    }, 2500); // Simulate 2.5 second generation time
  };
  
  // Reset the generator form
  const handleReset = () => {
    setGeneratedLesson(null);
    setTopic('');
    setAdditionalInfo('');
  };
  
  // Handle checkbox toggle
  const toggleLearningPreference = (pref: string) => {
    setLearningPreferences(prev => ({
      ...prev,
      [pref]: !prev[pref as keyof typeof prev]
    }));
  };
  
  // Card variant (for embedding)
  if (variant === 'card') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            AI Lesson Generator
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Create personalized lessons in seconds with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-500 mb-2" />
            <h3 className="text-lg font-medium mb-1">Smart Lesson Creation</h3>
            <p className="text-sm text-neutral-600 text-center mb-4">
              Our AI can generate customized lessons based on your specific needs and preferences.
            </p>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create a Lesson
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>AI Lesson Generator</DialogTitle>
                  <DialogDescription>
                    Tell us what you need and our AI will create a personalized lesson
                  </DialogDescription>
                </DialogHeader>
                
                {!generatedLesson ? (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="topic">What topic would you like to create a lesson about?</Label>
                      <Input 
                        id="topic" 
                        placeholder="e.g., Financial budgeting, Career planning, etc." 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age-group">Age Group</Label>
                        <Select value={ageGroup} onValueChange={setAgeGroup}>
                          <SelectTrigger id="age-group">
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9-12">9-12 years</SelectItem>
                            <SelectItem value="13-15">13-15 years</SelectItem>
                            <SelectItem value="16-18">16-18 years</SelectItem>
                            <SelectItem value="18+">18+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                          <SelectTrigger id="difficulty">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Lesson Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
                          <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                          <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                          <SelectItem value="60+ minutes">60+ minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Learning Preferences</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="visual" 
                            checked={learningPreferences.visual}
                            onCheckedChange={() => toggleLearningPreference('visual')}
                          />
                          <Label htmlFor="visual" className="text-sm">Visual aids</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="handson" 
                            checked={learningPreferences.handson}
                            onCheckedChange={() => toggleLearningPreference('handson')}
                          />
                          <Label htmlFor="handson" className="text-sm">Hands-on activities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="discussion" 
                            checked={learningPreferences.discussion}
                            onCheckedChange={() => toggleLearningPreference('discussion')}
                          />
                          <Label htmlFor="discussion" className="text-sm">Discussion-based</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="reading" 
                            checked={learningPreferences.reading}
                            onCheckedChange={() => toggleLearningPreference('reading')}
                          />
                          <Label htmlFor="reading" className="text-sm">Reading materials</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="video" 
                            checked={learningPreferences.video}
                            onCheckedChange={() => toggleLearningPreference('video')}
                          />
                          <Label htmlFor="video" className="text-sm">Video content</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                      <Textarea 
                        id="additional-info" 
                        placeholder="Any specific aspects you'd like the lesson to cover?"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">{generatedLesson.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {generatedLesson.ageGroup}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            {generatedLesson.difficulty}
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {generatedLesson.duration}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {generatedLesson.learningObjectives.map((objective: string, index: number) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Lesson Elements</h4>
                        <div className="space-y-2">
                          {generatedLesson.elements.map((element: any, index: number) => (
                            <div key={index} className="flex items-start p-2 rounded-md border">
                              <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                {element.icon}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{element.title}</div>
                                <div className="text-xs text-neutral-600">{element.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {generatedLesson.additionalNotes && (
                        <div className="mt-4 text-sm text-neutral-500">
                          <strong>Note:</strong> {generatedLesson.additionalNotes}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  {!generatedLesson ? (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleGenerateLesson} 
                        disabled={!topic || isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Lesson
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleReset}>
                        Create Another
                      </Button>
                      <Button onClick={() => setOpen(false)}>
                        Use This Lesson
                      </Button>
                    </div>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="bg-neutral-50 border-t p-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs text-neutral-500">
              Powered by AI curriculum tools
            </span>
            <Button variant="ghost" size="sm" className="text-xs">
              <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
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
          <BookOpen className="mr-2 h-4 w-4" />
          Generate Smart Lesson
        </Button>
      </DialogTrigger>
      
      {/* Dialog content - same as in card variant */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Lesson Generator</DialogTitle>
          <DialogDescription>
            Tell us what you need and our AI will create a personalized lesson
          </DialogDescription>
        </DialogHeader>
        
        {!generatedLesson ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic">What topic would you like to create a lesson about?</Label>
              <Input 
                id="topic" 
                placeholder="e.g., Financial budgeting, Career planning, etc." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age-group">Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger id="age-group">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-12">9-12 years</SelectItem>
                    <SelectItem value="13-15">13-15 years</SelectItem>
                    <SelectItem value="16-18">16-18 years</SelectItem>
                    <SelectItem value="18+">18+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Lesson Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
                  <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                  <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                  <SelectItem value="60+ minutes">60+ minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Learning Preferences</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="visual" 
                    checked={learningPreferences.visual}
                    onCheckedChange={() => toggleLearningPreference('visual')}
                  />
                  <Label htmlFor="visual" className="text-sm">Visual aids</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="handson" 
                    checked={learningPreferences.handson}
                    onCheckedChange={() => toggleLearningPreference('handson')}
                  />
                  <Label htmlFor="handson" className="text-sm">Hands-on activities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="discussion" 
                    checked={learningPreferences.discussion}
                    onCheckedChange={() => toggleLearningPreference('discussion')}
                  />
                  <Label htmlFor="discussion" className="text-sm">Discussion-based</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reading" 
                    checked={learningPreferences.reading}
                    onCheckedChange={() => toggleLearningPreference('reading')}
                  />
                  <Label htmlFor="reading" className="text-sm">Reading materials</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="video" 
                    checked={learningPreferences.video}
                    onCheckedChange={() => toggleLearningPreference('video')}
                  />
                  <Label htmlFor="video" className="text-sm">Video content</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information (Optional)</Label>
              <Textarea 
                id="additional-info" 
                placeholder="Any specific aspects you'd like the lesson to cover?"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="rounded-lg border p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">{generatedLesson.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {generatedLesson.ageGroup}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {generatedLesson.difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {generatedLesson.duration}
                  </Badge>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Learning Objectives</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {generatedLesson.learningObjectives.map((objective: string, index: number) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Lesson Elements</h4>
                <div className="space-y-2">
                  {generatedLesson.elements.map((element: any, index: number) => (
                    <div key={index} className="flex items-start p-2 rounded-md border">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        {element.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{element.title}</div>
                        <div className="text-xs text-neutral-600">{element.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {generatedLesson.additionalNotes && (
                <div className="mt-4 text-sm text-neutral-500">
                  <strong>Note:</strong> {generatedLesson.additionalNotes}
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          {!generatedLesson ? (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateLesson} 
                disabled={!topic || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Lesson
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleReset}>
                Create Another
              </Button>
              <Button onClick={() => setOpen(false)}>
                Use This Lesson
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmartLessonGenerator;