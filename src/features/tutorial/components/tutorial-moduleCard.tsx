/**
 * 教程模块卡片组件
 * 用于在教程中心页面显示单个教程模块
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Play, ChevronRight } from 'lucide-react';
import type { TutorialModuleType } from '../types';

interface TutorialModuleCardProps {
  /** 教程模块数据 */
  module: TutorialModuleType;
  /** 是否显示进度状态 */
  showProgress?: boolean;
  /** 用户进度状态 */
  progressStatus?: 'not_started' | 'in_progress' | 'completed';
}

/**
 * 教程模块卡片组件
 * 显示教程模块的基本信息，支持点击跳转到详情页
 */
export default function TutorialModuleCard({ 
  module, 
  showProgress = false, 
  progressStatus = 'not_started' 
}: TutorialModuleCardProps) {
  const getProgressColor = () => {
    switch (progressStatus) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  const getProgressText = () => {
    switch (progressStatus) {
      case 'completed': return '已完成';
      case 'in_progress': return '进行中';
      default: return '开始学习';
    }
  };

  return (
    <Link 
      href={`/front/tutorial/modules/${module.id}`}
      className="block"
    >
      <Card className="hover:shadow-md transition-shadow group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {module.title}
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {module.description && (
            <CardDescription className="line-clamp-3 mb-4">
              {module.description}
            </CardDescription>
          )}
          <div className="flex items-center justify-between text-sm">
            {module.estimatedTimeMinutes && (
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{module.estimatedTimeMinutes} 分钟</span>
              </div>
            )}
            <div className={`flex items-center ${getProgressColor()}`}>
              <Play className="h-4 w-4 mr-1" />
              <span>{getProgressText()}</span>
            </div>
          </div>
          {showProgress && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    progressStatus === 'completed' ? 'bg-green-500' :
                    progressStatus === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ 
                    width: progressStatus === 'completed' ? '100%' : 
                           progressStatus === 'in_progress' ? '50%' : '0%' 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
} 