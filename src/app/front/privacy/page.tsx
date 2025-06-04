import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  FileText,
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "2025年6月";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">隐私政策</h1>
            <p className="text-xl text-muted-foreground mb-4">
              我们承诺保护您的隐私和个人信息
            </p>
            <Badge variant="secondary" className="text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              最后更新：{lastUpdated}
            </Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  概述
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  欢迎使用 AI-N8N 平台（以下简称"本平台"）。我们深知您对隐私的关注，本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
                </p>
                <p>
                  使用本平台服务即表示您同意本隐私政策的条款。如果您不同意本政策的任何部分，请停止使用我们的服务。
                </p>
              </CardContent>
            </Card>

            {/* Information Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-primary" />
                  信息收集
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>我们收集的信息类型：</h3>
                <ul>
                  <li><strong>账户信息：</strong>用户名、邮箱地址、密码（加密存储）</li>
                  <li><strong>个人资料：</strong>姓名、头像、个人简介、技能水平</li>
                  <li><strong>使用数据：</strong>学习进度、浏览记录、偏好设置</li>
                  <li><strong>交互数据：</strong>评论、点赞、收藏、分享行为</li>
                  <li><strong>技术信息：</strong>IP地址、设备信息、浏览器类型</li>
                  <li><strong>联系信息：</strong>通过联系表单提交的消息和反馈</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-primary" />
                  信息使用
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>我们使用您的信息用于：</h3>
                <ul>
                  <li>提供和改进我们的服务</li>
                  <li>个性化您的学习体验</li>
                  <li>发送服务通知和更新</li>
                  <li>回应您的询问和请求</li>
                  <li>分析平台使用情况以优化服务</li>
                  <li>防止欺诈和确保平台安全</li>
                  <li>遵守法律法规要求</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  信息共享
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>我们不会出售您的个人信息。我们仅在以下情况下共享信息：</h3>
                <ul>
                  <li><strong>征得同意：</strong>获得您的明确同意</li>
                  <li><strong>服务提供商：</strong>与受信任的第三方服务商（如云存储提供商）</li>
                  <li><strong>法律要求：</strong>遵守法律义务或法院命令</li>
                  <li><strong>安全保护：</strong>保护用户和平台的安全</li>
                  <li><strong>业务转让：</strong>在企业并购等情况下</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-primary" />
                  数据安全
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>我们采取的安全措施：</h3>
                <ul>
                  <li>数据传输采用 HTTPS 加密</li>
                  <li>密码使用安全的哈希算法存储</li>
                  <li>定期进行安全审计和漏洞扫描</li>
                  <li>访问控制和权限管理</li>
                  <li>数据备份和灾难恢复计划</li>
                  <li>员工安全培训和保密协议</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  您的权利
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>您对个人信息享有以下权利：</h3>
                <ul>
                  <li><strong>访问权：</strong>查看我们持有的您的个人信息</li>
                  <li><strong>更正权：</strong>更新或修正不准确的信息</li>
                  <li><strong>删除权：</strong>请求删除您的个人信息</li>
                  <li><strong>限制权：</strong>限制我们处理您的信息</li>
                  <li><strong>数据可携性：</strong>获取您的数据副本</li>
                  <li><strong>撤销同意：</strong>随时撤销对数据处理的同意</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2 text-primary" />
                  Cookie 和追踪技术
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>我们使用 Cookie 和类似技术来：</p>
                <ul>
                  <li>保持您的登录状态</li>
                  <li>记住您的偏好设置</li>
                  <li>分析网站使用情况</li>
                  <li>提供个性化内容</li>
                </ul>
                <p>您可以通过浏览器设置管理 Cookie 偏好。</p>
              </CardContent>
            </Card>


            {/* Policy Changes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                  政策更新
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  我们可能会不时更新本隐私政策。重大变更将通过邮件或平台通知的方式告知您。
                  建议您定期查看本页面以了解最新的隐私政策。
                </p>
                <p>
                  继续使用我们的服务即表示您接受更新后的隐私政策。
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
} 