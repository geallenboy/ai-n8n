'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdvancedMarkdownEditor } from '@/features/common';
import { toast } from 'sonner';
import { 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle,
  Palette,
  Sun,
  Moon,
  Monitor,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

export default function TestEditorPage() {
  const [content, setContent] = useState(`# 测试 AdvancedMarkdownEditor

## 功能测试清单

### ✅ 基础功能
- [x] Markdown 语法支持
- [x] 实时预览
- [x] 亮色/暗色主题切换
- [x] 字数统计
- [x] 工具栏操作

### 🖼️ 图片上传功能
- [x] 文件拖拽上传
- [x] 文件选择上传
- [x] URL导入上传
- [x] Cloudflare Images集成
- [x] 图片预览
- [x] Alt文本设置

### 🎨 样式美化
- [x] 现代化UI设计
- [x] 主题切换支持
- [x] 响应式布局
- [x] 加载动画
- [x] 错误处理

## 使用说明

1. **编辑模式**: 在左侧编辑器中输入Markdown内容
2. **预览模式**: 切换到右侧查看渲染效果  
3. **插入图片**: 点击"插入图片"按钮上传或添加图片
4. **主题切换**: 使用右上角的主题切换按钮

## 示例内容

### 文本格式
**粗体文本** 和 *斜体文本*

### 代码块
\`\`\`javascript
const editor = new AdvancedMarkdownEditor({
  theme: 'dark',
  imageUpload: true,
  cloudflare: true
});
\`\`\`

### 链接
[访问 GitHub](https://github.com)

> 这是一个引用块示例

---

**测试完成后，此内容将被保存到组件状态中。**
`);

  const [features, setFeatures] = useState([
    { name: 'Markdown 语法支持', status: 'success', icon: FileText },
    { name: '亮色/暗色主题', status: 'success', icon: Palette },
    { name: '图片上传功能', status: 'testing', icon: ImageIcon },
    { name: 'Cloudflare 集成', status: 'testing', icon: Upload },
    { name: '实时预览', status: 'success', icon: CheckCircle },
    { name: '响应式设计', status: 'success', icon: Monitor },
  ]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log('内容已更新:', newContent.length, '字符');
  };

  const testImageUpload = () => {
    toast.info('请使用编辑器中的"插入图片"按钮测试图片上传功能');
  };

  const testThemeSwitch = () => {
    toast.info('请使用编辑器右上角的主题切换按钮测试主题功能');
  };

  const getStatusIcon = (status: string, IconComponent: any) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'testing':
        return <IconComponent className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <IconComponent className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          AdvancedMarkdownEditor 测试页面
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          测试美化后的Markdown编辑器和Cloudflare图片上传功能
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Sun className="h-3 w-3" />
            亮色主题
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Moon className="h-3 w-3" />
            暗色主题
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            图片上传
          </Badge>
        </div>
      </div>

      {/* 功能状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            功能测试状态
          </CardTitle>
          <CardDescription>
            检查AdvancedMarkdownEditor的各项功能是否正常工作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {getStatusIcon(feature.status, feature.icon)}
                <span className="font-medium">{feature.name}</span>
                <Badge 
                  variant={feature.status === 'success' ? 'default' : feature.status === 'testing' ? 'secondary' : 'destructive'}
                  className="ml-auto"
                >
                  {feature.status === 'success' ? '✓' : feature.status === 'testing' ? '○' : '✗'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快速测试按钮 */}
      <Card>
        <CardHeader>
          <CardTitle>快速功能测试</CardTitle>
          <CardDescription>
            点击下方按钮快速测试各项功能
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={testImageUpload}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              测试图片上传
            </Button>
            <Button 
              variant="outline" 
              onClick={testThemeSwitch}
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              测试主题切换
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setContent('')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              清空内容
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              刷新页面
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 编辑器测试区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            编辑器测试区域
          </CardTitle>
          <CardDescription>
            在下方编辑器中测试所有功能，包括图片上传、主题切换等
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedMarkdownEditor
            label="测试编辑器"
            value={content}
            onChange={handleContentChange}
            placeholder="在这里开始编写内容，测试所有功能..."
            minHeight={500}
            maxHeight={800}
            showPreview={true}
            showWordCount={true}
            showCharacterCount={true}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* 内容预览 */}
      <Card>
        <CardHeader>
          <CardTitle>当前内容状态</CardTitle>
          <CardDescription>
            显示编辑器中的内容统计信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {content.length}
              </div>
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                总字符数
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {content.trim().split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <div className="text-sm text-green-600/70 dark:text-green-400/70">
                单词数
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {content.split('\n').length}
              </div>
              <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                行数
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cloudflare配置提示 */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Upload className="h-5 w-5" />
            Cloudflare Images 配置
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            要测试图片上传功能，请确保已配置Cloudflare Images API
          </CardDescription>
        </CardHeader>
        <CardContent className="text-yellow-800 dark:text-yellow-200">
          <div className="space-y-2">
            <p>• 检查 <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">CLOUDFLARE_ACCOUNT_ID</code> 环境变量</p>
            <p>• 检查 <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">CLOUDFLARE_API_TOKEN</code> 环境变量</p>
            <p>• 参考 <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">CLOUDFLARE_SETUP.md</code> 文件进行配置</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 