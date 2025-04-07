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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  CheckSquare, 
  Calendar, 
  UserCircle, 
  Users, 
  BookOpen, 
  Lightbulb, 
  Loader2,
  MessageSquare,
  AlarmClock,
  GraduationCap,
  BarChart2,
  BarChart,
  Book,
  Zap,
  Download as DownloadIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Student summary type
interface StudentSummary {
  id: number;
  name: string;
  avatar?: string;
  recentModules: string[];
  strengths: string[];
  struggles: string[];
  recommendedFocus: string[];
  lastActivity: string;
  progress: number;
}

// Class insight type
interface ClassInsight {
  type: 'strength' | 'challenge' | 'recommendation';
  content: string;
}

// Assignment suggestion type 
interface AssignmentSuggestion {
  title: string;
  description: string;
  objectives: string[];
  subjects: string[];
  estimatedTime: string;
  difficultyLevel: 'easy' | 'medium' | 'challenging';
  recommendedFor?: string[];
}

// Component props
interface TeacherSmartAssistProps {
  userType: 'teacher' | 'parent';
  students?: StudentSummary[];
  className?: string;
  variant?: 'buttons' | 'card';
}

/**
 * Teacher/Parent Smart Assist Component
 * 
 * Provides AI assistance for educators and parents, including
 * student summaries, class insights, and assignment recommendations.
 */
