# 🚀 AI N8N  - 智能自动化学习平台

> **AI N8N ** 是一个基于 Next.js 15 技术栈构建的现代化 AI 驱动的自动化学习平台，集成了教程、案例、博客、支付、用户管理和 AI 功能。专为快速构建和部署 SaaS 应用而设计。

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 📋 目录

- [✨ 功能特性](#-功能特性)
- [🏗️ 技术栈](#️-技术栈)
- [🚀 快速开始](#-快速开始)
- [📁 项目结构](#-项目结构)
- [🔧 配置说明](#-配置说明)
- [🌐 国际化](#-国际化)
- [💳 支付集成](#-支付集成)
- [🤖 AI 功能](#-ai-功能)
- [📊 数据模型](#-数据模型)
- [🚀 部署指南](#-部署指南)
- [🤝 贡献指南](#-贡献指南)
- [📄 许可证](#-许可证)

## ✨ 功能特性

### 🎯 核心功能

- **📚 智能教程系统** - 分级教程、进度跟踪、学习路径规划
- **💼 用例展示平台** - 实际应用案例、代码示例、最佳实践
- **📝 博客内容管理** - Markdown 编辑器、内容发布、分类管理
- **👤 用户管理系统** - 个人资料、学习记录、偏好设置
- **💳 订阅支付系统** - Stripe 集成、多种套餐、使用限额管理
- **🎨 后台管理面板** - 内容管理、用户管理、数据统计

### 🚀 技术特性

- **🌍 国际化支持** - 中英文双语，基于 next-intl
- **🔐 安全认证** - Clerk 集成，支持多种登录方式
- **📱 响应式设计** - 移动端优先，适配所有设备
- **⚡ 高性能优化** - Next.js 15、React 19、服务端渲染
- **🎨 现代化 UI** - Tailwind CSS、Radix UI、Framer Motion
- **📈 数据分析** - 用户行为跟踪、学习进度统计

### 🤖 AI 增强功能

- **🔤 智能翻译** - 内容自动翻译，支持多语言
- **📊 智能分析** - 用户行为分析、学习建议推荐
- **🎯 个性化推荐** - 基于用户偏好的内容推荐
- **💬 智能互动** - AI 助手、问答系统

## 🏗️ 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架
- **React 19** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript

### 样式和UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Radix UI** - 无样式的 UI 组件库
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 数据库和ORM
- **PostgreSQL** - 关系型数据库
- **Drizzle ORM** - TypeScript ORM
- **Drizzle Kit** - 数据库迁移工具

### 认证和支付
- **Clerk** - 用户认证和管理
- **Stripe** - 支付处理平台

### AI 服务
- **OpenRouter** - AI 模型API网关
- **Claude 3.5 Sonnet** - 默认 AI 模型

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **pnpm** - 包管理器

### 部署和托管
- **Vercel** - 部署平台
- **Vercel Postgres** - 托管数据库

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm 8.0 或更高版本
- PostgreSQL 数据库

### 1. 克隆项目

```bash
git clone https://github.com/geallenboy/ai-n8n.git
cd ai-n8n
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

复制环境变量模板并配置：

```bash
cp .env.example .env.local
```

配置必要的环境变量：

```env
# 数据库
DATABASE_URL="postgresql://username:password@localhost:5432/ai-n8n"

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# Stripe 支付
STRIPE_SECRET_KEY="sk_test_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# AI 服务
OPENROUTER_API_KEY="sk-or-v1-xxx"

# 应用配置
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. 数据库设置

```bash
# 生成数据库模式
pnpm db:generate

# 推送到数据库
pnpm db:push

# 打开数据库管理界面（可选）
pnpm db:studio
```

### 5. 启动开发服务器

```bash
pnpm dev
```

现在可以在 [http://localhost:3000](http://localhost:3000) 访问应用。

## 📁 项目结构

```
src/
├── app/                    # App Router 页面
│   ├── (auth)/            # 认证相关页面
│   ├── api/               # API 路由
│   │   ├── ai/           # AI 功能 API
│   │   ├── payments/     # 支付相关 API
│   │   ├── user/         # 用户相关 API
│   │   └── webhooks/     # Webhook 处理
│   ├── backend/          # 后台管理页面
│   ├── front/            # 前台用户页面
│   └── globals.css       # 全局样式
├── components/            # 可复用组件
│   ├── ui/               # 基础 UI 组件
│   ├── magicui/          # 高级 UI 组件
│   ├── payment/          # 支付相关组件
│   └── seo/              # SEO 组件
├── features/             # 功能模块
│   ├── auth/             # 认证功能
│   ├── blogs/            # 博客功能
│   ├── dashboard/        # 仪表板
│   ├── tutorial/         # 教程功能
│   ├── use-cases/        # 用例功能
│   └── users/            # 用户管理
├── drizzle/              # 数据库相关
│   ├── schemas/          # 数据模型定义
│   └── migrations/       # 数据库迁移
├── hooks/                # React Hooks
├── lib/                  # 工具函数
├── translate/            # 国际化
│   ├── messages/         # 翻译文件
│   └── i18n/             # 配置文件
└── types/                # TypeScript 类型定义
```

## 🔧 配置说明

### 数据库配置

项目使用 Drizzle ORM 管理数据库，配置文件位于 `drizzle.config.ts`：

```typescript
export default defineConfig({
    out: "./src/drizzle/migrations",
    schema: "./src/drizzle/schemas",
    dialect: "postgresql",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})
```

### 认证配置

使用 Clerk 提供用户认证服务，支持：
- Email/密码登录
- Google OAuth
- 多因子认证
- 用户角色管理

### AI 配置

集成 OpenRouter API，支持多种 AI 模型：
- Claude 3.5 Sonnet (默认)
- GPT-4
- Llama 2
- 自定义模型

## 🌐 国际化

项目支持中英文双语，基于 `next-intl` 实现：

### 添加新语言

1. 在 `src/translate/messages/` 添加语言文件
2. 更新 `src/translate/i18n/request.ts` 配置
3. 添加对应的翻译内容

### 使用翻译

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('common');
return <h1>{t('title')}</h1>;
```

## 💳 支付集成

### Stripe 配置

1. 创建 Stripe 账户
2. 获取 API 密钥
3. 配置 Webhook 端点：`/api/payments/webhook`
4. 设置产品和价格

### 订阅模型

支持多种订阅计划：
- 免费计划 - 基础功能
- 专业计划 - 扩展功能
- 企业计划 - 全部功能

## 🤖 AI 功能

### 智能翻译

```typescript
// API: /api/ai/translate
const response = await fetch('/api/ai/translate', {
  method: 'POST',
  body: JSON.stringify({
    text: 'Hello World',
    targetLanguage: 'zh'
  })
});
```

### 内容分析

```typescript
// API: /api/ai/analyze
const response = await fetch('/api/ai/analyze', {
  method: 'POST',
  body: JSON.stringify({
    content: 'Your content here',
    type: 'sentiment'
  })
});
```

## 📊 数据模型

### 核心实体

- **Users** - 用户信息和偏好
- **TutorialSections** - 教程分类
- **TutorialModules** - 教程模块
- **TutorialSteps** - 教程步骤
- **UseCases** - 应用用例
- **Blogs** - 博客文章
- **SubscriptionPlans** - 订阅计划
- **UserSubscriptions** - 用户订阅
- **PaymentRecords** - 支付记录

### 关系设计

- 用户可以有多个订阅记录
- 教程按分类 → 模块 → 步骤的层级组织
- 支持用户学习进度跟踪
- 用例和博客支持点赞、收藏功能

## 🚀 部署指南

### Vercel 部署（推荐）

1. **连接 GitHub**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库

2. **配置环境变量**
   - 在 Vercel 项目设置中添加所有必需的环境变量

3. **数据库设置**
   - 使用 Vercel Postgres 或其他托管 PostgreSQL 服务

4. **自动部署**
   - 推送到 main 分支自动触发部署

详细部署指南请参考 [deploy.md](./deploy.md)

### 其他部署选项

- **Netlify** - 静态站点部署
- **Railway** - 全栈应用托管
- **DigitalOcean** - VPS 部署
- **AWS** - 云服务部署

## 🧪 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# E2E 测试
pnpm test:e2e
```

## 📈 性能优化

- **代码分割** - 自动代码分割
- **图片优化** - Next.js Image 组件
- **缓存策略** - ISR 和 SSG
- **CDN 分发** - Vercel Edge Network

## 🔍 SEO 优化

- **元数据管理** - 动态 SEO 标签
- **结构化数据** - JSON-LD 标记
- **Sitemap** - 自动生成
- **国际化 SEO** - 多语言 URL

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 配置
- 添加适当的注释
- 编写测试用例

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: add new feature
fix: bug fix
docs: update documentation
style: code style changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 📞 支持和联系

- **Email**: [gejialun88@gmail.com](mailto:gejialun88@gmail.com)
- **Twitter**: [@gejialun88](https://x.com/gejialun88)
- **Website**: [gegarron.com](https://gegarron.com)
- **微信**: gegarron

## 🙏 致谢

感谢以下开源项目和服务：

- [Next.js](https://nextjs.org) - React 框架
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架
- [Radix UI](https://www.radix-ui.com) - UI 组件
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Clerk](https://clerk.com) - 认证服务
- [Stripe](https://stripe.com) - 支付服务
- [Vercel](https://vercel.com) - 部署平台

## 📊 统计数据

- **代码行数**: 10,000+ 行
- **组件数量**: 50+ 个
- **API 端点**: 20+ 个
- **数据模型**: 15+ 个
- **支持语言**: 2 种（中文、英文）

## 🔄 更新日志

### v1.0.0 (2025-06-01)
- 🎉 初始版本发布
- ✨ 完整的教程系统
- 💳 Stripe 支付集成
- 🌍 国际化支持
- 🤖 AI 功能集成

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

<div align="center">

**🚀 立即开始使用 AI N8N，构建您的下一个 AI 驱动应用！**

[📚 查看文档](./TECHNICAL_DOCS.md) | [🎯 在线演示](https://www.aiautomatehub.org) | [💬 获取支持](mailto:gejialun88@gmail.com)

</div>
