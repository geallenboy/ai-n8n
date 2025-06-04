"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export const GoogleSignin = () => {
  const { signIn } = useSignIn();
  const loginT = useTranslations("login");
  
  const handleGoogleSignIn = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-full"
    >
      <Image
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-2"
      />
      {loginT("google")}
    </Button>
  );
};
