"use client";

import React from "react";
import Logo from "@/features/common/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth/components/auth-provider";

import { LanguageSwitcher } from "./language-switcher";
import { ModeToggle } from "./mode-toggle";
import { AuroraText } from "@/components/magicui/aurora-text";

const NavItemsRight = () => {
  const homeT = useTranslations("home.navigtion");
  const { user, loading, signOut } = useAuth();
  
  if (loading) {
    return (
      <>
        <LanguageSwitcher />
        <ModeToggle />
        <Button variant={"outline"} disabled size="sm">
          加载中...
        </Button>
      </>
    );
  }
  
  return (
    <>
      <LanguageSwitcher />
      <ModeToggle />
      {user ? (
        <div className="flex items-center gap-2">
          <Link
            href={"/dashboard"}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            <Button variant={"outline"} size="sm">
              {homeT("name")}
            </Button>
          </Link>
          <Button 
            variant={"ghost"} 
            size="sm"
            onClick={signOut}
            className="text-sm"
          >
            登出
          </Button>
        </div>
      ) : (
        <Link
          href={"/login"}
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          <Button variant={"outline"} size="sm">
            {homeT("login")}
          </Button>
        </Link>
      )}
    </>
  );
};
const NavItemsLeft = () => {
  const homeT = useTranslations("home.navigtion");
  const pathname = usePathname();
  
  // 在首页时，use-cases 链接使用锚点；在其他页面时，使用绝对路径
  const useCasesHref = pathname === '/' ? '#use-cases' : '/use-cases';
  // 在首页时，tutorials 链接使用锚点；在其他页面时，使用绝对路径
  const tutorialsHref = pathname === '/' ? '#tutorials' : '/tutorials';
  
  return (
    <>
      <Link
        href={useCasesHref}
        className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${
          pathname.startsWith('/use-cases') 
            ? 'text-blue-600 font-semibold' 
            : 'text-foreground'
        }`}
      >
        {homeT("useCases")}
      </Link>
      <Link
        href={tutorialsHref}
        className={`text-sm font-medium hover:underline underline-offset-4 transition-colors ${
          pathname.startsWith('/tutorials') 
            ? 'text-blue-600 font-semibold' 
            : 'text-foreground'
        }`}
      >
        {homeT("tutorialsNav")}
      </Link>
      <Link
        href={"#about"}
        className="text-sm font-medium hover:underline underline-offset-4"
      >
        {homeT("about")}
      </Link>
    </>
  );
};

const Navigtion = () => {
  return (
    <div className="w-full bg-background/60 backdrop-blur-md fixed top-0 px-8 py-4 z-50 shadow-xl overflow-hidden">
      <header className="contariner mx-auto flex items-center ">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-center gap-6">
            <Logo />
            <nav className="hidden md:flex items-center justify-center gap-3 ml-2">
              <NavItemsLeft />
            </nav>
          </div>
          <div className="hidden md:flex items-center justify-center gap-3">
            <NavItemsRight />
          </div>
        </div>
        <div className="ml-auto md:hidden overflow-hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">导航</SheetTitle>
              <nav className="flex flex-col gap-4 mt-12">
                <NavItemsLeft />
                <NavItemsRight />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Navigtion;
