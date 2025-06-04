import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  currentPath: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 