# AI生成功能故障排除指南

## 已修复的问题

### 问题1: AI生成工作流程解读和教程内容不同步显示

**症状**: 点击"AI生成工作流解读"或"AI生成工作流教程"按钮后，接口返回成功，但内容没有在编辑器中显示。

**根本原因**: 
1. **数据字段检查错误**: 函数检查的是错误的数据字段
   - `handleAIWorkflowInterpretation` 检查 `formData.workflowJson`（英文字段），但实际应该检查 `formData.workflowJsonZh`（中文字段）
   - `handleAITutorialGeneration` 检查 `formData.readme`（英文字段），但实际应该检查 `formData.readmeZh`（中文字段）

2. **AdvancedMarkdownEditor组件渲染问题**: MDXEditor组件没有正确响应外部value的变化
   - MDXEditor使用 `markdown={value || ''}` 但缺少强制更新机制
   - React组件重渲染时，MDXEditor内部状态没有同步更新

**修复方案**:
✅ 修改函数中的字段检查逻辑，使用正确的中文字段
✅ 使用 `formData.workflowJsonZh` 作为工作流数据源
✅ 使用 `formData.readmeZh || formData.readme || ''` 作为内容源
✅ 为MDXEditor添加稳定的key属性，基于content hash强制重新渲染
✅ 添加useEffect监听value变化，手动同步编辑器内容

### 问题2: AI生成摘要输出Markdown格式

**症状**: AI生成的案例摘要、工作流解读、教程包含Markdown语法（如 `#` `*` `**` 等）。

**原因**: 
- OpenRouter API的系统提示词没有明确要求输出纯文本格式
- 模型默认倾向于使用Markdown格式输出结构化内容

**修复方案**:
✅ 修改所有AI生成功能的系统提示词
✅ 明确要求"输出纯文本格式，不使用Markdown语法"
✅ 在提示词中强调"不要使用标题符号（#）、列表符号（*）或任何其他标记语言"

## 技术修复详情

### AdvancedMarkdownEditor组件修复

**问题**: MDXEditor组件不响应外部value变化

**原始代码**:
```typescript
<MDXEditor
  ref={editorRef}
  markdown={value || ''}
  onChange={handleChange}
  // ... 其他属性
/>
```

**修复后代码**:
```typescript
// 创建稳定的key基于内容hash
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

// 监听value变化并手动同步编辑器
useEffect(() => {
  if (editorRef.current && value !== undefined) {
    try {
      const currentMarkdown = editorRef.current.getMarkdown();
      if (currentMarkdown !== value) {
        editorRef.current.setMarkdown(value || '');
      }
    } catch (err) {
      console.error('Error updating markdown:', err);
    }
  }
}, [value]);

<MDXEditor
  key={`mdx-editor-${hashString(value || '')}`}
  ref={editorRef}
  markdown={value || ''}
  onChange={handleChange}
  // ... 其他属性
/>
```

### 数据流修复

**问题**: 字段检查逻辑错误

**修复前**:
```typescript
if (!formData.workflowJson) {  // 检查英文字段
  toast.error('请先填写工作流JSON');
  return;
}
```

**修复后**:
```typescript
if (!formData.workflowJsonZh) {  // 检查中文字段
  toast.error('请先填写工作流JSON');
  return;
}
```

## 使用指南

### 案例管理编辑页面 AI 功能使用流程

1. **AI生成摘要**
   - 先填写"详细说明"内容（推荐填写中文版本）
   - 点击"AI生成摘要"按钮
   - 系统会自动生成中英文摘要

2. **AI生成工作流解读**
   - 先填写"工作流JSON"数据
   - 可选择性填写"详细说明"内容
   - 点击"AI生成工作流解读"按钮
   - 系统会基于工作流JSON和说明生成解读

3. **AI生成工作流教程**
   - 先填写"工作流JSON"数据
   - 可选择性填写"详细说明"内容
   - 点击"AI生成工作流教程"按钮
   - 系统会生成详细的分步教程

### 环境配置要求

确保 `.env.local` 文件包含以下配置：

```bash
# OpenRouter API配置
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_DEFAULT_MODEL=thedrummer/valkyrie-49b-v1

# 应用配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 故障排查步骤

#### 1. 检查浏览器控制台日志
```javascript
// 查看AI生成响应数据
console.log('AI工作流解读响应:', result);
console.log('更新前的formData:', formData.workflowInterpretationZh);
console.log('更新后的formData:', newData);
```

#### 2. 验证数据流
- 确保API返回 `result.success = true`
- 检查 `result.data` 包含正确的字段名
- 验证 `setFormData` 被正确调用

#### 3. 检查编辑器渲染
- 确认AdvancedMarkdownEditor接收到正确的value
- 验证MDXEditor的key属性变化
- 查看useEffect是否触发内容同步

#### 4. 环境变量验证
```bash
# 检查环境变量是否正确配置
echo $OPENROUTER_API_KEY
```

## 测试验证

### 手动测试步骤
1. 打开案例编辑页面
2. 填写工作流JSON数据
3. 点击"AI生成工作流解读"按钮
4. 验证内容是否立即显示在编辑器中
5. 重复测试"AI生成工作流教程"功能

### 预期结果
- ✅ AI生成成功后，内容立即在编辑器中显示
- ✅ 编辑器内容与API返回的数据一致
- ✅ 生成的内容为纯文本格式，不包含Markdown语法
- ✅ 浏览器控制台显示正确的调试日志

## 相关文件清单

**修改的文件**:
1. `src/app/backend/use-cases/edit/[id]/page.tsx` - 字段检查逻辑修复和调试日志
2. `src/features/common/components/advanced-markdown-editor.tsx` - MDXEditor同步更新机制
3. `src/lib/openrouter.ts` - AI生成提示词优化，要求纯文本输出

**相关文档**:
1. `OPENROUTER_SETUP.md` - OpenRouter配置指南
2. `AI_GENERATION_TROUBLESHOOTING.md` - 故障排除文档（本文档）

这些修复确保了AI生成功能的稳定性和用户体验，解决了内容不同步显示的根本问题。 