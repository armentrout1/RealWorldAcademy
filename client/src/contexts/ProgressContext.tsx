import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';

// Define our progress types and response schemas
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
}

export interface CategoryProgress {
  id: string;
  title: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  category: string;
}

export interface UserProgress {
  badges: Badge[];
  categories: CategoryProgress[];
  timeline: TimelineEvent[];
  overallProgress: number;
}

// Response schemas
const badgeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlocked: z.boolean(),
  dateUnlocked: z.string().optional(),
});

const categoryProgressSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.number(),
  total: z.number(),
  percentage: z.number(),
  color: z.string(),
  icon: z.string(),
});

const timelineEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  completed: z.boolean(),
  category: z.string(),
});

const progressSummarySchema = z.object({
  overallProgress: z.number(),
});

// Arrays of response types
const badgesResponseSchema = z.array(badgeSchema);
const categoryProgressResponseSchema = z.array(categoryProgressSchema);
const timelineEventsResponseSchema = z.array(timelineEventSchema);

// Types based on schemas
type BadgesResponse = z.infer<typeof badgesResponseSchema>;
type CategoryProgressResponse = z.infer<typeof categoryProgressResponseSchema>;
type TimelineEventsResponse = z.infer<typeof timelineEventsResponseSchema>;
type ProgressSummaryResponse = z.infer<typeof progressSummarySchema>;

// Initial state with some example data
const initialProgress: UserProgress = {
  badges: [
    {
      id: 'quiz-master',
      title: 'First Quiz Completed',
      description: 'You completed your first self-discovery quiz!',
      icon: '🎯',
      unlocked: false,
    },
    {
      id: 'budget-master',
      title: 'Budget Master',
      description: 'You created your first budget plan!',
      icon: '💰',
      unlocked: false,
    },
    {
      id: 'project-builder',
      title: 'First Project Built',
      description: 'You completed your first hands-on project!',
      icon: '🛠️',
      unlocked: false,
    },
    {
      id: 'subject-master',
      title: 'Knowledge Explorer',
      description: 'You finished a complete subject module!',
      icon: '📘',
      unlocked: false,
    },
    {
      id: 'team-player',
      title: 'Teamwork Champion',
      description: 'You completed a team project simulation!',
      icon: '🤝',
      unlocked: false,
    },
    {
      id: 'financial-wizard',
      title: 'Financial Wizard',
      description: 'You mastered all financial literacy modules!',
      icon: '✨',
      unlocked: false,
    },
  ],
  categories: [
    {
      id: 'self-discovery',
      title: 'Self Discovery',
      completed: 0,
      total: 1,
      percentage: 0,
      color: 'hsl(280, 90%, 65%)',
      icon: '🧠',
    },
    {
      id: 'subjects',
      title: 'Subject Modules',
      completed: 0,
      total: 5,
      percentage: 0,
      color: 'hsl(220, 90%, 65%)',
      icon: '📚',
    },
    {
      id: 'projects',
      title: 'Projects',
      completed: 0,
      total: 5,
      percentage: 0,
      color: 'hsl(160, 90%, 40%)',
      icon: '🛠️',
    },
    {
      id: 'financial',
      title: 'Financial Literacy',
      completed: 0,
      total: 4,
      percentage: 0,
      color: 'hsl(40, 90%, 55%)',
      icon: '💰',
    },
    {
      id: 'team-projects',
      title: 'Team Projects',
      completed: 0,
      total: 3,
      percentage: 0,
      color: 'hsl(340, 90%, 65%)',
      icon: '👥',
    },
  ],
  timeline: [
    {
      id: '1',
      title: 'Started learning journey',
      date: new Date().toISOString(),
      completed: true,
      category: 'general',
    },
  ],
  overallProgress: 0,
};

