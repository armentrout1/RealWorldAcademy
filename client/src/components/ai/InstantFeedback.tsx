import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  X,
  Sparkles,
  ThumbsUp,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define severity levels for feedback
type FeedbackSeverity = 'success' | 'warning' | 'info' | 'error';

// Props interface
interface InstantFeedbackProps {
  context: 'quiz' | 'budget' | 'project' | 'assignment';
  score?: number; // percentage as decimal, e.g., 0.85 for 85%
  completedSteps?: string[];
  skippedSteps?: string[];
  strengths?: string[];
  areasToImprove?: string[];
  className?: string;
  onClose?: () => void;
  onAction?: (action: string) => void;
}

/**
 * Instant Feedback Component
 * 
 * Provides AI-like feedback on student submitted work with suggestions
 * for improvement and recognition of strengths.
 */
const InstantFeedback: React.FC<InstantFeedbackProps> = ({
  context,
  score,
  completedSteps = [],
  skippedSteps = [],
  strengths = [],
  areasToImprove = [],
  className,
  onClose,
  onAction
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [severity, setSeverity] = useState<FeedbackSeverity>('info');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackDetail, setFeedbackDetail] = useState('');
  const [suggestedAction, setSuggestedAction] = useState<{text: string, action: string} | null>(null);
  
  // Determine feedback content based on context and data
  useEffect(() => {
    let message = '';
    let detail = '';
    let action = null;
    let determinedSeverity: FeedbackSeverity = 'info';
    
    // Determine severity based on score or completion
    if (score !== undefined) {
      if (score >= 0.8) determinedSeverity = 'success';
      else if (score >= 0.6) determinedSeverity = 'info';
      else if (score >= 0.4) determinedSeverity = 'warning';
      else determinedSeverity = 'error';
    } else if (skippedSteps && skippedSteps.length > 0) {
      determinedSeverity = 'warning';
    } else if (completedSteps && completedSteps.length > 0) {
      determinedSeverity = 'success';
    }
    
    setSeverity(determinedSeverity);
    
    switch (context) {
      case 'quiz':
        if (score !== undefined) {
          if (score >= 0.9) {
            message = "Excellent work! You've mastered this content.";
            detail = `You scored ${Math.round(score * 100)}%, which shows a strong understanding of the material. ${strengths.length > 0 ? `You showed particular strength in ${strengths.join(', ')}.` : ''}`;
            action = { text: 'Continue to next module', action: 'next_module' };
          } else if (score >= 0.7) {
            message = "Good job! You're on the right track.";
            detail = `Your score of ${Math.round(score * 100)}% indicates good progress. ${areasToImprove.length > 0 ? `Consider reviewing ${areasToImprove.join(', ')} to strengthen your understanding.` : ''}`;
            action = { text: 'Review challenging concepts', action: 'review' };
          } else if (score >= 0.5) {
            message = "You're making progress, but there's room for improvement.";
            detail = `Your score of ${Math.round(score * 100)}% suggests you should review key concepts before moving on. ${areasToImprove.length > 0 ? `Focus especially on ${areasToImprove.join(', ')}.` : ''}`;
            action = { text: 'Review with guided help', action: 'guided_review' };
          } else {
            message = 'You might need to revisit this material.';
            detail = `Your score of ${Math.round(score * 100)}% indicates you should spend more time with these concepts before moving forward. Consider using additional resources or asking for help.`;
            action = { text: 'Get personalized help', action: 'get_help' };
          }
        } else {
          message = 'Quiz completed! Review your results.';
          detail = 'Check your answers and see explanations for any you missed.';
        }
        break;
        
      case 'budget':
        if (skippedSteps && skippedSteps.length > 0) {
          message = 'Your budget is missing some important elements.';
          detail = `Don't forget to include ${skippedSteps.join(', ')} in your budget planning. A complete budget helps you get a realistic picture of your finances.`;
          action = { text: 'Complete missing sections', action: 'complete_missing' };
        } else if (strengths && strengths.length > 0) {
          message = 'Nice job! Your budget looks balanced.';
          detail = `Your budget shows good planning, particularly in ${strengths.join(', ')}. This approach will help you manage your finances effectively.`;
          action = { text: 'See advanced budget options', action: 'advanced_options' };
        } else {
          message = 'Your budget has been saved.';
          detail = 'You can return to edit it anytime or compare it with your actual spending.';
        }
        break;
        
      case 'project':
        if (completedSteps && completedSteps.length > 0) {
          if (skippedSteps && skippedSteps.length > 0) {
            message = 'Your project is coming along nicely, but has a few gaps.';
            detail = `You've made great progress on ${completedSteps.length} parts of your project, but don't forget about ${skippedSteps.join(', ')}. These elements will help make your project more complete.`;
            action = { text: 'Complete missing steps', action: 'finish_steps' };
          } else {
            message = 'Excellent work on your project!';
            detail = "You've completed all the required elements and demonstrated a thorough understanding of the concepts.";
            action = { text: 'Submit final project', action: 'submit_project' };
          }
        } else {
          message = 'Ready to start your project?';
          detail = 'Begin by breaking it down into smaller steps and creating a timeline.';
        }
        break;
        
      case 'assignment':
        if (score !== undefined) {
          if (score >= 0.8) {
            message = 'Great job on this assignment!';
            detail = `You completed the assignment well, showing particular strength in ${strengths.join(', ')}. Your work demonstrates good understanding of the concepts.`;
          } else {
            message = 'Assignment submitted with some areas to review.';
            detail = `While you've completed the assignment, reviewing ${areasToImprove.join(', ')} would strengthen your understanding.`;
            action = { text: 'Review with examples', action: 'review_examples' };
          }
        } else if (completedSteps && completedSteps.length > 0) {
          message = 'Assignment progress saved.';
          detail = `You've completed ${completedSteps.length} parts of this assignment so far. Keep going!`;
        } else {
          message = 'Assignment started.';
          detail = 'Remember to save your progress as you work through each section.';
        }
        break;
        
      default:
        message = 'Feedback on your submission';
        detail = 'Review your work and see suggestions for improvement.';
    }
    
    setFeedbackMessage(message);
    setFeedbackDetail(detail);
    if (action) setSuggestedAction(action);
    
  }, [context, score, completedSteps, skippedSteps, strengths, areasToImprove]);
  
  // Icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Color styles based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  const handleActionClick = () => {
    if (suggestedAction && onAction) {
      onAction(suggestedAction.action);
    }
  };
  
  return (
    <Alert 
      className={cn(
        "mt-4 transition-all duration-300",
        getSeverityStyles(),
        !isOpen && "opacity-90 hover:opacity-100",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          {getIcon()}
          <div className="ml-3">
            <AlertTitle className="text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Feedback
            </AlertTitle>
            <AlertDescription className="text-sm mt-1 text-current">
              {feedbackMessage}
            </AlertDescription>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <CollapsibleTrigger asChild onClick={() => setIsOpen(!isOpen)}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          {onClose && (
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Collapsible open={isOpen} className="mt-2">
        <CollapsibleContent className="text-sm space-y-2">
          <div className="mt-2">{feedbackDetail}</div>
          
          {/* Show strengths if available */}
          {strengths && strengths.length > 0 && (
            <div className="mt-2">
              <div className="font-medium flex items-center text-xs">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                STRENGTHS
              </div>
              <ul className="mt-1 list-disc list-inside text-sm">
                {strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Show areas to improve if available */}
          {areasToImprove && areasToImprove.length > 0 && (
            <div className="mt-2">
              <div className="font-medium flex items-center text-xs">
                <Award className="h-3.5 w-3.5 mr-1" />
                AREAS TO FOCUS ON
              </div>
              <ul className="mt-1 list-disc list-inside text-sm">
                {areasToImprove.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Suggested action button */}
          {suggestedAction && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-current bg-white text-current hover:bg-white/90"
                onClick={handleActionClick}
              >
                {suggestedAction.text}
              </Button>
            </div>
          )}
          
          {/* Placeholder for actual AI integration */}
          {/* <!-- TODO: Use AI to analyze student input --> */}
          {/* <!-- TODO: Generate personalized feedback based on actual work --> */}
        </CollapsibleContent>
      </Collapsible>
    </Alert>
  );
};

export default InstantFeedback;