const TeacherSmartAssist: React.FC<TeacherSmartAssistProps> = ({
  userType = 'teacher',
  students = [],
  className,
  variant = 'buttons'
}) => {
  const [activeTab, setActiveTab] = useState<string>('suggestions');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [assistResponse, setAssistResponse] = useState<string | null>(null);
  
  // Simulated class insights
  const classInsights: ClassInsight[] = [
    {
      type: 'strength',
      content: 'Most students are performing well in practical financial literacy tasks.'
    },
    {
      type: 'challenge',
      content: '60% of students need additional support with long-term financial planning concepts.'
    },
    {
      type: 'recommendation',
      content: 'Consider incorporating more visual aids when teaching investment concepts.'
    },
    {
      type: 'strength',
      content: 'Student collaboration is strong in team projects.'
    },
    {
      type: 'challenge',
      content: 'Technical skills show the widest variance in proficiency among students.'
    }
  ];
  
  // Simulated assignment suggestions
  const assignmentSuggestions: AssignmentSuggestion[] = [
    {
      title: 'Personal Budget Challenge',
      description: 'Students create and maintain a personal budget for a month based on a provided income scenario.',
      objectives: [
        'Apply budgeting principles to real-world scenarios',
        'Identify wants vs. needs in spending decisions',
        'Track expenses and adjust budgets as needed'
      ],
      subjects: ['Financial Literacy', 'Mathematics'],
      estimatedTime: '1 week',
      difficultyLevel: 'medium'
    },
    {
      title: 'Career Research Project',
      description: 'Students research a career path of interest, identifying education requirements, typical responsibilities, and expected earnings.',
      objectives: [
        'Connect academic learning to career opportunities',
        'Practice research and presentation skills',
        'Develop understanding of education-to-career pathways'
      ],
      subjects: ['Career Development', 'Research Skills'],
      estimatedTime: '2 weeks',
      difficultyLevel: 'medium'
    },
    {
      title: 'Problem-Solving Challenge',
      description: 'Students work in pairs to solve a series of increasingly difficult logic and math problems.',
      objectives: [
        'Strengthen critical thinking skills',
        'Apply mathematical concepts to solve problems',
        'Develop collaborative problem-solving techniques'
      ],
      subjects: ['Mathematics', 'Logic', 'Collaboration'],
      estimatedTime: '3 days',
      difficultyLevel: 'challenging',
      recommendedFor: ['Students struggling with applied math']
    }
  ];
  
  // Generate a recommendation based on a specific student
  const generateStudentRecommendation = (student: StudentSummary) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const recommendation = `Based on ${student.name}'s recent activity and progress:

**Strengths to Build On:**
${student.strengths.map(s => `- ${s}`).join('\n')}

**Areas for Additional Support:**
${student.struggles.map(s => `- ${s}`).join('\n')}

**Recommended Next Steps:**
${student.recommendedFocus.map(r => `- ${r}`).join('\n')}

${student.name} has completed modules in ${student.recentModules.join(', ')} with an overall progress rate of ${student.progress}%. 

I recommend focusing on practical, hands-on activities that connect theoretical concepts to real-world applications. Consider providing additional scaffolding for complex topics and leveraging ${student.name}'s strengths in ${student.strengths[0].toLowerCase()} when introducing new material.`;
      
      setAssistResponse(recommendation);
      setIsLoading(false);
    }, 1500);
  };
  
  // Generate a weekly summary
  const generateWeeklySummary = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const summary = `**Weekly Learning Summary**

This week, ${students.length} students engaged with the platform. Here are the key insights:

**Overall Progress:**
- Average completion rate: 68%
- Most active day: Wednesday
- Most completed module: Financial Literacy Basics

**Engagement by Subject Area:**
- Financial Literacy: High engagement (82%)
- Real-World Math: Moderate engagement (65%)
- Tech Skills: Mixed engagement (53%)

**Student Highlights:**
${students.slice(0, 3).map(student => 
  `- ${student.name}: Completed ${student.recentModules.length} modules, showing strength in ${student.strengths[0].toLowerCase()}`
).join('\n')}

**Recommended Focus Areas:**
1. Provide additional support for the 3 students struggling with long-term financial planning concepts
2. Consider more visual learning resources for technical skills modules
3. Highlight the connection between current lessons and future career applications

**Suggested Next Activity:**
Personal Budget Challenge - This hands-on project will help reinforce recent learning while addressing common areas of difficulty.`;
      
      setAssistResponse(summary);
      setIsLoading(false);
    }, 1500);
  };
  
  // Generate response to custom query
  const handleCustomQuery = () => {
    if (customQuery.trim().length === 0) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate different responses based on query content
      let response = '';
      
      if (customQuery.toLowerCase().includes('struggle') || 
          customQuery.toLowerCase().includes('difficult') || 
          customQuery.toLowerCase().includes('challenge')) {
        response = `Based on my analysis of your ${userType === 'teacher' ? 'class' : 'child\'s'} data, here are the main challenges I've identified:

1. **Abstract Concepts in Financial Planning**: ${userType === 'teacher' ? 'Students are' : 'Your child is'} having difficulty connecting theoretical concepts to practical applications, particularly with long-term planning.

2. **Technical Skill Variance**: There's a wide range in proficiency with digital tools and technical concepts.

3. **Sustained Engagement**: Some ${userType === 'teacher' ? 'students' : 'learning sessions'} show strong initial interest but decreasing engagement over time.

**Recommended Strategies:**

- Use more real-world examples and interactive simulations
- Provide differentiated resources for varying technical skill levels
- Break complex projects into smaller milestone achievements
- Connect learning explicitly to personal interests and goals

Would you like more specific strategies for any of these challenges?`;
      } else if (customQuery.toLowerCase().includes('progress') || 
                 customQuery.toLowerCase().includes('improve') || 
                 customQuery.toLowerCase().includes('better')) {
        response = `I've analyzed the progress data and have some insights on improvements:

**Areas of Strong Progress:**
- Financial literacy fundamentals (basics of budgeting, saving concepts)
- Collaborative skills in group activities
- Self-reflection and personal assessment activities

**Opportunities for Accelerated Progress:**
1. **Personalized Learning Paths**: Consider customizing assignments based on individual strengths and interests
2. **Peer Learning**: Facilitate more structured peer-to-peer teaching opportunities
3. **Real-World Application**: Increase connections between theoretical knowledge and practical applications

**Specific Improvement Metrics:**
- ${userType === 'teacher' ? 'Students who' : 'When your child'} completed the practical application exercises showed 32% higher retention rates
- Concepts taught using visual aids were recalled with 45% higher accuracy
- Self-paced modules resulted in 27% higher completion rates than timed activities

Would you like me to recommend specific activities that leverage these insights?`;
      } else {
        response = `Thanks for your question about "${customQuery.trim()}". Here's what I can tell you based on the available data:

${userType === 'teacher' ? 'Your students have' : 'Your child has'} engaged with content related to this topic in the following ways:

- Completed related modules: Personal Finance Basics, Future Planning, Career Exploration
- Demonstrated strengths in practical applications and visual learning
- Spent approximately 4.5 hours on related content in the past month

**Relevant Insights:**
- This topic connects well with recent learning in financial literacy
- There's an opportunity to build on existing knowledge by introducing more advanced concepts
- Similar topics have shown high engagement levels among ${userType === 'teacher' ? 'your student demographic' : 'children in this age group'}

**Suggested Next Steps:**
1. Explore the "Real World Applications" module that directly relates to this topic
2. Consider the hands-on project options available in the Projects section
3. Review the assessment data to identify specific areas to focus on within this topic

Would you like more specific information about any of these aspects?`;
      }
      
      setAssistResponse(response);
      setIsLoading(false);
    }, 2000);
  };
  
  // Handle dialog opening
  const handleOpenDialog = (dialogType: string) => {
    setOpenDialog(dialogType);
    setAssistResponse(null); // Clear previous responses
    
    // Auto-generate content for specific dialogs
    if (dialogType === 'weekly-summary') {
      generateWeeklySummary();
    }
  };
  
  // Format the response text with markdown-like styling
  const formatResponseText = (text: string) => {
    if (!text) return '';
    
    return text.split('\n\n').map((paragraph, i) => (
      <p key={i} className="mb-3">
        {paragraph.split('\n').map((line, j) => {
          // Handle bullet points
          if (line.startsWith('- ')) {
            return (
              <div key={j} className="flex items-start ml-1 mb-1">
                <span className="mr-2">•</span>
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          
          // Handle numbered lists
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={j} className="flex items-start ml-1 mb-1">
                <span className="mr-2">{line.split('.')[0]}.</span>
                <span>{line.substring(line.indexOf(' ') + 1)}</span>
              </div>
            );
          }
          
          // Handle bold text
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <h4 key={j} className="font-medium mt-2 mb-1">
                {line.substring(2, line.length - 2)}
              </h4>
            );
          }
          
          // Handle section headings
          if (line.startsWith('**') && line.includes(':**')) {
            const parts = line.split(':**');
            return (
              <div key={j} className="mb-1">
                <strong>{parts[0].substring(2)}</strong>:{parts[1]}
              </div>
            );
          }
          
          return <div key={j} className="mb-1">{line}</div>;
        })}
      </p>
    ));
  };
  
  // Card variant
  if (variant === 'card') {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            AI {userType === 'teacher' ? 'Teaching' : 'Parent'} Assistant
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Get personalized insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="suggestions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="suggestions" className="flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Suggestions</span>
                <span className="sm:hidden">Ideas</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center">
                <BarChart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="ask" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Ask</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggestions" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Button 
                  variant="outline" 
                  className="h-auto flex-col items-start p-4 text-left"
                  onClick={() => handleOpenDialog('suggest-assignment')}
                >
                  <div className="flex items-center w-full mb-2">
                    <CheckSquare className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium">Suggest Assignment</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Get personalized assignment ideas based on student needs
                  </p>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto flex-col items-start p-4 text-left"
                  onClick={() => handleOpenDialog('weekly-summary')}
                >
                  <div className="flex items-center w-full mb-2">
                    <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium">Weekly Summary</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Get an overview of the week's learning activities and progress
                  </p>
                </Button>
                
                {userType === 'teacher' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-start p-4 text-left"
                      onClick={() => handleOpenDialog('differentiation')}
                    >
                      <div className="flex items-center w-full mb-2">
                        <Users className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="font-medium">Differentiation Help</span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Get tips for meeting diverse student needs in your class
                      </p>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-start p-4 text-left"
                      onClick={() => handleOpenDialog('learning-resources')}
                    >
                      <div className="flex items-center w-full mb-2">
                        <BookOpen className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="font-medium">Learning Resources</span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Find supplemental materials for current topics
                      </p>
                    </Button>
                  </>
                )}
                
                {userType === 'parent' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-start p-4 text-left"
                      onClick={() => handleOpenDialog('learning-activities')}
                    >
                      <div className="flex items-center w-full mb-2">
                        <Book className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="font-medium">Learning Activities</span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Get ideas for reinforcing concepts at home
                      </p>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col items-start p-4 text-left"
                      onClick={() => handleOpenDialog('progress-support')}
                    >
                      <div className="flex items-center w-full mb-2">
                        <Zap className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="font-medium">Progress Support</span>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Tips for supporting your child's learning progress
                      </p>
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <BarChart2 className="h-4 w-4 text-blue-600" />
                <AlertTitle>
                  {userType === 'teacher' ? 'Class Insights' : 'Learning Insights'}
                </AlertTitle>
                <AlertDescription className="text-blue-800">
                  AI-generated observations based on learning data
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                {classInsights.map((insight, index) => {
                  // Set color and icon based on insight type
                  let color, icon;
                  switch (insight.type) {
                    case 'strength':
                      color = 'bg-green-50 border-green-200 text-green-800';
                      icon = <CheckSquare className="h-4 w-4 text-green-600" />;
                      break;
                    case 'challenge':
                      color = 'bg-amber-50 border-amber-200 text-amber-800';
                      icon = <AlarmClock className="h-4 w-4 text-amber-600" />;
                      break;
                    case 'recommendation':
                      color = 'bg-indigo-50 border-indigo-200 text-indigo-800';
                      icon = <Lightbulb className="h-4 w-4 text-indigo-600" />;
                      break;
                    default:
                      color = 'bg-neutral-50 border-neutral-200';
                      icon = <UserCircle className="h-4 w-4" />;
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border ${color} flex items-start`}
                    >
                      <div className="mr-3 mt-0.5">
                        {icon}
                      </div>
                      <p className="text-sm">{insight.content}</p>
                    </div>
                  );
                })}
              </div>
              
              {userType === 'teacher' && students.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Student Needs Attention</h3>
                  <div className="space-y-2">
                    {students
                      .filter(student => student.progress < 60)
                      .slice(0, 3)
                      .map(student => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-2 rounded-md border border-neutral-200"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 mr-3">
                              {student.avatar ? (
                                <img 
                                  src={student.avatar} 
                                  alt={student.name} 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full flex items-center justify-center text-neutral-700 font-medium">
                                  {student.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{student.name}</div>
                              <div className="text-xs text-neutral-500">Progress: {student.progress}%</div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              handleOpenDialog('student-recommendation');
                              generateStudentRecommendation(student);
                            }}
                          >
                            Analyze
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ask" className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Input 
                  placeholder={`Ask about your ${userType === 'teacher' ? 'students' : 'child'}'s learning...`}
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                />
                <Button onClick={handleCustomQuery} disabled={customQuery.trim().length === 0}>
                  Get AI Insights
                </Button>
              </div>
              
              {assistResponse && !isLoading && (
                <div className="mt-4 p-4 rounded-lg border bg-white">
                  <div className="flex items-start space-x-3">
                    <Brain className="h-6 w-6 text-indigo-500 mt-1" />
                    <div className="flex-1 text-sm">
                      {formatResponseText(assistResponse)}
                    </div>
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex justify-center p-8">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                    <p className="text-sm text-neutral-500">Analyzing data and generating insights...</p>
                  </div>
                </div>
              )}
              
              {!assistResponse && !isLoading && (
                <div className="text-center p-8 text-neutral-500">
                  <GraduationCap className="h-12 w-12 mx-auto text-neutral-300 mb-2" />
                  <h3 className="text-lg font-medium text-neutral-600 mb-1">
                    Ask Me Anything
                  </h3>
                  <p className="text-sm mb-2">
                    Get AI-powered insights about {userType === 'teacher' ? 'your students' : 'your child'}'s learning
                  </p>
                  <div className="max-w-sm mx-auto">
                    <p className="text-xs">Example questions:</p>
                    <div className="grid grid-cols-1 gap-2 mt-2 text-left">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => {
                          setCustomQuery("What topics are students struggling with the most?");
                          handleCustomQuery();
                        }}
                      >
                        What topics are {userType === 'teacher' ? 'students' : 'my child'} struggling with the most?
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => {
                          setCustomQuery("How can I help improve engagement?");
                          handleCustomQuery();
                        }}
                      >
                        How can I help improve engagement?
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => {
                          setCustomQuery("What skills show the most progress?");
                          handleCustomQuery();
                        }}
                      >
                        What skills show the most progress?
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-neutral-50 border-t px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {/* <!-- TODO: Use AI to analyze educator data and generate personalized insights --> */}
            Powered by AI analysis
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={() => setActiveTab('ask')}
          >
            Ask a Question
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Buttons variant (default)
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dialog open={openDialog === 'suggest-assignment'} onOpenChange={(open) => !open && setOpenDialog(null)}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleOpenDialog('suggest-assignment')}
            >
              <CheckSquare className="mr-2 h-4 w-4" />
              Ask AI to Recommend an Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>AI Assignment Recommendations</DialogTitle>
              <DialogDescription>
                Personalized assignment suggestions based on learning data
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
              {assignmentSuggestions.map((assignment, index) => (
                <div 
                  key={index}
                  className="rounded-md border p-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {assignment.description}
                  </p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {assignment.subjects.map((subject, i) => (
                        <Badge key={i} variant="outline">{subject}</Badge>
                      ))}
                      <Badge 
                        variant="outline" 
                        className={
                          assignment.difficultyLevel === 'easy' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : assignment.difficultyLevel === 'medium'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {assignment.difficultyLevel}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        {assignment.estimatedTime}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium uppercase text-neutral-500 mb-1">Learning Objectives:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {assignment.objectives.map((objective, i) => (
                          <li key={i}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {assignment.recommendedFor && (
                      <div className="text-sm">
                        <span className="font-medium text-indigo-600">Recommended for: </span>
                        {assignment.recommendedFor.join(', ')}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={() => setOpenDialog(null)}>
                      Use This Assignment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                {/* <!-- TODO: Use AI to analyze student needs and generate assignment recommendations --> */}
                Powered by AI learning analysis
              </span>
              <Button variant="outline" onClick={() => setOpenDialog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={openDialog === 'weekly-summary'} onOpenChange={(open) => !open && setOpenDialog(null)}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleOpenDialog('weekly-summary')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Summarize {userType === 'teacher' ? 'Students\'' : 'Child\'s'} Week
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Weekly Learning Summary</DialogTitle>
              <DialogDescription>
                AI-generated overview of the week's learning activities and progress
              </DialogDescription>
            </DialogHeader>
            
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-neutral-600">
                  Analyzing learning data and generating summary...
                </p>
              </div>
            ) : (
              <div className="my-4 space-y-2">
                {assistResponse && (
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start space-x-4">
                      <Brain className="h-6 w-6 text-indigo-500 mt-1" />
                      <div className="flex-1 text-sm">
                        {formatResponseText(assistResponse)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                {/* <!-- TODO: Use AI to generate weekly learning summaries based on actual data --> */}
                Data through {new Date().toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setOpenDialog(null)}>
                  Close
                </Button>
                <Button variant="outline" className="flex items-center" disabled={!assistResponse}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Other dialog definitions for student recommendations, etc. would go here */}
      <Dialog open={openDialog === 'student-recommendation'} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Learning Analysis</DialogTitle>
            <DialogDescription>
              AI-generated insights and recommendations for this student
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-neutral-600">
                Analyzing student data and generating insights...
              </p>
            </div>
          ) : (
            <div className="my-4 space-y-2">
              {assistResponse && (
                <div className="rounded-lg border p-4 bg-white">
                  <div className="flex items-start space-x-4">
                    <UserCircle className="h-6 w-6 text-indigo-500 mt-1" />
                    <div className="flex-1 text-sm">
                      {formatResponseText(assistResponse)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherSmartAssist;