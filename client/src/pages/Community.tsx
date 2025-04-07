import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, BookOpen, Users, Lightbulb, AlertTriangle, Award, Flag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for Q&A board
const mockQuestions = [
  {
    id: 1,
    title: "What's the best way to plan a budget?",
    topic: "Financial Literacy",
    author: {
      username: "student42",
      avatar: "S",
      isModerator: false
    },
    content: "I'm trying to create my first budget, but I'm not sure where to start. Should I use the 50/30/20 rule or is there a better approach for a high school student?",
    createdAt: "2 days ago",
    likes: 15,
    replies: [
      {
        id: 101,
        author: {
          username: "financeTeacher",
          avatar: "T",
          isModerator: true
        },
        content: "Great question! For high school students, I recommend starting with tracking your current spending for a month before making your budget. Then try the 50/30/20 rule (50% needs, 30% wants, 20% savings) but adapt it to your situation - maybe 70/20/10 if you don't have many living expenses yet.",
        createdAt: "1 day ago",
        likes: 8
      },
      {
        id: 102,
        author: {
          username: "moneywise",
          avatar: "M",
          isModerator: false
        },
        content: "I started with a simple spreadsheet tracking my income from my part-time job and categorizing all my expenses. The key is consistency! Update it weekly and adjust as needed.",
        createdAt: "1 day ago",
        likes: 5
      }
    ]
  },
  {
    id: 2,
    title: "Can someone help explain what compound interest means?",
    topic: "Financial Literacy",
    author: {
      username: "curious_learner",
      avatar: "C",
      isModerator: false
    },
    content: "I keep hearing about compound interest being either your best friend or worst enemy, but I'm not sure I fully understand how it works. Can someone explain it in simple terms?",
    createdAt: "3 days ago",
    likes: 23,
    replies: [
      {
        id: 201,
        author: {
          username: "mathWhiz",
          avatar: "W",
          isModerator: false
        },
        content: "Compound interest is when you earn interest on both the money you initially put in (the principal) AND on the interest you've already earned. It's like a snowball effect that makes your money grow faster and faster over time. For example, if you invest $100 with 10% annual interest, after year 1 you have $110. In year 2, you earn 10% on $110 (not just on your original $100), so you get $11 more, for a total of $121.",
        createdAt: "2 days ago",
        likes: 17
      }
    ]
  },
  {
    id: 3,
    title: "How do I prepare for a job interview?",
    topic: "Career Skills",
    author: {
      username: "future_pro",
      avatar: "F",
      isModerator: false
    },
    content: "I have my first job interview next week for a summer position. What should I do to prepare? I'm really nervous!",
    createdAt: "1 day ago",
    likes: 8,
    replies: [
      {
        id: 301,
        author: {
          username: "careerCoach",
          avatar: "C",
          isModerator: true
        },
        content: "Research the company beforehand, prepare answers to common questions like 'Tell me about yourself' and 'Why do you want this job?', and prepare 2-3 questions to ask them. Also, practice with a friend or family member. You've got this!",
        createdAt: "1 day ago",
        likes: 7
      }
    ]
  }
];

