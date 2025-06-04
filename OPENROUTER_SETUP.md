# OpenRouter API 配置指南

## 问题诊断

如果案例管理AI生成摘要报错，通常是因为以下原因：

### 1. 缺少环境变量

请在你的 `.env.local` 文件中添加以下配置：

```bash
# OpenRouter AI API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# 其他必需的环境变量
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 获取OpenRouter API Key

1. 访问 [OpenRouter.ai](https://openrouter.ai/)
2. 注册账号并登录
3. 前往 API Keys 页面
4. 创建新的API Key
5. 将API Key复制到环境变量中

### 3. 支持的模型列表

推荐使用以下模型（按性能和价格排序）：

```bash
# 高性能模型
anthropic/claude-3.5-sonnet      # 推荐：最新Claude模型
anthropic/claude-3-opus          # 最强性能
anthropic/claude-3-sonnet        # 平衡性能和速度

# 中等性能模型
openai/gpt-4-turbo              # OpenAI GPT-4 Turbo
openai/gpt-4                    # OpenAI GPT-4

# 经济型模型
anthropic/claude-3-haiku        # 最快速度
openai/gpt-3.5-turbo           # 经济选择
```

## 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 复制并修改以下内容
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 重启开发服务器

```bash
pnpm dev
```

### 3. 测试配置

在案例管理页面尝试生成摘要，如果配置正确应该可以正常工作。

## 错误排查

### 400 Bad Request 错误

通常表示：
- API Key 无效或格式错误
- 模型名称不正确
- 请求格式有问题

### 401 Unauthorized 错误

表示：
- API Key 缺失
- API Key 无效
- 账户余额不足

### 429 Rate Limit 错误

表示：
- 请求过于频繁
- 超出了API配额限制

## 成本优化

### 模型选择建议

- **开发测试**: 使用 `anthropic/claude-3-haiku` 或 `openai/gpt-3.5-turbo`
- **生产环境**: 使用 `anthropic/claude-3.5-sonnet`
- **高质量需求**: 使用 `anthropic/claude-3-opus`

### 请求优化

- 合理设置 `max_tokens` 参数
- 避免频繁重复请求
- 实现请求缓存机制

## 安全注意事项

1. **永远不要**将API Key提交到版本控制系统
2. 使用 `.env.local` 文件存储敏感信息
3. 在生产环境中使用环境变量管理服务
4. 定期轮换API Key

## 技术支持

如果仍然遇到问题：

1. 检查OpenRouter控制台的使用统计
2. 查看浏览器开发者工具的Network标签
3. 检查服务器日志中的详细错误信息
4. 联系OpenRouter技术支持

## 备选方案

如果OpenRouter不可用，可以考虑：

1. **OpenAI直接集成**: 使用OpenAI官方API
2. **Azure OpenAI**: 企业级OpenAI服务
3. **本地模型**: 使用Ollama等本地AI解决方案 