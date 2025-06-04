'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavorite } from '@/features/interactions';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  resourceType: 'use_case' | 'blog';
  resourceId: string;
  userId?: string;
  initialIsFavorited?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FavoriteButton({
  resourceType,
  resourceId,
  userId,
  initialIsFavorited = false,
  className = '',
  variant = 'outline',
  size = 'sm'
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.error('请先登录');
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavorite(resourceType, resourceId, userId);
      if (result.success && typeof result.isFavorited === 'boolean') {
        setIsFavorited(result.isFavorited);
        toast.success(result.isFavorited ? '已添加到收藏' : '已取消收藏');
      } else {
        toast.error(result.error || '操作失败');
      }
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading || !userId}
      className={`${className} ${isFavorited ? 'text-red-600 border-red-600' : ''}`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
      {size !== 'icon' && (
        <span className="ml-1">
          {isFavorited ? '已收藏' : '收藏'}
        </span>
      )}
    </Button>
  );
} 