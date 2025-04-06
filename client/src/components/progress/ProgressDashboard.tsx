import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useProgress } from '@/contexts/ProgressContext';
import ProgressCircle from './ProgressCircle';
import CategoryProgressWidget from './CategoryProgressWidget';
import BadgeCollection from './BadgeCollection';
import Timeline from './Timeline';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ProgressDashboardProps {
  className?: string;
  compact?: boolean;
}

export function ProgressDashboard({
  className,
  compact = false,
}: ProgressDashboardProps) {
  const { progress } = useProgress();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall progress circle - always visible */}
      <div className="flex justify-center mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressCircle
            value={progress.overallProgress}
            size={compact ? 120 : 150}
            strokeWidth={compact ? 8 : 10}
            label="Overall Progress"
            showPercentage
          />
        </motion.div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-4">
          <CategoryProgressWidget 
            categories={progress.categories}
            viewType={compact ? 'bars' : 'mixed'}
            compact={compact}
          />
        </TabsContent>
        
        <TabsContent value="achievements" className="pt-4">
          <BadgeCollection badges={progress.badges} />
        </TabsContent>
        
        <TabsContent value="timeline" className="pt-4">
          <div className="bg-card p-5 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Your Learning Journey</h3>
            {progress.timeline.length > 0 ? (
              <Timeline 
                events={progress.timeline} 
                maxItems={compact ? 5 : 10}
              />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Your learning journey will be tracked here as you progress through the platform.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProgressDashboard;