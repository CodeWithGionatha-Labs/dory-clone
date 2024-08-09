import { NewEventDialog } from "@/components/dialogs/NewEventDialog";
import { UserEventsList } from "@/components/EventsList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserEvents } from "@/lib/server/get-user-events";
import { Plus } from "lucide-react";

const MyEventsPage = async () => {
  const initialEvents = await getUserEvents();

  return (
    <ScrollArea className="w-full h-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-2 mt-4 ml-4">Your Events</h2>

      <div className="h-full grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <NewEventDialog>
          <button className="h-24 md:h-36 bg-white/50 border-[3px] border-spacing-4 border-dashed grid place-items-center group">
            <span className="inline-flex flex-col items-center gap-x-1 font-medium group-hover:text-blue-600 transition-colors duration-150">
              <Plus className="w-5 h-5" />
              <span>New Event</span>
            </span>
          </button>
        </NewEventDialog>

        <UserEventsList initialEvents={initialEvents} />
      </div>
    </ScrollArea>
  );
};

export default MyEventsPage;
