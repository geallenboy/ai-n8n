'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Image from 'next/image';

interface RichTextRendererProps {
  content: string;
}

const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!match) {
    return (
      <code 
        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" 
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="rounded-lg"
        customStyle={{
          margin: 0,
          background: 'hsl(var(--muted))',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

const components = {
  code: CodeBlock,
  h1: ({ children }: any) => (
    <h1 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 id={children?.toString().toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
      {children}
    </h3>
  ),
  // Custom component for n8n workflow previews
  pre: ({ children }: any) => {
    // Check if it's n8n workflow JSON
    const content = children?.props?.children;
    if (typeof content === 'string' && content.includes('"nodes"') && content.includes('"connections"')) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 my-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">n8n</span>
            </div>
            <h4 className="font-semibold">n8n Workflow JSON</h4>
          </div>
          <div className="relative">
            {children}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Copy this JSON and import it directly into your n8n instance.
          </p>
        </div>
      );
    }
    return <pre>{children}</pre>;
  },
  // Enhanced blockquote for tips and warnings
  blockquote: ({ children }: any) => {
    const content = children?.props?.children;
    if (typeof content === 'string') {
      if (content.startsWith('💡')) {
        return (
          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 my-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="prose prose-sm dark:prose-invert">
                {content.replace('💡', '').trim()}
              </div>
            </div>
          </div>
        );
      }
      if (content.startsWith('⚠️')) {
        return (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 p-4 my-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="prose prose-sm dark:prose-invert">
                {content.replace('⚠️', '').trim()}
              </div>
            </div>
          </div>
        );
      }
      if (content.startsWith('🚨')) {
        return (
          <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 my-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">🚨</span>
              <div className="prose prose-sm dark:prose-invert">
                {content.replace('🚨', '').trim()}
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <blockquote className="border-l-4 border-muted-foreground/20 pl-6 italic">
        {children}
      </blockquote>
    );
  },
  // Enhanced links
  a: ({ href, children }: any) => (
    <a 
      href={href} 
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      {children}
    </a>
  ),
  // Enhanced images
  img: ({ src, alt }: any) => (
    <div className="my-8">
      <div className="relative w-full h-64">
        <Image 
          src={src || '/placeholder.jpg'} 
          alt={alt || 'Image'}
          fill
          className="rounded-lg shadow-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
      {alt && (
        <p className="text-center text-sm text-muted-foreground mt-2">{alt}</p>
      )}
    </div>
  ),
};

export function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
