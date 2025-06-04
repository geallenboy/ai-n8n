'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseCaseType } from '@/features/use-cases/types';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check,
  Mail 
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface ShareButtonsProps {
  useCase: UseCaseType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function ShareButtons({ useCase, size = 'md', variant = 'outline' }: ShareButtonsProps) {
  const t = useTranslations('useCases.detail');
  const [copied, setCopied] = useState(false);
  
  // Map size to Button component sizes
  const buttonSize = size === 'md' ? 'default' : size;
  
  // Get current URL
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `https://yoursite.com/use-cases/${useCase.id}`;
  
  const shareText = `Check out this awesome use case: ${useCase.title}`;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(useCase.title)}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success(t('linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('copyFailed'));
    }
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: useCase.title,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{t('share')}:</span>
      
      {/* Native Share (if supported) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button 
          variant={variant} 
          size={buttonSize} 
          onClick={handleNativeShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {size !== 'sm' && t('share')}
        </Button>
      )}

      {/* Custom Share Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={variant} size={buttonSize}>
            <Share2 className="h-4 w-4" />
            {size !== 'sm' && !navigator.share && t('share')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">{t('shareThisCase')}</h4>
            
            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 justify-start"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 justify-start"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 justify-start"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('email')}
                className="flex items-center gap-2 justify-start"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                Email
              </Button>
            </div>
            
            {/* Copy Link */}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 justify-center"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    {t('copied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t('copyLink')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
