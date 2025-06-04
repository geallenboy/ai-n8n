'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation, Footer } from '@/features/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Sun,
  Camera,
  Save,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    updates: true
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen ">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen ">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-8">您需要登录才能访问设置页面</p>
            <Link href="/sign-in">
              <Button>立即登录</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // 这里应该调用API来保存用户信息
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen ">
     
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">账户设置</h1>
          <p className="text-gray-600">管理您的账户信息和偏好设置</p>
        </div>

        <div className="space-y-6">
          {/* 个人资料 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                个人资料
              </CardTitle>
              <CardDescription>
                更新您的个人信息和头像
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 头像部分 */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.imageUrl} alt="Profile" />
                  <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    更换头像
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    支持 JPG、PNG 格式，最大 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">名字</Label>
                  <Input 
                    id="firstName" 
                    defaultValue={user?.firstName || ''} 
                    placeholder="请输入您的名字"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">姓氏</Label>
                  <Input 
                    id="lastName" 
                    defaultValue={user?.lastName || ''} 
                    placeholder="请输入您的姓氏"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ''} 
                  disabled
                  className=""
                />
                <p className="text-sm text-gray-500">
                  邮箱地址无法更改。如需更改，请联系客服。
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      保存更改
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                通知设置
              </CardTitle>
              <CardDescription>
                选择您希望接收的通知类型
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>邮件通知</Label>
                  <p className="text-sm text-gray-500">接收重要更新和教程提醒</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>推送通知</Label>
                  <p className="text-sm text-gray-500">在浏览器中接收即时通知</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>营销邮件</Label>
                  <p className="text-sm text-gray-500">接收产品更新和特别优惠</p>
                </div>
                <Switch 
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>系统更新</Label>
                  <p className="text-sm text-gray-500">接收系统维护和更新通知</p>
                </div>
                <Switch 
                  checked={notifications.updates}
                  onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 外观设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                外观与语言
              </CardTitle>
              <CardDescription>
                自定义您的界面外观和语言偏好
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>深色模式</Label>
                  <p className="text-sm text-gray-500">切换到深色主题</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="language">界面语言</Label>
                <select 
                  id="language"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="zh"
                >
                  <option value="zh">中文（简体）</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
          </Card>


          
        </div>
      </main>

    </div>
  );
} 