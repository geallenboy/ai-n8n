'use client';

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  target?: string; // CSS selector for the content area
  className?: string;
  showPercentage?: boolean;
}

export function ReadingProgress({ 
  target = 'article', 
  className = '',
  showPercentage = false 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target) as HTMLElement;
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = targetElement.scrollHeight;
      
      // Calculate how much of the article is visible
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;
      
      // Calculate progress
      const start = elementTop;
      const end = elementTop + elementHeight - windowHeight;
      const progressValue = Math.min(Math.max((scrollTop - start) / (end - start), 0), 1);
      
      setProgress(Math.round(progressValue * 100));
    };

    // Update progress on scroll
    const handleScroll = () => {
      requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <Progress 
        value={progress} 
        className="h-1 rounded-none bg-transparent"
        style={{
          background: 'transparent',
        }}
      />
      {showPercentage && progress > 0 && (
        <div className="absolute top-2 right-4 text-xs bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          {progress}%
        </div>
      )}
    </div>
  );
}
