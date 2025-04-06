import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
  bgColor?: string;
  icon?: string;
  label?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressCircle({
  value,
  max = 100,
  size = 100,
  strokeWidth = 8,
  className,
  color = "var(--primary)",
  bgColor = "#e2e8f0",
  icon,
  label,
  showValue = false,
  showPercentage = true,
  animated = true,
}: ProgressCircleProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? circumference : offset}
            initial={animated ? { strokeDashoffset: circumference } : false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <span className="text-2xl mb-1">{icon}</span>}
          {showPercentage && (
            <span className="text-xl font-bold">{percentage}%</span>
          )}
          {showValue && !showPercentage && (
            <span className="text-xl font-bold">
              {value}/{max}
            </span>
          )}
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm font-medium text-center">{label}</span>
      )}
    </div>
  );
}

export default ProgressCircle;