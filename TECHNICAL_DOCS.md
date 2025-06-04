# 📖 AI N8N 技术文档

> 这是 AI N8N 项目的详细技术文档，包含架构设计、API 规范、数据库设计、开发指南等技术细节。

## 📋 目录

- [🏗️ 架构设计](#️-架构设计)
- [📊 数据库设计](#-数据库设计)
- [🔌 API 设计](#-api-设计)
- [🎨 前端架构](#-前端架构)
- [🔐 认证授权](#-认证授权)
- [💳 支付系统](#-支付系统)
- [🤖 AI 集成](#-ai-集成)
- [🌐 国际化实现](#-国际化实现)
- [⚡ 性能优化](#-性能优化)
- [🧪 测试策略](#-测试策略)
- [🚀 部署流程](#-部署流程)
- [📝 开发指南](#-开发指南)

## 🏗️ 架构设计

### 整体架构

AI N8N 采用现代化的全栈架构，基于 Next.js 15 App Router 构建：

```
┌─────────────────────────────────────────────────────┐
│                   Frontend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    用户界面   │  │   管理后台   │  │   移动端适配  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                  Next.js API Routes                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  认证 API   │  │  支付 API   │  │   AI API    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                  External Services                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │    Clerk    │  │   Stripe    │  │ OpenRouter  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                    Database                        │
│              PostgreSQL + Drizzle ORM              │
└─────────────────────────────────────────────────────┘
```

### 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端框架 | Next.js 15 | SSR/SSG 支持，优秀的开发体验 |
| UI 库 | React 19 | 最新特性支持，生态成熟 |
| 样式 | Tailwind CSS | 快速开发，原子化 CSS |
| 组件库 | Radix UI | 无样式组件，可访问性好 |
| 状态管理 | Zustand | 轻量级，TypeScript 友好 |
| 数据库 | PostgreSQL | 关系型数据库，功能强大 |
| ORM | Drizzle | TypeScript 原生，性能优秀 |
| 认证 | Clerk | 功能完整，易于集成 |
| 支付 | Stripe | 全球支持，安全可靠 |
| AI 服务 | OpenRouter | 多模型支持，价格优势 |

## 📊 数据库设计

### 核心表结构

#### 用户相关

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar VARCHAR(500),
    bio TEXT,
    skill_level VARCHAR(50) DEFAULT 'beginner',
    preferences JSONB,
    total_learning_time INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    provider VARCHAR(50) DEFAULT 'email',
    provider_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户资料扩展表
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255),
    position VARCHAR(255),
    website VARCHAR(500),
    social_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 教程系统

```sql
-- 教程分类表
CREATE TABLE tutorial_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_zh TEXT,
    description TEXT,
    description_zh TEXT,
    icon TEXT DEFAULT 'BookOpen',
    color TEXT DEFAULT 'blue',
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    order INTEGER NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 教程模块表
CREATE TABLE tutorial_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES tutorial_sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_zh TEXT,
    description TEXT,
    description_zh TEXT,
    content TEXT,
    content_zh TEXT,
    video_url TEXT,
    estimated_time_minutes INTEGER,
    difficulty TEXT NOT NULL DEFAULT 'beginner',
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    order INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section_id, order)
);

-- 教程步骤表
CREATE TABLE tutorial_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES tutorial_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_zh TEXT,
    content TEXT NOT NULL,
    content_zh TEXT,
    step_type TEXT NOT NULL DEFAULT 'content',
    video_url TEXT,
    exercise_data JSONB,
    order INTEGER NOT NULL,
    estimated_time_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, order)
);
```

#### 学习进度

```sql
-- 用户教程进度表
CREATE TABLE user_tutorial_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    module_id UUID NOT NULL REFERENCES tutorial_modules(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started',
    progress INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    notes TEXT,
    rating INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- 用户步骤进度表
CREATE TABLE user_step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    step_id UUID NOT NULL REFERENCES tutorial_steps(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, step_id)
);
```

#### 支付系统

```sql
-- 订阅计划表
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_zh VARCHAR(100),
    description TEXT,
    description_zh TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    features JSON NOT NULL DEFAULT '[]',
    features_zh JSON DEFAULT '[]',
    max_use_cases INTEGER DEFAULT -1,
    max_tutorials INTEGER DEFAULT -1,
    max_blogs INTEGER DEFAULT -1,
    stripe_price_id VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用户订阅表
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 数据库索引策略

```sql
-- 用户相关索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 教程相关索引
CREATE INDEX idx_tutorial_sections_order ON tutorial_sections(order);
CREATE INDEX idx_tutorial_modules_section ON tutorial_modules(section_id);
CREATE INDEX idx_tutorial_modules_published ON tutorial_modules(is_published);
CREATE INDEX idx_tutorial_steps_module ON tutorial_steps(module_id);

-- 学习进度索引
CREATE INDEX idx_user_progress_user ON user_tutorial_progress(user_id);
CREATE INDEX idx_user_progress_module ON user_tutorial_progress(module_id);
CREATE INDEX idx_user_step_progress_user ON user_step_progress(user_id);

-- 支付相关索引
CREATE INDEX idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);
```

## 🔌 API 设计

### API 规范

项目采用 RESTful API 设计，所有 API 都位于 `/api` 路径下：

```
/api
├── auth/           # 认证相关
├── user/           # 用户管理
├── tutorial/       # 教程系统
├── use-cases/      # 用例管理
├── blogs/          # 博客管理
├── payments/       # 支付处理
├── ai/             # AI 功能
└── webhooks/       # Webhook 处理
```

### 认证 API

#### 用户信息
```typescript
// GET /api/user/profile
interface UserProfileResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
    fullName?: string;
    avatar?: string;
    bio?: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    preferences: UserPreferences;
    totalLearningTime: number;
    isAdmin: boolean;
  };
  error?: string;
}

// PUT /api/user/profile
interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferences?: UserPreferences;
}
```

### 教程 API

#### 获取教程列表
```typescript
// GET /api/tutorial/sections
interface TutorialSectionsResponse {
  success: boolean;
  data?: TutorialSection[];
  error?: string;
}

// GET /api/tutorial/modules?sectionId=xxx
interface TutorialModulesResponse {
  success: boolean;
  data?: TutorialModule[];
  error?: string;
}

// GET /api/tutorial/steps?moduleId=xxx
interface TutorialStepsResponse {
  success: boolean;
  data?: TutorialStep[];
  error?: string;
}
```

#### 学习进度管理
```typescript
// POST /api/tutorial/progress
interface UpdateProgressRequest {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  timeSpent?: number;
  notes?: string;
  rating?: number;
}

// POST /api/tutorial/step-progress
interface UpdateStepProgressRequest {
  stepId: string;
  isCompleted: boolean;
  timeSpent?: number;
}
```

### AI API

#### 智能翻译
```typescript
// POST /api/ai/translate
interface TranslateRequest {
  text: string;
  targetLanguage: 'en' | 'zh';
  sourceLanguage?: 'en' | 'zh';
}

interface TranslateResponse {
  success: boolean;
  data?: {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
  };
  error?: string;
}
```

#### 内容分析
```typescript
// POST /api/ai/analyze
interface AnalyzeRequest {
  content: string;
  type: 'sentiment' | 'keywords' | 'summary';
}

interface AnalyzeResponse {
  success: boolean;
  data?: {
    type: string;
    result: any;
    confidence?: number;
  };
  error?: string;
}
```

### 支付 API

#### 创建订阅
```typescript
// POST /api/payments/create-subscription
interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
  billingCycle: 'monthly' | 'yearly';
}

interface CreateSubscriptionResponse {
  success: boolean;
  data?: {
    subscriptionId: string;
    clientSecret?: string;
    status: string;
  };
  error?: string;
}
```

#### Webhook 处理
```typescript
// POST /api/payments/webhook
// Stripe webhook 事件处理
// 支持的事件：
// - customer.subscription.created
// - customer.subscription.updated
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed
```

### 错误处理

所有 API 都采用统一的错误处理格式：

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// 错误代码规范
const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
```

## 🎨 前端架构

### 组件架构

```
components/
├── ui/                 # 基础 UI 组件（Radix UI 封装）
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── magicui/            # 高级 UI 组件
│   ├── animated-counter.tsx
│   ├── sparkles-text.tsx
│   └── ...
├── payment/            # 支付相关组件
│   ├── pricing-card.tsx
│   ├── checkout-form.tsx
│   └── ...
└── seo/                # SEO 组件
    ├── meta-tags.tsx
    └── structured-data.tsx
```

### 功能模块架构

```
features/
├── auth/               # 认证模块
│   ├── components/     # 认证相关组件
│   ├── hooks/          # 认证相关 hooks
│   └── utils/          # 认证工具函数
├── tutorial/           # 教程模块
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── dashboard/          # 仪表板模块
├── blogs/              # 博客模块
└── use-cases/          # 用例模块
```

### 状态管理

使用 Zustand 进行状态管理：

```typescript
// stores/user-store.ts
interface UserState {
  user: User | null;
  loading: boolean;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  updateUser: (userData) => 
    set((state) => ({ 
      user: state.user ? { ...state.user, ...userData } : null 
    })),
  clearUser: () => set({ user: null }),
}));
```

### 路由设计

采用 Next.js App Router：

```
app/
├── (auth)/             # 认证路由组
│   ├── sign-in/
│   └── sign-up/
├── front/              # 前台页面
│   ├── dashboard/
│   ├── tutorial/
│   ├── use-cases/
│   ├── blogs/
│   └── settings/
├── backend/            # 后台管理
│   ├── tutorial/
│   ├── use-cases/
│   ├── blogs/
│   └── users/
└── api/                # API 路由
```

## 🔐 认证授权

### Clerk 集成

项目使用 Clerk 作为认证服务提供商：

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/front/dashboard(.*)',
  '/front/settings(.*)',
  '/backend(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

### 权限控制

```typescript
// 用户角色定义
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

// 权限检查 Hook
export function usePermissions() {
  const { user } = useUser();
  
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // 检查用户权限逻辑
    const userPermissions = user.publicMetadata.permissions as string[] || [];
    return userPermissions.includes(permission);
  };

  const isAdmin = () => {
    return user?.publicMetadata.role === UserRole.ADMIN ||
           user?.publicMetadata.role === UserRole.SUPER_ADMIN;
  };

  return { hasPermission, isAdmin };
}
```

### 保护路由

```typescript
// components/protected-route.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  permission, 
  fallback 
}: ProtectedRouteProps) {
  const { hasPermission } = usePermissions();
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (permission && !hasPermission(permission)) {
    return fallback || <div>无权限访问</div>;
  }

  return <>{children}</>;
}
```

## 💳 支付系统

### Stripe 集成架构

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// 创建订阅
export async function createSubscription({
  customerId,
  priceId,
  paymentMethodId,
}: CreateSubscriptionParams) {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    default_payment_method: paymentMethodId,
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
}
```

### 订阅管理

```typescript
// features/payments/hooks/use-subscription.ts
export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const updateSubscription = async (planId: string) => {
    try {
      const response = await fetch('/api/payments/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const result = await response.json();
      if (result.success) {
        setSubscription(result.data);
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const cancelSubscription = async () => {
    // 取消订阅逻辑
  };

  return {
    subscription,
    loading,
    updateSubscription,
    cancelSubscription,
  };
}
```

### Webhook 处理

```typescript
// app/api/payments/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { updateUserSubscription } from '@/lib/payments';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
  }

  return new Response('Webhook processed', { status: 200 });
}
```

## 🤖 AI 集成

### OpenRouter 配置

```typescript
// lib/openrouter.ts
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: ChatMessage[], model?: string) {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
        'X-Title': 'AI N8N',
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    return response.json();
  }
}
```

### AI 功能实现

```typescript
// app/api/ai/translate/route.ts
export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();
    
    const client = new OpenRouterClient(OPENROUTER_API_KEY!);
    
    const messages = [
      {
        role: 'system',
        content: `You are a professional translator. Translate the given text to ${targetLanguage}. Only return the translated text, no explanations.`
      },
      {
        role: 'user',
        content: text
      }
    ];

    const response = await client.chat(messages);
    const translatedText = response.choices[0].message.content;

    return NextResponse.json({
      success: true,
      data: {
        translatedText,
        sourceLanguage: 'auto',
        targetLanguage,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Translation failed'
    }, { status: 500 });
  }
}
```

## 🌐 国际化实现

### next-intl 配置

```typescript
// src/translate/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
  timeZone: 'Asia/Shanghai',
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    },
    number: {
      precise: {
        maximumFractionDigits: 5,
      },
    },
  },
}));
```

### 多语言路由

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/([\\w-]+)?/users/(.+)',
  ],
};
```

