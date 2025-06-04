import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  Users, 
  Gavel,
  BookOpen,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "2025年6月";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">使用条款</h1>
            <p className="text-xl text-muted-foreground mb-4">
              使用本平台前请仔细阅读以下条款
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
            
            {/* Agreement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  协议接受
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  欢迎使用 AI-N8N 平台（以下简称"本平台"、"我们"）。通过访问或使用本平台，您同意受本使用条款（以下简称"条款"）的约束。
                </p>
                <p>
                  如果您不同意这些条款，请不要使用本平台。我们保留随时修改这些条款的权利，修改后的条款将在发布后立即生效。
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  服务描述
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>AI-N8N 是一个专注于 n8n 自动化工具的学习平台，提供：</p>
                <ul>
                  <li>n8n 教程和学习资源</li>
                  <li>实际使用案例和工作流模板</li>
                  <li>技术博客和最佳实践分享</li>
                  <li>社区交流和互动功能</li>
                  <li>学习进度跟踪和管理</li>
                </ul>
                <p>我们致力于为用户提供高质量的学习体验和技术支持。</p>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  用户责任
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>作为平台用户，您同意：</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-green-600 dark:text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      允许的行为
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>提供准确的注册信息</li>
                      <li>合理使用平台资源</li>
                      <li>尊重其他用户</li>
                      <li>分享有价值的内容</li>
                      <li>遵守相关法律法规</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-red-600 dark:text-red-400 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      禁止的行为
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>发布虚假或误导信息</li>
                      <li>侵犯他人知识产权</li>
                      <li>进行恶意攻击或骚扰</li>
                      <li>发布垃圾内容或广告</li>
                      <li>尝试破坏平台安全</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  知识产权
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>平台内容</h3>
                <p>
                  本平台的所有内容，包括但不限于文本、图像、代码、设计、商标和商业秘密，均受知识产权法保护。
                  除明确授权外，您不得复制、修改、分发或创建衍生作品。
                </p>
                
                <h3>用户内容</h3>
                <p>
                  您对自己发布的内容保留所有权，但授予我们使用、修改、展示和分发该内容的权利。
                  您保证拥有发布内容的合法权利，且不侵犯第三方权益。
                </p>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  账户管理
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>账户创建</h3>
                <ul>
                  <li>您必须提供准确、完整的注册信息</li>
                  <li>一人只能注册一个账户</li>
                  <li>您有责任保护账户安全</li>
                  <li>发现未授权使用应立即通知我们</li>
                </ul>
                
                <h3>账户终止</h3>
                <p>
                  我们保留在以下情况下暂停或终止您账户的权利：
                </p>
                <ul>
                  <li>违反本使用条款</li>
                  <li>长期不活跃</li>
                  <li>从事非法活动</li>
                  <li>损害平台利益或其他用户权益</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  隐私和数据
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  我们重视您的隐私权。有关我们如何收集、使用和保护您的个人信息，请参阅我们的
                  <a href="/front/privacy" className="text-primary hover:underline">隐私政策</a>。
                </p>
                <p>
                  使用本平台即表示您同意我们的隐私政策。
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-primary" />
                  责任限制
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">重要声明</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        本平台"按现状"提供服务，不对服务的完整性、准确性或可用性作出保证。
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3>免责声明</h3>
                <ul>
                  <li>我们不保证服务不会中断或无错误</li>
                  <li>不对用户生成的内容负责</li>
                  <li>不保证第三方链接的安全性</li>
                  <li>不对因使用本平台造成的损失承担责任</li>
                </ul>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="w-5 h-5 mr-2 text-primary" />
                  争议解决
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <h3>适用法律</h3>
                <p>
                  本条款受中华人民共和国法律管辖，不考虑法律冲突原则。
                </p>
                
                <h3>争议处理</h3>
                <ol>
                  <li><strong>友好协商：</strong>首先尝试通过友好协商解决争议</li>
                  <li><strong>仲裁：</strong>协商不成的，提交有管辖权的仲裁机构仲裁</li>
                  <li><strong>诉讼：</strong>仲裁不适用的情况下，向有管辖权的法院提起诉讼</li>
                </ol>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>
    </div>
  );
} 