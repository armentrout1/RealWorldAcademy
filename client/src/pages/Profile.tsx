import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, User, Save } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const interests = [
  { id: 'money', label: 'Money' },
  { id: 'tech', label: 'Technology' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'career', label: 'Career Planning' },
  { id: 'science', label: 'Science' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts', label: 'Arts' },
  { id: 'environment', label: 'Environment' },
  { id: 'leadership', label: 'Leadership' },
];

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    ageGroup: user?.ageGroup || '',
    interests: user?.interests || [],
  });

  if (!user) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You must be logged in to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setProfileData(prev => ({ ...prev, ageGroup: value }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setProfileData(prev => {
      if (checked) {
        return { ...prev, interests: [...prev.interests, interest] };
      } else {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
        throw new Error('Name fields cannot be empty');
      }
      
      // TODO: Connect to profile update API
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        ageGroup: profileData.ageGroup as any,
        interests: profileData.interests,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="profile-form" onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <User className="h-4 w-4 mr-2" /> Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={true} // Email can't be changed
                  />
                  <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                </div>
                
                <div className="grid gap-2 mb-4">
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select 
                    value={profileData.ageGroup} 
                    onValueChange={handleSelectChange}
                    disabled={isSubmitting || isLoading}
                  >
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
                
                <div className="grid gap-2">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {interests.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`interest-${interest.id}`} 
                          checked={profileData.interests.includes(interest.label)}
                          onCheckedChange={(checked) => 
                            handleInterestChange(interest.label, checked as boolean)
                          }
                          disabled={isSubmitting || isLoading}
                        />
                        <Label 
                          htmlFor={`interest-${interest.id}`}
                          className="text-sm text-muted-foreground"
                        >
                          {interest.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="profile-form"
                disabled={isSubmitting || isLoading}
              >
                {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {(isSubmitting || isLoading) ? 'Saving...' : (
                  <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Preference settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Account settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;