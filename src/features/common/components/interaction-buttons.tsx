'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Copy,
  MessageCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface InteractionButtonsProps {
  resourceType: 'tutorial' | 'use_case' | 'blog';
  resourceId: string;
  title: string;
  url?: string;
  className?: string;
  onStatsUpdate?: () => void;
}

export default function InteractionButtons({
  resourceType,
  resourceId,
  title,
  url,
  className = '',
  onStatsUpdate
}: InteractionButtonsProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 获取初始状态
  useEffect(() => {
    fetchInteractionStats();
  }, [resourceType, resourceId, user]);

  const fetchInteractionStats = async () => {
    try {
      // 获取点赞信息
      const likeResponse = await fetch(
        `/api/likes?resourceType=${resourceType}&resourceId=${resourceId}&userId=${user?.id || ''}`
      );
      if (likeResponse.ok) {
        const likeData = await likeResponse.json();
        setLikeCount(likeData.count);
        setIsLiked(likeData.isLiked);
      }

      // 获取收藏信息
      const favoriteResponse = await fetch(
        `/api/favorites?resourceType=${resourceType}&resourceId=${resourceId}&userId=${user?.id || ''}`
      );
      if (favoriteResponse.ok) {
        const favoriteData = await favoriteResponse.json();
        setFavoriteCount(favoriteData.count);
        setIsFavorited(favoriteData.isFavorited);
      }
    } catch (error) {
      console.error('获取交互统计失败:', error);
    }
  };

  // 获取资源类型的中文名称
  const getResourceTypeName = () => {
    switch (resourceType) {
      case 'tutorial': return '教程';
      case 'use_case': return '案例';
      case 'blog': return '博客';
      default: return '内容';
    }
  };

  // 处理需要登录的操作
  const handleLoginRequired = (action: string, description: string) => {
    toast.error('请先登录', { 
      description,
      action: {
        label: '立即登录',
        onClick: () => router.push('/sign-in')
      }
    });
  };

  const handleLike = async () => {
    if (!user) {
      handleLoginRequired('点赞', `登录后即可点赞此${getResourceTypeName()}，方便日后快速找到`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsLiked(result.action === 'liked');
        setLikeCount(prev => result.action === 'liked' ? prev + 1 : prev - 1);
        toast.success(result.message);
        // 调用父组件的更新回调
        if (onStatsUpdate) {
          onStatsUpdate();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast.error('操作失败', { description: '请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      handleLoginRequired('收藏', `登录后即可收藏此${getResourceTypeName()}，建立个人学习库`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsFavorited(result.action === 'favorited');
        setFavoriteCount(prev => result.action === 'favorited' ? prev + 1 : prev - 1);
        toast.success(result.message);
        // 调用父组件的更新回调
        if (onStatsUpdate) {
          onStatsUpdate();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast.error('操作失败', { description: '请稍后重试' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      // 记录分享行为
      await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId, platform }),
      });

      const shareUrl = url || window.location.href;
      const shareText = `分享一个不错的${resourceType === 'tutorial' ? '教程' : resourceType === 'use_case' ? '案例' : '博客'}：${title}`;

      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
          break;
        case 'wechat':
          // 微信分享通常需要特殊处理，这里简单复制链接
          navigator.clipboard.writeText(shareUrl);
          toast.success('链接已复制', { description: '请在微信中粘贴分享' });
          break;
        case 'copy_link':
          navigator.clipboard.writeText(shareUrl);
          toast.success('链接已复制');
          break;
      }
    } catch (error) {
      console.error('分享失败:', error);
      toast.error('分享失败', { description: '请稍后重试' });
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* 点赞按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center space-x-1 transition-colors ${
          isLiked 
            ? 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-800' 
            : !user 
            ? 'text-muted-foreground border-muted-foreground/30 hover:text-red-500 hover:border-red-200'
            : 'hover:text-red-500 hover:border-red-200'
        }`}
        title={!user ? '登录后即可点赞' : ''}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        {!user && <Lock className="w-3 h-3 ml-1 opacity-50" />}
       
      </Button>

      {/* 收藏按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFavorite}
        disabled={isLoading}
        className={`flex items-center space-x-1 transition-colors ${
          isFavorited 
            ? 'text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800' 
            : !user 
            ? 'text-muted-foreground border-muted-foreground/30 hover:text-blue-500 hover:border-blue-200'
            : 'hover:text-blue-500 hover:border-blue-200'
        }`}
        title={!user ? '登录后即可收藏' : ''}
      >
        <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        {!user && <Lock className="w-3 h-3 ml-1 opacity-50" />}
       
      </Button>

      {/* 分享按钮 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 hover:text-green-500 hover:border-green-200"
          >
            <Share2 className="w-4 h-4" />
            <span>分享</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare('twitter')}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('linkedin')}>
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('facebook')}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('wechat')}>
            <MessageCircle className="w-4 h-4 mr-2" />
            微信
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare('copy_link')}>
            <Copy className="w-4 h-4 mr-2" />
            复制链接
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 