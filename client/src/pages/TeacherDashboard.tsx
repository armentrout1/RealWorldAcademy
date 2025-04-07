import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  MessageCircle,
  PenLine,
  SendHorizontal,
  Users,
  BookOpen,
  PiggyBank,
  Briefcase,
  Calculator,
  MessageSquare,
  Heart,
  Code,
  Sparkles,
  AlertCircle
} from "lucide-react";

// Mock data for the teacher dashboard
const teacherName = "Ms. Johnson";

// Mock student data
interface Student {
  id: number;
  name: string;
  avatar: string;
  progress: {
    modules: number;
    projects: number;
  };
  subjects: string[];
  selfDiscoveryType: "Planner" | "Builder" | "Innovator" | "Helper";
  recentProjects: {
    id: number;
    title: string;
    subject: string;
    submitted: string;
    grade?: string;
  }[];
  status: "ahead" | "on-track" | "behind";
  interests: string[];
  notes: string;
}

const students: Student[] = [
  {
    id: 1,
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    progress: {
      modules: 75,
      projects: 8,
    },
    subjects: ["math", "finance", "communication"],
    selfDiscoveryType: "Planner",
    recentProjects: [
      {
        id: 101,
        title: "Personal Budget Tracker",
        subject: "Financial Literacy",
        submitted: "2023-03-28",
        grade: "A"
      },
      {
        id: 102,
        title: "Public Speaking Presentation",
        subject: "Communication",
        submitted: "2023-03-15",
        grade: "B+"
      }
    ],
    status: "ahead",
    interests: ["Economics", "Public Speaking", "Data Analysis"],
    notes: "Emma shows exceptional ability in financial concepts. Consider challenging her with more advanced investment concepts."
  },
  {
    id: 2,
    name: "Jamal Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamal",
    progress: {
      modules: 68,
      projects: 7,
    },
    subjects: ["technology", "entrepreneurship", "tech-real-world"],
    selfDiscoveryType: "Innovator",
    recentProjects: [
      {
        id: 201,
        title: "Small Business Website",
        subject: "Tech in the Real World",
        submitted: "2023-03-25",
        grade: "A-"
      },
      {
        id: 202,
        title: "App Prototype",
        subject: "Technology Skills",
        submitted: "2023-03-10",
      }
    ],
    status: "ahead",
    interests: ["Coding", "Business Creation", "Digital Design"],
    notes: "Jamal has creative ideas for tech applications. Encourage him to document his process more thoroughly."
  },
  {
    id: 3,
    name: "Sofia Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    progress: {
      modules: 45,
      projects: 5,
    },
    subjects: ["health", "science", "communication"],
    selfDiscoveryType: "Helper",
    recentProjects: [
      {
        id: 301,
        title: "Nutrition Guide",
        subject: "Health & Wellness",
        submitted: "2023-03-20",
        grade: "B"
      },
      {
        id: 302,
        title: "Stress Management Workshop",
        subject: "Health & Wellness",
        submitted: "2023-03-05",
        grade: "A"
      }
    ],
    status: "on-track",
    interests: ["Nutrition", "Psychology", "Community Service"],
    notes: "Sofia shows strong empathy in her projects. Great candidate for peer mentoring."
  },
  {
    id: 4,
    name: "Tyler Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler",
    progress: {
      modules: 30,
      projects: 3,
    },
    subjects: ["history", "technology", "careers"],
    selfDiscoveryType: "Builder",
    recentProjects: [
      {
        id: 401,
        title: "Career Research Report",
        subject: "Future Careers",
        submitted: "2023-03-18",
        grade: "C+"
      }
    ],
    status: "behind",
    interests: ["Gaming", "History", "Video Production"],
    notes: "Tyler needs more structure and regular check-ins. Set weekly goals to help him catch up."
  },
  {
    id: 5,
    name: "Aisha Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
    progress: {
      modules: 60,
      projects: 6,
    },
    subjects: ["entrepreneurship", "math", "finance"],
    selfDiscoveryType: "Planner",
    recentProjects: [
      {
        id: 501,
        title: "Investment Strategy",
        subject: "Financial Literacy",
        submitted: "2023-03-22",
        grade: "A-"
      },
      {
        id: 502,
        title: "Small Business Plan",
        subject: "Entrepreneurship",
        submitted: "2023-03-12",
        grade: "A"
      }
    ],
    status: "on-track",
    interests: ["Investment", "Business Planning", "International Relations"],
    notes: "Aisha has a methodical approach to planning. Excellent organization skills."
  },
  {
    id: 6,
    name: "Jackson Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson",
    progress: {
      modules: 40,
      projects: 4,
    },
    subjects: ["science", "tech-real-world", "health"],
    selfDiscoveryType: "Innovator",
    recentProjects: [
      {
        id: 601,
        title: "Environmental Analysis App",
        subject: "Science",
        submitted: "2023-03-15",
        grade: "B+"
      }
    ],
    status: "on-track",
    interests: ["Environmental Science", "Mobile Apps", "Sustainable Technology"],
    notes: "Jackson has innovative ideas connecting science and technology. Encourage more practical implementations."
  },
  {
    id: 7,
    name: "Maya Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    progress: {
      modules: 25,
      projects: 2,
    },
    subjects: ["communication", "careers", "entrepreneurship"],
    selfDiscoveryType: "Helper",
    recentProjects: [
      {
        id: 701,
        title: "Community Outreach Plan",
        subject: "Communication",
        submitted: "2023-03-10",
        grade: "B"
      }
    ],
    status: "behind",
    interests: ["Community Projects", "Event Planning", "Social Media"],
    notes: "Maya needs help with time management. Strong communication skills but struggles with deadlines."
  },
  {
    id: 8,
    name: "Ethan Roberts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
    progress: {
      modules: 55,
      projects: 5,
    },
    subjects: ["math", "tech-real-world", "technology"],
    selfDiscoveryType: "Builder",
    recentProjects: [
      {
        id: 801,
        title: "Data Analysis Project",
        subject: "Real-World Math",
        submitted: "2023-03-25",
        grade: "A"
      },
      {
        id: 802,
        title: "Website Portfolio",
        subject: "Tech in the Real World",
        submitted: "2023-03-08",
        grade: "B+"
      }
    ],
    status: "on-track",
    interests: ["Programming", "Data Science", "Graphic Design"],
    notes: "Ethan excels in technical skills but could improve presentation quality."
  }
];

