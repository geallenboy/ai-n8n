'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { recordShare } from '@/features/interactions';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';

interface ShareButtonProps {
  resourceType: 'use_case' | 'blog';
  resourceId: string;
  title: string;
  url: string;
  userId?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({
  resourceType,
  resourceId,
  title,
  url,
  userId,
  className = '',
  variant = 'outline',
  size = 'sm'
}: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('common.share');
  const locale = useLocale();

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'facebook' | 'wechat' | 'weibo' | 'copy_link') => {
    setIsLoading(true);
    
    try {
      // 记录分享行为
      await recordShare(resourceType, resourceId, platform, userId);

      const encodedTitle = encodeURIComponent(title);
      const encodedUrl = encodeURIComponent(url);

      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
          break;
        case 'wechat':
          // 微信分享通常需要特殊处理，这里先复制链接
          await navigator.clipboard.writeText(url);
          toast.success(t('wechatCopySuccess'));
          break;
        case 'weibo':
          window.open(`https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`, '_blank');
          break;
        case 'copy_link':
          await navigator.clipboard.writeText(url);
          toast.success(t('linkCopied'));
          break;
      }
    } catch (error) {
      toast.error(t('shareError'));
    } finally {
      setIsLoading(false);
    }
  };

  const shareOptions = [
    { key: 'twitter' as const, label: 'Twitter', icon: Twitter },
    { key: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin },
    { key: 'facebook' as const, label: 'Facebook', icon: Facebook },
    { key: 'wechat' as const, label: t('wechat'), icon: MessageCircle },
    { key: 'weibo' as const, label: t('weibo'), icon: Share2 },
    { key: 'copy_link' as const, label: t('copyLink'), icon: Copy },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoading}
          className={className}
        >
          <Share2 className="h-4 w-4" />
          {size !== 'icon' && <span className="ml-1">{t('share')}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareOptions.map(({ key, label, icon: Icon }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleShare(key)}
            className="cursor-pointer"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 