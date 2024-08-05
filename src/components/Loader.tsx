"use client";

import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import BeatLoader from "react-spinners/BeatLoader";
import { blue } from "tailwindcss/colors";
import { Skeleton } from "./ui/skeleton";

export const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <BeatLoader color={blue[600]} size={16} />
    </div>
  );
};

export const AuthLoader = ({ className }: PropsWithClassName) => {
  return <Skeleton className={cn("bg-gray-100/50 w-32 h-10", className)} />;
};