// Create context
interface ProgressContextType {
  progress: UserProgress;
  updateCategoryProgress: (categoryId: string, completed: number, total: number) => void;
  unlockBadge: (badgeId: string) => void;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Default user ID for demonstration - in a real app, this would come from authentication
const CURRENT_USER_ID = 1;

// Provider component
export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  
  // Fetch badges from API
  const badgesQuery = useQuery<Badge[]>({
    queryKey: ['/api/users', CURRENT_USER_ID, 'badges'],
    queryFn: async () => {
      try {
        const data = await apiRequest<BadgesResponse>(`/api/users/${CURRENT_USER_ID}/badges`);
        return data || [];
      } catch (error) {
        console.error('Failed to fetch badges:', error);
        return [];
      }
    },
    initialData: initialProgress.badges,
  });

  // Fetch category progress from API
  const categoryProgressQuery = useQuery<CategoryProgress[]>({
    queryKey: ['/api/users', CURRENT_USER_ID, 'category-progress'],
    queryFn: async () => {
      try {
        const data = await apiRequest<CategoryProgressResponse>(`/api/users/${CURRENT_USER_ID}/category-progress`);
        // Calculate percentage for each category if it's not already included
        return data?.map(category => ({
          ...category,
          percentage: category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0,
        })) || [];
      } catch (error) {
        console.error('Failed to fetch category progress:', error);
        return [];
      }
    },
    initialData: initialProgress.categories,
  });

  // Fetch timeline events from API
  const timelineQuery = useQuery<TimelineEvent[]>({
    queryKey: ['/api/users', CURRENT_USER_ID, 'timeline'],
    queryFn: async () => {
      try {
        const data = await apiRequest<TimelineEventsResponse>(`/api/users/${CURRENT_USER_ID}/timeline`);
        return data || [];
      } catch (error) {
        console.error('Failed to fetch timeline events:', error);
        return [];
      }
    },
    initialData: initialProgress.timeline,
  });

  // Fetch overall progress from API
  const overallProgressQuery = useQuery<number>({
    queryKey: ['/api/users', CURRENT_USER_ID, 'progress-summary'],
    queryFn: async () => {
      try {
        const data = await apiRequest<ProgressSummaryResponse>(`/api/users/${CURRENT_USER_ID}/progress-summary`);
        return data?.overallProgress || 0;
      } catch (error) {
        console.error('Failed to fetch overall progress:', error);
        return 0;
      }
    },
    initialData: initialProgress.overallProgress,
  });

  // Combine all the data into a single progress object
  useEffect(() => {
    setProgress({
      badges: badgesQuery.data || initialProgress.badges,
      categories: categoryProgressQuery.data || initialProgress.categories,
      timeline: timelineQuery.data || initialProgress.timeline,
      overallProgress: overallProgressQuery.data || initialProgress.overallProgress,
    });
  }, [
    badgesQuery.data,
    categoryProgressQuery.data,
    timelineQuery.data,
    overallProgressQuery.data,
  ]);

  // Calculate overall progress whenever any category changes and update it
  useEffect(() => {
    if (categoryProgressQuery.data?.length) {
      const totalCompleted = categoryProgressQuery.data.reduce((sum: number, category: CategoryProgress) => sum + category.completed, 0);
      const totalItems = categoryProgressQuery.data.reduce((sum: number, category: CategoryProgress) => sum + category.total, 0);
      const overallProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
      
      // If overall progress has changed, update it in the database
      if (overallProgress !== overallProgressQuery.data) {
        updateOverallProgressMutation.mutate({ overallProgress });
      }
    }
  }, [categoryProgressQuery.data]);

