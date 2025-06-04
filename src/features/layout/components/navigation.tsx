'use client';

import React, { useState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser, useClerk } from '@clerk/nextjs';
import { useLocale, useTranslations } from 'next-intl';
import { setClientLocale } from '@/lib/locale-client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Shield, LogOut, Menu, X, Sun, Moon, Laptop, Globe, Languages } from 'lucide-react';
import { checkIsAdmin } from '@/lib/auth';
import { useTheme } from 'next-themes';

export default function Navigation() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const localeT = useTranslations('LocaleSwitcher');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 确保组件在客户端挂载后才显示用户相关内容
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 暂时注释掉管理员检查，避免 Server Action 调用问题
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (user?.primaryEmailAddress?.emailAddress) {
          const adminStatus = await checkIsAdmin(user.primaryEmailAddress.emailAddress);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    if (isLoaded && user && isMounted) {
      checkAdminStatus();
    }
  }, [user, isLoaded, isMounted]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLanguageChange = (newLocale: 'zh' | 'en') => {
    startTransition(() => {
      setClientLocale(newLocale);
    });
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress;
    }
    return 'User';
  };

  const navItems = [
    { href: '/', label: t('home'), active: pathname==='/' },
    { href: '/front/tutorial', label: t('learning'), active: pathname.startsWith('/front/tutorial') },
    { href: '/front/use-cases', label: t('useCases'), active: pathname.startsWith('/front/use-cases') },
    { href: '/front/blogs', label: t('articles'), active: pathname.startsWith('/front/blogs') },
    { href: '/front/about', label: t('about'), active: pathname.startsWith('/front/about') },
    { href: '/front/contact', label: t('contact'), active: pathname.startsWith('/front/contact') },
  ];

  const ThemeToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>亮色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>深色</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>跟随系统</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const LanguageToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{localeT('label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('zh')}
          className={locale === 'zh' ? 'bg-primary/10' : ''}
        >
          <Globe className="mr-2 h-4 w-4" />
          <span>{localeT('zh')}</span>
          {locale === 'zh' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={locale === 'en' ? 'bg-primary/10' : ''}
        >
          <Globe className="mr-2 h-4 w-4" />
          <span>{localeT('en')}</span>
          {locale === 'en' && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <span className="text-2xl font-bold gradient-text">AI</span>
                <span className="text-2xl font-bold text-primary ml-1">n8n</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>
          
          {/* 桌面端导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                  item.active 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
                {item.active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* 右侧操作区域 */}
          <div className="flex items-center space-x-2">
            {/* 语言切换器 */}
            <LanguageToggle />
            
            {/* 主题切换器 */}
            <ThemeToggle />

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* 用户菜单区域 */}
            {!isMounted ? (
              // 服务器端和初始客户端渲染显示加载状态
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
              </div>
            ) : isLoaded && user ? (
              // 已登录用户菜单
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.imageUrl} alt={getUserDisplayName(user)} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getUserDisplayName(user)}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/front/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/front/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t('settings')}</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* 管理员菜单项 */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/backend" className="flex items-center text-primary">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>{t('adminPanel')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLoaded ? (
              // 未登录用户按钮
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="font-medium">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="btn-primary-gradient">
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 移动端侧边菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-background/95 backdrop-blur-sm border-t border-border/40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
                  item.active 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* 移动端语言和主题切换 */}
            <div className="pt-4 border-t border-border/40 space-y-2">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">{localeT('label')}</p>
                <div className="flex space-x-2">
                  <Button
                    variant={locale === 'zh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleLanguageChange('zh');
                      setIsMenuOpen(false);
                    }}
                  >
                    {localeT('zh')}
                  </Button>
                  <Button
                    variant={locale === 'en' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      handleLanguageChange('en');
                      setIsMenuOpen(false);
                    }}
                  >
                    {localeT('en')}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 移动端用户操作 */}
            {isLoaded && !user && (
              <div className="pt-4 border-t border-border/40 space-y-2">
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full btn-primary-gradient" size="sm">
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 