'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UseCaseType } from '@/features/use-cases/types';
import { Calendar, User, Eye, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface UseCaseCardProps {
  useCase: UseCaseType;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase }) => {
  return (
    <Card className="group h-full bg-gray-900 border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {useCase.coverImageUrl ? (
            <Image
              src={useCase.coverImageUrl}
              alt={useCase.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-lg font-semibold">案例封面</div>
            </div>
          )}
          
          {/* Published Status Badge */}
          {useCase.isPublished && (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white">
              已发布
            </Badge>
          )}
          
          {/* Stats Badge */}
          {useCase.stats && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded text-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{useCase.stats.favorites}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Category */}
          {useCase.category && (
            <div className="text-blue-400 text-sm font-medium mb-2">
              {useCase.category}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {useCase.title}
          </h3>

          {/* Summary */}
          {useCase.summary && (
            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
              {useCase.summary}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-4">
              {useCase.stats && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{useCase.stats.views.toLocaleString()}</span>
                </div>
              )}
              {useCase.stats && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{useCase.stats.favorites}</span>
                </div>
              )}
            </div>
            {useCase.publishedAt && (
              <div className="text-gray-600">
                {new Date(useCase.publishedAt).toLocaleDateString('zh-CN')}
              </div>
            )}
          </div>

          {/* Author */}
          {useCase.n8nAuthor && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                <User className="w-3 h-3" />
              </div>
              <span className="text-gray-400 text-sm">{useCase.n8nAuthor}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Link
          href={`/use-cases/${useCase.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 group"
        >
          查看详情
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UseCaseCard; 