// Mock assignments data
interface Assignment {
  id: number;
  title: string;
  subject: string;
  ageGroup: string;
  dueDate: string;
  assigned: string;
  status: {
    completed: number;
    total: number;
  };
}

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Create a Personal Budget",
    subject: "finance",
    ageGroup: "13-15",
    dueDate: "2023-04-15",
    assigned: "2023-04-01",
    status: {
      completed: 5,
      total: 8
    }
  },
  {
    id: 2,
    title: "Digital Portfolio Project",
    subject: "tech-real-world",
    ageGroup: "16-18",
    dueDate: "2023-04-22",
    assigned: "2023-04-05",
    status: {
      completed: 3,
      total: 8
    }
  },
  {
    id: 3,
    title: "Active Listening Exercise",
    subject: "communication",
    ageGroup: "9-12",
    dueDate: "2023-04-10",
    assigned: "2023-04-03",
    status: {
      completed: 7,
      total: 8
    }
  }
];

// Mock announcements data
interface Announcement {
  id: number;
  message: string;
  date: string;
}

const announcements: Announcement[] = [
  {
    id: 1,
    message: "This week's focus is on budgeting and project collaboration! Remember to complete your group assignments by Friday.",
    date: "2023-04-03"
  },
  {
    id: 2,
    message: "Career Day is coming up on April 20th. Please prepare your questions for our guest speakers from the tech and finance industries.",
    date: "2023-04-01"
  }
];

