'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Mail, ExternalLink, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* 品牌介绍 */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                <span className="text-3xl font-bold text-white ml-1">n8n</span>
                <Zap className="absolute -top-1 -right-6 h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-gray-300 hover:text-white">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-gray-300 hover:text-white">
                <Mail className="h-5 w-5" />
                <span className="sr-only">{t('email')}</span>
              </Button>
            </div>
          </div>
          
          {/* 产品链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">{t('product.title')}</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/front/use-cases" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('product.useCases')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/tutorial"
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('product.learning')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/blogs" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('product.blogs')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('product.dashboard')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 公司信息 */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">{t('company.title')}</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/front/about" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('company.about')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/contact" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('company.contact')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/privacy" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('company.privacy')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/front/terms" 
                  className="text-gray-300 hover:text-white transition-colors group flex items-center"
                >
                  {t('company.terms')}
                  <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 分割线 */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-gray-300 text-sm">
              <span>{t('copyright', { year: currentYear })}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                {t('madeWith')} <Heart className="h-4 w-4 mx-1 text-red-400 animate-pulse" /> {t('byTeam')}
              </span>
            </div>
            
           
          </div>
        </div>
      </div>
      
      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </footer>
  );
} 