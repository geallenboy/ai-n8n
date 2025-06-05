'use client';

import React, { useState, useEffect } from 'react';
import { 
  MDXEditor, 
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  frontmatterPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

// CodeMirror 语言支持
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface AdvancedMarkdownRendererProps {
  content: string;
  className?: string;
  showToc?: boolean;
  allowHtml?: boolean;
}

const AdvancedMarkdownRenderer: React.FC<AdvancedMarkdownRendererProps> = ({
  content,
  className = '',
  showToc = false,
  allowHtml = false
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!content) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic p-4 text-center">
        暂无内容
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="animate-pulse p-4">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('markdown-renderer-container', className)}>
      <MDXEditor
        markdown={content}
        readOnly={true}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          imagePlugin({
            imageAutocompleteSuggestions: [],
            imageUploadHandler: undefined,
            imagePreviewHandler: (imageSource) => Promise.resolve(imageSource)
          }),
          tablePlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'text'
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              'javascript': 'JavaScript',
              'js': 'JavaScript', 
              'typescript': 'TypeScript',
              'ts': 'TypeScript',
              'tsx': 'TypeScript React',
              'jsx': 'JavaScript React',
              'css': 'CSS',
              'html': 'HTML',
              'json': 'JSON',
              'markdown': 'Markdown',
              'md': 'Markdown',
              'bash': 'Bash',
              'sh': 'Shell',
              'python': 'Python',
              'py': 'Python',
              'sql': 'SQL',
              'yaml': 'YAML',
              'yml': 'YAML',
              'xml': 'XML',
              'text': 'Plain Text',
              '': 'Plain Text'
            },
            codeMirrorExtensions: [
              javascript(),
              css(),
              html(),
              json(),
              markdown(),
              python(),
              sql(),
              xml(),
              yaml()
            ]
          })
        ]}
        contentEditableClassName="prose prose-lg dark:prose-invert max-w-none p-6 focus:outline-none"
      />

      <style jsx global>{`
        .markdown-renderer-container .mdxeditor {
          background: transparent !important;
          border: none !important;
        }
        
        .markdown-renderer-container .mdxeditor-toolbar {
          display: none !important;
        }
        
        .markdown-renderer-container .mdxeditor-rich-text-editor {
          background: white !important;
          color: rgb(17 24 39) !important;
          border: none !important;
          padding: 0 !important;
        }
        
        .dark .markdown-renderer-container .mdxeditor-rich-text-editor {
          background: transparent !important;
          color: rgb(243 244 246) !important;
        }
        
        .markdown-renderer-container .mdxeditor-rich-text-editor:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* 标题样式优化 */
        .markdown-renderer-container h1 {
          font-size: 2.25rem !important;
          font-weight: 700 !important;
          color: rgb(17 24 39) !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          padding-bottom: 0.5rem !important;
          border-bottom: 2px solid rgb(229 231 235) !important;
          text-decoration: none !important;
        }
        
        .dark .markdown-renderer-container h1 {
          color: rgb(243 244 246) !important;
          border-bottom-color: rgb(75 85 99) !important;
        }
        
        .markdown-renderer-container h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          color: rgb(17 24 39) !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
          text-decoration: none !important;
        }
        
        .dark .markdown-renderer-container h2 {
          color: rgb(243 244 246) !important;
        }
        
        .markdown-renderer-container h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: rgb(17 24 39) !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.5rem !important;
          text-decoration: none !important;
        }
        
        .dark .markdown-renderer-container h3 {
          color: rgb(243 244 246) !important;
        }
        
        .markdown-renderer-container h4 {
          font-size: 1.25rem !important;
          font-weight: 500 !important;
          color: rgb(17 24 39) !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          text-decoration: none !important;
        }
        
        .dark .markdown-renderer-container h4 {
          color: rgb(243 244 246) !important;
        }
        
        .markdown-renderer-container h5,
        .markdown-renderer-container h6 {
          font-size: 1.125rem !important;
          font-weight: 500 !important;
          color: rgb(17 24 39) !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
          text-decoration: none !important;
        }
        
        .dark .markdown-renderer-container h5,
        .dark .markdown-renderer-container h6 {
          color: rgb(243 244 246) !important;
        }
        
        /* 移除所有标题的默认链接样式 */
        .markdown-renderer-container h1 a,
        .markdown-renderer-container h2 a,
        .markdown-renderer-container h3 a,
        .markdown-renderer-container h4 a,
        .markdown-renderer-container h5 a,
        .markdown-renderer-container h6 a {
          color: inherit !important;
          text-decoration: none !important;
          border: none !important;
          background: none !important;
        }
        
        .markdown-renderer-container h1 a:hover,
        .markdown-renderer-container h2 a:hover,
        .markdown-renderer-container h3 a:hover,
        .markdown-renderer-container h4 a:hover,
        .markdown-renderer-container h5 a:hover,
        .markdown-renderer-container h6 a:hover {
          color: inherit !important;
          text-decoration: none !important;
        }
        
        /* 段落样式 */
        .markdown-renderer-container p {
          color: rgb(75 85 99) !important;
          line-height: 1.75 !important;
          margin-bottom: 1rem !important;
        }
        
        .dark .markdown-renderer-container p {
          color: rgb(209 213 219) !important;
        }
        
        /* 链接样式 */
        .markdown-renderer-container a {
          color: rgb(59 130 246) !important;
          text-decoration: underline !important;
          text-decoration-color: rgb(59 130 246) !important;
          text-underline-offset: 2px !important;
          transition: all 0.2s ease !important;
        }
        
        .markdown-renderer-container a:hover {
          color: rgb(37 99 235) !important;
          text-decoration-color: rgb(37 99 235) !important;
        }
        
        .dark .markdown-renderer-container a {
          color: rgb(96 165 250) !important;
          text-decoration-color: rgb(96 165 250) !important;
        }
        
        .dark .markdown-renderer-container a:hover {
          color: rgb(147 197 253) !important;
          text-decoration-color: rgb(147 197 253) !important;
        }
        
        /* 列表样式 */
        .markdown-renderer-container ul,
        .markdown-renderer-container ol {
          color: rgb(75 85 99) !important;
          margin-bottom: 1rem !important;
        }
        
        .dark .markdown-renderer-container ul,
        .dark .markdown-renderer-container ol {
          color: rgb(209 213 219) !important;
        }
        
        /* 引用块样式 */
        .markdown-renderer-container blockquote {
          border-left: 4px solid rgb(59 130 246) !important;
          background-color: rgb(239 246 255) !important;
          padding: 1rem !important;
          margin: 1.5rem 0 !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
        }
        
        .dark .markdown-renderer-container blockquote {
          background-color: rgb(30 58 138, 0.2) !important;
          border-left-color: rgb(96 165 250) !important;
        }
        
        .markdown-renderer-container blockquote p {
          color: rgb(55 65 81) !important;
          font-style: italic !important;
          margin-bottom: 0 !important;
        }
        
        .dark .markdown-renderer-container blockquote p {
          color: rgb(229 231 235) !important;
        }
        
        /* 代码块样式 */
        .markdown-renderer-container code {
          background-color: rgb(243 244 246) !important;
          color: rgb(220 38 127) !important;
          padding: 0.125rem 0.375rem !important;
          border-radius: 0.25rem !important;
          font-size: 0.875rem !important;
        }
        
        .dark .markdown-renderer-container code {
          background-color: rgb(55 65 81) !important;
          color: rgb(251 113 133) !important;
        }
        
        .markdown-renderer-container pre {
          background-color: rgb(17 24 39) !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
          margin: 1.5rem 0 !important;
          overflow-x: auto !important;
        }
        
        .markdown-renderer-container pre code {
          background: none !important;
          color: rgb(243 244 246) !important;
          padding: 0 !important;
        }
        
        /* 表格样式 */
        .markdown-renderer-container table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1.5rem 0 !important;
          border: 1px solid rgb(229 231 235) !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }
        
        .dark .markdown-renderer-container table {
          border-color: rgb(75 85 99) !important;
        }
        
        .markdown-renderer-container th,
        .markdown-renderer-container td {
          padding: 0.75rem !important;
          text-align: left !important;
          border-bottom: 1px solid rgb(229 231 235) !important;
        }
        
        .dark .markdown-renderer-container th,
        .dark .markdown-renderer-container td {
          border-bottom-color: rgb(75 85 99) !important;
        }
        
        .markdown-renderer-container th {
          background-color: rgb(249 250 251) !important;
          font-weight: 600 !important;
          color: rgb(17 24 39) !important;
        }
        
        .dark .markdown-renderer-container th {
          background-color: rgb(55 65 81) !important;
          color: rgb(243 244 246) !important;
        }
        
        .markdown-renderer-container td {
          color: rgb(75 85 99) !important;
        }
        
        .dark .markdown-renderer-container td {
          color: rgb(209 213 219) !important;
        }
        
        /* 图片样式 */
        .markdown-renderer-container img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1.5rem auto !important;
          display: block !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* 分隔线样式 */
        .markdown-renderer-container hr {
          border: none !important;
          height: 2px !important;
          background-color: rgb(229 231 235) !important;
          margin: 2rem 0 !important;
          border-radius: 1px !important;
        }
        
        .dark .markdown-renderer-container hr {
          background-color: rgb(75 85 99) !important;
        }
        
        /* CodeMirror编辑器样式（代码块） */
        .markdown-renderer-container .cm-editor {
          background: rgb(17 24 39) !important;
          color: rgb(243 244 246) !important;
          border-radius: 0.5rem !important;
        }
        
        .markdown-renderer-container .cm-focused {
          outline: none !important;
        }
        
        .markdown-renderer-container .cm-editor.cm-readonly .cm-cursor {
          display: none !important;
        }
        
        .markdown-renderer-container .cm-editor.cm-readonly:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
};

export default AdvancedMarkdownRenderer; 