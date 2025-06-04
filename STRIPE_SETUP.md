# Stripe 支付功能设置指南

## 概述

本项目集成了 Stripe 支付功能，支持订阅制付费模式。用户可以选择免费版、专业版或企业版订阅计划。

## 功能特性

- ✅ 三种订阅计划（免费版、专业版、企业版）
- ✅ 月付/年付选择（年付享受20%折扣）
- ✅ Stripe Checkout 安全支付
- ✅ Webhook 自动处理订阅状态
- ✅ 用户使用限额管理
- ✅ 支付记录追踪

## 数据库表结构

### 1. subscription_plans (订阅计划表)
- 存储不同的订阅计划信息
- 包含价格、功能列表、Stripe价格ID等

### 2. user_subscriptions (用户订阅表)
- 记录用户的订阅状态
- 关联Stripe客户ID和订阅ID

### 3. payment_records (支付记录表)
- 记录所有支付交易
- 包含成功和失败的支付记录

### 4. user_usage_limits (用户使用限额表)
- 跟踪用户的使用情况
- 根据订阅计划限制访问

## Stripe 设置步骤

### 1. 创建 Stripe 账户
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册并完成账户验证

### 2. 获取 API 密钥
1. 在 Stripe Dashboard 中，进入 "Developers" > "API keys"
2. 复制以下密钥：
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

### 3. 创建产品和价格
1. 在 Stripe Dashboard 中，进入 "Products"
2. 创建以下产品：

#### 专业版 (Pro)
- 月付：¥29/月
- 年付：¥290/年

#### 企业版 (Enterprise)
- 月付：¥99/月
- 年付：¥990/年

3. 记录每个价格的 Price ID (price_xxx...)

### 4. 设置 Webhook
1. 在 Stripe Dashboard 中，进入 "Developers" > "Webhooks"
2. 点击 "Add endpoint"
3. 设置 Endpoint URL：`https://yourdomain.com/api/payments/webhook`
4. 选择以下事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. 复制 Webhook 签名密钥 (whsec_...)

### 5. 环境变量配置

创建 `.env.local` 文件（如果不存在），并添加以下配置：

```env
# 数据库配置
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxx"
CLERK_SECRET_KEY="sk_test_xxx"

# OpenRouter API
OPENROUTER_API_KEY="sk-or-v1-xxx"

# Stripe 支付配置 - 必需！
STRIPE_SECRET_KEY="sk_test_51xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# 站点配置 - 必需！
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 邮件配置 (可选)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# 开发环境
NODE_ENV="development"
```

**重要注意事项：**
- 确保 `.env.local` 文件在项目根目录
- `STRIPE_SECRET_KEY` 和 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 必须来自同一个 Stripe 账户
- 测试环境使用 `sk_test_` 和 `pk_test_` 开头的密钥
- 生产环境使用 `sk_live_` 和 `pk_live_` 开头的密钥

### 6. 更新价格ID
在 `src/components/payment/pricing-section.tsx` 中更新实际的 Stripe Price ID：

```typescript
const pricingPlans: PricingPlan[] = [
  // ...
  {
    id: 'pro',
    // ...
    stripePriceIdMonthly: 'price_your_pro_monthly_id',
    stripePriceIdYearly: 'price_your_pro_yearly_id',
    // ...
  },
  {
    id: 'enterprise',
    // ...
    stripePriceIdMonthly: 'price_your_enterprise_monthly_id',
    stripePriceIdYearly: 'price_your_enterprise_yearly_id',
    // ...
  }
];
```

## 快速修复当前错误

如果您遇到 `STRIPE_SECRET_KEY is not set` 错误，请按照以下步骤操作：

1. **检查环境变量文件**：
   ```bash
   ls -la .env*
   ```

2. **创建 .env.local 文件**（如果不存在）：
   ```bash
   touch .env.local
   ```

3. **添加最小配置**：
   ```env
   # 最小 Stripe 配置
   STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **重启开发服务器**：
   ```bash
   pnpm dev
   ```

## 测试

### 1. 测试支付
使用 Stripe 提供的测试卡号：
- 成功支付：`4242 4242 4242 4242`
- 失败支付：`4000 0000 0000 0002`

### 2. 测试 Webhook
1. 使用 Stripe CLI 进行本地测试：
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

2. 触发测试事件：
```bash
stripe trigger customer.subscription.created
```

## 部署注意事项

1. **生产环境密钥**：确保在生产环境中使用 `pk_live_` 和 `sk_live_` 密钥
2. **Webhook URL**：更新 Webhook 端点为生产域名
3. **HTTPS**：Stripe 要求 Webhook 端点使用 HTTPS
4. **数据库迁移**：运行数据库迁移以创建支付相关表

## 安全考虑

1. **密钥保护**：永远不要在客户端代码中暴露 Secret Key
2. **Webhook 验证**：始终验证 Webhook 签名
3. **用户验证**：确保只有认证用户可以创建订阅
4. **金额验证**：在服务端验证支付金额

## 故障排除

### 常见问题

1. **STRIPE_SECRET_KEY is not set 错误**
   - 检查 `.env.local` 文件是否存在于项目根目录
   - 确认文件中包含 `STRIPE_SECRET_KEY="sk_test_xxx"`
   - 重启开发服务器

2. **Webhook 签名验证失败**
   - 检查 `STRIPE_WEBHOOK_SECRET` 是否正确
   - 确保使用原始请求体进行验证

3. **支付失败**
   - 检查 Stripe 价格ID是否正确
   - 确认产品在 Stripe 中处于活跃状态

4. **订阅状态不同步**
   - 检查 Webhook 是否正确配置
   - 查看 Stripe Dashboard 中的 Webhook 日志

### 环境变量调试

使用内置的环境变量检查器：

```typescript
import { checkStripeEnvVars } from '@/lib/env-check';

// 在开发中调用此函数查看配置状态
checkStripeEnvVars();
```

### 日志查看
- Stripe Dashboard > Developers > Logs
- 应用程序日志中的 Webhook 处理记录

## 支持

如有问题，请参考：
- [Stripe 文档](https://stripe.com/docs)
- [Stripe 支持](https://support.stripe.com/)
- 项目 GitHub Issues 