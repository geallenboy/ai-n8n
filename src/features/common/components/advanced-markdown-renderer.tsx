'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 代码块组件
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const copyToClipboard = async () => {
    const code = String(children).replace(/\n$/, '');
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code 
        className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" 
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
        <span className="font-medium">{language || 'text'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              复制
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

// 表格组件
const Table = ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
  <div className="overflow-x-auto my-6">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
      {children}
    </table>
  </div>
);

const TableHead = ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, ...props }: React.HTMLProps<HTMLTableRowElement>) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800" {...props}>
    {children}
  </tr>
);

const TableCell = ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
    {children}
  </td>
);

const TableHeaderCell = ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <th 
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" 
    {...props}
  >
    {children}
  </th>
);

// 链接组件
const LinkComponent = ({ href, children, ...props }: React.HTMLProps<HTMLAnchorElement>) => {
  const isExternal = href?.startsWith('http');
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors inline-flex items-center gap-1"
      {...props}
    >
      {children}
      {isExternal && <ExternalLink className="h-3 w-3" />}
    </a>
  );
};

// 引用块组件
const Blockquote = ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
  <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300" {...props}>
    {children}
  </blockquote>
);

// 警告框组件
const Alert = ({ type, children }: { type: 'info' | 'warning' | 'success' | 'error'; children: React.ReactNode }) => {
  const alertClasses = {
    info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-lg ${alertClasses[type]}`}>
      {children}
    </div>
  );
};

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
  if (!content) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic p-4 text-center">
        暂无内容
      </div>
    );
  }

  return (
    <div className={cn('markdown-renderer prose prose-lg prose-gray dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]}
        components={{
          // 代码相关
          code: CodeBlock,
          pre: ({ children }) => <div className="my-4">{children}</div>,
          
          // 表格相关
          table: Table,
          thead: TableHead,
          tbody: TableBody,
          tr: TableRow,
          td: TableCell,
          th: TableHeaderCell,
          
          // 链接
          a: LinkComponent,
          
          // 引用
          blockquote: Blockquote,
          
          // 标题
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-base font-medium text-gray-900 dark:text-gray-100 mt-3 mb-1" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-2 mb-1" {...props}>
              {children}
            </h6>
          ),
          
          // 段落 - 简化处理避免嵌套冲突
          p: ({ children, node, ...props }) => {
            // 检查子元素是否包含图片，如果包含则使用div替代p
            const hasImg = node?.children?.some((child: any) => child.tagName === 'img');
            if (hasImg) {
              return (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>
                  {children}
                </div>
              );
            }
            return (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>
                {children}
              </p>
            );
          },
          
          // 列表
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="ml-4" {...props}>{children}</li>
          ),
          
          // 分隔线
          hr: (props) => (
            <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
          ),
          
          // 图片 - 使用figure元素确保正确的HTML结构
          img: ({ src, alt, ...props }) => (
            <figure className="my-6 text-center">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                {...props}
              />
              {alt && (
                <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AdvancedMarkdownRenderer; 