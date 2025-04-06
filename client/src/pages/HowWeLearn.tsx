import React, { useState } from "react";
import { 
  BookOpen, 
  Headphones, 
  Eye, 
  Video, 
  Users, 
  Hammer, 
  School,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Learning methods data
const learningMethods = [
  {
    id: "teaching",
    title: "Teaching Others / Immediate Use",
    retention: 90,
    example: "Create a budget and share it with your family",
    icon: <School className="h-6 w-6" />,
    color: "bg-green-500",
    textColor: "text-green-500",
    lightColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    id: "practice",
    title: "Practicing by Doing",
    retention: 80,
    example: "Build a model or test a science experiment",
    icon: <Hammer className="h-6 w-6" />,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: "discussion",
    title: "Group Discussion",
    retention: 70,
    example: "Talk with others about a historical event",
    icon: <Users className="h-6 w-6" />,
    color: "bg-purple-500",
    textColor: "text-purple-500",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: "demonstration",
    title: "Watching a Demonstration",
    retention: 50,
    example: "Watch a video on how credit cards work",
    icon: <Video className="h-6 w-6" />,
    color: "bg-amber-500",
    textColor: "text-amber-500",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  {
    id: "visuals",
    title: "Seeing Visuals",
    retention: 30,
    example: "Look at a diagram of the water cycle",
    icon: <Eye className="h-6 w-6" />,
    color: "bg-pink-500",
    textColor: "text-pink-500",
    lightColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    id: "audio",
    title: "Hearing Words",
    retention: 20,
    example: "Listen to a podcast about taxes",
    icon: <Headphones className="h-6 w-6" />,
    color: "bg-cyan-500",
    textColor: "text-cyan-500",
    lightColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  {
    id: "reading",
    title: "Reading",
    retention: 10,
    example: "Read a definition of compound interest",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-rose-500",
    textColor: "text-rose-500",
    lightColor: "bg-rose-50",
    borderColor: "border-rose-200"
  }
];

// Main component
const HowWeLearn: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  // Handle method selection
  const handleMethodClick = (id: string) => {
    setSelectedMethod(id === selectedMethod ? null : id);
  };

  // Animation properties
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-4">How We Learn Best</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Not all learning methods are equal. Students remember more when they do, discuss, and teach instead of just reading or listening.
          </p>
        </div>
        
        {/* Pyramid Visualization - Desktop */}
        <div className="hidden md:block mb-16">
          <div className="relative">
            {/* Pyramid background */}
            <div className="w-full h-[500px] bg-gradient-to-b from-green-50 to-rose-50 rounded-xl overflow-hidden relative">
              <div 
                className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-green-500 to-transparent h-full opacity-10"
                style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)' }}
              ></div>
            </div>
            
            {/* Staggered Levels */}
            <motion.div 
              className="absolute inset-0 flex flex-col justify-between py-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {learningMethods.map((method, index) => {
                // Calculate width percentage based on retention (min 50% to max 100%)
                const widthPercentage = 50 + (method.retention / 2);
                
                return (
                  <motion.div 
                    key={method.id} 
                    className="flex justify-center"
                    variants={item}
                  >
                    <div 
                      className={`${method.lightColor} ${method.borderColor} border cursor-pointer 
                                  hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden
                                  ${selectedMethod === method.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                      style={{ width: `${widthPercentage}%` }}
                      onClick={() => handleMethodClick(method.id)}
                    >
                      <div className={`${method.color} h-1`}></div>
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${method.color} text-white p-2 rounded-full flex-shrink-0`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium mr-2">{method.title}</h3>
                              <Badge className="bg-white bg-opacity-80 text-neutral-800 font-mono">
                                {method.retention}%
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-600">{method.example}</p>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 ${method.textColor} transition-transform duration-300 ${
                          selectedMethod === method.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                      
                      {selectedMethod === method.id && (
                        <div className={`${method.lightColor} p-4 border-t ${method.borderColor} text-neutral-700`}>
                          <p><strong>Why it works:</strong> {getMethodExplanation(method.id)}</p>
                          <div className="mt-3">
                            <strong>Example activities at Real World Academy:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {getMethodActivities(method.id).map((activity, i) => (
                                <li key={i}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
        
        {/* Mobile accordion view */}
        <div className="md:hidden mb-12">
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {learningMethods.map((method) => (
              <motion.div 
                key={method.id}
                variants={item}
              >
                <Card 
                  className={`overflow-hidden border ${method.borderColor} ${
                    selectedMethod === method.id ? 'ring-2 ring-primary shadow-md' : ''
                  }`}
                  onClick={() => handleMethodClick(method.id)}
                >
                  <div className={`${method.color} h-1`}></div>
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${method.color} text-white p-2 rounded-full`}>
                          {method.icon}
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-medium">{method.title}</h3>
                            <Badge className="bg-white bg-opacity-80 border text-neutral-800 font-mono">
                              {method.retention}%
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600">{method.example}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${method.textColor} flex-shrink-0 transition-transform duration-300 ${
                        selectedMethod === method.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    {selectedMethod === method.id && (
                      <div className={`${method.lightColor} mt-4 p-3 rounded-lg text-neutral-700 text-sm`}>
                        <p><strong>Why it works:</strong> {getMethodExplanation(method.id)}</p>
                        <div className="mt-3">
                          <strong>Example activities:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {getMethodActivities(method.id).slice(0, 2).map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Interactive Circular Visualization */}
        <div className="mb-16">
          <h2 className="font-sans font-bold text-2xl text-neutral-900 mb-6 text-center">The Cone of Learning</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {learningMethods.map((method, index) => {
                  const segmentSize = method.retention / 3.5; // Adjust to fit all segments in circle
                  const offset = learningMethods
                    .slice(0, index)
                    .reduce((acc, m) => acc + m.retention / 3.5, 0);
                  const largeArcFlag = segmentSize > 180 ? 1 : 0;
                  
                  // Calculate coordinates for the segment
                  const startAngle = (offset / 100) * Math.PI * 2;
                  const endAngle = ((offset + segmentSize) / 100) * Math.PI * 2;
                  
                  const startX = 50 + 45 * Math.cos(startAngle);
                  const startY = 50 + 45 * Math.sin(startAngle);
                  const endX = 50 + 45 * Math.cos(endAngle);
                  const endY = 50 + 45 * Math.sin(endAngle);
                  
                  const colorHex = getColorHex(method.color);

                  return (
                    <path
                      key={method.id}
                      d={`M 50 50 L ${startX} ${startY} A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      fill={colorHex}
                      className="cursor-pointer transition-opacity duration-300 hover:opacity-90"
                      onClick={() => handleMethodClick(method.id)}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="20" fill="white" stroke="#e5e5e5" strokeWidth="1" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold" fill="#333">
                  Learning
                  <tspan x="50" y="55">Retention</tspan>
                </text>
              </svg>
              
              {/* Legend */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full absolute transform rotate-90">
                  {learningMethods.map((method, index) => {
                    const segmentSize = method.retention / 3.5;
                    const offset = learningMethods
                      .slice(0, index)
                      .reduce((acc, m) => acc + m.retention / 3.5, 0);
                    
                    // Calculate angle and position for the label
                    const angle = ((offset + segmentSize / 2) / 100) * 360;
                    const labelDistance = 55; // Distance from center in percentage
                    
                    const labelX = 50 + labelDistance * Math.cos((angle * Math.PI) / 180);
                    const labelY = 50 + labelDistance * Math.sin((angle * Math.PI) / 180);
                    
                    let align = 'middle';
                    if (angle > 90 && angle < 270) {
                      align = 'end';
                    } else if (angle > 270 || angle < 90) {
                      align = 'start';
                    }
                    
                    return (
                      <div
                        key={method.id}
                        className={`absolute text-xs font-medium ${method.textColor} cursor-pointer`}
                        style={{
                          left: `${labelX}%`,
                          top: `${labelY}%`,
                          transform: 'translate(-50%, -50%)',
                          textAlign: align === 'middle' ? 'center' : align === 'start' ? 'left' : 'right',
                          maxWidth: '80px'
                        }}
                        onClick={() => handleMethodClick(method.id)}
                      >
                        {method.retention}%
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Approach */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 text-center mb-12">
          <h2 className="font-sans font-bold text-2xl text-neutral-900 mb-4">Our Approach to Learning</h2>
          <p className="text-neutral-700 leading-relaxed max-w-2xl mx-auto">
            Real World Academy is designed to help students learn in the most effective way — by doing, building, and sharing what they know. 
            Our curriculum focuses on active participation, practical projects, and collaborative learning to maximize retention and develop 
            skills that translate directly to real-world success.
          </p>
          <Button className="mt-6">
            Explore Our Programs
          </Button>
        </div>
        
        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-xl mb-3">The Science Behind Learning</h3>
              <p className="text-neutral-600 mb-4">
                The Cone of Learning was developed by Edgar Dale in the 1960s and later enhanced by research on active vs. passive learning. 
                While exact percentages vary, the fundamental principle remains valid: active participation significantly improves learning outcomes.
              </p>
              <Button variant="outline" className="w-full">
                Learn More About Learning Science
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-xl mb-3">Apply This To Your Learning</h3>
              <p className="text-neutral-600 mb-4">
                Want to improve your learning in any subject? Try to move up the pyramid. Instead of just reading or listening, 
                find ways to discuss, practice, or even teach what you're learning to dramatically increase retention.
              </p>
              <Button variant="outline" className="w-full">
                Get Study Tips & Strategies
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper functions

// Get explanation text for each learning method
function getMethodExplanation(methodId: string): string {
  switch (methodId) {
    case 'teaching':
      return 'When you teach or immediately apply knowledge, you must organize, clarify, and articulate information in your own words, deeply embedding it in memory.';
    case 'practice':
      return 'Hands-on practice creates muscle memory and context-rich learning experiences, connecting abstract concepts to real-world applications.';
    case 'discussion':
      return 'Group discussions expose you to different perspectives, require active listening, and force you to articulate and defend your understanding.';
    case 'demonstration':
      return 'Watching demonstrations provides visual cues and procedural knowledge that text alone cannot convey.';
    case 'visuals':
      return 'Visual information is processed more efficiently than text, making complex information easier to understand and remember.';
    case 'audio':
      return 'Listening engages different cognitive pathways than reading, but still requires active focus to process and retain information.';
    case 'reading':
      return 'Reading provides detailed information but is passive without additional engagement strategies like note-taking or reflection.';
    default:
      return '';
  }
}

// Get example activities for each method
function getMethodActivities(methodId: string): string[] {
  switch (methodId) {
    case 'teaching':
      return [
        'Present your project findings to classmates',
        'Create educational content explaining a concept',
        'Mentor a peer through a challenging project'
      ];
    case 'practice':
      return [
        'Build a functional budget in a spreadsheet',
        'Design and test a small business model',
        'Create and run experiments to test hypotheses'
      ];
    case 'discussion':
      return [
        'Participate in group problem-solving sessions',
        'Debate different approaches to ethical dilemmas',
        'Collaborative brainstorming for project solutions'
      ];
    case 'demonstration':
      return [
        'Watch expert walkthroughs of complex procedures',
        'Observe real-time problem-solving techniques',
        'View case studies of successful projects'
      ];
    case 'visuals':
      return [
        'Study infographics that explain complex processes',
        'Analyze diagrams of systems and relationships',
        'Review visual summaries of important concepts'
      ];
    case 'audio':
      return [
        'Listen to expert interviews and discussions',
        'Audio lessons on fundamental concepts',
        'Podcast-style deep dives into subject matter'
      ];
    case 'reading':
      return [
        'Review comprehensive written materials',
        'Study detailed explanations and definitions',
        'Read case studies and examples'
      ];
    default:
      return [];
  }
}

// Get hex color from tailwind class
function getColorHex(colorClass: string): string {
  // Map of tailwind color classes to hex values
  const colorMap: {[key: string]: string} = {
    'bg-green-500': '#10b981',
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#8b5cf6',
    'bg-amber-500': '#f59e0b',
    'bg-pink-500': '#ec4899',
    'bg-cyan-500': '#06b6d4',
    'bg-rose-500': '#f43f5e'
  };
  
  return colorMap[colorClass] || '#9ca3af'; // default gray if not found
}

export default HowWeLearn;