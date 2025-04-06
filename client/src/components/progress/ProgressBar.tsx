import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  textClassName?: string;
  showPercentage?: boolean;
  height?: string;
  color?: string;
  icon?: string;
  label?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  textClassName,
  showPercentage = true,
  height = "h-2.5",
  color = "var(--primary)",
  icon,
  label,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || icon) && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            {icon && <span className="text-lg">{icon}</span>}
            {label && <span className="text-sm font-medium">{label}</span>}
          </div>
          {showPercentage && (
            <span className="text-xs font-medium text-muted-foreground">
              {value} of {max} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden", 
          height,
          barClassName
        )}
      >
        <motion.div
          className="h-full rounded-full transition-all"
          style={{ 
            backgroundColor: color,
            width: `${percentage}%`,
          }}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;