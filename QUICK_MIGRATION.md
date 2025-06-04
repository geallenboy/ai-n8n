# 🚀 快速迁移到 Neon 数据库

## 📋 5分钟完成迁移

### 1️⃣ 获取 Neon 数据库 URL

1. 访问 [neon.tech](https://neon.tech/) 
2. 注册并创建新项目
3. 复制数据库连接字符串

### 2️⃣ 一键迁移

```bash
# 使用一键迁移脚本
pnpm db:migrate-all "postgresql://ain8ndb_owner:npg_J1UE8qHolLxs@ep-green-brook-aa8ekr1z-pooler.westus3.azure.neon.tech/ain8ndb?sslmode=require"
```

### 3️⃣ 验证迁移

```bash
# 打开数据库管理界面
pnpm db:studio

# 启动应用
pnpm dev
```

## 🎉 完成！

现在你的应用已经使用 Neon 云数据库了！

## 💡 或者使用单独的命令

### 只备份数据库
```bash
pnpm db:backup
```

### 只迁移到 Neon
```bash
pnpm db:migrate-to-neon "你的_NEON_数据库_URL"
```

## ⚠️ 重要提醒

- 确保本地PostgreSQL正在运行且有数据
- 备份文件会保存在 `./database-backups/` 目录
- 原环境文件会自动备份
- 迁移完成后请测试所有功能

---

详细指南请查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 