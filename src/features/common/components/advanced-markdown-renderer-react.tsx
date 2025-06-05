'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// 代码块组件
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
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
        className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono font-medium" 
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-6">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm rounded-t-lg border border-gray-200 dark:border-gray-700">
        <span className="font-medium uppercase text-xs tracking-wide">{language || 'text'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
        style={currentTheme === 'dark' ? oneDark : oneLight}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none !border !border-t-0 !border-gray-200 dark:!border-gray-700"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

// 表格组件
const Table = ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
  <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700">
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
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" {...props}>
    {children}
  </tr>
);

const TableCell = ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100" {...props}>
    {children}
  </td>
);

const TableHeaderCell = ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
  <th 
    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" 
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
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2 decoration-blue-600 dark:decoration-blue-400 hover:decoration-2 transition-all inline-flex items-center gap-1"
      {...props}
    >
      {children}
      {isExternal && <ExternalLink className="h-3 w-3" />}
    </a>
  );
};

// 引用块组件
const Blockquote = ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
  <blockquote 
    className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 pr-4 py-4 my-6 rounded-r-lg" 
    {...props}
  >
    <div className="text-gray-700 dark:text-gray-300 italic">
      {children}
    </div>
  </blockquote>
);

interface AdvancedMarkdownRendererReactProps {
  content: string;
  className?: string;
  showToc?: boolean;
  allowHtml?: boolean;
}

const AdvancedMarkdownRendererReact: React.FC<AdvancedMarkdownRendererReactProps> = ({
  content,
  className = '',
  showToc = false,
  allowHtml = false
}) => {
  if (!content) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic p-8 text-center">
        <div className="text-lg">暂无内容</div>
        <div className="text-sm mt-2">内容将在这里显示</div>
      </div>
    );
  }

  return (
    <div className={cn('markdown-renderer-react', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkFrontmatter]}
        components={{
          // 代码相关
          code: CodeBlock,
          pre: ({ children }) => <div>{children}</div>,
          
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
          
          // 标题 - 完全自定义样式，避免prose冲突
          h1: ({ children, ...props }) => (
            <h1 
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-7 mb-3" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-2" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 
              className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-5 mb-2" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 
              className="text-base font-medium text-gray-900 dark:text-gray-100 mt-4 mb-1" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 
              className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-3 mb-1" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...props}
            >
              {children}
            </h6>
          ),
          
          // 段落
          p: ({ children, node, ...props }) => {
            // 检查子元素是否包含图片
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
            <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>{children}</li>
          ),
          
          // 分隔线
          hr: (props) => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" {...props} />
          ),
          
          // 图片
          img: ({ src, alt, ...props }) => (
            <figure className="my-6 text-center">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto border border-gray-200 dark:border-gray-700"
                {...props}
              />
              {alt && (
                <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          
          // 强调
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </strong>
          ),
          
          // 斜体
          em: ({ children, ...props }) => (
            <em className="italic text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      
      <style jsx global>{`
        .markdown-renderer-react {
          line-height: 1.7;
        }
        
        .markdown-renderer-react h1,
        .markdown-renderer-react h2,
        .markdown-renderer-react h3,
        .markdown-renderer-react h4,
        .markdown-renderer-react h5,
        .markdown-renderer-react h6 {
          text-decoration: none !important;
        }
        
        .markdown-renderer-react h1 a,
        .markdown-renderer-react h2 a,
        .markdown-renderer-react h3 a,
        .markdown-renderer-react h4 a,
        .markdown-renderer-react h5 a,
        .markdown-renderer-react h6 a {
          text-decoration: none !important;
          color: inherit !important;
        }
        
        .markdown-renderer-react h1 a:hover,
        .markdown-renderer-react h2 a:hover,
        .markdown-renderer-react h3 a:hover,
        .markdown-renderer-react h4 a:hover,
        .markdown-renderer-react h5 a:hover,
        .markdown-renderer-react h6 a:hover {
          text-decoration: none !important;
          color: inherit !important;
        }
      `}</style>
    </div>
  );
};

export default AdvancedMarkdownRendererReact; 