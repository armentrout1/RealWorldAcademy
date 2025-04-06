import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  PartyPopper, 
  Home, 
  GlassWater, 
  Clock, 
  Award, 
  ArrowLeft, 
  ChevronRight,
  Calendar,
  DollarSign,
  Ruler,
  Percent,
  ShoppingCart,
  Users,
  Palette,
  MousePointer,
  PenTool,
  LayoutGrid,
  Calculator
} from "lucide-react";

// Project type definition
interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  image: string;
  steps: {
    title: string;
    description: string;
    completed?: boolean;
  }[];
}

// Project data
const projects: Project[] = [
  {
    id: "party-budget",
    title: "Plan a Party on a Budget",
    description: "Organize a party for 10 people with a $500 budget. Learn to balance costs, prioritize expenses, and create an enjoyable event within financial constraints.",
    icon: <PartyPopper />,
    iconBg: "bg-purple-500",
    difficulty: "Easy",
    time: "2-3 hours",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Plan your guest list and type of party",
        description: "Decide on the type of party (dinner, BBQ, cocktail, etc.) and finalize your guest list of 10 people. Consider any dietary restrictions or preferences."
      },
      {
        title: "Create a budget spreadsheet",
        description: "Set up categories for your $500 budget: venue/space, food, beverages, decorations, entertainment, and miscellaneous. Allocate initial amounts to each category."
      },
      {
        title: "Research and price out food options",
        description: "Research costs for different food options (homemade, catered, potluck). Get specific prices for your menu items and adjust your food budget accordingly."
      },
      {
        title: "Plan decorations and entertainment",
        description: "Research affordable decoration ideas and entertainment options. Consider DIY decorations and free/low-cost entertainment like playlists or party games."
      },
      {
        title: "Finalize your plan and budget",
        description: "Adjust all categories to ensure your total stays under $500. Create a final shopping list and timeline for party preparations."
      }
    ]
  },
  {
    id: "dream-home",
    title: "Design Your Dream Home",
    description: "Lay out your ideal home, calculate space and costs. Learn about floor plans, square footage calculations, material costs, and design principles.",
    icon: <Home />,
    iconBg: "bg-blue-500",
    difficulty: "Medium",
    time: "4-6 hours",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Determine your needs and preferences",
        description: "Create a list of must-haves for your dream home: number of bedrooms/bathrooms, special rooms, outdoor spaces, accessibility features, etc."
      },
      {
        title: "Research home sizes and layouts",
        description: "Research average square footage for different room types and overall home sizes. Study different floor plan layouts that might work for your needs."
      },
      {
        title: "Sketch your floor plan",
        description: "Create a rough sketch of your floor plan, including room dimensions. Calculate the total square footage of your design and adjust as needed."
      },
      {
        title: "Research construction costs",
        description: "Research the average cost per square foot in your area. Calculate a rough estimate for the construction cost of your dream home design."
      },
      {
        title: "Add design elements and finishes",
        description: "Research and select design elements, materials, and finishes for your home. Create a mood board with your choices and calculate how they affect your budget."
      }
    ]
  },
  {
    id: "lemonade-stand",
    title: "Run a Lemonade Stand",
    description: "Figure out expenses, pricing, and profit to grow your stand. Apply basic business principles like cost analysis, profit margins, and marketing.",
    icon: <GlassWater />,
    iconBg: "bg-yellow-500",
    difficulty: "Easy",
    time: "3-4 hours",
    image: "https://images.unsplash.com/photo-1596568359553-a56bbbea5487?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Calculate startup costs",
        description: "Research and list all the items you'd need to start a lemonade stand: ingredients, cups, signs, table, etc. Calculate your total startup cost."
      },
      {
        title: "Develop your recipe and calculate per-cup cost",
        description: "Create your lemonade recipe and calculate exactly how much it costs to make one cup, including the cup itself and all ingredients."
      },
      {
        title: "Set your price and profit margin",
        description: "Decide on a selling price based on your costs, desired profit margin, and what customers might be willing to pay. Calculate your profit per cup."
      },
      {
        title: "Create a marketing plan",
        description: "Design a sign for your stand, decide on its location, and plan how you'll attract customers. Consider special promotions or loyalty programs."
      },
      {
        title: "Project your sales and profit",
        description: "Estimate how many cups you could sell in a day based on location and time. Calculate your potential daily profit and how long it would take to recoup your startup costs."
      }
    ]
  },
  {
    id: "family-budget",
    title: "Create a Family Budget",
    description: "Develop a comprehensive monthly budget for a family of four. Learn financial planning, expense tracking, and saving strategies.",
    icon: <Calculator />,
    iconBg: "bg-green-500",
    difficulty: "Medium",
    time: "3-5 hours",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Set financial goals",
        description: "Define short-term and long-term financial goals for the family, such as paying off debt, saving for college, or planning for a vacation."
      },
      {
        title: "Track current spending",
        description: "Create a spreadsheet to track all family expenses for a month, categorizing them into housing, transportation, food, healthcare, education, etc."
      },
      {
        title: "Create a realistic budget",
        description: "Based on income and spending patterns, create a budget that allocates specific amounts to each category, including savings and emergency fund."
      },
      {
        title: "Identify areas for improvement",
        description: "Analyze the budget to find areas where expenses can be reduced, and develop specific strategies to cut costs without sacrificing quality of life."
      },
      {
        title: "Implement tracking system",
        description: "Create a system for the family to track ongoing expenses and compare them against the budget, with regular check-ins to adjust as needed."
      }
    ]
  },
  {
    id: "website-design",
    title: "Design a Personal Website",
    description: "Plan and design a personal portfolio website. Learn about web design principles, user experience, and digital presence.",
    icon: <LayoutGrid />,
    iconBg: "bg-indigo-500",
    difficulty: "Hard",
    time: "6-8 hours",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Define your website's purpose",
        description: "Decide what you want your website to accomplish: showcase your work, sell products, share your resume, blog about your interests, etc."
      },
      {
        title: "Research design inspiration",
        description: "Look at similar websites for inspiration. Make note of layouts, color schemes, and features you like and might want to incorporate."
      },
      {
        title: "Create a content plan",
        description: "List all the content you'll need for your website: text for each page, images, portfolio pieces, contact information, etc."
      },
      {
        title: "Sketch your layout",
        description: "Create wireframes (simple sketches) of your main pages, showing where different elements will be placed. Consider how users will navigate through your site."
      },
      {
        title: "Design your visual identity",
        description: "Choose colors, fonts, and image styles that reflect your personality or brand. Create a logo or header design for your site."
      }
    ]
  },
  {
    id: "community-garden",
    title: "Plan a Community Garden",
    description: "Design a garden space that can be used by a neighborhood or school. Learn about sustainable planning, community organization, and basic agriculture.",
    icon: <Palette />,
    iconBg: "bg-emerald-500",
    difficulty: "Hard",
    time: "5-7 hours",
    image: "https://images.unsplash.com/photo-1466692476655-ab0c26c69752?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    steps: [
      {
        title: "Assess available space and resources",
        description: "Measure and evaluate potential garden locations. Consider sunlight, water access, soil quality, and accessibility for community members."
      },
      {
        title: "Research local growing conditions",
        description: "Learn about your local climate, growing seasons, and plants that thrive in your area. Create a calendar of planting times for different crops."
      },
      {
        title: "Design the garden layout",
        description: "Create a detailed layout showing individual plots, communal areas, paths, water sources, tool storage, and gathering spaces. Consider accessibility for all users."
      },
      {
        title: "Develop a budget and resource list",
        description: "Calculate costs for soil, seeds, tools, irrigation, and structures. Research potential funding sources, donations, or community partnerships."
      },
      {
        title: "Create a management plan",
        description: "Develop guidelines for plot assignment, maintenance responsibilities, water usage, and conflict resolution. Plan for regular community workdays and events."
      }
    ]
  }
];