// Mock data for clubs
const mockClubs = [
  {
    id: 1,
    name: "Young Entrepreneurs Club",
    description: "Learn business fundamentals, share startup ideas, and work on mini-ventures together.",
    emoji: "💸",
    members: 128,
    topics: [
      { id: 1, title: "How to validate a business idea", author: "startupKid", replies: 12, createdAt: "2 days ago" },
      { id: 2, title: "Resources for creating a business plan", author: "bizGenius", replies: 8, createdAt: "4 days ago" },
      { id: 3, title: "This Week's Challenge: Create a 60-second pitch", author: "clubModerator", isPinned: true, replies: 23, createdAt: "6 days ago" }
    ]
  },
  {
    id: 2,
    name: "Critical Thinkers",
    description: "Discuss logical reasoning, debate ethical dilemmas, and solve complex problems together.",
    emoji: "🧠",
    members: 95,
    topics: [
      { id: 1, title: "Identifying logical fallacies in everyday life", author: "logicalThinker", replies: 18, createdAt: "1 day ago" },
      { id: 2, title: "Book recommendation: Thinking Fast and Slow", author: "bookworm", replies: 7, createdAt: "3 days ago" },
      { id: 3, title: "This Week's Challenge: Take both sides of a controversial issue", author: "clubModerator", isPinned: true, replies: 32, createdAt: "5 days ago" }
    ]
  },
  {
    id: 3,
    name: "Creators & Designers",
    description: "Share your creative projects, get feedback, and collaborate on digital or physical creations.",
    emoji: "🎨",
    members: 156,
    topics: [
      { id: 1, title: "Free design resources for beginners", author: "designPro", replies: 24, createdAt: "1 day ago" },
      { id: 2, title: "How to give and receive constructive feedback", author: "artMentor", replies: 11, createdAt: "3 days ago" },
      { id: 3, title: "This Week's Challenge: Redesign a common household item", author: "clubModerator", isPinned: true, replies: 28, createdAt: "4 days ago" }
    ]
  },
  {
    id: 4,
    name: "World Explorers",
    description: "Discover different cultures, discuss global issues, and learn about life around the world.",
    emoji: "🌍",
    members: 112,
    topics: [
      { id: 1, title: "Cultural communication differences around the world", author: "globeTrotter", replies: 15, createdAt: "2 days ago" },
      { id: 2, title: "Sustainable travel and its impact", author: "ecoTraveler", replies: 9, createdAt: "4 days ago" },
      { id: 3, title: "This Week's Challenge: Research a lesser-known cultural tradition", author: "clubModerator", isPinned: true, replies: 19, createdAt: "7 days ago" }
    ]
  }
];

// Mock data for projects
const mockProjects = [
  {
    id: 1,
    title: "My Personal Budget App",
    subject: "Financial Literacy",
    author: "techSavvy",
    summary: "I created a simple budget tracking app using spreadsheets that automatically categorizes spending and shows trends over time.",
    likes: 32,
    comments: 7,
    createdAt: "3 days ago"
  },
  {
    id: 2,
    title: "Mental Health Awareness Campaign",
    subject: "Wellness",
    author: "mindfulStudent",
    summary: "Our team designed posters and social media content to promote mental health awareness at our school. We reached over 500 students!",
    likes: 45,
    comments: 12,
    createdAt: "5 days ago"
  },
  {
    id: 3,
    title: "Local Business Analysis",
    subject: "Entrepreneurship",
    author: "futureFounder",
    summary: "I interviewed 3 local business owners and created a presentation comparing their business models, challenges, and success factors.",
    likes: 28,
    comments: 9,
    createdAt: "1 week ago"
  },
  {
    id: 4,
    title: "Personal Website Portfolio",
    subject: "Technology",
    author: "webDev101",
    summary: "I built my first personal website showcasing my skills and projects. Used HTML, CSS, and a little JavaScript to make it interactive.",
    likes: 37,
    comments: 14,
    createdAt: "2 days ago"
  },
  {
    id: 5,
    title: "Community Garden Initiative",
    subject: "Civic Engagement",
    author: "greenThumb",
    summary: "Organized a team to create a small garden in our community center. We're growing vegetables and donating the produce to a local food bank.",
    likes: 51,
    comments: 18,
    createdAt: "6 days ago"
  }
];

// Topic dropdown options for the Q&A section
const topicOptions = [
  "Financial Literacy",
  "Career Skills",
  "Technology",
  "Communication",
  "Health & Wellness",
  "Study Skills",
  "Creative Arts",
  "Other"
];

// Subject filter options for the Projects section
const subjectFilters = [
  "All",
  "Financial Literacy",
  "Technology",
  "Wellness",
  "Entrepreneurship",
  "Communication",
  "Civic Engagement"
];

