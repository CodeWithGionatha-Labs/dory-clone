"use client";

import { getUserBookmarkedEventsAction } from "@/lib/actions/get-user-bookmarked-events-action";
import { getUserEventsAction } from "@/lib/actions/get-user-events-action";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { Event } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";
import { EventCard } from "./EventCard";
import { InfiniteScrollList } from "./InfiniteScrollList";

type Props = {
  initialEvents: EventDetail[];
};

export const UserEventsList = ({ initialEvents }: Props) => {
  const [events, setEvents] = useState(initialEvents);

  const { executeAsync } = useAction(getUserEventsAction);

  const fetchMoreEvents = useCallback(
    async ({ cursor }: { cursor?: Event["id"] }) => {
      const newEvents = await executeAsync({ cursor });

      if (!newEvents?.data || newEvents.data.length === 0) {
        return [];
      }

      return newEvents.data;
    },
    []
  );

  return (
    <InfiniteScrollList<EventDetail>
      items={events}
      setItems={setEvents}
      fetchMore={fetchMoreEvents}
      renderItem={(event) => (
        <EventCard key={event.id} event={event} className="h-36" />
      )}
    />
  );
};

export const BookmarkedEventsList = ({ initialEvents }: Props) => {
  const [events, setEvents] = useState(initialEvents);

  const { executeAsync } = useAction(getUserBookmarkedEventsAction);

  const fetchMoreEvents = useCallback(
    async ({ cursor }: { cursor?: Event["id"] }) => {
      const newEvents = await executeAsync({ cursor });

      if (!newEvents?.data || newEvents.data.length === 0) {
        return [];
      }

      return newEvents.data;
    },
    []
  );

  return (
    <InfiniteScrollList<EventDetail>
      items={events}
      setItems={setEvents}
      fetchMore={fetchMoreEvents}
      renderItem={(event) => (
        <EventCard key={event.id} event={event} className="h-36" />
      )}
    />
  );
};
