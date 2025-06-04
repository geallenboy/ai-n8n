import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/features/common/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleTools } from "@/components/seo/google-tools";
import Script from "next/script";
import "./globals.css";

const MyAppFont = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI n8n Platform",
  description: "AI-powered n8n workflow automation platform",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: ['n8n', 'automation', 'workflow', 'AI', '自动化', '工作流'],
  authors: [{ name: 'AI n8n Team' }],
  creator: 'AI n8n Platform',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    title: 'AI n8n Platform',
    description: 'AI-powered n8n workflow automation platform',
    siteName: 'AI n8n Platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI n8n Platform',
    description: 'AI-powered n8n workflow automation platform',
    creator: '@ain8n',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          {/* Google Tools (Analytics & Search Console) */}
          <GoogleTools
            gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            siteVerification={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
            enableAnalytics={!!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            enableSearchConsole={!!process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
          
          <Script
            id="n8n-demo-component"
            type="module"
            src="/n8n-demo.js"
            strategy="afterInteractive"
          />
        </head>
        <body className={`${MyAppFont.className} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster richColors />
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
