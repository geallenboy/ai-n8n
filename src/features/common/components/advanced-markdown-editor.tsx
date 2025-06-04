'use client';

import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { 
  MDXEditor, 
  type MDXEditorMethods,
  BoldItalicUnderlineToggles,
  UndoRedo,
  Separator,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  InsertCodeBlock,
  toolbarPlugin,
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, FileDown, FileUp } from 'lucide-react';
import { useState } from 'react';

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: number;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}

export interface AdvancedMarkdownEditorRef {
  getMarkdown: () => string;
  setMarkdown: (value: string) => void;
  focus: () => void;
}

const AdvancedMarkdownEditor = forwardRef<AdvancedMarkdownEditorRef, AdvancedMarkdownEditorProps>(
  ({
    value,
    onChange,
    label,
    placeholder = '开始编写...',
    height = 600,
    className = '',
    required = false,
    readOnly = false
  }, ref) => {
    const editorRef = useRef<MDXEditorMethods>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // 创建一个简单的hash函数用于生成稳定的key
    const hashString = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString();
    };

    // 清理和验证markdown内容
    const sanitizeMarkdown = (content: string): string => {
      if (!content) return '';
      
      // 移除可能导致解析问题的字符
      let cleaned = content
        .replace(/\r\n/g, '\n') // 统一换行符
        .replace(/\r/g, '\n')   // 统一换行符
        .replace(/\u0000/g, '') // 移除null字符
        .replace(/\ufffd/g, '') // 移除替换字符
        .trim();

      // 确保代码块格式正确
      cleaned = cleaned.replace(/```(\w*)\n/g, (match, lang) => {
        // 如果语言标识包含无效字符，清理它
        const cleanLang = lang ? lang.replace(/[^a-zA-Z0-9\-_]/g, '') : '';
        return '```' + cleanLang + '\n';
      });

      return cleaned;
    };

    // 当value变化时，强制更新编辑器内容
    useEffect(() => {
      if (editorRef.current && value !== undefined && isInitialized) {
        try {
          const currentMarkdown = editorRef.current.getMarkdown();
          const sanitizedValue = sanitizeMarkdown(value);
          
          if (currentMarkdown !== sanitizedValue) {
            editorRef.current.setMarkdown(sanitizedValue);
          }
          setError(null);
        } catch (err) {
          console.error('Error updating markdown:', err);
          setError('更新内容时出错：' + (err instanceof Error ? err.message : '未知错误'));
        }
      }
    }, [value, isInitialized]);

    useImperativeHandle(ref, () => ({
      getMarkdown: () => {
        try {
          return editorRef.current?.getMarkdown() || '';
        } catch (err) {
          console.error('Error getting markdown:', err);
          return '';
        }
      },
      setMarkdown: (value: string) => {
        try {
          const sanitizedValue = sanitizeMarkdown(value);
          editorRef.current?.setMarkdown(sanitizedValue);
          setError(null);
        } catch (err) {
          console.error('Error setting markdown:', err);
          setError('设置markdown内容时出错：' + (err instanceof Error ? err.message : '未知错误'));
        }
      },
      focus: () => {
        try {
          editorRef.current?.focus();
        } catch (err) {
          console.error('Error focusing editor:', err);
        }
      },
    }));

    const toggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    const exportMarkdown = () => {
      try {
        const markdown = editorRef.current?.getMarkdown() || '';
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error exporting markdown:', err);
        setError('导出失败：' + (err instanceof Error ? err.message : '未知错误'));
      }
    };

    const importMarkdown = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.markdown,.txt';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const content = e.target?.result as string;
              const sanitizedContent = sanitizeMarkdown(content);
              onChange(sanitizedContent);
              if (editorRef.current) {
                editorRef.current.setMarkdown(sanitizedContent);
              }
              setError(null);
            } catch (err) {
              console.error('Error importing markdown:', err);
              setError('导入的文件包含无效的markdown格式：' + (err instanceof Error ? err.message : '未知错误'));
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    const handleChange = (newValue: string) => {
      try {
        const sanitizedValue = sanitizeMarkdown(newValue);
        onChange(sanitizedValue);
        setError(null);
      } catch (err) {
        console.error('Error changing markdown:', err);
        setError('内容包含无效的markdown格式：' + (err instanceof Error ? err.message : '未知错误'));
      }
    };

    const handleEditorError = (error: any) => {
      console.error('MDXEditor error:', error);
      
      // 详细记录错误信息
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          type: typeof error,
          ...(error.cause && { cause: error.cause })
        });
      }
      
      // 检查是否是markdown解析错误
      if (error && error.message && error.message.includes('markdown structure failed')) {
        setError(`Markdown解析错误: 检测到无效的代码块结构。请尝试在源代码模式下修复格式问题。`);
      } else {
        setError('编辑器错误：' + (error instanceof Error ? error.message : '未知错误'));
      }
    };

    // 添加更严格的markdown验证
    const validateMarkdown = (content: string): { isValid: boolean; error?: string } => {
      if (!content) return { isValid: true };
      
      try {
        // 检查代码块是否正确闭合
        const codeBlocks = content.match(/```/g);
        if (codeBlocks && codeBlocks.length % 2 !== 0) {
          return { isValid: false, error: '代码块未正确闭合' };
        }
        
        // 检查是否有无效字符
        if (content.includes('\u0000') || content.includes('\ufffd')) {
          return { isValid: false, error: '包含无效字符' };
        }
        
        return { isValid: true };
      } catch (err) {
        return { isValid: false, error: '内容验证失败' };
      }
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={importMarkdown}
                className="h-7 px-2 text-xs"
              >
                <FileUp className="h-3 w-3 mr-1" />
                导入
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={exportMarkdown}
                className="h-7 px-2 text-xs"
              >
                <FileDown className="h-3 w-3 mr-1" />
                导出
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="h-7 px-2"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <strong>错误:</strong> {error}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="h-auto p-0 text-red-700 hover:text-red-900 flex-shrink-0"
              >
                关闭
              </Button>
            </div>
            <div className="mt-2 text-xs text-red-600">
              提示：可以尝试切换到源代码模式修复错误，然后切换回富文本模式。
            </div>
          </div>
        )}
        
        <div 
          className={`border rounded-lg overflow-hidden transition-all duration-200 ${
            isFullscreen 
              ? 'fixed inset-4 z-50 bg-white shadow-2xl' 
              : 'relative'
          }`}
          style={{ 
            height: isFullscreen ? 'calc(100vh - 2rem)' : height 
          }}
        >
          <div className="h-full overflow-auto">
            <MDXEditor
              key={`mdx-editor-${hashString(value || '')}-${isInitialized ? 'init' : 'not-init'}`}
              ref={(instance) => {
                if (instance && !isInitialized) {
                  setIsInitialized(true);
                  console.log('MDXEditor initialized successfully');
                }
                // @ts-ignore
                editorRef.current = instance;
              }}
              markdown={sanitizeMarkdown(value || '')}
              onChange={(newValue) => {
                console.log('MDXEditor onChange called with:', newValue?.substring(0, 100) + '...');
                
                // 在更改前验证内容
                const validation = validateMarkdown(newValue);
                if (!validation.isValid) {
                  console.warn('Markdown validation failed:', validation.error);
                  setError(`内容验证失败: ${validation.error}`);
                  return;
                }
                
                handleChange(newValue);
              }}
              placeholder={placeholder}
              readOnly={readOnly}
              contentEditableClassName="prose prose-lg dark:prose-invert max-w-none p-4 min-h-full"
              suppressHtmlProcessing={true}
              onError={handleEditorError}
              plugins={[
                // 工具栏插件
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />
                      <BlockTypeSelect />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />
                      <InsertCodeBlock />
                      <ConditionalContents
                        options={[
                          {
                            when: (editor) => editor?.editorType === 'codeblock',
                            contents: () => <ChangeCodeMirrorLanguage />
                          }
                        ]}
                      />
                    </>
                  )
                }),
                // 核心功能插件 - 简化配置减少错误
                listsPlugin(),
                quotePlugin(),
                headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                  imageAutocompleteSuggestions: []
                }),
                tablePlugin(),
                thematicBreakPlugin(),
                frontmatterPlugin(),
                codeBlockPlugin({ 
                  defaultCodeBlockLanguage: '',
                  codeBlockEditorDescriptors: []
                }),
                codeMirrorPlugin({ 
                  codeBlockLanguages: {
                    '': 'Plain text',
                    javascript: 'JavaScript',
                    js: 'JavaScript',
                    typescript: 'TypeScript',
                    ts: 'TypeScript',
                    css: 'CSS',
                    html: 'HTML',
                    json: 'JSON',
                    sql: 'SQL',
                    python: 'Python',
                    bash: 'Bash',
                    yaml: 'YAML',
                    markdown: 'Markdown',
                    xml: 'XML',
                    php: 'PHP',
                    java: 'Java'
                  } 
                }),
                // 移除可能导致问题的高级插件
                diffSourcePlugin({
                  viewMode: 'rich-text',
                  diffMarkdown: ''
                }),
                markdownShortcutPlugin()
              ]}
              className="min-h-full"
            />
          </div>
        </div>
        
        {isFullscreen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleFullscreen}
          />
        )}
      </div>
    );
  }
);

AdvancedMarkdownEditor.displayName = 'AdvancedMarkdownEditor';

export default AdvancedMarkdownEditor; 