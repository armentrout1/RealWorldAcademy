import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  ClipboardList, 
  MessageCircle, 
  Lightbulb,
  Clock, 
  PencilRuler,
  CalendarCheck,
  Search,
  BarChart,
  FileText,
  ChevronRight,
  Send,
  UserCircle
} from "lucide-react";

// Define team member type
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: string;
  color: string;
  icon: React.ReactNode;
}

// Define task type
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "todo" | "in-progress" | "review" | "completed";
  dueDate: string;
}

// Define message type
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  reactions?: string[];
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Designer",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    status: "Working on presentation slides and visual elements",
    color: "bg-purple-500",
    icon: <PencilRuler size={16} />
  },
  {
    id: "jordan",
    name: "Jordan Taylor",
    role: "Organizer",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    status: "Coordinating timeline and resource allocation",
    color: "bg-blue-500",
    icon: <CalendarCheck size={16} />
  },
  {
    id: "malik",
    name: "Malik Johnson",
    role: "Researcher",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    status: "Gathering data and analyzing market trends",
    color: "bg-green-500",
    icon: <Search size={16} />
  },
  {
    id: "ava",
    name: "Ava Rodriguez",
    role: "Presenter",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    status: "Preparing final presentation and talking points",
    color: "bg-amber-500",
    icon: <BarChart size={16} />
  }
];

// Project tasks data
const projectTasks: Task[] = [
  {
    id: "task-1",
    title: "Research the market opportunity",
    description: "Analyze current market trends and identify target audience needs",
    assignedTo: "malik",
    status: "completed",
    dueDate: "2 days ago"
  },
  {
    id: "task-2",
    title: "Create presentation slides",
    description: "Design visually appealing slides with key points and data visualization",
    assignedTo: "sarah",
    status: "in-progress",
    dueDate: "Due tomorrow"
  },
  {
    id: "task-3",
    title: "Build a budget plan",
    description: "Develop a comprehensive budget with cost estimates and ROI projections",
    assignedTo: "jordan",
    status: "in-progress",
    dueDate: "Due tomorrow"
  },
  {
    id: "task-4",
    title: "Write the executive summary",
    description: "Create a concise overview of the project, highlighting key findings and recommendations",
    assignedTo: "malik",
    status: "todo",
    dueDate: "Due in 3 days"
  },
  {
    id: "task-5",
    title: "Practice and prepare presentation",
    description: "Rehearse presentation flow, timing, and prepare for potential questions",
    assignedTo: "ava",
    status: "todo",
    dueDate: "Due in 4 days"
  },
  {
    id: "task-6",
    title: "Final review and submission",
    description: "Complete final check of all materials and submit the finished project",
    assignedTo: "jordan",
    status: "todo",
    dueDate: "Due in 5 days"
  }
];

// Chat messages data
const chatMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "jordan",
    text: "Hey team! I've created our project timeline. Can everyone review and confirm their tasks?",
    timestamp: "Yesterday, 3:42 PM"
  },
  {
    id: "msg-2",
    senderId: "malik",
    text: "Just finished the initial research. Some interesting findings about consumer behavior in this market!",
    timestamp: "Yesterday, 4:15 PM"
  },
  {
    id: "msg-3",
    senderId: "sarah",
    text: "I'll start on the slides today. @Malik, can you share your research doc so I can pull the key points?",
    timestamp: "Yesterday, 4:32 PM"
  },
  {
    id: "msg-4",
    senderId: "malik",
    text: "Shared the research doc in our Drive folder. Let me know if you need anything else!",
    timestamp: "Yesterday, 4:45 PM"
  },
  {
    id: "msg-5",
    senderId: "ava",
    text: "Thanks for the organization, Jordan! I've added some notes on what we should emphasize in the presentation.",
    timestamp: "Yesterday, 5:20 PM"
  },
  {
    id: "msg-6",
    senderId: "jordan",
    text: "Don't forget we have a check-in meeting tomorrow at 2pm to review progress!",
    timestamp: "Yesterday, 5:45 PM"
  },
  {
    id: "msg-7",
    senderId: "sarah",
    text: "Started on the slides design. Here's a preview of the template I'm creating:",
    timestamp: "Today, 9:30 AM"
  },
  {
    id: "msg-8",
    senderId: "malik",
    text: "Looks great, Sarah! I think we should highlight the market size data on the third slide.",
    timestamp: "Today, 10:15 AM"
  }
];

