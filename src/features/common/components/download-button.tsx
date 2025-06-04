'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { recordDownload } from '@/features/interactions';
import { toast } from 'sonner';

interface DownloadButtonProps {
  useCaseId: string;
  downloadType: 'json' | 'workflow';
  userId?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function DownloadButton({
  useCaseId,
  downloadType,
  userId,
  className = '',
  variant = 'default',
  size = 'default',
  children
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    
    try {
      // 记录下载行为
      await recordDownload(useCaseId, downloadType, userId);
      
      // 这里可以添加实际的下载逻辑
      // 例如：下载工作流文件
      toast.success('下载已开始');
    } catch (error) {
      toast.error('下载失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {children || '下载工作流'}
    </Button>
  );
} 