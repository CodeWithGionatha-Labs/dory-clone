"use client";

import routes from "@/config/routes";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = PropsWithClassName<{
  ownerId: string;
  eventSlug: string;
}>;

export const EventTabsNavigation = ({
  ownerId,
  eventSlug,
  className,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const isQATab = pathname === routes.event({ eventSlug, ownerId });
  const isPollsTab = pathname === routes.eventPolls({ ownerId, eventSlug });

  return (
    <div className={cn("flex", className)}>
      {["Q&A", "Polls"].map((tab) => (
        <Button
          key={tab}
          variant={"outline"}
          className={cn("basis-1/2 bg-gray-100 rounded-t-lg rounded-b-none", {
            "bg-white": tab === "Q&A" ? isQATab : isPollsTab,
          })}
          onClick={() =>
            router.replace(
              tab === "Q&A"
                ? routes.event({ ownerId, eventSlug })
                : routes.eventPolls({ ownerId, eventSlug })
            )
          }
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};
