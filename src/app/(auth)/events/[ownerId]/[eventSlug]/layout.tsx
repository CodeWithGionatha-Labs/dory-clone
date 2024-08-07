import { BookmarkEventButton } from "@/components/buttons/BookmarkEventButton";
import { CopyEventLinkButton } from "@/components/buttons/CopyEventLinkButton";
import { EventFloatingSidebar } from "@/components/layout/EventFloatingSidebar";
import { EventTabsNavigation } from "@/components/layout/EventTabsNavigation";
import { EventAdminMenu } from "@/components/menu/EventAdminMenu";
import { ParticipantsTooltip } from "@/components/tooltips/ParticipantsTooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/UserAvatar";
import routes from "@/config/routes";
import { getEventDetail } from "@/lib/server/get-event-detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

type Props = PropsWithChildren<{
  params: {
    ownerId: string;
    eventSlug: string;
  };
}>;

const EventPageLayout = async ({
  children,
  params: { ownerId, eventSlug },
}: Props) => {
  const event = await getEventDetail({ ownerId, eventSlug });

  if (!event) {
    return notFound();
  }

  const { owner } = event;

  const showDescription =
    event.shortDescription && event.shortDescription.length > 0;

  return (
    <div className="flex flex-col items-start h-full pt-8 px-4 lg:px-8">
      <Link
        href={routes.dashboard}
        className="text-xs underline underline-offset-2"
      >
        <ArrowLeft className="w-3 h-3 inline-block mr-1" />
        <span>Back to events</span>
      </Link>

      {/* Top Header */}
      <div className="w-full flex flex-col mt-3 lg:flex-row lg:shrink-0 lg:justify-between">
        {/* Event Name & Description & Organizer */}
        <div>
          <h2 className="font-bold text-2xl lg:text-3xl">
            {event.displayName}
          </h2>

          {showDescription && (
            <p className="line-clamp-1 text-sm text-muted-foreground mt-1.5">
              {event.shortDescription}
            </p>
          )}

          {/* Event Organizer */}
          <div className="inline-flex items-center gap-x-2 mt-2">
            <span className="text-xs lg:text-sm">
              <span className="text-slate-600">Organized by </span>
              <span className="font-semibold">{owner.displayName}</span>
            </span>

            <UserAvatar
              className="w-6 h-6"
              displayName={owner.displayName}
              color={owner.color}
            />
          </div>
        </div>

        {/* Participants, Event Action Buttons */}
        <div className="flex items-baseline justify-between lg:items-center lg:mr-8 lg:self-end">
          <ParticipantsTooltip
            className="mr-7"
            participantsCount={event._count.participants}
          />

          <div className="inline-flex items-center gap-x-2 mt-6 lg:mt-0">
            <CopyEventLinkButton ownerId={owner.id} eventSlug={event.slug} />

            <BookmarkEventButton event={event} />

            <EventAdminMenu event={event} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-1 flex-col lg:flex-row overflow-auto gap-x-4 pt-6">
        {/* Mobile tabs navigation */}
        <EventTabsNavigation
          className="rounded-t-md lg:hidden"
          ownerId={ownerId}
          eventSlug={eventSlug}
        />

        {/* Desktop Left Floating sidebar */}
        <div className="hidden lg:pb-10 lg:block">
          <EventFloatingSidebar
            ownerId={ownerId}
            eventSlug={eventSlug}
            questionsCount={event._count.questions}
            pollsCount={event._count.polls}
          />
        </div>

        {/* Main content: Q&A or Polls */}
        <div className="w-full h-full overflow-auto pb-4">
          <ScrollArea className="relative h-full bg-white px-2.5 py-4 rounded-b-lg lg:rounded-lg lg:p-6">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default EventPageLayout;
