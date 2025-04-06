import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TimelineEvent } from '@/contexts/ProgressContext';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  maxItems?: number;
}

export function Timeline({ events, className, maxItems }: TimelineProps) {
  // Sort events by date, newest first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Limit the number of events shown if maxItems is provided
  const displayEvents = maxItems ? sortedEvents.slice(0, maxItems) : sortedEvents;

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      {/* Timeline events */}
      <div className="space-y-4">
        {displayEvents.map((event, index) => (
          <TimelineItem 
            key={event.id} 
            event={event} 
            index={index}
          />
        ))}
        
        {maxItems && sortedEvents.length > maxItems && (
          <div className="ml-12 text-sm text-muted-foreground">
            + {sortedEvents.length - maxItems} more events...
          </div>
        )}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

function TimelineItem({ event, index }: TimelineItemProps) {
  // Determine icon and color based on event category
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'badge':
        return { icon: '🏆', color: 'bg-yellow-500' };
      case 'project':
        return { icon: '🛠️', color: 'bg-blue-500' };
      case 'course':
        return { icon: '📚', color: 'bg-green-500' };
      case 'quiz':
        return { icon: '🎯', color: 'bg-purple-500' };
      case 'financial':
        return { icon: '💰', color: 'bg-emerald-500' };
      default:
        return { icon: '📌', color: 'bg-gray-500' };
    }
  };
  
  const { icon, color } = getCategoryDetails(event.category);
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });

  return (
    <motion.div 
      className="flex items-start gap-4 relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Timeline dot */}
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center z-10", color)}>
        <span className="text-white text-sm">{icon}</span>
      </div>
      
      {/* Event content */}
      <div className="bg-card p-3 rounded-md shadow-sm flex-1 mt-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{event.title}</h4>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        {event.completed && (
          <div className="flex items-center mt-1 text-xs text-green-600">
            <span className="mr-1">✓</span> Completed
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Timeline;