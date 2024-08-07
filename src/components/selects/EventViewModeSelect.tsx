"use client";

import { eventPageQueryParams } from "@/config/queryParams";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { match } from "ts-pattern";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const viewModes = ["admin", "participant"] as const;

type ViewMode = (typeof viewModes)[number];

const asParticipantParam = eventPageQueryParams.asParticipant;

export const EventViewModeSelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const selectedViewMode: ViewMode = searchParams.get(asParticipantParam)
    ? "participant"
    : "admin";

  const handleValueChange = (value: ViewMode) => {
    const params = new URLSearchParams(searchParams);

    match(value)
      .with("participant", () => params.set(asParticipantParam, "true"))
      .with("admin", () => params.delete(asParticipantParam));

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select defaultValue={selectedViewMode} onValueChange={handleValueChange}>
      <SelectTrigger className="text-slate-700">
        <SelectValue className="text-center" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={"admin" as ViewMode}>Admin View</SelectItem>
        <SelectItem value={"participant" as ViewMode}>
          Participant View
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
