# 邮件功能配置指南

## 概述

联系表单现在集成了 Resend 邮件服务，可以自动发送邮件通知。当用户提交联系表单时，系统会：

1. 将消息保存到数据库
2. 向管理员发送包含联系详情的通知邮件
3. 向用户发送确认邮件

## 环境变量配置

需要在 `.env.local` 文件中配置以下环境变量：

```bash
# 必需的 Resend 配置
RESEND_API_KEY="your_resend_api_key_here"

# 可选配置（有默认值）
RESEND_FROM_EMAIL="contact@yourdomain.com"  # 默认: contact@ai-n8n.com
RESEND_TO_EMAIL="admin@yourdomain.com"      # 默认: admin@ai-n8n.com
NEXT_PUBLIC_APP_URL="https://yourdomain.com" # 默认: https://ai-n8n.com
```

## 获取 Resend API Key

1. 访问 [Resend.com](https://resend.com)
2. 注册/登录账户
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 API Key 并添加到环境变量中

## 域名验证

使用自定义发件域名需要在 Resend 中验证域名：

1. 在 Resend 控制台添加域名
2. 按照指示配置 DNS 记录
3. 等待域名验证完成
4. 更新 `RESEND_FROM_EMAIL` 使用验证的域名

## 功能特性

### 管理员通知邮件
- 包含完整的联系人信息
- 消息内容和技术信息
- 格式化的 HTML 邮件模板

### 用户确认邮件
- 感谢消息和确认信息
- 平台资源链接（教程、案例、博客）
- 专业的品牌邮件模板

### 错误处理
- 即使邮件发送失败，表单提交仍会成功
- 详细的错误日志记录
- 优雅的降级处理

## 测试

1. 配置环境变量
2. 重启开发服务器
3. 访问联系页面提交测试消息
4. 检查控制台日志和邮箱

## 故障排除

### 邮件未发送
1. 检查 `RESEND_API_KEY` 是否正确配置
2. 查看控制台错误日志
3. 验证 Resend 账户状态和限制
4. 确认发件域名已验证

### 收不到邮件
1. 检查垃圾邮件文件夹
2. 验证收件邮箱地址
3. 确认 Resend 账户配额未用完
4. 检查域名的 SPF/DKIM 配置

## 开发注意事项

- 如果未配置 `RESEND_API_KEY`，系统会跳过邮件发送但记录警告
- 所有邮件操作都是异步的，不会阻塞主要业务流程
- 邮件模板支持中英文动态内容
- 支持可选字段（公司、电话）的条件显示 