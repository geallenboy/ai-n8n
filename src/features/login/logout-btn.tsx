"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

export const LogoutBtn = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  const sidebarT = useTranslations("sidebar");
  
  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <span
      onClick={handleLogout}
      className="inline-block w-full cursor-pointer text-destructive"
    >
      {sidebarT("logout")}
    </span>
  );
};

export default LogoutBtn;
