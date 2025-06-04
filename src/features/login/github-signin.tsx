"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export const GithubSignin = () => {
  const { signIn } = useSignIn();
  const loginT = useTranslations("login");
  
  const handleGithubSignIn = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGithubSignIn}
      className="w-full"
    >
      <Image
        src="https://authjs.dev/img/providers/github.svg"
        alt="GitHub logo"
        width={20}
        height={20}
        className="mr-2"
      />
      {loginT("github")}
    </Button>
  );
};
