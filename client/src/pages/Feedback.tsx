import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Feedback() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    audience: "parent",
    category: "general",
    message: "",
  });

  const feedbackMutation = useMutation({
    mutationFn: () => apiRequest("/api/feedback", {
      method: "POST",
      body: formData,
    }),
    onSuccess: () => {
      setFormData({
        name: "",
        email: "",
        audience: "parent",
        category: "general",
        message: "",
      });
      toast({
        title: "Feedback sent",
        description: "Thank you. This helps shape the public beta.",
      });
    },
    onError: (error) => {
      toast({
        title: "Feedback not sent",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please include your name, email, and message.",
        variant: "destructive",
      });
      return;
    }

    feedbackMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <MessageSquare className="h-6 w-6 text-primary" />
          Beta Feedback
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tell us what is useful, confusing, broken, unsafe, or missing while Real World Academy moves toward public beta.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>Bug reports, content concerns, safety issues, and feature ideas all belong here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitFeedback} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  disabled={feedbackMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  disabled={feedbackMutation.isPending}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(value) => setFormData((current) => ({ ...current, audience: value }))}
                  disabled={feedbackMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent / Guardian</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((current) => ({ ...current, category: value }))}
                  disabled={feedbackMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                className="min-h-[180px]"
                value={formData.message}
                onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                disabled={feedbackMutation.isPending}
              />
            </div>

            <Button type="submit" disabled={feedbackMutation.isPending}>
              <Send className="mr-2 h-4 w-4" />
              {feedbackMutation.isPending ? "Sending..." : "Send Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
