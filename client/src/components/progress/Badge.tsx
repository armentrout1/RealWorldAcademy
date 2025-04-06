import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge as BadgeType } from '@/contexts/ProgressContext';

interface BadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTooltip?: boolean;
  onClick?: () => void;
}

export function Badge({
  badge,
  size = 'md',
  className,
  showTooltip = true,
  onClick,
}: BadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };
  
  const badgeElement = (
    <motion.div
      className={cn(
        sizeClasses[size],
        'rounded-full flex items-center justify-center relative cursor-pointer transition-all',
        badge.unlocked
          ? 'bg-gradient-to-br from-primary-100 to-primary-300 shadow-md hover:shadow-lg'
          : 'bg-gray-200 text-gray-400 hover:bg-gray-300',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-center">{badge.icon}</span>
      {badge.unlocked && (
        <motion.div
          className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1.5">
              <p className="font-semibold">{badge.title}</p>
              <p className="text-xs">{badge.description}</p>
              {badge.unlocked && badge.dateUnlocked && (
                <p className="text-xs text-muted-foreground">
                  Earned: {new Date(badge.dateUnlocked).toLocaleDateString()}
                </p>
              )}
              {!badge.unlocked && (
                <p className="text-xs italic text-muted-foreground">
                  Complete the required task to unlock this badge
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeElement;
}

export default Badge;