  // Category progress mutation
  const updateCategoryProgressMutation = useMutation({
    mutationFn: async ({ id, completed, total }: { id: number, completed: number, total: number }) => {
      return apiRequest({
        url: `/api/users/${CURRENT_USER_ID}/category-progress/${id}`,
        method: 'PATCH',
        body: { completed, total },
      });
    },
    onSuccess: () => {
      // Invalidate the category progress cache
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'category-progress'] });
    },
  });

  // Badge mutation
  const updateBadgeMutation = useMutation({
    mutationFn: async ({ id, unlocked }: { id: number, unlocked: boolean }) => {
      return apiRequest({
        url: `/api/users/${CURRENT_USER_ID}/badges/${id}`,
        method: 'PATCH',
        body: { unlocked },
      });
    },
    onSuccess: () => {
      // Invalidate the badges cache
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'badges'] });
    },
  });

  // Timeline event mutation
  const addTimelineEventMutation = useMutation({
    mutationFn: async (event: Omit<TimelineEvent, 'id'>) => {
      return apiRequest({
        url: `/api/users/${CURRENT_USER_ID}/timeline`,
        method: 'POST',
        body: event,
      });
    },
    onSuccess: () => {
      // Invalidate the timeline cache
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'timeline'] });
    },
  });

  // Overall progress mutation
  const updateOverallProgressMutation = useMutation({
    mutationFn: async ({ overallProgress }: { overallProgress: number }) => {
      return apiRequest({
        url: `/api/users/${CURRENT_USER_ID}/progress-summary`,
        method: 'PATCH',
        body: { overallProgress },
      });
    },
    onSuccess: () => {
      // Invalidate the progress summary cache
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'progress-summary'] });
    },
  });

  // Update a specific category's progress
  const updateCategoryProgress = (categoryId: string, completed: number, total: number) => {
    // First update state optimistically for immediate UI feedback
    setProgress(prev => {
      const updatedCategories = prev.categories.map(category => {
        if (category.id === categoryId) {
          const percentage = Math.round((completed / total) * 100);
          return { ...category, completed, total, percentage };
        }
        return category;
      });
      
      return {
        ...prev,
        categories: updatedCategories,
      };
    });
    
    // Then update in the database
    const category = progress.categories.find(c => c.id === categoryId);
    if (category) {
      updateCategoryProgressMutation.mutate({
        id: Number(category.id),
        completed,
        total,
      });
    }
  };

  // Unlock a badge
  const unlockBadge = (badgeId: string) => {
    // First update state optimistically for immediate UI feedback
    setProgress(prev => {
      const updatedBadges = prev.badges.map(badge => {
        if (badge.id === badgeId && !badge.unlocked) {
          return { 
            ...badge, 
            unlocked: true,
            dateUnlocked: new Date().toISOString(),
          };
        }
        return badge;
      });
      
      // Add timeline event for badge unlock if the badge was actually unlocked
      const badgeWasUnlocked = updatedBadges.some(
        (b, i) => b.id === badgeId && b.unlocked && !prev.badges[i].unlocked
      );
      
      let updatedTimeline = [...prev.timeline];
      if (badgeWasUnlocked) {
        const badge = updatedBadges.find(b => b.id === badgeId);
        
        // Add timeline event via API
        if (badge) {
          addTimelineEvent({
            title: `Earned badge: ${badge.title}`,
            date: new Date().toISOString(),
            completed: true,
            category: 'badge',
          });
        }
      }
      
      return {
        ...prev,
        badges: updatedBadges,
      };
    });
    
    // Then update in the database
    const badge = progress.badges.find(b => b.id === badgeId);
    if (badge) {
      updateBadgeMutation.mutate({
        id: Number(badge.id),
        unlocked: true,
      });
    }
  };

  // Add a timeline event
  const addTimelineEvent = (event: Omit<TimelineEvent, 'id'>) => {
    // Add optimistically to state
    setProgress(prev => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          ...event,
          id: `temp-${Date.now()}`, // Temporary ID until server responds
        },
      ],
    }));
    
    // Add to database
    addTimelineEventMutation.mutate(event);
  };

  // Reset all progress (for demo only)
  const resetProgress = () => {
    setProgress(initialProgress);
    // In a real app, you would need to implement a reset endpoint
    // and call it here, then invalidate all queries
  };

  // Loading state
  const isLoading = 
    badgesQuery.isLoading || 
    categoryProgressQuery.isLoading || 
    timelineQuery.isLoading ||
    overallProgressQuery.isLoading;

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateCategoryProgress,
        unlockBadge,
        addTimelineEvent,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook to use the progress context
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};