'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdvancedMarkdownRenderer } from '@/features/common';

const testMarkdown = `# 高级Markdown渲染器测试

这是一个测试页面，用于展示优化后的 **AdvancedMarkdownRenderer** 组件的效果。

## 功能特点

- ✅ 使用 MDXEditor 的只读模式
- ✅ 完美的主题支持（亮色/暗色）
- ✅ 优化的标题样式（无蓝色下划线）
- ✅ 丰富的 Markdown 语法支持

### 代码块展示

JavaScript 代码示例：

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our site, \${name}\`;
}

// 调用函数
const message = greetUser('张三');
console.log(message);
\`\`\`

Python 代码示例：

\`\`\`python
def calculate_sum(numbers):
    """计算数字列表的总和"""
    total = 0
    for num in numbers:
        total += num
    return total

# 使用示例
my_numbers = [1, 2, 3, 4, 5]
result = calculate_sum(my_numbers)
print(f"总和是: {result}")
\`\`\`

### 表格展示

| 功能 | 旧版本 | 新版本 |
|------|--------|--------|
| 渲染引擎 | ReactMarkdown | MDXEditor |
| 主题支持 | 基础 | 完整 |
| 代码高亮 | Prism.js | CodeMirror |
| 标题样式 | 有问题 | 完美 |

### 列表展示

#### 有序列表
1. 第一项内容
2. 第二项内容
3. 第三项内容

#### 无序列表
- 功能优化
  - 标题样式修复
  - 链接样式优化
  - 代码块增强
- 性能提升
  - 更快的渲染速度
  - 更好的内存使用
- 用户体验
  - 更好的视觉效果
  - 完整的主题支持

### 引用块

> 这是一个引用块的示例。使用 MDXEditor 的只读模式可以提供更好的渲染效果，确保与编辑器的视觉一致性。
> 
> 引用块支持 **粗体** 和 *斜体* 文字，以及 \`行内代码\`。

### 链接展示

这里有一些链接示例：
- [内部链接](/test-editor)
- [外部链接](https://www.example.com)
- [GitHub 链接](https://github.com)

### 图片展示

![示例图片](https://via.placeholder.com/600x300/4F46E5/FFFFFF?text=Advanced+Markdown+Renderer "这是一个示例图片")

### 行内元素

这里有一些行内元素：\`console.log('Hello World')\`，以及 **粗体文字** 和 *斜体文字*。

---

## 总结

新的 AdvancedMarkdownRenderer 组件提供了：

1. **更好的视觉效果** - 无蓝色下划线的标题
2. **完整的主题支持** - 亮色和暗色主题
3. **增强的代码高亮** - 使用 CodeMirror
4. **一致的用户体验** - 与编辑器保持一致

这样的改进大大提升了内容的可读性和用户体验！🎉`;

export default function TestRendererPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AdvancedMarkdownRenderer 测试页面
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            测试优化后的 Markdown 渲染器组件效果
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>渲染效果展示</CardTitle>
          </CardHeader>
          <CardContent>
            <AdvancedMarkdownRenderer 
              content={testMarkdown}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>💡 提示：可以切换主题查看不同模式下的渲染效果</p>
        </div>
      </div>
    </div>
  );
} 