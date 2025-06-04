import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/features/common/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
const MyAppFont = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI n8n Platform",
  description: "AI-powered n8n workflow automation platform",
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