### 翻译文件结构

```json
// src/translate/messages/zh.json
{
  "common": {
    "title": "AI N8N",
    "description": "智能自动化学习平台",
    "loading": "加载中...",
    "error": "发生错误",
    "success": "操作成功"
  },
  "navigation": {
    "home": "首页",
    "tutorial": "教程",
    "useCases": "用例",
    "blogs": "博客",
    "pricing": "定价",
    "dashboard": "仪表板"
  },
  "tutorial": {
    "sections": {
      "title": "教程分类",
      "beginner": "初级教程",
      "intermediate": "中级教程",
      "advanced": "高级教程"
    }
  }
}
```

## ⚡ 性能优化

### 代码分割

```typescript
// 动态导入组件
const TutorialEditor = dynamic(
  () => import('@/features/tutorial/components/TutorialEditor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false,
  }
);

// 路由级别的代码分割
const AdminDashboard = dynamic(
  () => import('@/features/admin/AdminDashboard'),
  {
    loading: () => <DashboardSkeleton />,
  }
);
```

### 图片优化

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### 缓存策略

```typescript
// app/api/tutorial/route.ts
export async function GET() {
  const tutorials = await getTutorials();
  
  return NextResponse.json(tutorials, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// 使用 React 缓存
import { cache } from 'react';

export const getTutorialSections = cache(async () => {
  return await db.select().from(tutorialSections);
});
```

