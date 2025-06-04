'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Lightbulb,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  Sparkles
} from 'lucide-react';


const adminNavItems = [
  {
    title: '仪表板',
    href: '/backend',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: '用户管理',
    href: '/backend/users',
    icon: Users,
    badge: 'Pro',
  },
  {
    title: '教程管理',
    href: '/backend/tutorial',
    icon: BookOpen,
    badge: null,
  },
  {
    title: '博客管理',
    href: '/backend/blogs',
    icon: FileText,
    badge: null,
  },
  {
    title: '案例管理',
    href: '/backend/use-cases',
    icon: Lightbulb,
    badge: null,
  },
  {
    title: '系统设置',
    href: '/backend/settings',
    icon: Settings,
    badge: null,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border shadow-lg flex flex-col">
      {/* 头部 */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center mb-2">
          <div className="relative">
            <span className="text-xl font-bold gradient-text">AI</span>
            <span className="text-xl font-bold text-sidebar-foreground ml-1">n8n</span>
            <Sparkles className="absolute -top-1 -right-4 h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-sidebar-foreground/70">管理后台</p>
        <Badge variant="secondary" className="mt-2 text-xs">
          v2.0.0
        </Badge>
      </div>
      
      {/* 导航菜单 */}
      <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = mounted && (pathname === item.href || (item.href !== '/backend' && pathname.startsWith(item.href)));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <div className="flex items-center">
                <Icon className={cn(
                  "h-4 w-4 mr-3 transition-colors",
                  isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                )} />
                <span>{item.title}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {item.badge && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                    {item.badge}
                  </Badge>
                )}
                {isActive && (
                  <ChevronRight className="h-3 w-3 text-sidebar-accent-foreground" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* 底部操作区 */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
       
        
        {/* 返回首页 */}
        <Link
          href="/"
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200 group"
        >
          <Home className="h-4 w-4 mr-3 text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground transition-colors" />
          返回首页
        </Link>
        
        {/* 退出登录 */}
        <Button
          variant="ghost" 
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            // 这里应该调用退出登录逻辑
            window.location.href = '/sign-in';
          }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          退出登录
        </Button>
      </div>
    </div>
  );
} 