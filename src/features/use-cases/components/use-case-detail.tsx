'use client';

import React from 'react';
import Image from 'next/image';
import { UseCaseType } from '@/features/use-cases/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShareButtons } from './share-buttons';
import { ReadingProgress } from './reading-progress';
import {
  User,
  Calendar,
  Eye,
  Star,
  Download
} from 'lucide-react';

interface UseCaseDetailProps {
  useCase: UseCaseType;
}

export function UseCaseDetail({ useCase }: UseCaseDetailProps) {
  return (
    <article className="max-w-none">
      <ReadingProgress />
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {useCase.category && <Badge variant="secondary">{useCase.category}</Badge>}
          {useCase.isPublished && <Badge variant="default">Published</Badge>}
        </div>
        
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          {useCase.title}
        </h1>
        
        {useCase.summary && (
          <p className="text-xl text-muted-foreground mb-6">
            {useCase.summary}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
          {useCase.n8nAuthor && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {useCase.n8nAuthor}</span>
            </div>
          )}
          {useCase.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Published {new Date(useCase.publishedAt).toLocaleDateString()}</span>
            </div>
          )}
          {useCase.stats && (
            <>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{useCase.stats.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{useCase.stats.favorites} favorites</span>
              </div>
            </>
          )}
        </div>

        {/* Share Buttons */}
        <ShareButtons useCase={useCase} />
      </header>

      {/* Cover Image */}
      {useCase.coverImageUrl && (
        <div className="mb-8 relative w-full h-64 lg:h-96">
          <Image
            src={useCase.coverImageUrl}
            alt={useCase.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}

      {/* Main Content */}
      {useCase.readme && (
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: useCase.readme }} />
        </div>
      )}

      {/* Workflow Interpretation */}
      {useCase.workflowInterpretation && (
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Workflow Interpretation</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: useCase.workflowInterpretation }} />
          </div>
        </div>
      )}

      {/* Workflow Tutorial */}
      {useCase.workflowTutorial && (
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Workflow Tutorial</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: useCase.workflowTutorial }} />
          </div>
        </div>
      )}

      {/* n8n Workflow Download */}
      {useCase.workflowJson && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Download Workflow</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get the complete n8n workflow JSON file to import directly into your n8n instance.
          </p>
          <div className="flex gap-3">
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Workflow
            </Button>
            {useCase.originalUrl && (
              <Button variant="outline" asChild>
                <a href={useCase.originalUrl} target="_blank" rel="noopener noreferrer">
                  View Original
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  );
} 