### 数据库优化

```typescript
// 使用预处理语句
const getTutorialsBySection = db
  .select()
  .from(tutorialModules)
  .where(eq(tutorialModules.sectionId, placeholder('sectionId')))
  .prepare();

// 批量操作
const updateMultipleProgress = db.transaction(async (tx) => {
  for (const progress of progressUpdates) {
    await tx.insert(userTutorialProgress).values(progress);
  }
});
```

## 🧪 测试策略

### 单元测试

```typescript
// __tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDuration, calculateProgress } from '@/lib/utils';

describe('Utils Functions', () => {
  it('should format duration correctly', () => {
    expect(formatDuration(65)).toBe('1h 5m');
    expect(formatDuration(30)).toBe('30m');
  });

  it('should calculate progress correctly', () => {
    expect(calculateProgress(3, 10)).toBe(30);
    expect(calculateProgress(0, 10)).toBe(0);
  });
});
```

### 集成测试

```typescript
// __tests__/api/tutorial.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/tutorial/route';

describe('/api/tutorial', () => {
  beforeEach(async () => {
    // 设置测试数据
  });

  afterEach(async () => {
    // 清理测试数据
  });

  it('should return tutorial sections', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
  });
});
```

### E2E 测试

```typescript
// e2e/tutorial.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tutorial System', () => {
  test('should complete a tutorial module', async ({ page }) => {
    await page.goto('/front/tutorial');
    
    // 选择一个教程分类
    await page.click('[data-testid="tutorial-section-beginner"]');
    
    // 选择一个模块
    await page.click('[data-testid="tutorial-module-first"]');
    
    // 完成所有步骤
    await page.click('[data-testid="start-tutorial"]');
    
    // 验证完成状态
    await expect(page.locator('[data-testid="completion-badge"]')).toBeVisible();
  });
});
```

