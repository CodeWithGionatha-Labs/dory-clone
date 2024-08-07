import routes, { baseUrl } from "@/config/routes";
import { Event } from "@prisma/client";

type Params = {
  ownerId: Event["ownerId"];
  eventSlug: Event["slug"];
};

export const getEventLink = ({ ownerId, eventSlug }: Params) => {
  return `${baseUrl}${routes.event({
    ownerId,
    eventSlug,
  })}`;
};