// Helper function to get subject icon
const getSubjectIcon = (subject: string) => {
  switch (subject) {
    case "math":
      return <Calculator className="h-4 w-4" />;
    case "finance":
      return <PiggyBank className="h-4 w-4" />;
    case "science":
      return <FileText className="h-4 w-4" />;
    case "history":
      return <BookOpen className="h-4 w-4" />;
    case "careers":
      return <Briefcase className="h-4 w-4" />;
    case "technology":
      return <Code className="h-4 w-4" />;
    case "communication":
      return <MessageSquare className="h-4 w-4" />;
    case "health":
      return <Heart className="h-4 w-4" />;
    case "entrepreneurship":
      return <Sparkles className="h-4 w-4" />;
    case "tech-real-world":
      return <Code className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

// Helper function to get subject name
const getSubjectName = (subject: string) => {
  switch (subject) {
    case "math":
      return "Real-World Math";
    case "finance":
      return "Financial Literacy";
    case "science":
      return "Practical Science";
    case "history":
      return "Global Perspective";
    case "careers":
      return "Future Careers";
    case "technology":
      return "Technology Skills";
    case "communication":
      return "Communication & Relationships";
    case "health":
      return "Health & Wellness";
    case "entrepreneurship":
      return "Entrepreneurship & Work Skills";
    case "tech-real-world":
      return "Tech in the Real World";
    default:
      return subject;
  }
};

// Helper function to get subject color
const getSubjectColor = (subject: string) => {
  switch (subject) {
    case "math":
      return "bg-blue-500";
    case "finance":
      return "bg-purple-500";
    case "science":
      return "bg-green-500";
    case "history":
      return "bg-amber-500";
    case "careers":
      return "bg-rose-500";
    case "technology":
      return "bg-cyan-500";
    case "communication":
      return "bg-indigo-500";
    case "health":
      return "bg-red-500";
    case "entrepreneurship":
      return "bg-orange-500";
    case "tech-real-world":
      return "bg-teal-500";
    default:
      return "bg-gray-500";
  }
};

// Teacher Dashboard Component
const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState<boolean>(false);
  const [newAnnouncement, setNewAnnouncement] = useState<string>("");
  
  // Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    subject: "",
    ageGroup: "",
    dueDate: "",
    instructions: ""
  });

  // Filter State
  const [studentFilter, setStudentFilter] = useState({
    status: "all",
    subject: "all"
  });

  // Filtered students based on filters
  const filteredStudents = students.filter(student => {
    // Filter by status
    if (studentFilter.status !== "all" && student.status !== studentFilter.status) {
      return false;
    }
    
    // Filter by subject
    if (studentFilter.subject !== "all" && !student.subjects.includes(studentFilter.subject)) {
      return false;
    }
    
    return true;
  });

  // Handler for opening student detail view
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentDialogOpen(true);
  };

  // Handler for assignment form changes
  const handleAssignmentFormChange = (field: string, value: string) => {
    setAssignmentForm({
      ...assignmentForm,
      [field]: value
    });
  };

  // Handler for posting a new announcement
  const handlePostAnnouncement = () => {
    if (newAnnouncement.trim() === "") return;
    // In a real app, this would save to the backend
    // For now, we'll just clear the input
    setNewAnnouncement("");
    alert("Announcement posted! (This is a demo, so it won't be saved)");
  };

  // Handler for assigning to all students
  const handleAssignToAll = () => {
    // Check if all required fields are filled
    if (
      assignmentForm.title.trim() === "" ||
      assignmentForm.subject === "" ||
      assignmentForm.ageGroup === "" ||
      assignmentForm.dueDate === ""
    ) {
      alert("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would save to the backend
    alert("Assignment created and assigned to all students! (This is a demo, so it won't be saved)");
    
    // Reset form
    setAssignmentForm({
      title: "",
      subject: "",
      ageGroup: "",
      dueDate: "",
      instructions: ""
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
          Welcome, {teacherName}
        </h1>
        <p className="text-blue-600">
          Your Educator Dashboard — Guide and inspire your students' learning journey
        </p>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="roster">Class Roster</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="messages">Announcements</TabsTrigger>
        </TabsList>

        {/* Dashboard Content */}
        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Your Students
                </CardTitle>
                <CardDescription>Overview of your student progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-neutral-600 border-b pb-2">
                    <span className="font-medium">Status Summary</span>
                    <span className="font-medium">Count</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="bg-green-500 mr-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ahead
                      </Badge>
                      <span className="text-sm text-neutral-600">Exceeding expectations</span>
                    </div>
                    <span className="font-medium">{students.filter(s => s.status === "ahead").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge className="bg-blue-500 mr-2">
                        <Clock className="h-3 w-3 mr-1" />
                        On Track
                      </Badge>
                      <span className="text-sm text-neutral-600">Meeting expectations</span>
                    </div>
                    <span className="font-medium">{students.filter(s => s.status === "on-track").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Badge variant="destructive" className="mr-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Behind
                      </Badge>
                      <span className="text-sm text-neutral-600">Needs attention</span>
                    </div>
                    <span className="font-medium">{students.filter(s => s.status === "behind").length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("roster")}
                >
                  View Full Roster
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Assignments
                </CardTitle>
                <CardDescription>Recent and upcoming assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.slice(0, 3).map(assignment => (
                    <div key={assignment.id} className="border-b pb-2 last:border-b-0">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <div className="flex text-sm text-neutral-500 mt-1">
                            <div className="flex items-center mr-3">
                              {getSubjectIcon(assignment.subject)}
                              <span className="ml-1">{getSubjectName(assignment.subject)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="h-fit">
                          {assignment.status.completed}/{assignment.status.total}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab("assignments")}
                >
                  View All Assignments
                </Button>
              </CardFooter>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Student Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {students.slice(0, 8).map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center">
                    <img 
                      src={student.avatar} 
                      alt={student.name} 
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <div className="flex mt-1">
                        {student.subjects.slice(0, 3).map((subject, index) => (
                          <div 
                            key={index} 
                            className={`${getSubjectColor(subject)} text-white rounded-full p-1 mr-1 flex items-center justify-center`}
                            title={getSubjectName(subject)}
                          >
                            {getSubjectIcon(subject)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Module Progress</span>
                        <span>{student.progress.modules}%</span>
                      </div>
                      <Progress value={student.progress.modules} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Projects Completed</span>
                        <span>{student.progress.projects}</span>
                      </div>
                      <Progress value={(student.progress.projects / 10) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewStudent(student)}
                  >
                    View Student
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Class Roster Content */}
        <TabsContent value="roster">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Class Roster</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Status</label>
                <Select 
                  value={studentFilter.status} 
                  onValueChange={(value) => setStudentFilter({...studentFilter, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="ahead">Ahead</SelectItem>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="behind">Needs Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Subject</label>
                <Select 
                  value={studentFilter.subject} 
                  onValueChange={(value) => setStudentFilter({...studentFilter, subject: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="math">Real-World Math</SelectItem>
                    <SelectItem value="finance">Financial Literacy</SelectItem>
                    <SelectItem value="science">Practical Science</SelectItem>
                    <SelectItem value="history">Global Perspective</SelectItem>
                    <SelectItem value="technology">Technology Skills</SelectItem>
                    <SelectItem value="careers">Future Careers</SelectItem>
                    <SelectItem value="communication">Communication & Relationships</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="entrepreneurship">Entrepreneurship & Work Skills</SelectItem>
                    <SelectItem value="tech-real-world">Tech in the Real World</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Student List */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Subjects</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="h-8 w-8 rounded-full mr-2"
                          />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex">
                          {student.subjects.map((subject, index) => (
                            <div 
                              key={index} 
                              className={`${getSubjectColor(subject)} text-white rounded-full p-1 mr-1 flex items-center justify-center`}
                              title={getSubjectName(subject)}
                            >
                              {getSubjectIcon(subject)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${student.progress.modules}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{student.progress.modules}% complete</span>
                      </td>
                      <td className="px-4 py-3">
                        {student.status === "ahead" && (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Ahead
                          </Badge>
                        )}
                        {student.status === "on-track" && (
                          <Badge className="bg-blue-500">
                            <Clock className="h-3 w-3 mr-1" />
                            On Track
                          </Badge>
                        )}
                        {student.status === "behind" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Needs Help
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">
                          {student.selfDiscoveryType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students match your filter criteria.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Assignments Content */}
        <TabsContent value="assignments">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Create Assignment
                  </CardTitle>
                  <CardDescription>
                    Create and assign new work to your students
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Assignment Title</label>
                    <Input 
                      placeholder="Enter title..." 
                      value={assignmentForm.title}
                      onChange={(e) => handleAssignmentFormChange("title", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Select 
                      value={assignmentForm.subject}
                      onValueChange={(value) => handleAssignmentFormChange("subject", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Real-World Math</SelectItem>
                        <SelectItem value="finance">Financial Literacy</SelectItem>
                        <SelectItem value="science">Practical Science</SelectItem>
                        <SelectItem value="history">Global Perspective</SelectItem>
                        <SelectItem value="technology">Technology Skills</SelectItem>
                        <SelectItem value="careers">Future Careers</SelectItem>
                        <SelectItem value="communication">Communication & Relationships</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="entrepreneurship">Entrepreneurship & Work Skills</SelectItem>
                        <SelectItem value="tech-real-world">Tech in the Real World</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Age Group</label>
                    <Select 
                      value={assignmentForm.ageGroup}
                      onValueChange={(value) => handleAssignmentFormChange("ageGroup", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select age range..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-12">Ages 9-12</SelectItem>
                        <SelectItem value="13-15">Ages 13-15</SelectItem>
                        <SelectItem value="16-18">Ages 16-18</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input 
                      type="date" 
                      value={assignmentForm.dueDate}
                      onChange={(e) => handleAssignmentFormChange("dueDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Instructions</label>
                    <Textarea 
                      placeholder="Enter assignment instructions..." 
                      value={assignmentForm.instructions}
                      onChange={(e) => handleAssignmentFormChange("instructions", e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleAssignToAll}>
                    Assign to All Students
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Current Assignments
                  </CardTitle>
                  <CardDescription>
                    Track progress on existing assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{assignment.title}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-neutral-500">
                              <div className="flex items-center">
                                {getSubjectIcon(assignment.subject)}
                                <span className="ml-1">{getSubjectName(assignment.subject)}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>Ages {assignment.ageGroup}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Assigned: {new Date(assignment.assigned).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            <Badge className={assignment.status.completed === assignment.status.total ? "bg-green-500" : "bg-blue-500"}>
                              {assignment.status.completed}/{assignment.status.total} Completed
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${assignment.status.completed === assignment.status.total ? "bg-green-500" : "bg-blue-500"} h-2 rounded-full`} 
                              style={{ width: `${(assignment.status.completed / assignment.status.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Feedback
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Announcements Content */}
        <TabsContent value="messages">
          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Post Class Announcement
                  </CardTitle>
                  <CardDescription>
                    Send a message to all students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Type your announcement here..." 
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    className="min-h-[150px]"
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handlePostAnnouncement}
                    disabled={newAnnouncement.trim() === ""}
                  >
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    Post Announcement
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Recent Announcements
                  </CardTitle>
                  <CardDescription>
                    Previous messages sent to the class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">Class Announcement</span>
                          <Badge variant="outline">
                            {new Date(announcement.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-neutral-700">{announcement.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Detail Dialog */}
      <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center mb-2">
                  <img 
                    src={selectedStudent.avatar} 
                    alt={selectedStudent.name} 
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <DialogTitle className="text-xl">{selectedStudent.name}</DialogTitle>
                    <Badge variant="outline" className="mt-1">
                      {selectedStudent.selfDiscoveryType}
                    </Badge>
                  </div>
                </div>
                <DialogDescription>
                  Student progress and learning details
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-[1fr_1fr] gap-6 mt-4">
                <div>
                  <h3 className="font-medium text-lg mb-3">Progress Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Module Completion</span>
                        <span>{selectedStudent.progress.modules}%</span>
                      </div>
                      <Progress value={selectedStudent.progress.modules} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Projects Completed</span>
                        <span>{selectedStudent.progress.projects}/10</span>
                      </div>
                      <Progress value={(selectedStudent.progress.projects / 10) * 100} className="h-2" />
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6 mb-3">Subject Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.subjects.map((subject, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="flex items-center"
                      >
                        <div className={`${getSubjectColor(subject)} text-white rounded-full p-1 mr-1.5`}>
                          {getSubjectIcon(subject)}
                        </div>
                        {getSubjectName(subject)}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6 mb-3">Interests & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Recent Projects</h3>
                  <div className="space-y-3">
                    {selectedStudent.recentProjects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{project.title}</h4>
                          {project.grade && (
                            <Badge>{project.grade}</Badge>
                          )}
                        </div>
                        <div className="flex text-sm text-neutral-500 mt-1">
                          <span className="mr-3">{project.subject}</span>
                          <span>Submitted: {new Date(project.submitted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6 mb-3">Teacher Notes</h3>
                  <Textarea 
                    placeholder="Add notes about this student..." 
                    defaultValue={selectedStudent.notes}
                    className="min-h-[100px]"
                  />
                  <div className="text-right mt-2">
                    <Button size="sm">
                      <PenLine className="h-4 w-4 mr-1" />
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setStudentDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;