## 🚀 部署流程

### Vercel 部署配置

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["hkg1", "sfo1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 环境变量配置

```bash
# .env.production
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
OPENROUTER_API_KEY="sk-or-v1-..."
NEXT_PUBLIC_SITE_URL="https://ai-n8n-pro.vercel.app"
```

### CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build project
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 📝 开发指南

### 项目规范

#### 代码风格

```typescript
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "import"],
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always"
      }
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

#### TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 开发工作流

#### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/tutorial-system

# 2. 开发和测试
pnpm dev
pnpm test

# 3. 代码检查
pnpm lint
pnpm type-check

# 4. 提交代码
git add .
git commit -m "feat: implement tutorial system"

# 5. 推送并创建 PR
git push origin feature/tutorial-system
```

#### 2. 数据库迁移

```bash
# 1. 修改数据库模式
# 编辑 src/drizzle/schemas/*.ts

# 2. 生成迁移文件
pnpm db:generate

# 3. 应用迁移
pnpm db:push

# 4. 查看数据库
pnpm db:studio
```

#### 3. 组件开发规范

```typescript
// components/ui/button.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          {
            'bg-primary text-primary-foreground': variant === 'primary',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
            'border border-input': variant === 'outline',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={loading}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### 调试技巧

#### 1. 日志记录

```typescript
// lib/logger.ts
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = process.env.NODE_ENV === 'production' 
      ? LogLevel.WARN 
      : LogLevel.DEBUG;
  }

  debug(message: string, ...args: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: any[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, ...args);
    }
  }
}

export const logger = new Logger();
```

#### 2. 错误边界

```typescript
// components/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">出现错误</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || '未知错误'}
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 性能监控

#### 1. Web Vitals

```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // 发送到分析服务
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export function trackWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

#### 2. 数据库性能监控

```typescript
// lib/db-monitor.ts
import { performance } from 'perf_hooks';
import { logger } from './logger';

export function withMonitoring<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;
      
      logger.info(`Database operation: ${operationName}`, {
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
      
      // 如果查询时间超过 1 秒，记录警告
      if (duration > 1000) {
        logger.warn(`Slow query detected: ${operationName}`, {
          duration: `${duration.toFixed(2)}ms`,
        });
      }
      
      resolve(result);
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      logger.error(`Database operation failed: ${operationName}`, error, {
        duration: `${duration.toFixed(2)}ms`,
      });
      
      reject(error);
    }
  });
}
```

---

## 📚 参考资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team/docs)

### 第三方服务
- [Clerk 文档](https://clerk.com/docs)
- [Stripe 文档](https://stripe.com/docs)
- [OpenRouter 文档](https://openrouter.ai/docs)
- [Vercel 文档](https://vercel.com/docs)

### 开发工具
- [VS Code](https://code.visualstudio.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Postman](https://www.postman.com/)
- [TablePlus](https://tableplus.com/)

---

