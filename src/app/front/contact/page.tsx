'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Heart,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactMethods = [
    {
      icon: Mail,
      title: t('methods.email.title'),
      description: t('methods.email.description'),
      contact: t('methods.email.contact'),
      action: 'gejialun88@gmail.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageCircle,
      title: '微信联系',
      description: '通过微信快速联系我们',
      contact: '微信号：gegarron',
      action: 'weixin://contacts/profile/gegarron',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Github,
      title: t('methods.github.title'),
      description: t('methods.github.description'),
      contact: t('methods.github.contact'),
      action: 'https://github.com/geallenboy/ai-n8n',
      color: 'from-gray-600 to-gray-700'
    }
  ];

  const businessHours = [
    {
      day: t('office.schedule.weekdays'),
      time: t('office.schedule.weekdaysTime'),
      available: true
    },
    {
      day: t('office.schedule.saturday'),
      time: t('office.schedule.saturdayTime'),
      available: true
    },
    {
      day: t('office.schedule.sunday'),
      time: t('office.schedule.sundayTime'),
      available: false
    },
    {
      day: t('office.schedule.holiday'),
      time: t('office.schedule.holidayTime'),
      available: false
    }
  ];

  const socialLinks = [
    { name: t('social.twitter'), icon: Twitter, href: '#', color: 'text-blue-500' },
    { name: t('social.linkedin'), icon: Linkedin, href: '#', color: 'text-blue-600' },
    { name: t('social.github'), icon: Github, href: '#', color: 'text-gray-700 dark:text-gray-300' },
    { name: t('social.website'), icon: Globe, href: '#', color: 'text-green-500' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("请填写必要信息", {
        description: "姓名、邮箱、主题和消息都是必填项"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("发送成功", {
          description: result.message || "您的消息已成功发送，我们会尽快回复您！"
        });
        
        // 重置表单
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error("发送失败", {
        description: error instanceof Error ? error.message : "服务器错误，请稍后重试"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
     

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">{t('methods.title')}</h2>
            <p className="subHeading text-muted-foreground max-w-2xl mx-auto">
              {t('methods.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <a 
                      href={method.action}
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {method.contact}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="heading-lg">{t('form.title')}</CardTitle>
                  <p className="subHeading text-muted-foreground">
                    {t('form.description')}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('form.name')} <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={t('form.placeholders.name')}
                          required
                          disabled={isSubmitting}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('form.email')} <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('form.placeholders.email')}
                          required
                          disabled={isSubmitting}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">{t('form.company')}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder={t('form.placeholders.company')}
                          disabled={isSubmitting}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('form.phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t('form.placeholders.phone')}
                          disabled={isSubmitting}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('form.subject')} <span className="text-red-500">*</span></Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={t('form.placeholders.subject')}
                        required
                        disabled={isSubmitting}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('form.message')} <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={t('form.placeholders.message')}
                        rows={6}
                        required
                        disabled={isSubmitting}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {t('form.privacy')}
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-primary-gradient"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('form.send')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Business Hours */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    {t('office.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <span className="text-sm font-medium">{schedule.day}</span>
                      <Badge variant={schedule.available ? "default" : "secondary"} className="text-xs">
                        {schedule.time}
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          {t('office.emergency')}
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                          {t('office.emergencyDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Social Links */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('social.title')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('social.description')}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          className={`p-2 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200 hover:bg-primary/5 ${social.color}`}
                          title={social.name}
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 