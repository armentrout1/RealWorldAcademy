import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Palette, 
  Brain, 
  Wrench, 
  MessageSquare, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2,
  Compass,
  Lightbulb
} from "lucide-react";

// Quiz questions and options
const questions = [
  {
    id: 1,
    question: "How do you prefer to solve problems?",
    options: [
      { id: "a", text: "By thinking through different solutions methodically", type: "thinker" },
      { id: "b", text: "By discussing possible approaches with others", type: "communicator" },
      { id: "c", text: "By designing or drawing out possibilities", type: "creator" },
      { id: "d", text: "By building prototypes and experimenting", type: "builder" }
    ]
  },
  {
    id: 2,
    question: "When working on a project, which role do you naturally take?",
    options: [
      { id: "a", text: "Creating the plan and organizing the steps", type: "planner" },
      { id: "b", text: "Coming up with creative ideas and concepts", type: "creator" },
      { id: "c", text: "Building, testing, and implementing solutions", type: "builder" },
      { id: "d", text: "Facilitating discussions and explaining concepts", type: "communicator" }
    ]
  },
  {
    id: 3,
    question: "How do you best learn new information?",
    options: [
      { id: "a", text: "By reading and analyzing information on your own", type: "thinker" },
      { id: "b", text: "By doing hands-on activities and exercises", type: "builder" },
      { id: "c", text: "By discussing and explaining concepts to others", type: "communicator" },
      { id: "d", text: "By organizing information into visual formats", type: "creator" }
    ]
  },
  {
    id: 4,
    question: "Which environment helps you work most effectively?",
    options: [
      { id: "a", text: "A quiet space where you can focus deeply", type: "thinker" },
      { id: "b", text: "A workshop or lab with tools and materials", type: "builder" },
      { id: "c", text: "A collaborative space with people to bounce ideas off", type: "communicator" },
      { id: "d", text: "A flexible space that inspires creativity", type: "creator" }
    ]
  },
  {
    id: 5,
    question: "When facing a new challenge, what's your first instinct?",
    options: [
      { id: "a", text: "Research all available information and analyze options", type: "thinker" },
      { id: "b", text: "Create a detailed plan with goals and deadlines", type: "planner" },
      { id: "c", text: "Brainstorm innovative approaches and possibilities", type: "creator" },
      { id: "d", text: "Jump in and start experimenting with solutions", type: "builder" }
    ]
  },
  {
    id: 6,
    question: "What type of activities energize you the most?",
    options: [
      { id: "a", text: "Organizing and streamlining systems or processes", type: "planner" },
      { id: "b", text: "Engaging in deep thinking and problem-solving", type: "thinker" },
      { id: "c", text: "Creating art, designs, or new ideas", type: "creator" },
      { id: "d", text: "Teaching or presenting information to others", type: "communicator" }
    ]
  }
];

// Define color types
type ProfileColor = "purple" | "blue" | "green" | "amber" | "indigo";

// Result profiles interface
interface ProfileData {
  title: string;
  emoji: string;
  icon: React.ReactNode;
  color: ProfileColor;
  description: string;
}

// Result profiles
const profiles: Record<string, ProfileData> = {
  creator: {
    title: "Creator",
    emoji: "🎨",
    icon: <Palette className="h-12 w-12 text-purple-500" />,
    color: "purple",
    description: "You thrive on innovation and imagination. Your creative thinking enables you to develop original ideas and see connections others might miss. You excel in environments that value artistic expression, design thinking, and outside-the-box solutions."
  },
  thinker: {
    title: "Thinker",
    emoji: "🧠",
    icon: <Brain className="h-12 w-12 text-blue-500" />,
    color: "blue",
    description: "You excel at analytical and critical thinking. Your logical approach helps you solve complex problems and make evidence-based decisions. You thrive in environments that value deep analysis, research, and intellectual exploration."
  },
  builder: {
    title: "Builder",
    emoji: "🔧",
    icon: <Wrench className="h-12 w-12 text-green-600" />,
    color: "green",
    description: "You're hands-on and practical, with a talent for bringing ideas to life. Your ability to construct, fix, and implement solutions makes you invaluable. You thrive in environments that allow you to create tangible results through practical application."
  },
  communicator: {
    title: "Communicator",
    emoji: "💬",
    icon: <MessageSquare className="h-12 w-12 text-amber-500" />,
    color: "amber",
    description: "You excel at expressing ideas and connecting with others. Your interpersonal skills help facilitate understanding and collaboration. You thrive in environments that value teaching, persuasion, writing, and relationship-building."
  },
  planner: {
    title: "Planner",
    emoji: "📊",
    icon: <BarChart3 className="h-12 w-12 text-indigo-500" />,
    color: "indigo",
    description: "You have a talent for organization and strategic thinking. Your ability to create systems and anticipate needs makes projects run smoothly. You thrive in environments that value structure, efficiency, and long-term planning."
  }
};

