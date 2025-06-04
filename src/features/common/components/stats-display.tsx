'use client';

import { Eye, Heart, Download, Share2 } from 'lucide-react';

interface StatsDisplayProps {
  views?: number;
  favorites?: number;
  downloads?: number;
  shares?: number;
  className?: string;
  showLabels?: boolean;
}

export function StatsDisplay({ 
  views = 0, 
  favorites = 0, 
  downloads = 0, 
  shares = 0, 
  className = '',
  showLabels = false 
}: StatsDisplayProps) {
  const stats = [
    { icon: Eye, value: views, label: '查看', color: 'text-blue-600' },
    { icon: Heart, value: favorites, label: '收藏', color: 'text-red-600' },
    { icon: Download, value: downloads, label: '下载', color: 'text-green-600' },
    { icon: Share2, value: shares, label: '分享', color: 'text-purple-600' },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {stats.map(({ icon: Icon, value, label, color }) => (
        value > 0 && (
          <div key={label} className="flex items-center gap-1">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-sm text-gray-600">{value}</span>
            {showLabels && (
              <span className="text-xs text-gray-500">{label}</span>
            )}
          </div>
        )
      ))}
    </div>
  );
} 