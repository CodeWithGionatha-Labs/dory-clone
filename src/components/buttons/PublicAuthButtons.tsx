"use client";

import { baseUrl } from "@/app/config/routes";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

export const PublicAuthButtons = ({ className }: PropsWithClassName) => {
  const pathname = usePathname();

  return (
    <div className={cn("inline-flex items-center gap-x-3", className)}>
      <LoginLink
        postLoginRedirectURL={`${baseUrl}${pathname}`}
        className={cn(buttonVariants({ variant: "secondary" }))}
      >
        Sign In
      </LoginLink>

      <RegisterLink
        postLoginRedirectURL={`${baseUrl}${pathname}`}
        className={cn(
          buttonVariants({ variant: "default" }),
          "ring-1 ring-white"
        )}
      >
        Sign Up
      </RegisterLink>
    </div>
  );
};