const SelfDiscovery: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<keyof typeof profiles | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizComplete(false);
    setResult(null);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, answerType: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerType
    }));
  };

  // Move to next question
  const handleNextQuestion = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateResult();
        setQuizComplete(true);
      }
      setIsTransitioning(false);
    }, 300);
  };

  // Calculate result based on answers
  const calculateResult = () => {
    const typeCounts: Record<string, number> = {
      creator: 0,
      thinker: 0,
      builder: 0,
      communicator: 0,
      planner: 0
    };

    // Count the type of each answer
    Object.values(selectedAnswers).forEach(type => {
      if (type in typeCounts) {
        typeCounts[type]++;
      }
    });

    // Find the type with the highest count
    let maxCount = 0;
    let resultType: keyof typeof profiles = "thinker"; // Default

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        resultType = type as keyof typeof profiles;
      }
    });

    setResult(resultType);
  };

  // Reset the quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizComplete(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  // Render quiz introduction
  const renderQuizIntro = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-neutral-900 mb-3">Self Discovery</h1>
        <p className="text-lg text-neutral-600">Explore your strengths, passions, and potential career paths that align with your values.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 to-white">
          <CardHeader>
            <CardTitle>Discover Your Learning Archetype</CardTitle>
            <CardDescription>Take this short quiz to identify your natural strengths and learning style</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This assessment will help you understand your unique approach to learning and problem-solving, revealing insights about how you can best leverage your natural talents.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button 
                className="bg-primary text-white font-medium" 
                onClick={startQuiz}
              >
                Take the Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="text-primary border-primary">
                Learn More
              </Button>
            </div>
            <div className="bg-white rounded-lg p-4 border border-neutral-200">
              <h4 className="font-medium text-lg mb-2">What You'll Discover:</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Your primary learning archetype and natural strengths</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Optimal learning environments for your type</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Recommended approaches to maximize your learning potential</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Strategies to leverage your strengths and manage challenges</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Learning Archetype</span>
                  <span className="text-sm text-neutral-500">Not Started</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Skills Inventory</span>
                  <span className="text-sm text-primary">60%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Career Values</span>
                  <span className="text-sm text-neutral-500">Not Started</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Personality Assessment</span>
                  <span className="text-sm text-green-600">Completed</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="font-sans font-bold text-2xl text-neutral-900 mb-6">Other Self-Discovery Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg flex items-center justify-center">
            <Brain className="text-white w-12 h-12" />
          </div>
          <CardContent className="p-5">
            <h3 className="font-sans font-semibold text-lg mb-2">Skills Inventory</h3>
            <p className="text-neutral-600 text-sm mb-4">Identify your existing skills and discover areas for improvement to reach your career goals.</p>
            <Button className="w-full bg-primary text-white">
              Start Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-green-500 to-teal-500 rounded-t-lg flex items-center justify-center">
            <Compass className="text-white w-12 h-12" />
          </div>
          <CardContent className="p-5">
            <h3 className="font-sans font-semibold text-lg mb-2">Career Values</h3>
            <p className="text-neutral-600 text-sm mb-4">Understand what truly matters to you in a career and how to align your work with your values.</p>
            <Button className="w-full bg-primary text-white">
              Explore Values
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white hover:shadow-md transition-shadow">
          <div className="h-36 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg flex items-center justify-center">
            <Lightbulb className="text-white w-12 h-12" />
          </div>
          <CardContent className="p-5">
            <h3 className="font-sans font-semibold text-lg mb-2">Learning Style</h3>
            <p className="text-neutral-600 text-sm mb-4">Discover how you best absorb and process information to optimize your learning experience.</p>
            <Button className="w-full bg-primary text-white">
              Find Your Style
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Render the quiz questions
  const renderQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-sans font-bold text-3xl text-neutral-900 mb-4">Discover Your Learning Archetype</h2>
          <p className="text-neutral-600">Answer honestly based on your natural preferences, not what you think might be "best".</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-neutral-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(calculateProgress())}% Complete</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>
        
        <Card className={`shadow-md animate-${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <CardHeader>
            <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id] || ''} 
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div 
                  key={option.id}
                  className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQuestion.id] === option.type 
                      ? 'border-primary bg-primary/5' 
                      : 'border-neutral-200 hover:border-primary/50 hover:bg-neutral-50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option.type)}
                >
                  <RadioGroupItem value={option.type} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className={`flex-grow cursor-pointer font-medium ${
                      selectedAnswers[currentQuestion.id] === option.type 
                        ? 'text-primary' 
                        : 'text-neutral-700'
                    }`}
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => currentQuestionIndex > 0 
                ? (setIsTransitioning(true), setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev - 1);
                    setIsTransitioning(false);
                  }, 300)) 
                : resetQuiz()
              }
            >
              {currentQuestionIndex > 0 ? 'Previous' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleNextQuestion} 
              disabled={!selectedAnswers[currentQuestion.id]}
              className="bg-primary hover:bg-primary/90"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'See Results'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Render the result screen
  const renderResult = () => {
    if (!result) return null;
    
    const profile = profiles[result];
    const gradientColors: Record<ProfileColor, string> = {
      purple: "from-purple-500 to-pink-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      amber: "from-amber-500 to-yellow-500",
      indigo: "from-indigo-500 to-violet-500"
    };
    
    const gradientClass = gradientColors[profile.color];
    
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="shadow-lg overflow-hidden animate-fade-in">
          <div className={`bg-gradient-to-r ${gradientClass} pt-12 pb-16 px-6 text-white text-center relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                  {profile.icon}
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-1">
                {profile.emoji} {profile.title}
              </h2>
              <p className="text-white/90 text-lg">Your Learning Archetype</p>
            </div>
            {/* Abstract decoration elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          </div>
          
          <CardContent className="pt-8 pb-6 px-6">
            <div className="max-w-lg mx-auto">
              <h3 className="text-xl font-semibold mb-3">What it means to be a {profile.title}</h3>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                {profile.description}
              </p>
              
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium mb-2">Your Strengths Include:</h4>
                <ul className="space-y-2">
                  {result === 'creator' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Innovation and originality in approaching problems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Visual thinking and design capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Ability to envision new possibilities and solutions</span>
                      </li>
                    </>
                  )}
                  
                  {result === 'thinker' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Deep analytical and critical thinking skills</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Ability to process complex information and theories</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Talent for evaluating evidence and drawing logical conclusions</span>
                      </li>
                    </>
                  )}
                  
                  {result === 'builder' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Practical problem-solving and hands-on implementation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Ability to translate ideas into concrete, working solutions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Methodical approach to testing and improving products</span>
                      </li>
                    </>
                  )}
                  
                  {result === 'communicator' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Excellent verbal and written communication abilities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Talent for explaining complex ideas in accessible ways</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Empathy and ability to connect with diverse audiences</span>
                      </li>
                    </>
                  )}
                  
                  {result === 'planner' && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Exceptional organizational and project management skills</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Strategic thinking and ability to anticipate future needs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>Talent for creating efficient systems and processes</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={resetQuiz} 
                  variant="outline" 
                  className="flex-1"
                >
                  Retake Quiz
                </Button>
                <Link href="/learn">
                  <Button 
                    className={`flex-1 w-full bg-${profile.color}-600 hover:bg-${profile.color}-700`}
                    style={{ 
                      backgroundColor: result === 'creator' ? '#9333ea' : 
                                      result === 'thinker' ? '#2563eb' : 
                                      result === 'builder' ? '#16a34a' : 
                                      result === 'communicator' ? '#d97706' : 
                                      '#4f46e5'
                    }}
                  >
                    Explore Learning Paths
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render the appropriate view based on state
  if (!quizStarted) {
    return renderQuizIntro();
  } else if (quizComplete) {
    return renderResult();
  } else {
    return renderQuiz();
  }
};

export default SelfDiscovery;
