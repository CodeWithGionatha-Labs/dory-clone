import { Event } from "@prisma/client";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

type EventRouteParams = {
  ownerId: Event["ownerId"];
  eventSlug: Event["slug"];
};

export default {
  home: "/",
  register: "/api/auth/register",
  login: "/api/auth/login",
  dashboard: "/dashboard",
  account: "/dashboard/account",
  bookmarked: "/dashboard/bookmarks",
  // will redirect to questions event page
  event: ({ ownerId, eventSlug }: EventRouteParams) =>
    `/events/${ownerId}/${eventSlug}`,
  eventPolls: ({ ownerId, eventSlug }: EventRouteParams) =>
    `/events/${ownerId}/${eventSlug}/polls`,
} as const;