const Community: React.FC = () => {
  const [selectedClub, setSelectedClub] = useState<number | null>(null);
  const [projectFilter, setProjectFilter] = useState("All");
  
  // Form state for "Ask a Question"
  const [questionForm, setQuestionForm] = useState({
    title: "",
    topic: "",
    content: ""
  });
  
  // Form state for "Join a Club" - new topic
  const [newTopic, setNewTopic] = useState({
    title: "",
    content: ""
  });
  
  // Form state for "Share a Project"
  const [projectForm, setProjectForm] = useState({
    title: "",
    subject: "",
    summary: ""
  });
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to the backend
    alert("Question submitted! (This is simulated for now)");
    setQuestionForm({ title: "", topic: "", content: "" });
  };
  
  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to the backend
    alert("Topic posted! (This is simulated for now)");
    setNewTopic({ title: "", content: "" });
  };
  
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to the backend
    alert("Project shared! (This is simulated for now)");
    setProjectForm({ title: "", subject: "", summary: "" });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">Community</h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Connect with other students, join discussions, and share your projects in our safe learning environment.
        </p>
      </div>
      
      {/* Community Guidelines Panel */}
      <Card className="mb-8 border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-amber-800">Community Guidelines</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-amber-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Be kind. Be helpful. Stay appropriate.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>No sharing real names or personal information.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Focus on learning and support, not criticism.</span>
            </li>
          </ul>
          <p className="text-amber-600 text-sm mt-3">
            <strong>Note:</strong> This is a simulated environment for educational purposes. No real-time chat or personal data is being collected or shared.
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="questions" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="questions" className="text-base py-3">
            <BookOpen className="h-4 w-4 mr-2" />
            Ask a Question
          </TabsTrigger>
          <TabsTrigger value="clubs" className="text-base py-3">
            <Users className="h-4 w-4 mr-2" />
            Join a Club
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-base py-3">
            <Lightbulb className="h-4 w-4 mr-2" />
            Share a Project
          </TabsTrigger>
        </TabsList>
        
        {/* Questions & Answers Tab */}
        <TabsContent value="questions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Student Q&A Board</h2>
              
              {/* List of questions */}
              <div className="space-y-6 mb-8">
                {mockQuestions.map((question) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardHeader className="bg-neutral-50 pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{question.author.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{question.author.username}</h3>
                              {question.author.isModerator && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-xs">Moderator</Badge>
                              )}
                            </div>
                            <p className="text-sm text-neutral-500">{question.createdAt}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{question.topic}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mt-2">{question.title}</h3>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-neutral-700 mb-4">{question.content}</p>
                      
                      <div className="flex items-center text-sm text-neutral-600 border-t pt-3 mb-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful</span>
                          <span className="ml-1 text-neutral-500">({question.likes})</span>
                        </Button>
                        <div className="flex items-center gap-1 ml-4">
                          <MessageCircle className="h-4 w-4" />
                          <span>{question.replies.length} Replies</span>
                        </div>
                      </div>
                      
                      {/* Replies section */}
                      <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l">
                        {question.replies.map((reply) => (
                          <div key={reply.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{reply.author.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-sm">{reply.author.username}</span>
                                  {reply.author.isModerator && (
                                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 text-xs">Moderator</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-500">{reply.createdAt}</p>
                              </div>
                            </div>
                            <p className="text-sm text-neutral-700 mb-2">{reply.content}</p>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful</span>
                              <span className="ml-1 text-neutral-500">({reply.likes})</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Ask a Question form */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Ask a Question</CardTitle>
                  <CardDescription>
                    Get help from the community by posting your question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="question-title" className="block text-sm font-medium">
                        Question Title
                      </label>
                      <Input
                        id="question-title"
                        placeholder="What would you like to know?"
                        value={questionForm.title}
                        onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="question-topic" className="block text-sm font-medium">
                        Topic
                      </label>
                      <Select
                        onValueChange={(value) => setQuestionForm({...questionForm, topic: value})}
                        value={questionForm.topic}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((topic) => (
                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="question-content" className="block text-sm font-medium">
                        Question Details
                      </label>
                      <Textarea
                        id="question-content"
                        placeholder="Provide more details about your question..."
                        value={questionForm.content}
                        onChange={(e) => setQuestionForm({...questionForm, content: e.target.value})}
                        rows={5}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Post Question
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Clubs Tab */}
        <TabsContent value="clubs">
          {selectedClub === null ? (
            <div>
              <h2 className="text-2xl font-bold mb-6">Interest-Based Clubs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockClubs.map((club) => (
                  <Card key={club.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{club.emoji}</div>
                        <Badge variant="outline" className="font-normal">
                          {club.members} members
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{club.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{club.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button 
                        onClick={() => setSelectedClub(club.id)} 
                        className="w-full"
                      >
                        View Club
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setSelectedClub(null)}>
                  ← Back to Clubs
                </Button>
                <Button>Join Club</Button>
              </div>
              
              {mockClubs.filter(club => club.id === selectedClub).map((club) => (
                <div key={club.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{club.emoji}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{club.name}</h2>
                      <p className="text-neutral-600">{club.members} members</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-neutral-700 mb-8">{club.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-semibold mb-4">Recent Discussions</h3>
                      
                      <div className="space-y-4">
                        {club.topics.map((topic) => (
                          <Card key={topic.id} className={cn(
                            topic.isPinned && "border-blue-200 bg-blue-50"
                          )}>
                            <CardHeader className="pb-3">
                              {topic.isPinned && (
                                <Badge className="w-fit mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">This Week's Challenge</Badge>
                              )}
                              <div className="flex justify-between items-start">
                                <h4 className="text-lg font-medium">{topic.title}</h4>
                              </div>
                              <div className="flex items-center text-sm text-neutral-500">
                                <span>Posted by {topic.author}</span>
                                <span className="mx-2">•</span>
                                <span>{topic.createdAt}</span>
                              </div>
                            </CardHeader>
                            <CardFooter className="py-2 text-sm border-t">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                <span>{topic.replies} replies</span>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Start a Discussion</CardTitle>
                          <CardDescription>
                            Share your thoughts or ask a question
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleTopicSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="topic-title" className="block text-sm font-medium">
                                Title
                              </label>
                              <Input
                                id="topic-title"
                                placeholder="What would you like to discuss?"
                                value={newTopic.title}
                                onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor="topic-content" className="block text-sm font-medium">
                                Message
                              </label>
                              <Textarea
                                id="topic-content"
                                placeholder="Share your thoughts or question with the club..."
                                value={newTopic.content}
                                onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                                rows={4}
                              />
                            </div>
                            
                            <Button type="submit" className="w-full">
                              Post to Club
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Project Showcase</h2>
                
                <Select
                  value={projectFilter}
                  onValueChange={setProjectFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectFilters.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockProjects
                  .filter((project) => projectFilter === "All" || project.subject === projectFilter)
                  .map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit mb-1">{project.subject}</Badge>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center text-sm text-neutral-500">
                          <span>By {project.author}</span>
                          <span className="mx-2">•</span>
                          <span>{project.createdAt}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-neutral-700">{project.summary}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-rose-600">
                            <Heart className="h-4 w-4" />
                            <span>{project.likes}</span>
                          </Button>
                          <div className="flex items-center gap-1 text-sm text-neutral-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{project.comments}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Nice Work!
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Share Your Project</CardTitle>
                  <CardDescription>
                    Let the community see what you've accomplished
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="project-title" className="block text-sm font-medium">
                        Project Title
                      </label>
                      <Input
                        id="project-title"
                        placeholder="What did you create?"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="project-subject" className="block text-sm font-medium">
                        Subject
                      </label>
                      <Select
                        onValueChange={(value) => setProjectForm({...projectForm, subject: value})}
                        value={projectForm.subject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectFilters.filter(s => s !== "All").map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="project-summary" className="block text-sm font-medium">
                        Project Summary
                      </label>
                      <Textarea
                        id="project-summary"
                        placeholder="Tell us about your project in a few sentences..."
                        value={projectForm.summary}
                        onChange={(e) => setProjectForm({...projectForm, summary: e.target.value})}
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Share Project
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;