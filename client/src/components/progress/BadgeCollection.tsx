import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge as BadgeType } from '@/contexts/ProgressContext';
import { Badge } from './Badge';

interface BadgeCollectionProps {
  badges: BadgeType[];
  className?: string;
  title?: string;
  onBadgeClick?: (badge: BadgeType) => void;
}

export function BadgeCollection({
  badges,
  className,
  title = "Your Achievements",
  onBadgeClick,
}: BadgeCollectionProps) {
  // Sort badges with unlocked ones first
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

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
      
      <div className="flex flex-wrap justify-center gap-5">
        {sortedBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Badge
              badge={badge}
              size="md"
              onClick={onBadgeClick ? () => onBadgeClick(badge) : undefined}
            />
          </motion.div>
        ))}
      </div>
      
      {badges.some(badge => badge.unlocked) && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {badges.filter(b => b.unlocked).length} of {badges.length} badges earned
        </div>
      )}

      {!badges.some(badge => badge.unlocked) && (
        <div className="mt-4 text-center text-sm text-muted-foreground italic">
          Complete activities to earn your first badge!
        </div>
      )}
    </motion.div>
  );
}

export default BadgeCollection;