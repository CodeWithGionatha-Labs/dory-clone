"use client";

import routes from "@/config/routes";
import { useIsParticipantView } from "@/hooks/useIsParticipantView";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { BarChartIcon, MessageCircleMore } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { EventViewModeSelect } from "../selects/EventViewModeSelect";
import { SidebarItem } from "./SidebarItem";

type Props = {
  eventSlug: string;
  ownerId: string;
  questionsCount: number;
  pollsCount: number;
};

export const EventFloatingSidebar = ({
  eventSlug,
  ownerId,
  questionsCount,
  pollsCount,
}: Props) => {
  const { user } = useKindeBrowserClient();

  const pathname = usePathname();
  const router = useRouter();

  const questionsRoute = routes.event({ eventSlug, ownerId });
  const pollsRoute = routes.eventPolls({ eventSlug, ownerId });

  const isParticipantView = useIsParticipantView();
  const isAdmin = ownerId === user?.id;

  return (
    <div className="w-[220px] drop-shadow-md h-full border rounded-xl bg-white">
      <div className="flex flex-col h-full pt-8 px-3 pb-3">
        <nav className="flex flex-col gap-3 h-full">
          <button onClick={() => router.replace(questionsRoute)}>
            <SidebarItem
              isActive={pathname === questionsRoute}
              text="Q&A"
              icon={MessageCircleMore}
            >
              <span className="ml-auto">{questionsCount}</span>
            </SidebarItem>
          </button>

          <button onClick={() => router.replace(pollsRoute)}>
            <SidebarItem
              isActive={pathname === pollsRoute}
              text="Polls"
              icon={BarChartIcon}
            >
              <span className="ml-auto">{pollsCount}</span>
            </SidebarItem>
          </button>
        </nav>

        {isAdmin && (
          <div className="mt-auto space-y-4 w-full">
            <EventViewModeSelect key={String(isParticipantView)} />
          </div>
        )}
      </div>
    </div>
  );
};
