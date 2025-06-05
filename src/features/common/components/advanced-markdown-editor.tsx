'use client';

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useCallback, useState } from 'react';
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

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Loader2, 
  Eye, 
  Edit3, 
  FileText, 
  Palette,
  Upload,
  Image as ImageIcon,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import ImageUploadDialog from '@/components/ui/image-upload-dialog';

export interface AdvancedMarkdownEditorRef {
  getMarkdown: () => string;
  setMarkdown: (markdown: string) => void;
  focus: () => void;
  insertText: (text: string) => void;
}

interface AdvancedMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  showPreview?: boolean;
  showWordCount?: boolean;
  showCharacterCount?: boolean;
  autoFocus?: boolean;
  readOnly?: boolean;
}

const AdvancedMarkdownEditor = forwardRef<AdvancedMarkdownEditorRef, AdvancedMarkdownEditorProps>(
  ({
    value = '',
    onChange,
    placeholder = '开始编写您的内容...',
    label,
    error,
    disabled = false,
    className = '',
    minHeight = 300,
    maxHeight = 600,
    showPreview = true,
    showWordCount = true,
    showCharacterCount = true,
    autoFocus = false,
    readOnly = false
  }, ref) => {
    const editorRef = useRef<MDXEditorMethods>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentValue, setCurrentValue] = useState(value);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [wordCount, setWordCount] = useState(0);
    const [characterCount, setCharacterCount] = useState(0);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 等待组件挂载
    useEffect(() => {
      setMounted(true);
    }, []);

    // 计算字数和字符数
    const updateCounts = useCallback((text: string) => {
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(text.length);
    }, []);

    // 处理内容变化
    const handleChange = useCallback((newValue: string) => {
      setCurrentValue(newValue);
      updateCounts(newValue);
      onChange?.(newValue);
    }, [onChange, updateCounts]);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      getMarkdown: () => {
        return editorRef.current?.getMarkdown() || currentValue;
      },
      setMarkdown: (markdown: string) => {
        if (editorRef.current) {
          editorRef.current.setMarkdown(markdown);
        }
        setCurrentValue(markdown);
        updateCounts(markdown);
      },
      focus: () => {
        editorRef.current?.focus();
      },
      insertText: (text: string) => {
        if (editorRef.current) {
          editorRef.current.insertMarkdown(text);
        }
      }
    }), [currentValue, updateCounts]);

    // 初始化编辑器
    useEffect(() => {
      if (!mounted) return;

      const timer = setTimeout(() => {
        setIsReady(true);
        setIsLoading(false);
        
        if (value !== currentValue) {
          setCurrentValue(value);
          updateCounts(value);
        }
      }, 100);

      return () => clearTimeout(timer);
    }, [mounted, value, currentValue, updateCounts]);

    // 处理图片插入
    const handleImageSelect = useCallback((imageData: { url: string; alt: string; title?: string }) => {
      const imageMarkdown = imageData.title 
        ? `![${imageData.alt}](${imageData.url} "${imageData.title}")`
        : `![${imageData.alt}](${imageData.url})`;
      
      if (editorRef.current) {
        editorRef.current.insertMarkdown(imageMarkdown);
      } else {
        const newValue = currentValue + '\n' + imageMarkdown;
        handleChange(newValue);
      }
    }, [currentValue, handleChange]);

    // 主题切换按钮
    const ThemeToggle = () => {
      if (!mounted) return null;
      
      return (
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={theme === 'light' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('light')}
            className="h-7 w-7 p-0"
          >
            <Sun className="h-3 w-3" />
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('dark')}
            className="h-7 w-7 p-0"
          >
            <Moon className="h-3 w-3" />
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTheme('system')}
            className="h-7 w-7 p-0"
          >
            <Monitor className="h-3 w-3" />
          </Button>
        </div>
      );
    };

    // 渲染预览内容
    const renderPreview = () => {
      if (!currentValue.trim()) {
        return (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>预览将在这里显示</p>
              <p className="text-sm">在编辑器中输入内容以查看预览</p>
            </div>
          </div>
        );
      }

      // 简单的Markdown预览渲染
      const htmlContent = currentValue
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg" />')
        .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
        .replace(/\n/gim, '<br />');

      return (
        <div 
          className="prose prose-sm dark:prose-invert max-w-none p-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    };

    if (!mounted) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{label}</Label>
            <div className="flex items-center gap-2">
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImageDialogOpen(true)}
                disabled={disabled || readOnly}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                插入图片
              </Button>
            </div>
          </div>
        )}

        <Card className="overflow-y-auto border-2 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-sm font-medium">Markdown 编辑器</CardTitle>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              
              {showPreview && (
                <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'edit' | 'preview')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="edit" className="text-xs h-6 px-3">
                      <Edit3 className="h-3 w-3 mr-1" />
                      编辑
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-xs h-6 px-3">
                      <Eye className="h-3 w-3 mr-1" />
                      预览
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div 
              ref={containerRef}
              className="relative"
              style={{ 
                minHeight: `${minHeight}px`,
                maxHeight: `${maxHeight}px`
              }}
            >
              {activeTab === 'edit' ? (
                <div className="h-full">
                  {isReady ? (
                    <div className="markdown-editor-container">
                      <MDXEditor
                        ref={editorRef}
                        markdown={currentValue}
                        onChange={handleChange}
                        placeholder={placeholder}
                        readOnly={readOnly || disabled}
                        className={`
                          h-full min-h-[${minHeight}px] max-h-[${maxHeight}px]
                          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                          ${error ? 'border-red-500 dark:border-red-400' : ''}
                        `}
                        plugins={[
                          toolbarPlugin({
                            toolbarContents: () => (
                              <div className="flex items-center gap-1 flex-wrap">
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <Separator />
                                <BlockTypeSelect />
                                <Separator />
                                <CreateLink />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsImageDialogOpen(true)}
                                  className="h-8 px-2"
                                  disabled={disabled || readOnly}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Separator />
                                <ListsToggle />
                                <Separator />
                                <InsertTable />
                                <InsertThematicBreak />
                                <Separator />
                                <CodeToggle />
                                <ConditionalContents
                                  options={[
                                    {
                                      when: (editor) => editor?.editorType === 'codeblock',
                                      contents: () => <ChangeCodeMirrorLanguage />
                                    },
                                    {
                                      fallback: () => (
                                        <div className="flex items-center gap-1">
                                          <InsertCodeBlock />
                                        </div>
                                      )
                                    }
                                  ]}
                                />
                              </div>
                            )
                          }),
                          listsPlugin(),
                          quotePlugin(),
                          headingsPlugin(),
                          linkPlugin(),
                          linkDialogPlugin(),
                          imagePlugin({
                            imageAutocompleteSuggestions: [],
                            imageUploadHandler: undefined, // 禁用默认上传，使用自定义
                            imagePreviewHandler: (imageSource) => Promise.resolve(imageSource)
                          }),
                          tablePlugin(),
                          thematicBreakPlugin(),
                          frontmatterPlugin(),
                          codeBlockPlugin({ 
                            defaultCodeBlockLanguage: 'javascript'
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
                          }),
                          diffSourcePlugin(),
                          markdownShortcutPlugin()
                        ]}
                        contentEditableClassName="prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none min-h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          正在加载编辑器...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="h-full overflow-y-auto bg-white dark:bg-gray-900 border-l"
                  style={{ 
                    minHeight: `${minHeight}px`,
                    maxHeight: `${maxHeight}px`
                  }}
                >
                  {renderPreview()}
                </div>
              )}
            </div>
          </CardContent>

          {/* 底部状态栏 */}
          <div className="border-t bg-gray-50 dark:bg-gray-800 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                {showWordCount && (
                  <Badge variant="secondary" className="text-xs">
                    {wordCount} 词
                  </Badge>
                )}
                {showCharacterCount && (
                  <Badge variant="secondary" className="text-xs">
                    {characterCount} 字符
                  </Badge>
                )}
                {activeTab === 'edit' && (
                  <span className="text-xs">
                    支持 Markdown 语法 • 
                    <kbd className="mx-1 px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Z</kbd> 撤销 • 
                    <kbd className="mx-1 px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Y</kbd> 重做
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {error && (
                  <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-xs">{error}</span>
                  </div>
                )}
                <span className="text-xs">
                  {activeTab === 'edit' ? '编辑模式' : '预览模式'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 图片上传对话框 */}
        <ImageUploadDialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          onImageSelect={handleImageSelect}
          title="插入图片"
          description="上传图片到 Cloudflare 或通过 URL 添加图片"
        />

        <style jsx global>{`
          .markdown-editor-container .mdxeditor {
            background: transparent !important;
            border: none !important;
          }
          
          .markdown-editor-container .mdxeditor-toolbar {
            background: rgb(249 250 251) !important;
            border-bottom: 1px solid rgb(229 231 235) !important;
          }
          
          .dark .markdown-editor-container .mdxeditor-toolbar {
            background: rgb(31 41 55) !important;
            border-bottom: 1px solid rgb(75 85 99) !important;
          }
          
          .markdown-editor-container .mdxeditor-toolbar button {
            color: rgb(75 85 99) !important;
          }
          
          .dark .markdown-editor-container .mdxeditor-toolbar button {
            color: rgb(156 163 175) !important;
          }
          
          .markdown-editor-container .mdxeditor-toolbar button:hover {
            background: rgb(243 244 246) !important;
            color: rgb(17 24 39) !important;
          }
          
          .dark .markdown-editor-container .mdxeditor-toolbar button:hover {
            background: rgb(55 65 81) !important;
            color: rgb(243 244 246) !important;
          }
          
          .markdown-editor-container .mdxeditor-toolbar button[data-state="on"] {
            background: rgb(59 130 246) !important;
            color: white !important;
          }
          
          .markdown-editor-container .mdxeditor-rich-text-editor {
            background: white !important;
            color: rgb(17 24 39) !important;
          }
          
          .dark .markdown-editor-container .mdxeditor-rich-text-editor {
            background: rgb(17 24 39) !important;
            color: rgb(243 244 246) !important;
          }
          
          .markdown-editor-container .mdxeditor-rich-text-editor:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          
          .markdown-editor-container .cm-editor {
            background: white !important;
            color: rgb(17 24 39) !important;
          }
          
          .dark .markdown-editor-container .cm-editor {
            background: rgb(17 24 39) !important;
            color: rgb(243 244 246) !important;
          }
          
          .markdown-editor-container .cm-focused {
            outline: none !important;
          }
          
          .markdown-editor-container .mdxeditor-popup-container {
            background: white !important;
            border: 1px solid rgb(229 231 235) !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
          }
          
          .dark .markdown-editor-container .mdxeditor-popup-container {
            background: rgb(31 41 55) !important;
            border: 1px solid rgb(75 85 99) !important;
          }
        `}</style>
      </div>
    );
  }
);

AdvancedMarkdownEditor.displayName = 'AdvancedMarkdownEditor';

export default AdvancedMarkdownEditor; 