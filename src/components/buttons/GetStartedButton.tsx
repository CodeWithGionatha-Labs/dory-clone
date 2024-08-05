"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const btnClasses = cn(
  buttonVariants(),
  "p-6 text-sm rounded-sm lg:p-8 lg:text-xl"
);

export const GetStartedButton = () => {
  // TODO: add authentication and dynamic routes

  return (
    <Link href={"#"} className={btnClasses}>
      Get Started 👉
    </Link>
  );
};
