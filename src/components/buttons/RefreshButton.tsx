"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const RefreshButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.refresh()} variant={"ghost"}>
      <RefreshCcw className="w-4 h-4" />
      <span className="hidden lg:inline-block lg:ml-2">Refresh</span>
    </Button>
  );
};
