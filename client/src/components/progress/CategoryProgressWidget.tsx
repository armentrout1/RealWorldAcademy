import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CategoryProgress } from '@/contexts/ProgressContext';
import ProgressBar from './ProgressBar';
import ProgressCircle from './ProgressCircle';

interface CategoryProgressWidgetProps {
  categories: CategoryProgress[];
  className?: string;
  title?: string;
  viewType?: 'bars' | 'circles' | 'mixed';
  compact?: boolean;
}

export function CategoryProgressWidget({
  categories,
  className,
  title = "Your Progress",
  viewType = 'bars',
  compact = false,
}: CategoryProgressWidgetProps) {
  return (
    <motion.div
      className={cn(
        "bg-card p-5 rounded-lg shadow-sm border",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {viewType === 'bars' && (
        <div className="space-y-4">
          {categories.map((category) => (
            <ProgressBar
              key={category.id}
              value={category.completed}
              max={category.total}
              label={category.title}
              icon={category.icon}
              color={category.color}
              height="h-3"
            />
          ))}
        </div>
      )}
      
      {viewType === 'circles' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <ProgressCircle
              key={category.id}
              value={category.completed}
              max={category.total}
              label={category.title}
              icon={category.icon}
              color={category.color}
              size={compact ? 70 : 90}
              strokeWidth={compact ? 6 : 8}
              showPercentage={!compact}
              showValue={compact}
            />
          ))}
        </div>
      )}
      
      {viewType === 'mixed' && (
        <div className="space-y-5">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            {categories.map((category) => (
              <ProgressCircle
                key={category.id}
                value={category.completed}
                max={category.total}
                label={category.title}
                icon={category.icon}
                color={category.color}
                size={80}
                strokeWidth={7}
              />
            ))}
          </div>
          
          <div className="space-y-3 mt-4">
            {categories.map((category) => (
              <ProgressBar
                key={category.id}
                value={category.completed}
                max={category.total}
                label={category.title}
                icon={category.icon}
                color={category.color}
                height="h-2.5"
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CategoryProgressWidget;