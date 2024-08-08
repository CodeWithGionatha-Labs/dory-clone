"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const ClearSearchParamsButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    router.replace(`${pathname}`);
  };

  return (
    <Button variant={"outline"} size={"sm"} onClick={handleClear}>
      <X className="w-4 h-4 mr-2" />
      <span>Clear</span>
    </Button>
  );
};
