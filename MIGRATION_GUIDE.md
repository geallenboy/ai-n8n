# 🗄️ PostgreSQL 迁移到 Neon 数据库指南

本指南将帮助你将 AI-N8N 项目的本地 PostgreSQL 数据库迁移到 Neon 云数据库。

## 📋 迁移概览

- **源数据库**: 本地 PostgreSQL
- **目标数据库**: Neon (基于 PostgreSQL 的云数据库)
- **ORM**: Drizzle ORM
- **迁移方式**: 完整数据备份 + 恢复

## 🔧 准备工作

### 1. 确保工具已安装

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# 验证安装
pg_dump --version
psql --version
```

### 2. 创建 Neon 数据库

1. 访问 [Neon.tech](https://neon.tech/)
2. 注册并登录账户
3. 创建新项目
4. 选择 PostgreSQL 数据库
5. 复制连接字符串，格式类似：
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/database?sslmode=require
   ```

## 🚀 快速迁移 (推荐)

使用一键迁移脚本：

```bash
# 给脚本执行权限
chmod +x scripts/migrate-all.sh

# 执行迁移 (替换为你的 Neon 数据库 URL)
./scripts/migrate-all.sh "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/ai-n8n?sslmode=require"
```

## 📝 手动迁移步骤

如果你想了解详细过程或需要自定义迁移，可以按以下步骤手动执行：

### 步骤 1: 备份本地数据库

```bash
# 确保脚本有执行权限
chmod +x scripts/backup-database.sh

# 运行备份
./scripts/backup-database.sh
```

备份文件将保存在 `./database-backups/` 目录中。

### 步骤 2: 迁移数据到 Neon

```bash
# 确保脚本有执行权限
chmod +x scripts/migrate-to-neon.sh

# 运行迁移 (替换为你的 Neon URL)
./scripts/migrate-to-neon.sh "你的_NEON_数据库_URL"
```

### 步骤 3: 更新环境配置

```bash
# 确保脚本有执行权限
chmod +x scripts/update-env-for-neon.sh

# 更新环境配置
./scripts/update-env-for-neon.sh "你的_NEON_数据库_URL"
```

### 步骤 4: 验证迁移

```bash
# 测试数据库连接
pnpm db:studio

# 启动开发服务器
pnpm dev
```

## 🔍 验证迁移成功

### 1. 检查数据库连接

```bash
# 打开 Drizzle Studio
pnpm db:studio
```

你应该能看到所有迁移的表和数据。

### 2. 检查应用功能

启动应用并测试关键功能：
- 用户注册/登录
- 数据的读取和写入
- API 功能正常

### 3. 检查表结构

在 Drizzle Studio 中验证以下表存在：
- `users` - 用户信息
- `tutorial_sections` - 教程分类
- `tutorial_modules` - 教程模块  
- `tutorial_steps` - 教程步骤
- `use_cases` - 用例
- `blogs` - 博客
- `payment_records` - 支付记录
- 其他相关表

## 🐛 常见问题

### 问题 1: pg_dump 命令未找到

**解决方案**:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows (使用 WSL 或下载 PostgreSQL)
```

### 问题 2: 连接 Neon 数据库失败

**可能原因**:
- URL 格式错误
- 网络连接问题
- SSL 配置问题

**解决方案**:
```bash
# 测试连接
psql "你的_NEON_数据库_URL" -c "SELECT version();"

# 确保 URL 包含 sslmode=require
```

### 问题 3: 数据导入失败

**可能原因**:
- 权限问题
- 数据冲突
- 版本兼容性

**解决方案**:
```bash
# 查看详细错误信息
psql "你的_NEON_数据库_URL" < backup_file.sql 2>&1 | tee import.log

# 清空目标数据库后重试
```

### 问题 4: 应用无法连接到新数据库

**检查项目**:
1. `.env.local` 文件中的 `DATABASE_URL` 是否正确
2. 环境变量是否生效
3. Drizzle 配置是否正确

## 📊 性能对比

| 特性 | 本地 PostgreSQL | Neon |
|------|----------------|------|
| 可用性 | 本地依赖 | 99.9% SLA |
| 备份 | 手动 | 自动 |
| 扩展性 | 硬件限制 | 自动扩展 |
| 维护 | 手动维护 | 托管服务 |
| 成本 | 硬件成本 | 按使用量 |

## 🔒 安全建议

1. **数据库 URL 安全**:
   - 不要在代码中硬编码数据库 URL
   - 使用环境变量存储敏感信息
   - 定期轮换数据库密码

2. **备份策略**:
   - 保留本地备份文件
   - 利用 Neon 的自动备份功能
   - 定期测试备份恢复

3. **访问控制**:
   - 使用强密码
   - 限制数据库访问 IP
   - 启用 SSL 连接

## 📈 后续优化

### 1. 连接池优化

考虑在 Drizzle 配置中添加连接池：

```typescript
// src/drizzle/index.ts
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schemas"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const db = drizzle({ client: pool, schema })
```

### 2. 监控设置

配置数据库监控：
- 查询性能监控
- 连接数监控
- 错误率监控

### 3. 缓存策略

考虑添加 Redis 缓存层来减少数据库负载。

## 📞 获取帮助

如果在迁移过程中遇到问题：

1. 查看 [Neon 官方文档](https://neon.tech/docs)
2. 检查 [Drizzle ORM 文档](https://orm.drizzle.team/)
3. 查看项目 Issues 或创建新 Issue

## 🎉 迁移完成

恭喜！你已经成功将数据库迁移到 Neon。现在你可以享受云数据库的便利：

- ✅ 高可用性和可靠性
- ✅ 自动备份和恢复
- ✅ 无需维护基础设施
- ✅ 按需扩展
- ✅ 全球分布式访问

享受使用 Neon 云数据库！🌟 