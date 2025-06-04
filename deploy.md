# 部署指南

## Vercel 部署（推荐）

本项目已优化为 Vercel 部署，提供最佳的 Next.js 体验和完整的功能支持。

### 为什么选择 Vercel？

- ✅ **零配置部署** - 自动检测 Next.js 项目
- ✅ **完美兼容性** - 支持所有项目功能
- ✅ **自动优化** - 内置缓存和性能优化
- ✅ **实时预览** - 每个 PR 自动生成预览链接
- ✅ **全球 CDN** - 自动分发到全球边缘节点
- ✅ **内置数据库** - 可选择 Vercel Postgres
- ✅ **监控分析** - 内置性能和分析工具

## 快速部署

### 方法一：GitHub 集成（推荐）

1. **连接 GitHub 到 Vercel**
   - 访问 [vercel.com](https://vercel.com/)
   - 使用 GitHub 账户登录
   - 点击 "Import Project"

2. **导入项目**
   - 选择此 GitHub 仓库
   - Vercel 会自动检测为 Next.js 项目
   - 配置项目名称和域名

3. **配置环境变量**
   ```bash
   # 必需变量
   DATABASE_URL="your_postgres_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_xxx"
   CLERK_SECRET_KEY="sk_xxx"
   OPENROUTER_API_KEY="sk-or-v1-xxx"
   STRIPE_SECRET_KEY="sk_xxx"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_xxx"
   STRIPE_WEBHOOK_SECRET="whsec_xxx"
   NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
   
   # 可选变量
   RESEND_API_KEY="re_xxx"
   RESEND_FROM_EMAIL="noreply@your-domain.com"
   RESEND_TO_EMAIL="admin@your-domain.com"
   NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-3 分钟）

### 方法二：Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

## 数据库配置

### 推荐方案

#### 1. Vercel Postgres（推荐）
- 完美集成 Vercel 平台
- 自动备份和扩展
- 内置连接池

```bash
# 在 Vercel Dashboard 中创建数据库
# 自动生成 DATABASE_URL
```

#### 2. Neon（免费友好）
- 无服务器 PostgreSQL
- 免费套餐充足
- 分支功能

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

#### 3. Supabase（功能丰富）
- PostgreSQL + 实时功能
- 内置认证和存储
- 丰富的 API

```bash
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

## 环境变量配置详解

### 必需环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 公开密钥 | `pk_test_xxx` |
| `CLERK_SECRET_KEY` | Clerk 私密密钥 | `sk_test_xxx` |
| `OPENROUTER_API_KEY` | OpenRouter AI API 密钥 | `sk-or-v1-xxx` |
| `STRIPE_SECRET_KEY` | Stripe 私密密钥 | `sk_test_xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe 公开密钥 | `pk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 | `whsec_xxx` |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | `https://your-domain.vercel.app` |

### 可选环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `RESEND_API_KEY` | Resend 邮件服务 API 密钥 | - |
| `RESEND_FROM_EMAIL` | 发件人邮箱 | `noreply@your-domain.com` |
| `RESEND_TO_EMAIL` | 收件人邮箱 | `admin@your-domain.com` |
| `OPENROUTER_DEFAULT_MODEL` | 默认 AI 模型 | `anthropic/claude-3.5-sonnet` |

## 部署后配置

### 1. Stripe Webhook 配置

在 Stripe Dashboard 中配置 Webhook：
```
URL: https://your-domain.vercel.app/api/payments/webhook
Events: customer.subscription.created, customer.subscription.updated, etc.
```

### 2. Clerk 域名配置

在 Clerk Dashboard 中添加生产域名：
```
https://your-domain.vercel.app
```

### 3. 自定义域名（可选）

在 Vercel Dashboard 中：
1. 项目 → Settings → Domains
2. 添加自定义域名
3. 配置 DNS 记录

## 开发工作流

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 数据库操作
pnpm db:generate  # 生成数据库模式
pnpm db:push      # 推送到数据库
pnpm db:studio    # 打开数据库管理界面
```

### 部署流程

```bash
# 开发完成后
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel 自动触发部署
# 查看部署状态：https://vercel.com/dashboard
```

## 监控和维护

### 性能监控

- **Vercel Analytics** - 内置流量和性能分析
- **Real User Monitoring** - 真实用户体验监控
- **Core Web Vitals** - 页面性能指标

### 日志查看

```bash
# 使用 Vercel CLI 查看日志
vercel logs

# 或在 Vercel Dashboard 中查看
# 项目 → Functions → 查看日志
```

### 优化建议

1. **图片优化**
   - 使用 Next.js Image 组件
   - 启用自动图片压缩

2. **缓存策略**
   - 静态资源自动缓存
   - API 路由添加适当的缓存头

3. **性能监控**
   - 启用 Vercel Speed Insights
   - 定期检查 Core Web Vitals

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查本地构建
   pnpm build
   
   # 检查环境变量
   # 确保所有必需变量已配置
   ```

2. **数据库连接问题**
   ```bash
   # 检查连接字符串格式
   # 确认数据库服务可访问
   # 验证权限设置
   ```

3. **环境变量问题**
   ```bash
   # 检查变量名拼写
   # 确认公开变量使用 NEXT_PUBLIC_ 前缀
   # 重新部署以应用变量更改
   ```

## 成本估算

### Vercel 定价

| 计划 | 价格 | 包含功能 |
|------|------|----------|
| Hobby | 免费 | 100GB 带宽/月，无限项目 |
| Pro | $20/月 | 1TB 带宽/月，团队功能 |
| Enterprise | 联系销售 | 企业级功能，SLA 保证 |

### 推荐配置

- **个人项目**：Hobby 计划 + Neon 免费版
- **小型项目**：Pro 计划 + Vercel Postgres
- **企业项目**：Enterprise 计划 + 专业数据库

## 总结

使用 Vercel 部署 AI n8n 项目的优势：

1. **开发体验优秀** - 零配置，专注业务逻辑
2. **功能完整支持** - 所有项目功能正常工作
3. **性能表现卓越** - 全球 CDN，自动优化
4. **维护成本低** - 自动更新，无需运维
5. **扩展性强** - 自动缩放，按需付费

项目已完全优化为 Vercel 部署，只需几分钟即可上线运行。 