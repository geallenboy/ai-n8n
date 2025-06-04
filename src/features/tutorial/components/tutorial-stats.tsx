/**
 * 教程统计信息组件
 * 显示教程中心的统计数据
 */

import type { TutorialStatsType } from '../types';

interface TutorialStatsProps {
  /** 统计数据 */
  stats: TutorialStatsType;
  /** 总学时（分钟） */
  totalTimeMinutes: number;
  /** 是否加载中 */
  loading?: boolean;
}

/**
 * 教程统计信息组件
 * 显示版块数、课程数、总学时、学习人数等统计信息
 */
export default function TutorialStats({ 
  stats, 
  totalTimeMinutes, 
  loading = false 
}: TutorialStatsProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalSections}</div>
          <div className="text-sm text-gray-600">教程版块</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalModules}</div>
          <div className="text-sm text-gray-600">教程课程</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(totalTimeMinutes / 60)}h
          </div>
          <div className="text-sm text-gray-600">总学时</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.totalProgress}+</div>
          <div className="text-sm text-gray-600">学习人数</div>
        </div>
      </div>
    </div>
  );
} 