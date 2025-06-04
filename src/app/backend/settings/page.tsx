'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Database,
  Palette,
  Globe,
  Brain,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getSystemSettings, saveSystemSettings, resetSystemSettings, type SettingsData } from '@/features/settings/actions/settings-actions';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData>({
    // 网站基本设置
    siteName: 'n8n 教程平台',
    siteDescription: '专业的 n8n 自动化教程平台',
    siteUrl: 'https://your-domain.com',
    adminEmail: 'admin@example.com',
    
    // 功能设置
    enableRegistration: true,
    enableComments: true,
    enableNotifications: true,
    enableAnalytics: false,
    
    // AI设置
    openrouterApiKey: '',
    openrouterModel: 'anthropic/claude-3.5-sonnet',
    enableAIFeatures: true,
    
    // 显示设置
    itemsPerPage: '10',
    defaultLanguage: 'zh-CN',
    timezone: 'Asia/Shanghai',
  });

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setInitialLoading(true);
      const result = await getSystemSettings();
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        toast.error(result.error || '加载设置失败');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('加载设置失败');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await saveSystemSettings(settings);
      if (result.success) {
        toast.success('设置保存成功');
      } else {
        toast.error(result.error || '保存设置失败');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
      setLoading(true);
      try {
        const result = await resetSystemSettings();
        if (result.success) {
          toast.success('设置已重置');
          await loadSettings(); // 重新加载设置
        } else {
          toast.error(result.error || '重置设置失败');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error('重置设置失败');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            系统设置
          </h1>
          <p className="mt-2 text-gray-600">
            管理系统的基本配置和功能设置
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重置设置
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 网站基本设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              网站基本设置
            </CardTitle>
            <CardDescription>
              配置网站的基本信息和元数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">网站名称</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                placeholder="请输入网站名称"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">网站描述</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                placeholder="请输入网站描述"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="siteUrl">网站URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => updateSetting('siteUrl', e.target.value)}
                placeholder="https://your-domain.com"
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">管理员邮箱</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* 功能设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              功能设置
            </CardTitle>
            <CardDescription>
              控制网站的各项功能开关
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableRegistration">用户注册</Label>
                <p className="text-sm text-gray-500">允许新用户注册账号</p>
              </div>
              <Switch
                id="enableRegistration"
                checked={settings.enableRegistration}
                onCheckedChange={(checked) => updateSetting('enableRegistration', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableComments">评论功能</Label>
                <p className="text-sm text-gray-500">允许用户发表评论</p>
              </div>
              <Switch
                id="enableComments"
                checked={settings.enableComments}
                onCheckedChange={(checked) => updateSetting('enableComments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">通知功能</Label>
                <p className="text-sm text-gray-500">启用系统通知</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnalytics">数据分析</Label>
                <p className="text-sm text-gray-500">启用访问统计</p>
              </div>
              <Switch
                id="enableAnalytics"
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => updateSetting('enableAnalytics', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI设置
            </CardTitle>
            <CardDescription>
              配置OpenRouter AI服务和模型选择
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAIFeatures">启用AI功能</Label>
                <p className="text-sm text-gray-500">开启AI辅助分析和生成功能</p>
              </div>
              <Switch
                id="enableAIFeatures"
                checked={settings.enableAIFeatures}
                onCheckedChange={(checked) => updateSetting('enableAIFeatures', checked)}
              />
            </div>
            <div>
              <Label htmlFor="openrouterApiKey">OpenRouter API密钥</Label>
              <Input
                id="openrouterApiKey"
                type="password"
                value={settings.openrouterApiKey}
                onChange={(e) => updateSetting('openrouterApiKey', e.target.value)}
                placeholder="请输入OpenRouter API密钥"
                disabled={!settings.enableAIFeatures}
              />
              <p className="text-xs text-gray-500 mt-1">
                获取API密钥：<a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://openrouter.ai/keys</a>
              </p>
            </div>
            <div>
              <Label htmlFor="openrouterModel">AI模型</Label>
              <select
                id="openrouterModel"
                value={settings.openrouterModel}
                onChange={(e) => updateSetting('openrouterModel', e.target.value)}
                disabled={!settings.enableAIFeatures}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="google/gemini-pro">Gemini Pro</option>
                <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
                <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                选择用于AI分析和生成的模型，不同模型有不同的性能和成本
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 显示设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              显示设置
            </CardTitle>
            <CardDescription>
              配置界面显示和用户体验相关设置
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="itemsPerPage">每页显示条数</Label>
                <Input
                  id="itemsPerPage"
                  type="number"
                  value={settings.itemsPerPage}
                  onChange={(e) => updateSetting('itemsPerPage', e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="defaultLanguage">默认语言</Label>
                <select
                  id="defaultLanguage"
                  value={settings.defaultLanguage}
                  onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">时区</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Asia/Shanghai">Asia/Shanghai</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 