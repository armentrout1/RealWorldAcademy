import React, { useState } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, BookOpen, CheckCircle2, Info, Pencil, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema
const lessonFormSchema = z.object({
  contributorName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contributorEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  affiliation: z.string().min(2, {
    message: "Please specify your affiliation.",
  }),
  title: z.string().min(5, {
    message: "Lesson title must be at least 5 characters.",
  }),
  subject: z.string({
    required_error: "Please select a subject.",
  }),
  ageGroup: z.string({
    required_error: "Please select an age group.",
  }),
  objective: z.string().min(20, {
    message: "Objective should be at least 20 characters.",
  }),
  warmUp: z.string().min(20, {
    message: "Warm-up should be at least 20 characters.",
  }),
  coreContent: z.string().min(100, {
    message: "Core content should be at least 100 characters.",
  }),
  scenario: z.string().min(50, {
    message: "Scenario should be at least 50 characters.",
  }),
  activity: z.string().min(50, {
    message: "Activity should be at least 50 characters.",
  }),
  reflection: z.string().min(20, {
    message: "Reflection prompt should be at least 20 characters.",
  }),
  badge: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

// Default form values
const defaultValues: Partial<LessonFormValues> = {
  contributorName: "",
  contributorEmail: "",
  affiliation: "",
  title: "",
  subject: "",
  ageGroup: "",
  objective: "",
  warmUp: "",
  coreContent: "",
  scenario: "",
  activity: "",
  reflection: "",
  badge: "",
};

export default function ContributeLesson() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formStep, setFormStep] = useState<'info' | 'content' | 'details' | 'preview'>('info');
  const { toast } = useToast();

  // Initialize form
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Submit handler
  function onSubmit(data: LessonFormValues) {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Lesson data submitted:", data);
      setSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Lesson submitted successfully!",
        description: "Your lesson has been sent for review.",
      });
    }, 1500);
  }

  // Preview mode toggle
  const handlePreview = () => {
    if (formStep === 'preview') {
      setFormStep('info');
    } else {
      if (form.formState.isValid) {
        setFormStep('preview');
      } else {
        // Trigger validation
        form.trigger();
        toast({
          title: "Please complete all required fields",
          description: "Some information is missing or incorrect.",
          variant: "destructive",
        });
      }
    }
  };

  // Move to next step
  const nextStep = () => {
    if (formStep === 'info') {
      form.trigger(['contributorName', 'contributorEmail', 'affiliation']);
      if (form.formState.errors.contributorName || form.formState.errors.contributorEmail || form.formState.errors.affiliation) {
        return;
      }
      setFormStep('content');
    } else if (formStep === 'content') {
      form.trigger(['title', 'subject', 'ageGroup', 'objective', 'warmUp', 'coreContent']);
      if (form.formState.errors.title || form.formState.errors.subject || form.formState.errors.ageGroup || 
          form.formState.errors.objective || form.formState.errors.warmUp || form.formState.errors.coreContent) {
        return;
      }
      setFormStep('details');
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (formStep === 'content') {
      setFormStep('info');
    } else if (formStep === 'details') {
      setFormStep('content');
    } else if (formStep === 'preview') {
      setFormStep('details');
    }
  };

  // Render form based on submission status
  if (submitted) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full dark:bg-green-900">
              <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <CardTitle className="text-xl">Thank You For Contributing!</CardTitle>
              <CardDescription>Your lesson has been submitted for review</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Thanks for contributing to Real World Academy! Your lesson will be reviewed by our team before going live.
              We appreciate your help building the future of education.
            </p>
            <p>
              You'll receive an email notification when your lesson is approved or if we need any additional information.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" asChild>
              <Link href="/learn">Back to Learn</Link>
            </Button>
            <Button asChild>
              <Link href="/contribute">Contribute Another Lesson</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center mb-8">
        <Link href="/learn">
          <Button variant="ghost" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">Contribute a Lesson</h1>
          <p className="text-muted-foreground">Share your knowledge with the Real World Academy community</p>
        </div>
        <Button 
          variant={formStep === 'preview' ? "default" : "outline"} 
          onClick={handlePreview}
          className="gap-1"
        >
          {formStep === 'preview' ? (
            <>
              <Pencil className="h-4 w-4" />
              Edit Lesson
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>For Approved Contributors</AlertTitle>
        <AlertDescription>
          Lessons must follow Real World Academy's values: relevance, clarity, kindness, and empowerment.
        </AlertDescription>
      </Alert>

      {formStep === 'preview' ? (
        <LessonPreview data={form.getValues()} onBack={prevStep} onSubmit={() => form.handleSubmit(onSubmit)()} />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={formStep} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger 
                  value="info" 
                  onClick={() => setFormStep('info')}
                >
                  Contributor Info
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  onClick={() => setFormStep('content')}
                >
                  Lesson Content
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  onClick={() => setFormStep('details')}
                >
                  Activities & Reflection
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contributor Information</CardTitle>
                    <CardDescription>
                      Tell us a bit about yourself. Your email will not be displayed publicly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contributorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be shown as the lesson creator.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contributorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used for communication about your lesson submission (not displayed publicly).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="affiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Affiliation</FormLabel>
                          <FormControl>
                            <Input placeholder="School, Organization, or 'Parent'" {...field} />
                          </FormControl>
                          <FormDescription>
                            How you're connected to education (e.g., "High School Teacher", "Home Educator").
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button type="button" onClick={nextStep}>Next: Lesson Content</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Basics</CardTitle>
                    <CardDescription>
                      Define the core elements of your lesson.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lesson Title</FormLabel>
                          <FormControl>
                            <Input placeholder="An engaging title for your lesson" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="financial-literacy">Financial Literacy</SelectItem>
                                <SelectItem value="communication">Communication</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="well-being">Well-Being</SelectItem>
                                <SelectItem value="critical-thinking">Critical Thinking</SelectItem>
                                <SelectItem value="creativity">Creativity</SelectItem>
                                <SelectItem value="citizenship">Digital Citizenship</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ageGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Group</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an age group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="9-12">9-12 years</SelectItem>
                                <SelectItem value="13-15">13-15 years</SelectItem>
                                <SelectItem value="16-18">16-18 years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="objective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lesson Objective</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What students will learn from this lesson" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Start with "By the end of this lesson, students will be able to..."
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="warmUp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warm-Up</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A brief activity or question to get students thinking" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A hook to engage students at the beginning of the lesson.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="coreContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Core Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="The main lesson content" 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The main educational content of your lesson. Include key concepts, explanations, and examples.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" onClick={nextStep}>Next: Activities</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activities & Reflection</CardTitle>
                    <CardDescription>
                      Add engaging activities and reflection prompts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="scenario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Real-World Scenario</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A realistic scenario that applies the lesson concepts" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Describe a scenario that shows how this knowledge applies in real life.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="activity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Instructions for a hands-on activity" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Provide clear instructions for an engaging activity that reinforces the lesson.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reflection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reflection Prompt</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Questions for students to reflect on after the lesson" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Questions that encourage students to think about what they've learned.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="badge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Badge (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Suggested badge name for lesson completion" {...field} />
                          </FormControl>
                          <FormDescription>
                            Suggest a name for the badge students will earn upon completing this lesson.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                    <Button type="button" onClick={handlePreview}>Preview Lesson</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      )}
    </div>
  );
}

// Lesson Preview Component
interface LessonPreviewProps {
  data: LessonFormValues;
  onBack: () => void;
  onSubmit: () => void;
}

function LessonPreview({ data, onBack, onSubmit }: LessonPreviewProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge>{data.subject}</Badge>
            <Badge variant="outline">{data.ageGroup} years</Badge>
          </div>
          <CardTitle className="text-2xl">{data.title}</CardTitle>
          <CardDescription className="text-base">
            By {data.contributorName} ({data.affiliation})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Lesson Objective</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.objective}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Warm-Up</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.warmUp}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Core Content</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.coreContent}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Real-World Scenario</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.scenario}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Activity</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.activity}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Reflection Prompt</h3>
            <p className="text-muted-foreground whitespace-pre-line">{data.reflection}</p>
          </div>
          
          {data.badge && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Completion Badge</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                  {data.badge}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onBack}>
            Back to Edit
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>Submitting...</>
            ) : (
              <>
                Submit for Review
                <SendHorizontal className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
