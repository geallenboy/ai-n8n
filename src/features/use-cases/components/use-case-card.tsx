import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContentItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface UseCaseCardProps {
  useCase: ContentItem;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase }) => {
  return (
    <div className="group bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
      {/* Image */}
      {useCase.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={useCase.imageUrl}
            alt={useCase.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <Link 
          href={`/use-cases/${useCase.slug}`}
          className="block group-hover:text-blue-400 transition-colors duration-300"
        >
          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
            {useCase.title}
          </h3>
        </Link>
        
        {/* Summary */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {useCase.summary}
        </p>
        
        {/* Tags */}
        {useCase.tags && useCase.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {useCase.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-blue-900/50 text-blue-300 hover:bg-blue-800/60 text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
            {useCase.tags.length > 3 && (
              <Badge 
                variant="secondary"
                className="bg-gray-700 text-gray-300 text-xs px-2 py-1"
              >
                +{useCase.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        
      </div>
    </div>
  );
};

export default UseCaseCard;
