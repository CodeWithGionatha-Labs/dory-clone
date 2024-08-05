"use client";

import routes from "@/app/config/routes";
import { cn } from "@/lib/utils/ui-utils";
import {
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const btnClasses = cn(
  buttonVariants(),
  "p-6 text-sm rounded-sm lg:p-8 lg:text-xl"
);

export const GetStartedButton = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  if (!isAuthenticated) {
    return <RegisterLink className={btnClasses}>Get Started 👉</RegisterLink>;
  }

  return (
    <Link href={routes.dashboard} className={btnClasses}>
      Get Started 👉
    </Link>
  );
};
