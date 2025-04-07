import React from 'react';
import { ArrowLeft, BadgeCheck, Brain, Clock, Target, Star } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Financial Literacy lesson - Smart Money Challenge
export default function LessonTemplate() {
  // Track student progress through the lesson
  const [progress, setProgress] = React.useState(0);
  const [currentSection, setCurrentSection] = React.useState('overview');
  const [completedSections, setCompletedSections] = React.useState<string[]>([]);
  const [earnedBadge, setEarnedBadge] = React.useState(false);
  
  // Update progress when moving between sections
  const updateProgress = (section: string) => {
    setCurrentSection(section);
    if (!completedSections.includes(section)) {
      const updatedSections = [...completedSections, section];
      setCompletedSections(updatedSections);
      
      // Calculate progress percentage
      const totalSections = 5; // overview, lesson, activity, reflection, quiz
      const newProgress = Math.round((updatedSections.length / totalSections) * 100);
      setProgress(newProgress);
      
      // Award badge when all sections are complete
      if (newProgress >= 100 && !earnedBadge) {
        setEarnedBadge(true);
      }
    }
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/learn">
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>15 minutes</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <Progress value={progress} className="w-[100px] h-2" />
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <Badge className="mb-2">Financial Literacy</Badge>
          <h1 className="text-3xl font-bold tracking-tight">The Smart Money Challenge: Saving vs. Spending</h1>
          <p className="text-lg text-muted-foreground mt-2">Learn how to make strategic decisions about when to save and when to spend your money.</p>
        </div>
        
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Lesson Objective</CardTitle>
            </div>
            <CardDescription>
              By the end of this lesson, you'll be able to:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="list-disc ml-5 space-y-1">
              <li>Understand the difference between needs and wants</li>
              <li>Create a simple savings plan for a goal</li>
              <li>Make smarter decisions about when to spend and when to save</li>
              <li>Apply the 24-hour rule to avoid impulse purchases</li>
            </ul>
          </CardContent>
        </Card>
        
        <Tabs value={currentSection} onValueChange={updateProgress} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reflection">Reflection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-amber-500" />
                  <CardTitle>Warm-Up</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-4">Imagine you just received $100 for your birthday. Take a moment to think about what you would do with it. Would you:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Spend it all right away on something you've wanted?</li>
                  <li>Save all of it for something bigger in the future?</li>
                  <li>Spend some now and save some for later?</li>
                </ul>
                <p className="mt-4">There's no single "right" answer! But your choice reveals something about how you think about money. In this lesson, we'll explore how to make these decisions wisely.</p>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => updateProgress('lesson')}>
                Continue to Lesson
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="lesson" className="space-y-4">
            <Card>
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <CardTitle>Core Lesson: The Balancing Act</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p>Money represents choices. Every dollar you have can either be spent now or saved for later, and both options have their place in a healthy financial life. Spending allows you to enjoy things in the present and meet your immediate needs. Saving helps you prepare for the future and reach bigger goals that might require more money than you have right now.</p>
                
                <p>The key to financial success isn't about always saving or always spending—it's about making intentional choices based on your priorities. Financial experts often recommend the strategy of "Pay Yourself First," which means automatically setting aside some money in savings before you decide how to spend what's left. Even small amounts add up over time due to compound interest, where you earn interest not just on your original savings but also on the interest you've already earned.</p>
                
                <div className="bg-primary/5 p-4 rounded-md mt-6">
                  <h3 className="font-medium mb-2">Real-Life Scenario: The Concert Tickets</h3>
                  <p>Mia has been saving $10 a week from her allowance. After two months, she has $80 saved. She just found out her favorite band is coming to town, and tickets cost $50. She also knows that in three months, she wants to buy a new bike that costs $200.</p>
                  <p className="mt-2">If Mia buys the concert ticket:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-2">
                    <li>She'll have a great experience she'll remember</li>
                    <li>She'll be left with $30 in savings</li>
                    <li>It will take her 17 more weeks to save for the bike</li>
                  </ul>
                  <p className="mt-2">If Mia skips the concert:</p>
                  <ul className="list-disc ml-5 space-y-1 mt-2">
                    <li>She'll miss a fun experience</li>
                    <li>She'll have $80 toward her bike</li>
                    <li>It will take her 12 more weeks to save for the bike</li>
                  </ul>
                  <p className="mt-2">There's no right answer! The best choice depends on Mia's priorities. This is the kind of decision we all face regularly.</p>
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-2">
                  <h3 className="font-medium mb-2">Smart Money Tips</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>The 24-Hour Rule:</strong> Wait a day before making unplanned purchases over $20. This helps avoid impulse buying.</li>
                    <li><strong>50/30/20 Guideline:</strong> Try to use 50% of money for needs, 30% for wants, and 20% for savings.</li>
                    <li><strong>Needs vs. Wants:</strong> A "need" is something required for basic living. A "want" is something that improves life but isn't essential.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => updateProgress('activity')}>
                Continue to Activity
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader className="bg-green-50 dark:bg-green-950 border-b">
                <CardTitle>Activity: Goal-Based Savings Challenge</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p>Let's put what you've learned into action by creating a simple savings plan for something you want.</p>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Steps:</h3>
                  <ol className="list-decimal ml-5 space-y-3">
                    <li>
                      <strong>Choose a Goal:</strong> Think of something you want that costs between $50-$200. 
                      <div className="bg-white dark:bg-black p-2 mt-1 rounded-md border">
                        <p className="text-sm">My goal: _______________________</p>
                        <p className="text-sm mt-1">Cost: $_______</p>
                      </div>
                    </li>
                    
                    <li>
                      <strong>Assess Your Resources:</strong> How much money can you save each week or month?
                      <div className="bg-white dark:bg-black p-2 mt-1 rounded-md border">
                        <p className="text-sm">I can save $_______ per week/month</p>
                      </div>
                    </li>
                    
                    <li>
                      <strong>Do the Math:</strong> Calculate how long it will take to reach your goal.
                      <div className="bg-white dark:bg-black p-2 mt-1 rounded-md border">
                        <p className="text-sm">Total cost ÷ Amount saved per period = Number of periods needed</p>
                        <p className="text-sm mt-1">$_______ ÷ $_______ = _______ weeks/months</p>
                      </div>
                    </li>
                    
                    <li>
                      <strong>Identify Potential Trade-offs:</strong> What might you need to give up in the short term to reach this goal?
                      <div className="bg-white dark:bg-black p-2 mt-1 rounded-md border">
                        <p className="text-sm">To reach my goal, I might need to skip: _______________________</p>
                      </div>
                    </li>
                    
                    <li>
                      <strong>Track Your Progress:</strong> Create a simple tracker to monitor your savings growth.
                      <div className="bg-white dark:bg-black p-2 mt-1 rounded-md border">
                        <p className="text-sm">Current savings: $_______</p>
                        <p className="text-sm mt-1">Progress: _______% complete</p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Bonus Challenge:</h3>
                  <p>Identify one "want" purchase you've made in the past month. If you had saved that money instead, how would it have impacted your progress toward your current goal?</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => updateProgress('reflection')}>
                Continue to Reflection
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reflection" className="space-y-4">
            <Card>
              <CardHeader className="bg-purple-50 dark:bg-purple-950 border-b">
                <CardTitle>Reflect & Apply</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p>Take a moment to think about what you've learned and how you can apply it to your life.</p>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Reflection Questions:</h3>
                  <div className="bg-white dark:bg-black p-3 rounded-md border">
                    <p>What's one situation in your life right now where you're trying to decide between saving or spending? How can you apply what you've learned to make a better decision?</p>
                    <textarea 
                      className="w-full h-24 mt-2 p-2 border rounded-md bg-muted"
                      placeholder="Type your response here..."
                    />
                  </div>
                  
                  <div className="bg-white dark:bg-black p-3 rounded-md border">
                    <p>How might your saving and spending choices today affect your life one year from now? What about five years from now?</p>
                    <textarea 
                      className="w-full h-24 mt-2 p-2 border rounded-md bg-muted"
                      placeholder="Type your response here..."
                    />
                  </div>
                </div>
                
                {earnedBadge && (
                  <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md mt-4 flex items-center gap-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <BadgeCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Congratulations!</h3>
                      <p className="text-sm">You've earned the <strong>Money Mastermind</strong> badge for completing this lesson.</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-primary/5 p-4 rounded-md mt-2">
                  <h3 className="font-medium mb-2">Next Steps:</h3>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Try using the 24-Hour Rule next time you're tempted to make an impulse purchase</li>
                    <li>Start tracking your spending for one week to see where your money goes</li>
                    <li>Talk with your family about setting up a savings account if you don't have one</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" asChild>
                  <Link href="/learn">Back to Learn</Link>
                </Button>
                
                <Button onClick={() => {
                  if (!earnedBadge) {
                    setEarnedBadge(true);
                    setProgress(100);
                  }
                }}>
                  {earnedBadge ? 'Lesson Complete!' : 'Complete & Earn Badge'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}