// Team Projects Component
const TeamProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [reflection, setReflection] = useState("");
  const [yourRole, setYourRole] = useState("Your role in the team");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };
  
  // Get task status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "review":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Get task status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "review":
        return "In Review";
      default:
        return "To Do";
    }
  };
  
  // Find team member by ID
  const findTeamMember = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
            Work Together, Win Together
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Real life requires teamwork. This simulation shows how group roles, communication, and shared goals lead to success.
          </p>
        </div>
        
        {/* Project Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-white">Team Project</Badge>
                <Badge variant="outline" className="bg-white">Market Analysis</Badge>
                <Badge variant="outline" className="bg-white">Due in 5 days</Badge>
              </div>
              <h2 className="font-sans font-bold text-2xl text-neutral-900 mb-1">
                Business Launch Strategy
              </h2>
              <p className="text-neutral-600">
                Create a comprehensive business launch plan for a new product, including market analysis, budget, and presentation.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white">Project Details</Button>
              <Button>Join Team</Button>
            </div>
          </div>
        </div>
        
        {/* Your Role Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Your Role
              </CardTitle>
              <CardDescription>Choose your contribution to the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {userAvatar ? (
                          <AvatarImage src={userAvatar} alt="Your avatar" />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            YOU
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">You</div>
                        <div className="text-sm text-neutral-500">{yourRole}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className={`justify-start gap-2 py-6 ${yourRole === "Data Analyst" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setYourRole("Data Analyst")}
                    >
                      <FileText className="h-4 w-4 text-green-500" />
                      Data Analyst
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`justify-start gap-2 py-6 ${yourRole === "Project Manager" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setYourRole("Project Manager")}
                    >
                      <CalendarCheck className="h-4 w-4 text-blue-500" />
                      Project Manager
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`justify-start gap-2 py-6 ${yourRole === "Marketing Specialist" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setYourRole("Marketing Specialist")}
                    >
                      <BarChart className="h-4 w-4 text-purple-500" />
                      Marketing Specialist
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`justify-start gap-2 py-6 ${yourRole === "Financial Planner" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setYourRole("Financial Planner")}
                    >
                      <Clock className="h-4 w-4 text-amber-500" />
                      Financial Planner
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-5">
                  <h3 className="font-medium mb-3">What will you contribute?</h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Select the tasks you'd like to work on for this project:
                  </p>
                  <div className="space-y-3">
                    {projectTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-2">
                        <Checkbox 
                          id={task.id} 
                          checked={task.id === selectedTask}
                          onCheckedChange={() => handleTaskSelect(task.id)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5">
                          <Label 
                            htmlFor={task.id} 
                            className="font-medium cursor-pointer"
                          >
                            {task.title}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Workspace */}
        <div className="mb-8">
          <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Team Members</span>
                <span className="md:hidden">Team</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden md:inline">Task Board</span>
                <span className="md:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">Group Chat</span>
                <span className="md:hidden">Chat</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Team Members Tab */}
            <TabsContent value="team" className="space-y-4">
              <h3 className="font-medium text-xl mb-4">Your Team</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <div className={`h-1 ${member.color}`}></div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-lg">{member.name}</h4>
                            <Badge className={`${member.color} text-white flex items-center gap-1`}>
                              {member.icon}
                              {member.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">{member.status}</p>
                          
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="text-xs">
                              Message
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              View Tasks
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-primary/5 p-5 mt-8">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Team Collaboration Tips</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-neutral-700">
                  <li>Define clear roles and responsibilities for each team member</li>
                  <li>Schedule regular check-ins to ensure everyone is on the same page</li>
                  <li>Give constructive feedback and be open to receiving it</li>
                  <li>Celebrate small wins and acknowledge team members' contributions</li>
                </ul>
              </Card>
            </TabsContent>
            
            {/* Task Board Tab */}
            <TabsContent value="tasks">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-xl">Project Tasks</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* To Do Column */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                        To Do
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {projectTasks.filter(t => t.status === "todo").length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projectTasks
                      .filter(task => task.status === "todo")
                      .map(task => {
                        const assignee = findTeamMember(task.assignedTo);
                        return (
                          <Card key={task.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
                            <CardContent className="p-4 pt-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                                </div>
                                {assignee && (
                                  <Avatar className="h-7 w-7 flex-shrink-0">
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                    <AvatarFallback className={assignee.color.replace("bg-", "text-").replace("500", "700")}>
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                                <Badge variant="outline" className="text-xs text-neutral-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {task.dueDate}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  Start
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </CardContent>
                </Card>
                
                {/* In Progress Column */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                        In Progress
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {projectTasks.filter(t => t.status === "in-progress").length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projectTasks
                      .filter(task => task.status === "in-progress")
                      .map(task => {
                        const assignee = findTeamMember(task.assignedTo);
                        return (
                          <Card key={task.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
                            <div className="h-1 bg-blue-500"></div>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                                </div>
                                {assignee && (
                                  <Avatar className="h-7 w-7 flex-shrink-0">
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                    <AvatarFallback className={assignee.color.replace("bg-", "text-").replace("500", "700")}>
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                                <Badge variant="outline" className="text-xs text-neutral-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {task.dueDate}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  Complete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </CardContent>
                </Card>
                
                {/* Completed Column */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        Completed
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {projectTasks.filter(t => t.status === "completed").length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projectTasks
                      .filter(task => task.status === "completed")
                      .map(task => {
                        const assignee = findTeamMember(task.assignedTo);
                        return (
                          <Card key={task.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
                            <div className="h-1 bg-green-500"></div>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-neutral-600 mt-1">{task.description}</p>
                                </div>
                                {assignee && (
                                  <Avatar className="h-7 w-7 flex-shrink-0">
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                    <AvatarFallback className={assignee.color.replace("bg-", "text-").replace("500", "700")}>
                                      {assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                                <Badge variant="outline" className="text-xs text-green-600 bg-green-50">
                                  Completed
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  Review
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Group Chat Tab */}
            <TabsContent value="chat">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Team Chat
                    </CardTitle>
                    <Badge variant="outline">8 messages</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((message) => {
                      const sender = findTeamMember(message.senderId);
                      return (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8 mt-1">
                            {sender && <AvatarImage src={sender.avatar} alt={sender.name} />}
                            <AvatarFallback>
                              {sender ? sender.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">
                                {sender ? sender.name : 'Unknown User'}
                              </div>
                              {sender && (
                                <Badge className={`${sender.color} text-white text-xs px-1.5 py-0`}>
                                  {sender.role}
                                </Badge>
                              )}
                              <div className="text-xs text-neutral-500">
                                {message.timestamp}
                              </div>
                            </div>
                            <div className="mt-1 text-neutral-700">
                              {message.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="p-3 border-t bg-neutral-50">
                  <div className="flex items-center gap-2 w-full">
                    <Textarea 
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-10 h-10 resize-none"
                    />
                    <Button className="shrink-0" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Reflection Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Team Reflection
            </CardTitle>
            <CardDescription>
              Take a moment to reflect on your experience working in a team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contribution" className="font-medium">
                  What did you contribute to your team?
                </Label>
                <Textarea 
                  id="contribution"
                  placeholder="Describe your role and specific contributions to the team project..."
                  className="mt-2"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="teamwork" className="font-medium">
                  What was easy or hard about working with others?
                </Label>
                <Textarea 
                  id="teamwork"
                  placeholder="Reflect on the challenges and benefits of teamwork in this project..."
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="improvement" className="font-medium">
                  How would you improve your teamwork skills in the future?
                </Label>
                <Textarea 
                  id="improvement"
                  placeholder="What specific skills or approaches would you like to develop for future team projects?"
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline">Save Draft</Button>
            <Button>Submit Reflection</Button>
          </CardFooter>
        </Card>
        
        {/* Next Steps */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h3 className="font-bold text-xl mb-4">Next Steps for Real Team Projects</h3>
          <p className="text-neutral-700 mb-4">
            This simulation gives you a taste of team collaboration. In future updates, you'll be able to:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Form real teams with other students for live collaboration</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Use real-time chat and video communication tools</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Create shared documents and presentations</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Receive feedback from mentors on your team's work</span>
            </li>
          </ul>
          <Button>Learn More About Team Projects</Button>
        </div>
      </div>
    </div>
  );
};

export default TeamProjects;