// Project Detail Component
const ProjectDetail: React.FC<{ project: Project }> = ({ project }) => {
  const [location, setLocation] = useLocation();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [reflection, setReflection] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Handle checkbox change
  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Calculate progress whenever completedSteps changes
  useEffect(() => {
    const newProgress = (completedSteps.length / project.steps.length) * 100;
    setProgress(newProgress);
  }, [completedSteps, project.steps.length]);
  
  // Return to projects list
  const goBack = () => {
    setLocation('/projects');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={goBack}
          className="pl-0 mb-4 flex items-center text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className={`${project.iconBg} text-white p-2 rounded-lg`}>
            {project.icon}
          </div>
          <Badge variant={
            project.difficulty === "Easy" ? "default" : 
            project.difficulty === "Medium" ? "secondary" : 
            "destructive"
          }>
            {project.difficulty}
          </Badge>
          <div className="flex items-center text-neutral-500">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{project.time}</span>
          </div>
        </div>
        
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">{project.title}</h1>
        <p className="text-lg text-neutral-600 max-w-3xl">{project.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Steps</span>
                <Badge variant="outline" className="ml-2 font-mono">
                  {completedSteps.length}/{project.steps.length} completed
                </Badge>
              </CardTitle>
              <CardDescription>
                Follow these steps to complete your project. Check each step as you finish it.
              </CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg transition-all ${
                      completedSteps.includes(index) 
                        ? 'bg-neutral-50 border-neutral-200' 
                        : 'bg-white border-neutral-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Checkbox 
                        id={`step-${index}`}
                        checked={completedSteps.includes(index)}
                        onCheckedChange={() => toggleStep(index)}
                        className="mt-1"
                      />
                      <div>
                        <label 
                          htmlFor={`step-${index}`}
                          className={`font-medium text-lg block mb-1 ${
                            completedSteps.includes(index) ? 'line-through text-neutral-500' : 'text-neutral-900'
                          }`}
                        >
                          Step {index + 1}: {step.title}
                        </label>
                        <p className="text-neutral-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reflection</CardTitle>
              <CardDescription>
                Share what you've learned from this project and how you might apply these skills in the future.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="What did you learn from this project? What challenges did you face and how did you overcome them?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[150px]"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save Draft</Button>
              <Button>Submit Project</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Project Resources</CardTitle>
              <CardDescription>
                Helpful materials to assist with your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.id === "party-budget" && (
                  <>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <Calculator className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Party Budget Template</h4>
                        <p className="text-sm text-neutral-500">Excel spreadsheet</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <ShoppingCart className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Food Cost Calculator</h4>
                        <p className="text-sm text-neutral-500">Online tool</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <Users className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Party Planning Guide</h4>
                        <p className="text-sm text-neutral-500">PDF document</p>
                      </div>
                    </div>
                  </>
                )}
                
                {project.id === "dream-home" && (
                  <>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <LayoutGrid className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Floor Plan Templates</h4>
                        <p className="text-sm text-neutral-500">PDF document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <Ruler className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Square Footage Calculator</h4>
                        <p className="text-sm text-neutral-500">Online tool</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <DollarSign className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Construction Cost Guide</h4>
                        <p className="text-sm text-neutral-500">PDF document</p>
                      </div>
                    </div>
                  </>
                )}
                
                {project.id === "lemonade-stand" && (
                  <>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <Calculator className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Profit Calculator</h4>
                        <p className="text-sm text-neutral-500">Excel spreadsheet</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <Percent className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Pricing Strategy Guide</h4>
                        <p className="text-sm text-neutral-500">PDF document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-neutral-50">
                      <PenTool className="text-neutral-500" />
                      <div>
                        <h4 className="font-medium">Sign Templates</h4>
                        <p className="text-sm text-neutral-500">Printable PDF</p>
                      </div>
                    </div>
                  </>
                )}
                
                {!["party-budget", "dream-home", "lemonade-stand"].includes(project.id) && (
                  <div className="text-center py-6 text-neutral-500">
                    <MousePointer className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <p>Resource downloads will be available soon!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                If you're stuck on any step of this project, you can:
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Ask a question
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View example projects
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Watch tutorial video
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Project Cards Component
const ProjectsList: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Project-Based Learning</h1>
        <p className="text-lg text-neutral-600 max-w-3xl">Choose hands-on challenges to apply what you've learned and build real-world skills.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`${project.iconBg} h-1`}></div>
            <CardHeader className="p-5 pb-0">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <Badge variant={
                  project.difficulty === "Easy" ? "default" : 
                  project.difficulty === "Medium" ? "secondary" : 
                  "destructive"
                }>
                  {project.difficulty}
                </Badge>
              </div>
              <div className="flex items-center text-neutral-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{project.time}</span>
              </div>
              <CardDescription className="mt-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="p-5 pt-4">
              <Button asChild className="w-full">
                <Link href={`/projects/${project.id}`}>
                  Start Project
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="bg-white p-3 rounded-full">
            <Award className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-bold text-2xl text-neutral-900 mb-2">Earn Project Badges</h2>
            <p className="text-neutral-600 max-w-xl">
              Complete projects to earn badges for your profile and build a portfolio of real-world accomplishments that showcase your skills.
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" className="bg-white">
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Projects Component
const Projects: React.FC = () => {
  const [location] = useLocation();
  
  // Check if we're on a specific project page
  const matchProject = location.match(/\/projects\/(.+)/);
  if (matchProject) {
    const projectId = matchProject[1];
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      return <ProjectDetail project={project} />;
    }
  }
  
  // Otherwise show the main projects list
  return <ProjectsList />;
};

export default Projects;
