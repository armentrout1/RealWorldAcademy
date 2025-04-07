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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  Home,
  UserCircle,
  Bell,
  Lock,
  Eye,
  Globe,
  Palette,
  RefreshCw,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { toast } = useToast();
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    fullName: "Alex Morgan",
    email: "alex@example.com",
    bio: "Student interested in technology, math, and real-world learning.",
    receiveNotifications: true
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    highContrast: false,
    reducedAnimations: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showProgress: true,
    shareActivity: false
  });

  // Learning settings
  const [learningSettings, setLearningSettings] = useState({
    homeschoolMode: false,
    contentLevel: "age-appropriate",
    autoplayVideos: true
  });

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  // Handle homeschool mode toggle
  const handleHomeschoolModeToggle = (checked: boolean) => {
    setLearningSettings({
      ...learningSettings,
      homeschoolMode: checked
    });
    
    toast({
      title: checked ? "Homeschool Mode Enabled" : "Homeschool Mode Disabled",
      description: checked 
        ? "The interface has been optimized for homeschool learning."
        : "Standard learning interface restored.",
    });
  };

  // Handle saving all settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <SettingsIcon className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Account Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Side Navigation */}
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start font-normal text-base"
            onClick={() => document.getElementById('profile-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <UserCircle className="mr-2 h-5 w-5" />
            Profile
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start font-normal text-base"
            onClick={() => document.getElementById('notifications-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start font-normal text-base"
            onClick={() => document.getElementById('appearance-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Palette className="mr-2 h-5 w-5" />
            Appearance
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start font-normal text-base"
            onClick={() => document.getElementById('privacy-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Lock className="mr-2 h-5 w-5" />
            Privacy
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 font-normal text-base"
            onClick={() => document.getElementById('learning-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Home className="mr-2 h-5 w-5" />
            Learning Modes
          </Button>
        </div>
        
        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Section */}
          <Card id="profile-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={profileSettings.fullName}
                    onChange={(e) => setProfileSettings({...profileSettings, fullName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                    placeholder="Tell us a little about yourself..."
                  />
                </div>
                
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Notifications Section */}
          <Card id="notifications-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-neutral-500">Receive updates about your account and learning progress</p>
                  </div>
                  <Switch 
                    checked={profileSettings.receiveNotifications}
                    onCheckedChange={(checked) => setProfileSettings({...profileSettings, receiveNotifications: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Website Notifications</h3>
                    <p className="text-sm text-neutral-500">Show notifications in the browser while you're using the platform</p>
                  </div>
                  <Switch checked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Learning Reminders</h3>
                    <p className="text-sm text-neutral-500">Get gentle reminders to continue your learning</p>
                  </div>
                  <Switch checked />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Appearance Section */}
          <Card id="appearance-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the platform looks for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={appearanceSettings.theme === "light" ? "default" : "outline"}
                      className="justify-center"
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: "light"})}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={appearanceSettings.theme === "dark" ? "default" : "outline"}
                      className="justify-center"
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: "dark"})}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={appearanceSettings.theme === "system" ? "default" : "outline"}
                      className="justify-center"
                      onClick={() => setAppearanceSettings({...appearanceSettings, theme: "system"})}
                    >
                      System
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">High Contrast</h3>
                    <p className="text-sm text-neutral-500">Increase contrast for better readability</p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.highContrast}
                    onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, highContrast: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Reduced Animations</h3>
                    <p className="text-sm text-neutral-500">Minimize motion effects throughout the interface</p>
                  </div>
                  <Switch 
                    checked={appearanceSettings.reducedAnimations}
                    onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, reducedAnimations: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Privacy Section */}
          <Card id="privacy-section">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your data and what others can see about you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Show Learning Progress</h3>
                    <p className="text-sm text-neutral-500">Allow others to see your progress in courses and subjects</p>
                  </div>
                  <Switch 
                    checked={privacySettings.showProgress}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showProgress: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Share Activity</h3>
                    <p className="text-sm text-neutral-500">Let others know when you complete projects or earn achievements</p>
                  </div>
                  <Switch 
                    checked={privacySettings.shareActivity}
                    onCheckedChange={(checked) => setPrivacySettings({...privacySettings, shareActivity: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button variant="outline" className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    View Privacy Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Modes Section */}
          <Card id="learning-section" className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardHeader>
              <div className="bg-yellow-200 text-yellow-800 px-3 py-1 text-xs font-medium rounded-full w-fit mb-2">
                New Feature
              </div>
              <CardTitle className="flex items-center text-amber-800">
                <Home className="mr-2 h-5 w-5" />
                Learning Modes
              </CardTitle>
              <CardDescription className="text-amber-700">
                Customize your learning experience based on your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 px-4 bg-white rounded-md border border-yellow-200">
                  <div>
                    <h3 className="font-medium text-amber-900">Homeschool Mode</h3>
                    <p className="text-sm text-amber-700">
                      Optimizes the interface for family-led learning with parent-focused tools and simplified navigation
                    </p>
                  </div>
                  <Switch 
                    checked={learningSettings.homeschoolMode}
                    onCheckedChange={handleHomeschoolModeToggle}
                    className="data-[state=checked]:bg-amber-600"
                  />
                </div>
                
                {learningSettings.homeschoolMode && (
                  <div className="rounded-md bg-amber-100 p-4 text-amber-800 text-sm">
                    <p className="font-medium mb-2">Homeschool Mode features:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Simplified interface with fewer distractions</li>
                      <li>Parent notes and messages highlighted throughout</li>
                      <li>"Teacher" areas relabeled as "Parent Tools"</li>
                      <li>Weekly planning features for scheduling learning</li>
                      <li>Family-friendly progress reporting</li>
                    </ul>
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => window.location.href = "/parent-dashboard"}
                      >
                        Visit Homeschool Hub
                      </Button>
                    </div>
                  </div>
                )}
                
                <Separator className="bg-amber-200" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-amber-900">Content Level</h3>
                    <p className="text-sm text-amber-700">Choose the appropriate content level for your learning</p>
                  </div>
                  <div className="flex border border-amber-200 rounded-md">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={`rounded-l-md ${learningSettings.contentLevel === 'simplified' ? 'bg-amber-200 text-amber-900' : 'text-amber-700'}`}
                      onClick={() => setLearningSettings({...learningSettings, contentLevel: 'simplified'})}
                    >
                      Simplified
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={`${learningSettings.contentLevel === 'age-appropriate' ? 'bg-amber-200 text-amber-900' : 'text-amber-700'}`}
                      onClick={() => setLearningSettings({...learningSettings, contentLevel: 'age-appropriate'})}
                    >
                      Age-Appropriate
                    </Button>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className={`rounded-r-md ${learningSettings.contentLevel === 'advanced' ? 'bg-amber-200 text-amber-900' : 'text-amber-700'}`}
                      onClick={() => setLearningSettings({...learningSettings, contentLevel: 'advanced'})}
                    >
                      Advanced
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-amber-200" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-amber-900">Autoplay Learning Videos</h3>
                    <p className="text-sm text-amber-700">Automatically play the next video in a learning sequence</p>
                  </div>
                  <Switch 
                    checked={learningSettings.autoplayVideos}
                    onCheckedChange={(checked) => setLearningSettings({...learningSettings, autoplayVideos: checked})}
                    className="data-[state=checked]:bg-amber-600"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-amber-50">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Save className="mr-2 h-4 w-4" />
                Save Learning Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => {
                // Reset settings to defaults
                setProfileSettings({
                  fullName: "Alex Morgan",
                  email: "alex@example.com",
                  bio: "Student interested in technology, math, and real-world learning.",
                  receiveNotifications: true
                });
                setAppearanceSettings({
                  theme: "light",
                  highContrast: false,
                  reducedAnimations: false
                });
                setPrivacySettings({
                  showProgress: true,
                  shareActivity: false
                });
                setLearningSettings({
                  homeschoolMode: false,
                  contentLevel: "age-appropriate",
                  autoplayVideos: true
                });
                
                toast({
                  title: "Settings reset",
                  description: "All settings have been restored to defaults.",
                });
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;