import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, ageGroup: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.firstName.trim()) {
        throw new Error('First name is required');
      }
      if (!formData.lastName.trim()) {
        throw new Error('Last name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.password.trim()) {
        throw new Error('Password is required');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (!formData.ageGroup) {
        throw new Error('Age group is required');
      }
      if (!formData.agreeToTerms) {
        throw new Error('You must agree to the terms and conditions');
      }
      
      // Call signup function from auth context
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        ageGroup: formData.ageGroup as any,
        interests: [] // Default empty interests
      });
      
      // Show success toast
      toast({
        title: "Account created",
        description: "Welcome to Real World Academy!",
        duration: 3000,
      });
      
      // Redirect to dashboard
      setLocation('/dashboard');
    } catch (err) {
      // Show error message
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Morgan"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select onValueChange={handleSelectChange} disabled={isSubmitting}>
                  <SelectTrigger id="ageGroup">
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-9">Under 9</SelectItem>
                    <SelectItem value="9-12">9-12</SelectItem>
                    <SelectItem value="13-15">13-15</SelectItem>
                    <SelectItem value="16-18">16-18</SelectItem>
                    <SelectItem value="18+">18+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 my-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isSubmitting}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setLocation('/login')}>
            Already have an account? Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
